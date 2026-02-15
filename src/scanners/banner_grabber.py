import asyncio
import ssl
import time
from typing import List

from scanners.base import BaseScanner
from core.result import ScanResult, BannerData


class BannerGrabber(BaseScanner):

    COMMON_PORTS: List[int] = [22, 80, 443, 8080]

    async def scan(self, target: str) -> ScanResult[BannerData]:
        start_time = time.perf_counter()
        banners = {}

        ssl_context = ssl.create_default_context()
        ssl_context.check_hostname = False
        ssl_context.verify_mode = ssl.CERT_NONE

        async def grab_banner(port: int):
            async with self.context.semaphore:
                await self.context.rate_limiter.wait()

                try:
                    if port == 443:
                        reader, writer = await asyncio.wait_for(
                            asyncio.open_connection(target, port, ssl=ssl_context),
                            timeout=2
                        )
                    else:
                        reader, writer = await asyncio.wait_for(
                            asyncio.open_connection(target, port),
                            timeout=2
                        )

                    if port in [80, 443, 8080]:
                        request = (
                            f"HEAD / HTTP/1.1\r\n"
                            f"Host: {target}\r\n"
                            "Connection: close\r\n\r\n"
                        )
                        writer.write(request.encode())
                        await writer.drain()

                    try:
                        data = await asyncio.wait_for(reader.read(1024), timeout=2)
                        banner = data.decode(errors="ignore").strip()
                        if banner:
                            banners[port] = banner.split("\r\n")[0]
                    except asyncio.TimeoutError:
                        pass

                    writer.close()
                    await writer.wait_closed()

                except (asyncio.TimeoutError, ConnectionRefusedError, OSError, ssl.SSLError):
                    pass

        tasks = [asyncio.create_task(grab_banner(p)) for p in self.COMMON_PORTS]
        await asyncio.gather(*tasks)

        duration = time.perf_counter() - start_time

        return ScanResult[BannerData](
            scanner="BannerGrabber",
            target=target,
            execution_time=round(duration, 3),
            data=BannerData(banners=banners)
        )
