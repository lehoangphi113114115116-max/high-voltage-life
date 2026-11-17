# Nguyên lý máy cắt SF6 — bản 15 giây

Composition `HVL-SF6-PRINCIPLE-15S`, 450 frame, 1080×1920, 30 FPS. Dùng lại `BreakerPole` đã trích từ mã SF6 Remotion V2 người dùng gửi và hệ `src/illustration`: vật liệu gradient/shadow, dây/hạt năng lượng, Arc, Cloud, motionProgress. Không sửa mã nguồn V2 gốc.

Trình tự: tiếp điểm đóng/dẫn → mở và hình thành hồ quang → luồng khí làm nguội/khử ion → tại điểm không của dòng AC, hồ quang tắt và cách điện phục hồi để tránh tái phóng điện. Hạt vàng không dừng ngay lúc tiếp điểm tách, chỉ ngừng khi hồ quang tắt. Ba đường dẫn vào cực minh họa tách riêng, không nối tắt ba pha. Phần yard/cutaway chỉ là biểu tượng nguyên lý, không phải cấu tạo một model máy cắt cụ thể. Diễn biến được làm chậm, không mô phỏng vật lý hoặc thời gian cắt thật, không dùng làm chỉ dẫn thao tác. Dập tắt thành công còn phụ thuộc khả năng phục hồi điện môi so với điện áp phục hồi; lời đọc 15 giây chỉ giới thiệu cơ chế cơ bản.

Kịch bản: `agent/sf6-principle-script.txt`. VieNeu-TTS cục bộ/offline, giọng Thái Sơn, tốc độ 1,166× giữ nguyên. Audio 12,222 giây, phần kết giữ đến 15 giây. Karaoke và mốc câu dùng `agent/prepare-power-journey.mjs` đã bổ sung tham số ID/topic để dùng lại, không xây thêm pipeline TTS. Timestamp câu hỗ trợ bằng vùng im lặng, timestamp từ vẫn ước lượng, không phải forced alignment.

Khôi phục media:

```bash
node voice/scripts/prepare-script.mjs agent/sf6-principle-script.txt voice/output/sf6-principle.manifest.json
HF_HUB_OFFLINE=1 .venv-tts/bin/python voice/python/synthesize_vieneu.py voice/output/sf6-principle.manifest.json voice/output/sf6-principle.wav
node agent/prepare-power-journey.mjs sf6-principle 'Nguyên lý máy cắt SF6'
```

MP4: `out/hvl-sf6-principle-15s.mp4`, không commit cùng audio/model/cache. QC đạt: TypeScript, tính hợp lệ timestamp, ffprobe (H.264/AAC, 1080×1920, 30 FPS, video 450 frame; container 15,019 giây do AAC padding), decode FFmpeg không lỗi và đã xem contact sheet các trạng thái. Chỉ kiểm tra composition mới.
