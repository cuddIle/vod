import asyncio
from multiprocessing import Process, Queue, Manager
import random
import time
import websockets
from tqdm import tqdm

from streaming_job import StreamingJob


MAX_ITERATIONS = 5


def streamer(streamer_id: int, streams_queue: Queue, streams_db: dict) -> None:
    print(f'Streamer {streamer_id} started')

    while True:
        if stream_id := streams_queue.get():
            print(f'Streaming job {stream_id} started')
            streams_db[stream_id].status = "running"

            for i in tqdm(range(MAX_ITERATIONS)):
                streams_db[stream_id].progress = (i + 1) / MAX_ITERATIONS
                time.sleep(1 + random.randint(1, 5))

            streams_db[stream_id].status = "finished"
            print(f'Streaming job {stream_id} finished')


def create_streamers(streamer_number: int) -> tuple[list[Process], Queue, dict]:
    streams_queue = Queue()
    streams_db = Manager().dict()
    streamers = []

    for streamer_id in range(streamer_number):
        streamer_process = Process(target=streamer, args=(streamer_id, streams_queue, streams_db))
        streamer_process.start()
        streamers.append(streamer_process)

    return streamers, streams_queue, streams_db
    