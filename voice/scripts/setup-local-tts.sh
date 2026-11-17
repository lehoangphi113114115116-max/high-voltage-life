#!/usr/bin/env bash
set -euo pipefail

project_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$project_root"

python3 -m venv .venv-tts
.venv-tts/bin/python -m pip install --upgrade pip
.venv-tts/bin/python -m pip install -r voice/python/requirements-cpu.txt

echo "Đã cài VieNeu-TTS CPU vào .venv-tts"
echo "Model weights sẽ được tải vào voice/models ở lần tổng hợp đầu tiên."
