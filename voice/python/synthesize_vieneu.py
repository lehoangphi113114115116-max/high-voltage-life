#!/usr/bin/env python3
"""Synthesize a prepared HIGH VOLTAGE LIFE manifest with local VieNeu-TTS."""

from __future__ import annotations

import argparse
import json
import os
import subprocess
import tempfile
import time
from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parents[2]
DEFAULT_CONFIG = PROJECT_ROOT / "voice/config/local-vieneu.json"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("manifest", type=Path, help="Manifest từ voice:prepare")
    parser.add_argument("output", type=Path, help="File WAV đầu ra")
    parser.add_argument("--config", type=Path, default=DEFAULT_CONFIG)
    parser.add_argument("--voice", help="Ghi đè preset voice")
    parser.add_argument("--speed", type=float, help="Tốc độ 0.8–1.25")
    return parser.parse_args()


def probe_duration(path: Path) -> float:
    result = subprocess.run(
        [
            "ffprobe",
            "-v",
            "error",
            "-show_entries",
            "format=duration",
            "-of",
            "default=noprint_wrappers=1:nokey=1",
            str(path),
        ],
        check=True,
        capture_output=True,
        text=True,
    )
    return float(result.stdout.strip())


def main() -> None:
    args = parse_args()
    config = json.loads(args.config.read_text(encoding="utf-8"))
    manifest = json.loads(args.manifest.read_text(encoding="utf-8"))
    text = str(manifest["spokenText"]).strip()
    if not text:
        raise ValueError("Manifest không có spokenText.")

    speed = args.speed if args.speed is not None else float(config["speed"])
    if not 0.8 <= speed <= 1.25:
        raise ValueError("speed phải nằm trong khoảng 0.8–1.25.")

    model_cache = PROJECT_ROOT / "voice/models/huggingface"
    model_cache.mkdir(parents=True, exist_ok=True)
    os.environ.setdefault("HF_HOME", str(model_cache))
    os.environ.setdefault("HF_HUB_DISABLE_TELEMETRY", "1")

    from vieneu import Vieneu
    import soundfile as sf

    load_started = time.perf_counter()
    try:
        tts = Vieneu(
            mode="v3turbo",
            backend="onnx",
            precision=config["precision"],
            threads=int(config["threads"]),
        )
    except Exception as error:
        if "403" in str(error) or "ProxyError" in type(error).__name__:
            raise SystemExit(
                "Không thể tải weights chính thức từ Hugging Face: policy mạng trả 403. "
                "Hãy publish bản nháp môi trường đã bổ sung các miền Hugging Face rồi chạy lại."
            ) from error
        raise
    load_seconds = time.perf_counter() - load_started

    voice = args.voice or config.get("voice")
    if not voice:
        raise ValueError(
            "Chưa chọn preset mặc định. Hãy truyền --voice với một giọng miền Nam đã duyệt."
        )
    infer_started = time.perf_counter()
    audio = tts.infer(
        text,
        voice=voice,
        temperature=float(config["temperature"]),
        top_k=int(config["topK"]),
        top_p=float(config["topP"]),
        repetition_penalty=float(config["repetitionPenalty"]),
    )
    infer_seconds = time.perf_counter() - infer_started

    args.output.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as temporary:
        raw_path = Path(temporary.name)
    try:
        sf.write(raw_path, audio, int(config["sampleRate"]), subtype="PCM_16")
        subprocess.run(
            [
                "ffmpeg",
                "-y",
                "-v",
                "error",
                "-i",
                str(raw_path),
                "-af",
                f"atempo={speed},loudnorm=I={config['targetLufs']}:TP=-1.5:LRA=7",
                "-c:a",
                "pcm_s16le",
                "-ar",
                str(config["sampleRate"]),
                str(args.output),
            ],
            check=True,
        )
    finally:
        raw_path.unlink(missing_ok=True)

    duration_seconds = probe_duration(args.output)
    report = {
        "profileId": config["profileId"],
        "engine": config["engine"],
        "modelRepository": config["modelRepository"],
        "voice": voice,
        "voiceKind": "built-in-preset",
        "cloning": False,
        "displayText": manifest.get("displayText"),
        "spokenText": text,
        "speed": speed,
        "sampleRate": config["sampleRate"],
        "loadSeconds": round(load_seconds, 3),
        "inferenceSeconds": round(infer_seconds, 3),
        "durationSeconds": round(duration_seconds, 3),
        "rtf": round(infer_seconds / duration_seconds, 4),
    }
    report_path = args.output.with_suffix(".report.json")
    report_path.write_text(
        json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    print(json.dumps(report, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
