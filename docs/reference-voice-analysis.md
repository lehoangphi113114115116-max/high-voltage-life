# Phân tích mẫu giọng tham chiếu

File được phân tích cục bộ trong Codex Cloud ngày 2026-11-16. File không được chép vào repository và không được gửi tới dịch vụ bên ngoài.

## Chỉ số kỹ thuật

| Thuộc tính | Kết quả |
| --- | --- |
| Codec | MP3 |
| Thời lượng | 112,464 giây |
| Kênh | Mono |
| Sample rate | 24 kHz |
| Bitrate | khoảng 32 kbps |
| Integrated loudness | −19,1 LUFS |
| Loudness range | 2,0 LU |
| True peak | −1,2 dBFS |
| RMS | −19,27 dBFS |
| DC offset | 0,000104 |
| Khoảng ngắt phát hiện ở −40 dB, tối thiểu 250 ms | 50 đoạn, tổng 22,21 giây |

## Đánh giá khả dụng

- Mức âm khá đồng đều, không clipping và gần như không có DC offset; đây là tín hiệu thuận lợi cho việc tách câu và chuẩn hóa âm lượng.
- Khoảng 90,25 giây không thuộc các đoạn im lặng đã phát hiện, đủ dài cho một phép thử instant cloning của nhiều dịch vụ.
- 24 kHz mono phù hợp cho lời nói, nhưng bitrate 32 kbps là mức nén thấp. Artefact MP3 có thể làm giảm độ trung thực của bản clone; nếu có thể, nên dùng WAV/PCM hoặc bản gốc bitrate cao hơn trước khi tạo Voice ID chính thức.
- Phân tích tự động không xác nhận được tiếng ồn nền, nhạc nền, số người nói, giới tính, vùng miền hoặc sắc thái biểu cảm. Cần nghe và kiểm tra thủ công trước khi tải mẫu lên bất kỳ nhà cung cấp nào.
- Chưa có bằng chứng về quyền sử dụng trong repository. Vì vậy mẫu chỉ được coi là dữ liệu tham chiếu cục bộ và pipeline tiếp tục bị khóa.

## Điều kiện trước khi cloning

1. Xác nhận người cung cấp có quyền cho phép nhân bản và sử dụng giọng trong video.
2. Xác nhận file chỉ có một người nói và không chứa nhạc/giọng của bên thứ ba.
3. Chốt phạm vi thương mại, thời hạn sử dụng và cách thu hồi/xóa Voice ID.
4. Nếu có thể, thay bằng nguồn WAV sạch, không reverb, không xử lý nặng và có ít nhất 1–3 phút lời nói liên tục.
