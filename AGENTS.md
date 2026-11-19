# Hướng dẫn cho agent

## Phạm vi dự án

Đây là dự án Remotion dùng React và TypeScript, chạy và render hoàn toàn trong Codex Cloud. Không phụ thuộc vào máy Windows cá nhân.

Đọc `PROJECT_STATUS.md` trước khi làm việc. Chỉ mở module liên quan đến nhiệm vụ hiện tại; không xây lại module đã đánh dấu hoàn thành.

Trước khi viết kịch bản kỹ thuật, áp dụng `agent/research/SKILL.md` và kiểm tra hỗ trợ tài liệu theo từng cảnh. Dùng chế độ `--research-only` để kiểm tra hồ sơ mà không chạy TTS hoặc render. Khi Codex CLI con không khởi tạo được nhưng phiên làm việc có web search, tự nghiên cứu trong phiên hiện tại, đối chiếu theo skill, tạo hồ sơ JSON theo schema kèm chủ đề và ngày truy cập nguồn, rồi truyền `--research-file` để pipeline dùng và lưu hồ sơ đó.

Phương pháp dựng hình chung: đọc `docs/illustration-system.md`; import component/token/motion/transition từ `src/illustration/index.ts`. Tái sử dụng trước khi bổ sung. `src/examples/sf6-v2` giữ mã Remotion V2 người dùng cung cấp và cực máy cắt đã tách thành React; đây là ví dụ nguyên lý, không giới hạn hệ dựng hình vào SF6. Ví dụ tổng quát: `src/examples/ReusableIllustrationExample.tsx`.

Chọn công cụ theo [Auto Tool & Repository Director](docs/tool-director.md), `agent/tool-manifest.json` và `tool-plan.json` của lượt dựng. Với cảnh tự viết, ghi yêu cầu kỹ thuật cụ thể vào `toolRequirement` khi component hiện có thật sự thiếu. Kiểm tra ghi chú tích hợp và giấy phép trước khi thêm dependency.

Auto Footage Director: `agent/footage/director.mjs`, hướng dẫn `docs/auto-footage-director.md`. Pipeline đã nối tìm/license/tải/cắt/khung footage; ưu tiên SVG, chỉ thêm clip khớp câu và có safe slot. Layout mới phải khai báo reserved areas (thiết bị, sơ đồ, nhãn, karaoke) và candidate rectangles. Kiểm tra contentMatch/clip thực tế và credits trong QC trước khi bàn giao; không coi metadata match là xác minh thị giác. Không dùng clip chưa xác minh license.

## Phong cách mặc định cho mọi video mới

Phong cách đã chốt: **Colorful Technical Animation** — Remotion + React + SVG, đối tượng riêng có thể animate độc lập, màu tự nhiên rõ ràng, nhiều lớp phối cảnh/parallax, camera mượt. Hành động phải phù hợp lời thoại: chim bay/đáp/vỗ cánh, mây trôi, khói bốc tan ở nơi thực sự có khói, thiết bị đổi trạng thái, hạt năng lượng chạy trên dây. Không ghép toàn cảnh thành ảnh tĩnh rồi chỉ di chuyển camera hoặc thêm chữ. Tái sử dụng component; chỉ bổ sung phần thiếu. Footage/3D chỉ bổ trợ khi chủ đề cần. Không tự tạo preview; nhiệm vụ cập nhật cấu hình không render video.

Đọc và áp dụng `agent/visual-defaults.json` và `docs/visual-direction.md` khi lập storyboard hoặc dựng video. Mặc định sản xuất video hoàn chỉnh; chỉ làm preview khi người dùng yêu cầu. Yêu cầu cập nhật cấu hình/tài liệu không tự cấp phép render.

Mẫu phong cách đã duyệt là preview điện gió V2 (`HVL-WIND-POWER-PREVIEW`). Giữ mật độ hình có chủ đích, điểm nhìn chính rõ, chuyển động độc lập theo lớp, camera bám đối tượng và chuyển cảnh ăn khớp hình hoặc hành động. Mỗi nhịp 1–2 giây nên có một diễn biến có ý nghĩa. Chọn bối cảnh, hành động và sơ đồ theo chủ đề mới.

Thuyết minh khoa học dùng Adam và hồ sơ `voice/config/narration-direction.json`. Viết câu hỏi thật ngắn để mở ý, tách phát hiện và cao trào thành câu riêng, dùng dấu câu và khoảng nghỉ để tạo nhịp. Giữ từ điển phát âm, đối chiếu karaoke với WAV đã hoàn tất. VieNeu v3 Turbo không đọc chỉ thị cảm xúc riêng.

Ưu tiên kể chuyện bằng hoạt cảnh minh họa màu sắc có chiều sâu; footage chỉ dùng khi cần và có quyền sử dụng được xác minh. Cảnh vật dùng màu tự nhiên, đa dạng theo bối cảnh/vật liệu; màu thương hiệu chỉ dành cho nhận diện, nhãn kỹ thuật và karaoke. Hạn chế chữ, không giữ tiêu đề lớn xuyên suốt; chỉ hiện sơ đồ/công thức/đồ thị ở câu cần giải thích nguyên lý.

Chia cảnh theo nội dung và timestamp lời đọc, số cảnh không cố định. Mỗi cảnh có chuyển động đối tượng và camera phù hợp, chuyển cảnh mượt có liên kết; không đứng hình quá 3 giây nếu thiếu lý do kỹ thuật. Chọn 2D/2.5D/3D theo nhu cầu giải thích, giữ đúng nguyên lý và cấu tạo có tài liệu. Khi bắt đầu video mới, đưa các chỉ dẫn `visualDirection` trong storyboard vào renderer thực tế; không coi metadata là hình ảnh đã được triển khai.

## Quy tắc làm việc

- Mặc định ưu tiên minh họa kỹ thuật sạch bằng code/SVG trong Remotion, ít cảnh có trọng tâm. Footage và ảnh chỉ bổ trợ khi phù hợp; chuyển động camera trên ảnh tĩnh không đủ thay thế hoạt cảnh đối tượng.
- Dây đang mang điện phải có hạt vàng nhỏ chạy liên tục bám theo dây. Dùng `CurrentFlow` với `x1` là nguồn, `x2` là phía nhận; `reverse` đổi hướng, `controlY` khớp dây cong quadratic có control X tại trung điểm. Có thể bật `terminalPulse` ở đầu nối. Khi mất điện phải dừng/ẩn hạt. Hạt biểu diễn hướng truyền năng lượng quy ước, không phải vận tốc electron hay chiều dòng AC tức thời.

- Đọc Skills liên quan trong `.agents/skills` trước khi thay đổi composition hoặc quy trình render.
- Dùng `agent/skill-router.mjs` để chọn Skill: `social` cho nội dung video ngắn, `scientific-critical-thinking` để kiểm tra tuyên bố kỹ thuật, và `anatomy` chỉ khi cần minh họa cấu tạo/chiều sâu.
- Anatomy chỉ cung cấp nguyên tắc bố cục. Không tự sáng tạo cấu tạo, kích thước hoặc chuyển động của thiết bị điện thật khi chưa có tài liệu kỹ thuật được chấp thuận; Remotion luôn là renderer chính.
- Không tự chạy publisher/script tùy chọn của Skill, không bật OpenRouter hay dịch vụ trả phí nếu chưa được người dùng chấp thuận.
- Giữ tất cả package Remotion ở cùng một phiên bản chính xác.
- Dùng `useCurrentFrame()`, `useVideoConfig()` và `interpolate()` cho animation có tính xác định theo frame.
- Không dùng CSS transition hoặc CSS animation cho nội dung render.
- Không thêm TTS, 3D hoặc dịch vụ trả phí nếu chưa có yêu cầu và chấp thuận rõ ràng.
- Không ghi secret, token hoặc thông tin xác thực vào repository.
- TokenEconomizer: chỉ cài khi phiên bản Codex nằm trong dải upstream đã kiểm thử và hook trust có thể xác minh bằng status. Khi bị ngoài dải, không cài giả, không tự prune tool và không bật model side-call; tham khảo `docs/token-economizer.md`. Dùng `PROJECT_STATUS.md` làm bộ nhớ dự án tạm thời.
- Bàn giao MP4: không commit file lớn. Dùng `agent/deliver-video.mjs` để tạo bản fast-start từ file đã render; artifact Cloud là kênh chính, Release chỉ là dự phòng khi quyền upload được xác minh.
- GitHub Actions artifact: dùng `.github/workflows/video-artifact.yml` cho các video có đủ asset nguồn trong CI; không giả định workflow có thể đọc file chỉ tồn tại trong workspace Codex.
- Không gửi mẫu giọng ra ngoài, kích hoạt Voice Cloning hoặc đổi `voice/config/voice-profile.example.json` khỏi trạng thái `disabled` nếu chưa có xác nhận quyền sử dụng và chấp thuận dịch vụ/chi phí của người dùng.
- Giữ Voice ID và API key trong biến môi trường hoặc secret store; không commit các giá trị này.

## Kiểm tra khi thay đổi video

Khi sửa composition, kiểm tra phần vừa sửa và sản phẩm được yêu cầu. Các lệnh dưới đây chỉ dùng cho composition liên quan; không render lại các video cũ không liên quan:

```bash
npm run typecheck
npm run render
npm run probe
npm run render:87l
npm run probe:87l
```

Giữ composition kiểm tra `HIGH-VOLTAGE-LIFE` ở 150 frame. Demo kỹ thuật `HV-LIFE-87L-DEMO` dùng 450 frame. Cả hai giữ tỷ lệ 9:16, kích thước 1080 × 1920 và tốc độ 30 FPS, trừ khi người dùng yêu cầu thay đổi.

Nếu chỉ thay đổi bộ định tuyến Agent Skills, chạy `npm run agent:skills:test`; không render lại video cũ.

Nếu chỉ cập nhật phong cách/storyboard, kiểm tra cú pháp, dữ liệu cấu hình và kết quả storyboard mới; không render trừ khi người dùng yêu cầu.
