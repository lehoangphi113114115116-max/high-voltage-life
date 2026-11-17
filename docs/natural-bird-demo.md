# Video thử 15 giây — màu tự nhiên

Composition `HVL-NATURAL-BIRD-15S`, 450 frame, 1080×1920, 30 FPS. Tái sử dụng ảnh mẫu được tạo trong cuộc trò chuyện tại `public/art/bird-natural.png` và audio Thái Sơn tại `public/generated/current/voice.wav`.

Ba nhịp: cảnh chim và lá chuyển động độc lập với camera; chuyển hòa sang sơ đồ nhánh cơ thể và dòng trên dây; trở về cận điểm tiếp xúc và thanh chú thích điện trở. Ảnh chim là minh họa tĩnh được camera chuyển động; các đối tượng lá, đường vẽ và hạt trong sơ đồ được animate riêng, không phải footage chim thật. Hạt biểu diễn dòng theo quy ước, không mô phỏng vận tốc electron.

Giữ màu tự nhiên của ảnh, sơ đồ nền sáng và nhãn gọn. Không giữ tiêu đề dài trên màn hình. Dùng lại Karaoke của dự án, giới hạn đến hết câu thứ ba. Timestamp vẫn là ước lượng hiện có, chưa forced alignment. Audio cắt tại 14,4 giây, trong vùng im lặng 14,127–14,627 giây, để kết thúc câu và tránh đầu câu kế tiếp; phần còn lại video kết nhẹ đến giây 15.

Kiểm tra riêng: TypeScript đạt; ffprobe xác nhận H.264, AAC, 1080×1920, 30 FPS và đúng 15,000 giây; đã decode FFmpeg và xem contact sheet. Không render lại composition cũ. Bản bàn giao `out/hvl-natural-bird-15s-final.mp4` đã remux video với đoạn audio kết ở 14,4 giây và chèn im lặng đến 15 giây; không đưa MP4 vào Git.
