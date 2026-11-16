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

## Remotion Skills

Bộ 13 Remotion Skills chính thức từ `remotion-dev/skills` được khóa nguồn và hash trong `skills-lock.json`. Khôi phục bản dành cho Codex bằng:

```bash
npx --yes skills@latest experimental_install --frozen-lockfile --agent codex
```

Thư mục `.agents/skills` được bỏ qua trong Git vì đây là bản sao sinh ra từ lockfile.
