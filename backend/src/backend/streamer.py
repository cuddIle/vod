from multiprocessing import Process, Queue, Manager
import os
import random
import time
from backend.db.streams_dal import StreamDal
from backend.streaming_job import StreamingJobSelector, StreamingJobStatus, StreamingJobUpdate
from tqdm import tqdm



MAX_ITERATIONS = 5


def streamer(streamer_id: int, streams_queue: Queue, mongo_uri: str) -> None:

    stream_dal = StreamDal(mongo_uri)
    print(f'Streamer {streamer_id} started')

    while True:
        if stream_id := streams_queue.get():
            print(f'Streaming job {stream_id} started')
            stream_dal.update_stream_by_selector(
                StreamingJobSelector(stream_id=[stream_id]),
                StreamingJobUpdate(status=StreamingJobStatus.RUNNING)
            )

            for i in tqdm(range(MAX_ITERATIONS)):
                progress = (i + 1) / MAX_ITERATIONS
                stream_dal.update_stream_by_selector(
                    StreamingJobSelector(stream_id=[stream_id]),
                    StreamingJobUpdate(progress=progress)
                )

                time.sleep(1 + random.randint(1, 5))

            stream_dal.update_stream_by_selector(
                StreamingJobSelector(stream_id=[stream_id]),
                StreamingJobUpdate(status=StreamingJobStatus.COMPLETED)
            )

            print(f'Streaming job {stream_id} finished')


def create_streamers(streamer_number: int) -> tuple[list[Process], Queue]:
    streams_queue = Queue()
    streamers = []

    for streamer_id in range(streamer_number):
        streamer_process = Process(target=streamer, args=(streamer_id, streams_queue, os.getenv("MONGO_URI")))
        streamer_process.start()
        streamers.append(streamer_process)

    return streamers, streams_queue
    