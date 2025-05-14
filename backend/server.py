

import asyncio
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

from streamer import create_streamers
from streaming_job import StreamingJob, StreamingJobRequest, create_stream_job
from uvicorn import run

STREAMERS_NUM = 3

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/create_new_stream")
def create_new_stream(stream_job_request: StreamingJobRequest):
    try:
        print(
            f"Received new stream job request from {stream_job_request.username}"
            f"named {stream_job_request.stream_name}"
        )

        stream_job = create_stream_job(stream_job_request)
        print(f"Created stream job: {stream_job.id}")

        stream_db[stream_job.id] = stream_job
        streams_queue.put(stream_job.id)
    except Exception as e:
        return {"status": "error", "message": str(e)}

    return {"status": "success", "stream_id": stream_job.id}

@app.post("/get_stream")
def get_stream(stream_id: str):
    try:
        if stream_id not in stream_db:
            return {"status": "error", "message": "Stream ID not found"}
        
        return {"status": "success", "message": stream_db[stream_id]}
            
    except Exception as e:
        return {"status": "error", "message": str(e)}


@app.get("/get_all_streams_ids")
def get_all_streams_ids():
    try:
        return {"status": "success", "message": stream_db.keys()}
            
    except Exception as e:
        return {"status": "error", "message": str(e)}


@app.get("/get_all_streams")
def new_all_stream():
    try:
        return {"status": "success", "message": stream_db.values()}
            
    except Exception as e:
        return {"status": "error", "message": str(e)}

if __name__ == "__main__":
    _, streams_queue, stream_db = create_streamers(STREAMERS_NUM)

    run(app, log_level="info")
