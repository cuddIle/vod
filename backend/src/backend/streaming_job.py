from enum import Enum
from typing import Optional
from uuid import uuid4
from pydantic import BaseModel, ConfigDict, Field

from datetime import datetime

class StreamingJobStatus(Enum):
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"


class StreamingJob(BaseModel):
    model_config = ConfigDict(use_enum_values=True)

    stream_name: str
    username: str
    destination: str
    start: datetime
    end: datetime
    speed: int
    status: StreamingJobStatus
    progress: float = Field(default=0.0)
    filter: Optional[str] = Field(default=None)
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
        filter=stream_job_request.filter,
        status=StreamingJobStatus.PENDING,
    )
    return stream_job

class DateSelector(BaseModel):
    start: Optional[datetime] = Field(default=None)
    end: Optional[datetime] = Field(default=None)

class StreamingJobSelector(BaseModel):
    stream_name: Optional[list[str]] = Field(default=None)
    stream_id: Optional[list[str]] = Field(default=None)
    username: Optional[list[str]] = Field(default=None)
    destination: Optional[list[str]] = Field(default=None)
    start_time_range: Optional[DateSelector] = Field(default=None)
    end_time_range: Optional[DateSelector] = Field(default=None)
    status: Optional[list[StreamingJobStatus]] = Field(default=None)

class StreamingJobUpdate(BaseModel):
    stream_name: Optional[str] = Field(default=None)
    status: Optional[StreamingJobStatus] = Field(default=None)
    progress: Optional[float] = Field(default=None)
