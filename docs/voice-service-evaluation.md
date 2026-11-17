# Đánh giá dịch vụ giọng đọc cho HIGH VOLTAGE LIFE

Ngày đánh giá kiến trúc: 2026-11-16. Chưa có mẫu nào được tải lên và chưa kích hoạt dịch vụ. Môi trường task không có quyền duyệt web giá trực tiếp, vì vậy các con số dưới đây chỉ là mức tham khảo từ bảng giá công khai từng được công bố, không phải báo giá hiện hành. Phải kiểm tra lại trang chính thức ngay trước khi mua.

| Phương án | Tiếng Việt / clone | Tích hợp và timestamp | Chi phí tham khảo, cần xác minh | Nhận xét |
| --- | --- | --- | --- | --- |
| ElevenLabs | Multilingual và Instant/Professional Voice Clone | REST API, Voice ID tái sử dụng; alignment ký tự có thể chuẩn hóa | Gói từng được niêm yết khoảng 5 / 22 / 99 USD mỗi tháng theo hạn mức | Ứng viên ưu tiên để thử chất lượng; cần kiểm tra quyền clone, retention và quyền thương mại của gói |
| Azure AI Speech | Có TTS `vi-VN`; Personal Voice/Custom Neural Voice bị kiểm soát quyền truy cập | SDK/REST, viseme/word boundary thuận lợi cho karaoke | Neural TTS từng ở khoảng 16 USD/1 triệu ký tự; custom voice có điều kiện/báo giá riêng | Phù hợp nếu ưu tiên quản trị doanh nghiệp và quy trình đồng thuận chặt |
| PlayAI (PlayHT) | Có cloning/multilingual, cần thử riêng tiếng Việt kỹ thuật | API streaming; khả năng timestamp cần xác minh theo endpoint/gói | Gói creator/API từng ở khoảng 39 USD/tháng trở lên | Chỉ nên chọn sau bài test thuật ngữ và xác nhận alignment |
| Resemble AI | Voice cloning và API | API; alignment/phoneme phụ thuộc sản phẩm | Pay-as-you-go từng khoảng 0,006 USD/giây audio, clone chuyên nghiệp có thể tính riêng | Dễ dự toán theo phút, nhưng cần xác minh phí clone và lưu giọng |
| Local open source (XTTS v2/F5-TTS/OpenVoice) | Có thể clone cục bộ; chất lượng tiếng Việt tùy model | Tự vận hành, timestamp cần forced alignment riêng | Không phí theo ký tự; vẫn có chi phí GPU, lưu trữ và vận hành | Riêng tư hơn nhưng Codex Cloud hiện chưa được xác nhận có GPU; license model phải kiểm tra |

## Khuyến nghị

Giữ lớp adapter độc lập nhà cung cấp như mã hiện tại. Sau khi có xác nhận quyền sử dụng, thực hiện một phép thử ngắn có kiểm soát với ElevenLabs và Azure, dùng cùng sáu thuật ngữ trong từ điển. Chọn theo ba tiêu chí: phát âm tiếng Việt kỹ thuật, alignment đủ chính xác cho karaoke, và tổng chi phí/quyền thương mại. Không mua gói hoặc tải mẫu lên trước khi người dùng duyệt lại báo giá hiện hành.

OpenAI TTS và Google Cloud TTS có thể dùng cho giọng dựng sẵn, nhưng không được xem là lựa chọn clone tự phục vụ mặc định trong kiến trúc này nếu chưa xác minh quyền truy cập custom voice.
