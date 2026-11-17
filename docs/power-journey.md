# Từ nhà máy điện đến nhà dân — 15 giây

Composition `HVL-POWER-JOURNEY-15S`, 450 frame, 1080×1920, 30 FPS, H.264. Kịch bản tại `agent/power-journey-script.txt`.

Chuỗi nguyên lý: máy phát chuyển cơ năng thành điện năng → máy biến áp nâng điện áp để giảm tổn thất truyền tải với cùng công suất → lưới truyền tải → hạ áp nhiều cấp/phân phối → công tơ → nhà dân. Minh họa rút gọn, không phải sơ đồ đấu nối một trạm điện thực; không biểu diễn đủ ba pha, toàn bộ cấp biến áp, thiết bị đóng cắt hay bảo vệ. Rotor quay là biểu tượng máy phát, không phải mặt cắt cấu tạo thực.

Component React/SVG tái sử dụng trong `src/components/PowerJourneyObjects.tsx`: `Cloud`, `Tree`, `PowerPlant`, `Transformer`, `GridTower`, `House`. Rotor quay, mây trôi, cây đung đưa, đầu cực sáng nhẹ, cửa sổ/công tơ đổi trạng thái độc lập. `CurrentFlow` tái sử dụng cho hạt vàng trên dây theo hình học local của từng đoạn, biểu diễn năng lượng quy ước (không phải electron hay chiều dòng AC tức thời). Camera đi xuyên bối cảnh ba lớp từ nhà máy sang đường dây và nhà dân; màu trời/cây/vật liệu tự nhiên, ít chữ.

Audio mới: preset Thái Sơn, tốc độ cấu hình giữ nguyên 1,166×; model VieNeu-TTS đã có chạy offline, không cài lại hay dùng API. Audio dài 13,182 giây; video giữ phần kết đến 15 giây. `agent/prepare-power-journey.mjs` tạo media manifest, hỗ trợ ranh giới câu bằng vùng im lặng, rồi ước lượng timestamp từ theo độ dài chữ; dùng bộ Karaoke hiện có, không khẳng định forced alignment chính xác từng từ.

Khôi phục media (khi model/cache đã có):

```bash
node voice/scripts/prepare-script.mjs agent/power-journey-script.txt voice/output/power-journey.manifest.json
HF_HUB_OFFLINE=1 .venv-tts/bin/python voice/python/synthesize_vieneu.py voice/output/power-journey.manifest.json voice/output/power-journey.wav
node agent/prepare-power-journey.mjs
```

MP4 bàn giao: `out/hvl-power-journey-15s.mp4`. Audio và MP4 không commit. QC đạt: TypeScript, ffprobe (H.264/AAC, 1080×1920, 30 FPS; container 15,019 giây do padding audio AAC, video 450 frame), decode FFmpeg không lỗi và đã xem contact sheet các nhịp cảnh. Chỉ kiểm tra composition mới.
