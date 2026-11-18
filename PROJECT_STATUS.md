# Trạng thái HIGH VOLTAGE LIFE AI VIDEO AGENT

Cập nhật: 2026-11-17

| Module | Trạng thái | Ghi chú |
| --- | --- | --- |
| Remotion Cloud render | Hoàn thành | 1080×1920, 30 FPS, H.264 |
| Nhận diện hình ảnh + 2D MUSE 87L | Hoàn thành | Technical components tái sử dụng |
| Hệ dựng hình reusable | Đã tích hợp | `src/illustration`: tokens/materials, layer/parallax, motion, transition, dây/hồ quang/tiếp điểm/khói; tái sử dụng object cũ. Mã SF6 V2 giữ tại `src/examples/sf6-v2`; không render trong lượt này |
| Auto Footage Director | Đã tích hợp, kiểm thử mới đạt | Commons CC0/CC BY, lọc chủ đề theo câu, tải/cache/cắt clip, safe layout và FootageLayer. Live tải clip đạt; QC nội dung hình thực tế vẫn do Agent kiểm tra, chưa có model thị giác. Không render trong lượt này |
| TTS cục bộ | Hoàn thành | VieNeu-TTS v3 Turbo 3.8.4, Thái Sơn, tốc độ 1,166× |
| Từ điển phát âm | Hoàn thành | Thuật ngữ điện trong `pronunciation.vi.json` |
| Content Director | Hoàn thành v1 | Phân loại chủ đề/audience/độ sâu bằng rule + knowledge profile |
| Agent Skills chuyên môn | Hoàn thành | `social`, `scientific-critical-thinking`, `anatomy`; định tuyến theo chủ đề và khóa phiên bản |
| Mặc định minh họa code động | Đã cập nhật | `CurrentFlow` hạt vàng theo dây thẳng/cong, chiều nguồn→tải, nháy đầu nối tùy chọn; tích hợp cảnh chim SVG và StoryMotion. Chưa render mới ở cập nhật này |
| Storyboard Generator | Preview v2 chờ duyệt | Chia cảnh theo câu và timestamp lời đọc; số cảnh không cố định |
| Visual Director | Preview v2 chờ duyệt | Dolly/parallax, animation SVG, cross-dissolve và directional reveal; chưa áp dụng video đầy đủ |
| Phong cách sản xuất mặc định | Đã chốt cấu hình v3 | Colorful Technical Animation; Remotion/React/SVG, component độc lập, màu tự nhiên, hành động theo lời thoại, hạt năng lượng quy ước; footage/3D khi cần. Lượt này chỉ cấu hình, không render |
| Demo màu tự nhiên 15 giây | Đã render, chờ đánh giá | `HVL-NATURAL-BIRD-15S`; ảnh mẫu + camera, lá/SVG động, sơ đồ nền sáng, Thái Sơn/karaoke; H.264 1080×1920/30 FPS |
| Nhà máy điện → nhà dân | Đã render và QC | `HVL-POWER-JOURNEY-15S`; 450 frame, H.264/AAC 1080×1920/30 FPS; thư viện SVG độc lập, Thái Sơn, hạt năng lượng, camera parallax |
| Nguyên lý SF6 15 giây | Đã render/QC | `HVL-SF6-PRINCIPLE-15S`; 450 frame H.264/AAC 1080×1920/30 FPS, Thái Sơn/karaoke; đóng → mở/hồ quang → khử ion → phục hồi cách điện |
| Corona khi mưa | Đã render/QC | `HVL-CORONA-RAIN`, 84,3 giây, 2529 frame H.264/AAC 1080×1920/30 FPS; Thái Sơn/karaoke, SVG corona cục bộ và inset CC BY 2.0 đã review; xem `docs/corona-rain.md` |
| TokenEconomizer | Bị chặn có chủ đích | Codex `0.167.0-alpha.4` nằm ngoài dải upstream đã kiểm thử `0.153.1–0.164.0`; chưa cài giả/cưỡng ép. Xem `docs/token-economizer.md`; dùng `AGENTS.md` + `PROJECT_STATUS.md` làm phương án ghi nhớ hiện tại |
| Bàn giao MP4 | Đã chuẩn hóa | `agent/deliver-video.mjs` tạo bản fast-start từ MP4 có sẵn; artifact Cloud là kênh chính, GitHub Release chỉ dự phòng khi token có quyền upload |
| Google Drive delivery | Đã nối upload, chờ OAuth | `agent/drive-upload.mjs`; sau QC khi `HVL_DRIVE_ENABLED=1`, retry MP4 riêng. Chưa có client OAuth/Picker/refresh token; chưa upload thật. Xem `docs/google-drive-delivery.md` |
| GitHub Actions artifact | Đã cấu hình, chưa xác minh run | `.github/workflows/video-artifact.yml` sẽ render và upload artifact khi asset audio được chuẩn bị trong CI; MP4 hiện tại không thể chuyển từ workspace Codex vào run mà không commit/upload ngoài quyền hiện có |
| Karaoke theo audio | Hoàn thành v1 | Dùng duration và vùng không im lặng của audio thực tế |
| Automated Pipeline | Hoàn thành v1 | `npm run agent -- --topic "..."` |
| QC | Hoàn thành v1 | Kiểm tra spec, audio, karaoke, H.264/1080×1920/30 FPS |
| 3D thiết bị chân thật | Chưa triển khai | Không cần cho demo chim trên dây; chỉ bổ sung theo chủ đề có cấu tạo cơ khí |

Anatomy chỉ hỗ trợ ngôn ngữ minh họa có chiều sâu. Pipeline không được mô tả cấu tạo thiết bị điện thật nếu chưa có tài liệu kỹ thuật được chấp thuận; Remotion vẫn là renderer duy nhất.

Đầu ra sinh tự động nằm trong `agent/runs`, `public/generated` và `out`; không commit Git. File source, cấu hình và status được commit.
