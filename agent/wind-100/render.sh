#!/usr/bin/env bash
set -euo pipefail
parts=agent/runs/wind-100
assets=public/generated/wind-100
mkdir -p out "$parts"
render_segment() {
  local name=$1
  local frames=$2
  shift 2
  node_modules/.bin/remotion render src/index.ts HVL-WIND-100 "$parts/$name.mp4" \
    --frames="$frames" --props="$assets/timeline.json" --browser-executable=/usr/bin/chromium \
    --muted --concurrency=2 --codec=h264 --x264-preset=veryfast --jpeg-quality=87 --crf=18 "$@"
}
render_segment landscape 0-681
render_segment drivetrain 682-1148 --gl=swangle
render_segment system 1149-2999
printf "file 'landscape.mp4'\nfile 'drivetrain.mp4'\nfile 'system.mp4'\n" > "$parts/segments.txt"
ffmpeg -v error -y -f concat -safe 0 -i "$parts/segments.txt" -i "$assets/adam.wav" \
  -map 0:v:0 -map 1:a:0 -c:v copy -c:a aac -b:a 192k -t 100 -movflags +faststart out/hvl-wind-100.mp4
