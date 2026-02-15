import asyncio
from core.rate_limiter import AsyncRateLimiter


class ScanContext:
    def __init__(
        self,
        max_global_concurrency: int = 10,
        rps: float = 5.0,
        jitter: float = 0.0
    ):
        self.semaphore = asyncio.Semaphore(max_global_concurrency)
        self.rate_limiter = AsyncRateLimiter(rps, jitter=jitter)
