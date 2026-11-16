# Hướng dẫn cho agent

## Phạm vi dự án

Đây là dự án Remotion dùng React và TypeScript, chạy và render hoàn toàn trong Codex Cloud. Không phụ thuộc vào máy Windows cá nhân.

## Quy tắc làm việc

- Đọc Skills liên quan trong `.agents/skills` trước khi thay đổi composition hoặc quy trình render.
- Giữ tất cả package Remotion ở cùng một phiên bản chính xác.
- Dùng `useCurrentFrame()`, `useVideoConfig()` và `interpolate()` cho animation có tính xác định theo frame.
- Không dùng CSS transition hoặc CSS animation cho nội dung render.
- Không thêm TTS, 3D hoặc dịch vụ trả phí nếu chưa có yêu cầu và chấp thuận rõ ràng.
- Không ghi secret, token hoặc thông tin xác thực vào repository.

## Kiểm tra bắt buộc

Sau khi thay đổi mã nguồn, chạy:

```bash
npm run typecheck
npm run render
npm run probe
npm run render:87l
npm run probe:87l
```

Giữ composition kiểm tra `HIGH-VOLTAGE-LIFE` ở 150 frame. Demo kỹ thuật `HV-LIFE-87L-DEMO` dùng 450 frame. Cả hai giữ tỷ lệ 9:16, kích thước 1080 × 1920 và tốc độ 30 FPS, trừ khi người dùng yêu cầu thay đổi.
