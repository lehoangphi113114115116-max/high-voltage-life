# high-voltage-life-voice

Module giọng đọc dùng một hồ sơ ổn định cho toàn bộ video HIGH VOLTAGE LIFE. Mã hiện chỉ chuẩn bị văn bản và chuẩn hóa timestamp; không có adapter mạng nào được kích hoạt.

## Luồng dữ liệu

`kịch bản tiếng Việt → từ điển phát âm → adapter TTS được duyệt → audio + alignment → karaoke JSON → Remotion`

`displayText` luôn giữ nguyên để hiển thị. `spokenText` là bản dành riêng cho TTS, trong đó thuật ngữ kỹ thuật được mở rộng cách đọc.

## Cơ chế an toàn

- Provider mặc định là `disabled`.
- `assertVoiceUseAllowed()` chặn tổng hợp nếu chưa có xác nhận quyền sử dụng và phạm vi đồng thuận.
- File mẫu đặt trong `voice/reference/` hoặc `voice/private/`; cả hai bị Git bỏ qua.
- Voice ID đọc từ `HVL_VOICE_ID`; API key đọc từ `HVL_TTS_API_KEY`.
- Hồ sơ thật đặt tại `voice/config/voice-profile.local.json` và không được commit.
- Chỉ tạo adapter nhà cung cấp sau khi người dùng duyệt quyền, dịch vụ và chi phí.

## Timestamp

`build-timestamps.mjs` nhận một trong hai dạng alignment:

1. `words: [{text, start, end, confidence?}]`, thời gian tính bằng giây; hoặc
2. `characters`, `character_start_times_seconds`, `character_end_times_seconds`.

Kết quả dùng mili giây, độc lập nhà cung cấp, phù hợp để đổi sang frame Remotion bằng `Math.round(startMs * fps / 1000)`.

## Quy trình kích hoạt trong tương lai

1. Chủ sở hữu xác nhận bằng văn bản rằng có quyền tạo và sử dụng bản sao giọng.
2. Chốt phạm vi sử dụng, thời hạn lưu mẫu và chính sách xóa dữ liệu.
3. Người dùng duyệt nhà cung cấp và mức phí.
4. Tạo Voice ID đúng một lần; lưu ID/API key trong secret store của Cloud.
5. Bổ sung adapter, kiểm thử một đoạn ngắn và chỉ sau đó mới dùng cho video.

## TTS cục bộ không clone

VieNeu-TTS v3 Turbo chạy ONNX trực tiếp trên CPU và dùng preset nam miền Nam `Thái Sơn` cho hồ sơ `HVL Science Male v1`. Tốc độ mặc định là `1,166×`, nhanh hơn 10% so với mẫu so sánh `1,06×`. Luồng này không dùng file tham khảo, không gọi API TTS và không cần Voice ID.

```bash
npm run voice:setup-local
npm run voice:prepare -- voice/demo/sf6-test.txt voice/output/sf6-test.manifest.json
npm run voice:synthesize-local -- \
  voice/output/sf6-test.manifest.json \
  voice/output/hvl-sf6-test.wav
```

Weights chính thức được cache trong `voice/models/`. Policy Cloud phải cho phép các miền Hugging Face trước lần chạy đầu tiên. Cấu hình giọng và sampling nằm tại `voice/config/local-vieneu.json`.
