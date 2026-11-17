# Preview chuyển động — chờ người dùng duyệt

Composition: `HVL-MOTION-PREVIEW`, 520 frame, 1080×1920, 30 FPS. Chỉ render preview; composition video đầy đủ giữ cách dựng cũ đến khi được duyệt.

`agent/storyboard.mjs` chia lời thoại theo dấu kết câu và timestamp karaoke hiện có. Mỗi câu tạo một scene; số scene phụ thuộc kịch bản. Visual mode chọn theo nội dung: quan sát có chiều sâu, sơ đồ nguyên lý, cận dây/điểm tiếp xúc, cảnh báo. Đây là bộ quy tắc v2, chưa phải phân tích ngữ nghĩa bằng mô hình ngôn ngữ.

Preview chủ đề chim trên dây dùng 4 nhịp lời thoại trong 17,33 giây:

- 0–5,27 giây: chim, dây và các lớp cột điện có parallax; camera dolly; cánh chim chuyển động độc lập.
- 5,27–9,63 giây: cross-dissolve sang sơ đồ hai nút và nhánh cơ thể; các hạt biểu diễn dòng trên dây chuyển động.
- 9,63–14,73 giây: directional reveal sang cận hai chân và đoạn dây điện trở nhỏ; điểm quét chuyển động.
- 14,73–17,33 giây: trở lại công thức và kết luận qua cross-dissolve.

Chuyển cảnh có overlap 24 frame theo easing cubic; cảnh được sinh từ dữ liệu nên điều chỉnh qua storyboard, không có các scene JSX độc lập để kéo thả. Các hạt là biểu diễn quy ước, không phải mô phỏng vận tốc electron.

Giữ nguyên audio Thái Sơn và bộ karaoke hiện có. Timestamp từ pipeline hiện tại là ước lượng theo vùng có tiếng và độ dài từ, chưa phải forced alignment; cần người dùng đánh giá độ khớp nghe thực tế trước khi duyệt. Không tuyên bố đạt căn chỉnh chính xác từng từ.

Kiểm tra thay đổi: TypeScript, phân đoạn với số câu khác nhau, diff whitespace; render riêng preview và kiểm tra MP4 bằng ffprobe, trích contact sheet để xem bố cục. Không chạy lại các video kiểm thử cũ.
