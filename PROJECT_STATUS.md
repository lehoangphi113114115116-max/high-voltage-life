# Trạng thái HIGH VOLTAGE LIFE AI VIDEO AGENT

Cập nhật: 2026-11-17

| Module | Trạng thái | Ghi chú |
| --- | --- | --- |
| Remotion Cloud render | Hoàn thành | 1080×1920, 30 FPS, H.264 |
| Nhận diện hình ảnh + 2D MUSE 87L | Hoàn thành | Technical components tái sử dụng |
| TTS cục bộ | Hoàn thành | VieNeu-TTS v3 Turbo 3.8.4, Thái Sơn, tốc độ 1,166× |
| Từ điển phát âm | Hoàn thành | Thuật ngữ điện trong `pronunciation.vi.json` |
| Content Director | Hoàn thành v1 | Phân loại chủ đề/audience/độ sâu bằng rule + knowledge profile |
| Agent Skills chuyên môn | Hoàn thành | `social`, `scientific-critical-thinking`, `anatomy`; định tuyến theo chủ đề và khóa phiên bản |
| Mặc định minh họa code động | Đã cập nhật | `CurrentFlow` hạt vàng theo dây thẳng/cong, chiều nguồn→tải, nháy đầu nối tùy chọn; tích hợp cảnh chim SVG và StoryMotion. Chưa render mới ở cập nhật này |
| Storyboard Generator | Preview v2 chờ duyệt | Chia cảnh theo câu và timestamp lời đọc; số cảnh không cố định |
| Visual Director | Preview v2 chờ duyệt | Dolly/parallax, animation SVG, cross-dissolve và directional reveal; chưa áp dụng video đầy đủ |
| Phong cách sản xuất mặc định | Đã chốt cấu hình v3 | Colorful Technical Animation; Remotion/React/SVG, component độc lập, màu tự nhiên, hành động theo lời thoại, hạt năng lượng quy ước; footage/3D khi cần. Lượt này chỉ cấu hình, không render |
| Demo màu tự nhiên 15 giây | Đã render, chờ đánh giá | `HVL-NATURAL-BIRD-15S`; ảnh mẫu + camera, lá/SVG động, sơ đồ nền sáng, Thái Sơn/karaoke; H.264 1080×1920/30 FPS |
| Karaoke theo audio | Hoàn thành v1 | Dùng duration và vùng không im lặng của audio thực tế |
| Automated Pipeline | Hoàn thành v1 | `npm run agent -- --topic "..."` |
| QC | Hoàn thành v1 | Kiểm tra spec, audio, karaoke, H.264/1080×1920/30 FPS |
| 3D thiết bị chân thật | Chưa triển khai | Không cần cho demo chim trên dây; chỉ bổ sung theo chủ đề có cấu tạo cơ khí |

Anatomy chỉ hỗ trợ ngôn ngữ minh họa có chiều sâu. Pipeline không được mô tả cấu tạo thiết bị điện thật nếu chưa có tài liệu kỹ thuật được chấp thuận; Remotion vẫn là renderer duy nhất.

Đầu ra sinh tự động nằm trong `agent/runs`, `public/generated` và `out`; không commit Git. File source, cấu hình và status được commit.
