import asyncio
import time
import random


class AsyncRateLimiter:
    def __init__(self, rps: float, jitter: float = 0.0):
        if rps <= 0:
            raise ValueError("RPS must be greater than 0")

        self._interval = 1.0 / rps
        self._jitter = jitter
        self._last_call = 0.0
        self._lock = asyncio.Lock()

    async def wait(self):
        async with self._lock:
            now = time.perf_counter()
            elapsed = now - self._last_call

            wait_time = self._interval - elapsed

            if wait_time > 0:
                # Apply jitter variation
                if self._jitter > 0:
                    variation = random.uniform(-self._jitter, self._jitter)
                    wait_time += variation
                    wait_time = max(wait_time, 0)

                await asyncio.sleep(wait_time)

            self._last_call = time.perf_counter()
