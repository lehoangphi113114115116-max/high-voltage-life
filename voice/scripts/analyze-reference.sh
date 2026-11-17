#!/usr/bin/env bash
set -euo pipefail

input_path="${1:-}"
if [[ -z "$input_path" || ! -f "$input_path" ]]; then
  echo "Cách dùng: npm run voice:analyze -- /đường/dẫn/mẫu.mp3" >&2
  exit 1
fi

ffprobe -v error \
  -show_entries format=duration,size,bit_rate \
  -show_entries stream=codec_name,sample_rate,channels,channel_layout,bit_rate \
  -of json "$input_path"

ffmpeg -hide_banner -nostats -i "$input_path" \
  -af ebur128=peak=true -f null - 2>&1 \
  | tail -n 15
