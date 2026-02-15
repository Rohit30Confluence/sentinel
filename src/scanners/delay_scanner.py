import asyncio
import time
from scanners.base import BaseScanner
from core.result import ScanResult


class DelayScanner(BaseScanner):

    async def scan(self, target: str) -> ScanResult:
        start = time.perf_counter()
        await asyncio.sleep(2)
        duration = time.perf_counter() - start

        return ScanResult(
            scanner="DelayScanner",
            target=target,
            execution_time=round(duration, 3),
            data={"status": "completed"}
        )
