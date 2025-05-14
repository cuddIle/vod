from enum import Enum
from typing import Optional
from uuid import uuid4
from pydantic import BaseModel, Field

from datetime import datetime

class StreamingJobStatus(Enum):
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"


class StreamingJob(BaseModel):
    stream_name: str
    username: str
    destination: str
    start: datetime
    end: datetime
    speed: int
    progress: float = Field(default=0.0)
    filter: Optional[str] = Field(default=None)
    status: StreamingJobStatus = Field(default=StreamingJobStatus.PENDING)
    id: str = Field(default_factory=lambda: uuid4().hex)


class StreamingJobRequest(BaseModel):
    stream_name: str
    username: str
    source: str
    destination: str
    start: datetime
    end: datetime
    speed: int
    filter: Optional[str] = Field(default=None)


def create_stream_job(stream_job_request: StreamingJobRequest) -> StreamingJob:
    stream_job = StreamingJob(
        stream_name=stream_job_request.stream_name,
        username=stream_job_request.username,
        destination=stream_job_request.destination,
        start=stream_job_request.start,
        end=stream_job_request.end,
        speed=stream_job_request.speed,
        filter=stream_job_request.filter
    )
    return stream_job