# Sentinel

Async reconnaissance framework with:

- Global concurrency control
- Global rate limiting
- Structured result models
- Streaming CLI output

## Install (editable)

pip install -e .

## Usage

sentinel example.com
sentinel example.com -c 5 -r 2
sentinel example.com --json
