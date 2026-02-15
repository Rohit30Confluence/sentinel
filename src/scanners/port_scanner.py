import asyncio
import time
from typing import List

from scanners.base import BaseScanner
from core.result import ScanResult, PortScanData


class PortScanner(BaseScanner):

    COMMON_PORTS: List[int] = [22, 80, 443, 8080]

    async def scan(self, target: str) -> ScanResult[PortScanData]:
        start_time = time.perf_counter()
        open_ports: List[int] = []

        async def check_port(port: int):
            async with self.context.semaphore:
                await self.context.rate_limiter.wait()

                for attempt in range(2):
                    try:
                        reader, writer = await asyncio.wait_for(
                            asyncio.open_connection(target, port),
                            timeout=2
                        )
                        writer.close()
                        await writer.wait_closed()
                        open_ports.append(port)
                        return
                    except (asyncio.TimeoutError, ConnectionRefusedError, OSError):
                        if attempt == 0:
                            await asyncio.sleep(0.1)
                        else:
                            return

        tasks = [asyncio.create_task(check_port(p)) for p in self.COMMON_PORTS]
        await asyncio.gather(*tasks)

        duration = time.perf_counter() - start_time

        return ScanResult[PortScanData](
            scanner="PortScanner",
            target=target,
            execution_time=round(duration, 3),
            data=PortScanData(open_ports=sorted(open_ports))
        )
