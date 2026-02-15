from datetime import datetime, timezone
from typing import Generic, TypeVar, Optional, List, Dict
from pydantic import BaseModel, Field

T = TypeVar("T")


class ScanResult(BaseModel, Generic[T]):
    scanner: str
    target: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    status: str = "success"
    execution_time: float = 0.0
    error_message: Optional[str] = None
    data: T


class PortScanData(BaseModel):
    open_ports: List[int]


class BannerData(BaseModel):
    banners: Dict[int, str]
