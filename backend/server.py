

import asyncio
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

from streamer import create_streamers
from streaming_job import StreamingJob
from uvicorn import run

STREAMERS_NUM = 3

app = FastAPI()

_, streams_queue, progress_queue, stream_db = create_streamers(STREAMERS_NUM)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

active_connections = []


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    active_connections.append(websocket)
    try:
        while True:
            if not progress_queue.empty():
                message = progress_queue.get()
                print(len(active_connections))
                for connection in active_connections:
                    await connection.send_json(message)
                    pass
            await asyncio.sleep(0.1)  # Avoid busy waiting
    except WebSocketDisconnect:
        active_connections.remove(websocket)
        print("Client disconnected")


@app.post("/create_stream")
def create_stream(stream_job: StreamingJob):
    try:
        print(f"Received new stream job: {stream_job.id}")
        stream_db[stream_job.id] = stream_job
        streams_queue.put(stream_job.id)
    except Exception as e:
        return {"status": "error", "message": str(e)}

    return {"status": "success", "stream_id": stream_job.id}

@app.post("/get_stream")
def new_stream(stream_id: str):
    try:
        if stream_id not in stream_db:
            return {"status": "error", "message": "Stream ID not found"}
        
        return {"status": "success", "message": stream_db[stream_id]}
            
    except Exception as e:
        return {"status": "error", "message": str(e)}


@app.get("/get_streams_ids")
def new_stream():
    try:
        return {"status": "success", "message": stream_db.keys()}
            
    except Exception as e:
        return {"status": "error", "message": str(e)}


@app.get("/get_streams")
def new_stream():
    try:
        return {"status": "success", "message": stream_db.values()}
            
    except Exception as e:
        return {"status": "error", "message": str(e)}
    
for i in range(2):
    create_stream(stream_job=StreamingJob(
        name=f"test{i}",
        source="source",
        destination="destination",
        start="2023-10-01T00:00:00Z",
        end="2023-10-02T00:00:00Z",
        speed=1,
    )) 