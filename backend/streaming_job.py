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
    name: str
    source: str
    destination: str
    start: datetime
    end: datetime
    speed: int
    filter: str = ""
    status: StreamingJobStatus = StreamingJobStatus.PENDING
    id: str = Field(default_factory=lambda: uuid4().hex)
    