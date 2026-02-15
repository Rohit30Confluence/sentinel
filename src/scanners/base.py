from abc import ABC, abstractmethod
from core.result import ScanResult
from core.context import ScanContext


class BaseScanner(ABC):

    def __init__(self, context: ScanContext):
        self.context = context

    @abstractmethod
    async def scan(self, target: str) -> ScanResult:
        pass
