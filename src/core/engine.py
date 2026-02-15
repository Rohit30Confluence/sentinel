import asyncio
from typing import List, AsyncGenerator

from scanners.base import BaseScanner
from core.result import ScanResult


class ScannerEngine:
    def __init__(self) -> None:
        self._scanners: List[BaseScanner] = []

    def register(self, scanner: BaseScanner) -> None:
        self._scanners.append(scanner)

    async def stream(self, targets: List[str]) -> AsyncGenerator[ScanResult, None]:
        tasks = []

        for target in targets:
            for scanner in self._scanners:
                tasks.append(
                    asyncio.create_task(scanner.scan(target))
                )

        for task in asyncio.as_completed(tasks):
            yield await task

    async def run(self, targets: List[str]) -> List[ScanResult]:
        return [result async for result in self.stream(targets)]
