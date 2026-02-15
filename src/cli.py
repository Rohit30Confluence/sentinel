import asyncio
from typing import List

import typer

from core.engine import ScannerEngine
from core.context import ScanContext
from scanners.port_scanner import PortScanner
from scanners.banner_grabber import BannerGrabber

app = typer.Typer(help="Sentinel - Async Recon Framework")


@app.command()
def scan(
    targets: List[str] = typer.Argument(..., help="One or more targets to scan"),
    json_output: bool = typer.Option(
        False,
        "--json",
        "-j",
        help="Output results as structured JSON"
    ),
    concurrency: int = typer.Option(
        10,
        "--concurrency",
        "-c",
        help="Maximum concurrent connections (global)"
    ),
    rps: float = typer.Option(
        5.0,
        "--rps",
        "-r",
        help="Requests per second (global)"
    ),
    jitter: float = typer.Option(
        0.0,
        "--jitter",
        help="Random timing variation in seconds"
    ),
):
    """
    Run reconnaissance scan against one or more targets.
    """

    async def run_scan():
        # Global shared execution context
        context = ScanContext(
            max_global_concurrency=concurrency,
            rps=rps,
            jitter=jitter
        )

        engine = ScannerEngine()
        engine.register(PortScanner(context))
        engine.register(BannerGrabber(context))

        async for result in engine.stream(targets):
            if json_output:
                print(result.model_dump_json(indent=2))
            else:
                print(
                    f"\n[+] {result.scanner} "
                    f"({result.target}) "
                    f"finished in {result.execution_time}s"
                )
                print(f"    Findings: {result.data}")

    asyncio.run(run_scan())


if __name__ == "__main__":
    app()
