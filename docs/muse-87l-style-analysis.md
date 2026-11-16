# Phân tích phong cách MUSE 87L

Nguồn tham chiếu được phân tích trong Codex Cloud: `87L_Gop_Phan3.mp4`, 1080×1920, 30 FPS, dài khoảng 84 giây. File video tham chiếu không được đưa vào Git.

## Ngôn ngữ hình ảnh

- Nền navy phủ toàn khung, có gradient rất nhẹ để tập trung mắt vào khu vực kỹ thuật.
- Bảng màu chức năng: xanh nhạt cho đường dẫn và tín hiệu, vàng cho ngưỡng hoặc thông tin chính, đỏ/cam cho lỗi và lệnh cắt, xanh lá cho trạng thái ổn định.
- Font sans-serif đậm, chữ hoa, tiêu đề hai dòng; dòng quan trọng dùng vàng. Pill nhỏ ở trên xác định phần/chủ đề.
- Panel kỹ thuật viền vàng bo nhẹ chiếm vùng trung tâm. Khoảng trống lớn giúp sơ đồ dễ đọc trên màn hình dọc.
- Nhãn kỹ thuật nhỏ, viền màu theo trạng thái; số liệu và công thức được đặt sát đối tượng liên quan.
- Watermark `HIGH VOLTAGE LIFE` và thanh tiến trình mảnh duy trì nhận diện ở đáy khung.

## Chuyển động và nhịp trình bày

- Sơ đồ được dựng dần: trục, đường dây, dòng điện, ngưỡng, điểm sự cố và vùng tác động xuất hiện theo thứ tự giải thích.
- Dòng điện và tín hiệu dùng chấm hoặc nét đứt chạy liên tục theo timeline.
- Đường đặc tính được vẽ-on; điểm sự cố và nhãn cảnh báo dùng pulse/glow thay vì slide tĩnh.
- Chuyển cảnh chủ yếu là crossfade mềm kết hợp camera zoom/pan rất nhẹ. Không dùng cắt cứng gây mất ngữ cảnh.
- Mỗi cảnh giữ một ý chính, thay đổi trạng thái ngay trên cùng một sơ đồ để người xem không phải học lại bố cục.

## Áp dụng cho HIGH VOLTAGE LIFE

- Màu chuẩn: navy `#0a1626`, xanh kỹ thuật `#9fd8ff`, vàng `#f5b921`, cam hồ quang `#ff9a3c`.
- Component hóa panel, label, đường dây, dòng điện, tín hiệu, rơ le, vùng bảo vệ, chart và watermark.
- Demo 87L giữ sơ đồ hai đầu xuyên suốt bốn nhịp: tổng quan → bình thường → sự cố nội bộ → cắt hai đầu.
- Kiến trúc SVG/React hiện tại cho phép thay lớp nền hoặc bọc camera 2.5D/3D sau này mà không đổi logic relay và timeline.
