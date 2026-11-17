# HIGH VOLTAGE LIFE

Project Remotion thử nghiệm để xác minh Codex Cloud có thể dựng video MP4 bằng React và TypeScript.

## Composition thử nghiệm

- ID: `HIGH-VOLTAGE-LIFE`
- Kích thước: `1080 × 1920` (9:16)
- Tốc độ khung hình: `30 FPS`
- Thời lượng: `5 giây` (`150 frame`)
- Nội dung: nền xanh navy, tiêu đề **HIGH VOLTAGE LIFE** và đường dây truyền tải điện được animate bằng SVG
- Âm thanh, TTS và 3D: không sử dụng

## Demo bảo vệ so lệch đường dây 87L

- ID: `HV-LIFE-87L-DEMO`
- Kích thước: `1080 × 1920`, 30 FPS
- Thời lượng: `15 giây` (`450 frame`)
- Nội dung: sơ đồ hai đầu đường dây, dòng điện, kênh tín hiệu, vùng bảo vệ, đặc tính tác động và lệnh cắt hai đầu
- Phong cách: animation kỹ thuật 2D theo hệ nhận diện HIGH VOLTAGE LIFE

## Yêu cầu

- Node.js 20 trở lên
- npm
- FFmpeg và ffprobe để kiểm tra file đầu ra

Script render dùng Chromium tại `/usr/bin/chromium` của môi trường Codex Cloud. Cấu hình này tránh việc Remotion phải tải thêm Chrome Headless Shell từ một hostname không nằm trong chính sách mạng của task.

## Cài đặt và chạy

```bash
npm ci
npm run typecheck
npm run studio
```

Studio mặc định chạy tại địa chỉ cục bộ mà Remotion in ra trong terminal.

## Render MP4

```bash
npm run render
npm run render:87l
```

File đầu ra được tạo tại `out/high-voltage-life.mp4`. Đây là test render cục bộ, script dùng `--is-production=false` và không gọi dịch vụ render trả phí.

Kiểm tra file thực tế:

```bash
npm run probe
npm run probe:87l
```

## Agent Skills

Bộ 13 Remotion Skills chính thức cùng ba Skill chuyên môn đã chọn (`social`, `scientific-critical-thinking`, `anatomy`) được khóa nguồn, commit và hash trong `skills-lock.json`. Tên upstream của yêu cầu `social-content` là `social`. Khôi phục bản dành cho Codex bằng:

```bash
npx --yes skills@latest experimental_install --frozen-lockfile --agent codex
```

Thư mục `.agents/skills` được bỏ qua trong Git vì đây là bản sao sinh ra từ lockfile.

Content Director tự định tuyến Skill theo chủ đề; Anatomy chỉ dùng cho minh họa có chiều sâu và không được tự suy diễn cấu tạo thiết bị thật. Xem nguồn, phiên bản, license và giới hạn tại `docs/agent-skills.md`.

## Module giọng đọc

`high-voltage-life-voice` nằm trong `src/voice` và `voice/`. Module chuẩn hóa cách đọc thuật ngữ điện, định dạng timestamp karaoke và cung cấp giao diện adapter cho nhà cung cấp TTS/Voice Cloning.

Module đang ở chế độ an toàn `disabled`: không gọi API, không gửi mẫu giọng và không thể tổng hợp khi chưa có xác nhận quyền sử dụng. Chuẩn bị kịch bản cục bộ bằng:

```bash
npm run voice:prepare -- script.txt voice/output/script.manifest.json
```

Sau khi một nhà cung cấp được phê duyệt và trả về alignment, chuẩn hóa timestamp cho Remotion bằng:

```bash
npm run voice:timestamps -- alignment.json voice/output/script.karaoke.json
```

Không commit file mẫu, audio sinh ra, API key, Voice ID hoặc hồ sơ đồng thuận. Xem hướng dẫn và đánh giá dịch vụ tại `voice/README.md` và `docs/voice-service-evaluation.md`.

TTS cục bộ CPU dùng VieNeu-TTS v3 Turbo, không clone và không gọi API trả phí. Thiết lập/chạy bằng `npm run voice:setup-local` và `npm run voice:synthesize-local`; xem chi tiết tại `docs/local-tts-evaluation.md`.

## AI Video Agent

Auto Footage Director đã nối vào pipeline: tự tìm footage Commons có license hợp lệ theo từng câu, đặt khung phụ khi có vùng trống và giữ SVG khi không đủ điều kiện. Xem [cách dùng, credits và giới hạn kiểm chứng](docs/auto-footage-director.md).

Phương pháp dựng hình dùng chung tại `src/illustration/index.ts`: components, style token, motion và transition. Xem [hướng dẫn tái sử dụng](docs/illustration-system.md); mẫu SF6 Remotion V2 của người dùng giữ riêng trong `src/examples/sf6-v2`, ví dụ tổng quát trong `src/examples/ReusableIllustrationExample.tsx`.

Phong cách đã chốt: **Colorful Technical Animation** — hoạt cảnh Remotion + React + SVG với các đối tượng chuyển động độc lập, màu tự nhiên, phối cảnh/parallax và hạt vàng biểu diễn truyền năng lượng (không phải chuyển động electron). Footage/3D chỉ bổ trợ khi cần; mặc định không tạo preview nếu chưa được yêu cầu. Xem `agent/visual-defaults.json` và `docs/visual-direction.md`.

Phong cách mặc định cho video tiếp theo nằm trong `agent/visual-defaults.json` và `docs/visual-direction.md`: kể chuyện bằng chuyển động, màu cảnh vật tự nhiên, minh họa có chiều sâu, footage có quyền sử dụng và ít chữ. Mặc định dựng video hoàn chỉnh; preview chỉ khi được yêu cầu. Pipeline lưu các chỉ dẫn này cùng project/storyboard để Agent áp dụng khi sản xuất.

Tạo video mới từ một chủ đề bằng một lệnh:

```bash
npm run agent -- --topic "Vì sao chim đậu trên dây điện mà không bị giật?"
```

Pipeline phân loại chủ đề, tạo research brief/kịch bản/storyboard, chọn visual mode, tổng hợp giọng Thái Sơn, căn karaoke theo audio thực tế, render H.264 và chạy QC. MP4 nằm trong `out/`; project/QC report nằm trong `agent/runs/`. Xem tiến độ module tại `PROJECT_STATUS.md`.
