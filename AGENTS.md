# Hướng dẫn cho agent

## Phạm vi dự án

Đây là dự án Remotion dùng React và TypeScript, chạy và render hoàn toàn trong Codex Cloud. Không phụ thuộc vào máy Windows cá nhân.

Đọc `PROJECT_STATUS.md` trước khi làm việc. Chỉ mở module liên quan đến nhiệm vụ hiện tại; không xây lại module đã đánh dấu hoàn thành.

## Quy tắc làm việc

- Đọc Skills liên quan trong `.agents/skills` trước khi thay đổi composition hoặc quy trình render.
- Dùng `agent/skill-router.mjs` để chọn Skill: `social` cho nội dung video ngắn, `scientific-critical-thinking` để kiểm tra tuyên bố kỹ thuật, và `anatomy` chỉ khi cần minh họa cấu tạo/chiều sâu.
- Anatomy chỉ cung cấp nguyên tắc bố cục. Không tự sáng tạo cấu tạo, kích thước hoặc chuyển động của thiết bị điện thật khi chưa có tài liệu kỹ thuật được chấp thuận; Remotion luôn là renderer chính.
- Không tự chạy publisher/script tùy chọn của Skill, không bật OpenRouter hay dịch vụ trả phí nếu chưa được người dùng chấp thuận.
- Giữ tất cả package Remotion ở cùng một phiên bản chính xác.
- Dùng `useCurrentFrame()`, `useVideoConfig()` và `interpolate()` cho animation có tính xác định theo frame.
- Không dùng CSS transition hoặc CSS animation cho nội dung render.
- Không thêm TTS, 3D hoặc dịch vụ trả phí nếu chưa có yêu cầu và chấp thuận rõ ràng.
- Không ghi secret, token hoặc thông tin xác thực vào repository.
- Không gửi mẫu giọng ra ngoài, kích hoạt Voice Cloning hoặc đổi `voice/config/voice-profile.example.json` khỏi trạng thái `disabled` nếu chưa có xác nhận quyền sử dụng và chấp thuận dịch vụ/chi phí của người dùng.
- Giữ Voice ID và API key trong biến môi trường hoặc secret store; không commit các giá trị này.

## Kiểm tra khi thay đổi video

Sau khi thay đổi mã nguồn, chạy:

```bash
npm run typecheck
npm run render
npm run probe
npm run render:87l
npm run probe:87l
```

Giữ composition kiểm tra `HIGH-VOLTAGE-LIFE` ở 150 frame. Demo kỹ thuật `HV-LIFE-87L-DEMO` dùng 450 frame. Cả hai giữ tỷ lệ 9:16, kích thước 1080 × 1920 và tốc độ 30 FPS, trừ khi người dùng yêu cầu thay đổi.

Nếu chỉ thay đổi bộ định tuyến Agent Skills, chạy `npm run agent:skills:test`; không render lại video cũ.
