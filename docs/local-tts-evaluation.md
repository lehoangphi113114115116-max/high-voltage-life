# Đánh giá TTS tiếng Việt chạy cục bộ

Ngày đánh giá: 2026-11-16. Mục tiêu là CPU-only, không API trả phí, không huấn luyện mới và không clone giọng tham khảo.

## Tài nguyên Codex Cloud

- CPU: 5 vCPU Intel Xeon Platinum 8573C, x86-64.
- RAM: 33 GiB, khoảng 32 GiB khả dụng khi đo.
- GPU: không phát hiện NVIDIA GPU hoặc thiết bị tăng tốc đồ họa.
- Python: 3.12.14; pip 26.2.2.
- Disk: khoảng 58 GiB khả dụng trên `/workspace`.
- FFmpeg/ffprobe: 7.1.5.

## So sánh model

| Model | Giấy phép | CPU/phần cứng | Tiếng Việt và điều khiển | Kết luận |
| --- | --- | --- | --- | --- |
| VieNeu-TTS v3 Turbo 3.8.4 | Repo và package công bố Apache-2.0; cần giữ NOTICE/attribution và kiểm tra lại license model card của weights | ONNX CPU, torch-free; benchmark tác giả khoảng RTF 0,55–0,62 fp32 | 25 preset, 3 vùng, nam/nữ, sampling; tốc độ hậu xử lý bằng FFmpeg | Chọn. Tự nhiên nhất trong nhóm phù hợp CPU và có preset nam rõ ràng |
| Piper | Engine hiện tại GPL-3.0-or-later; từng model có license dữ liệu riêng | ONNX rất nhẹ, realtime CPU | Có ba voice `vi_VN`, nhưng chất lượng low/medium và ít điều khiển nhấn nhá | Phương án dự phòng; cần tuân thủ GPL và xác minh license từng voice |
| Meta MMS-TTS Vietnamese | CC-BY-NC-4.0 | CPU có thể chạy nhưng cần Transformers/PyTorch | Có tiếng Việt, ít điều khiển phong cách | Loại cho mục tiêu thương mại vì điều khoản NC |
| Coqui XTTS v2 / viXTTS | Coqui Public Model License, không phải giấy phép thương mại mở mặc định | CPU chậm và nặng; GPU phù hợp hơn | Chất lượng/clone tốt | Không chọn: license và phần cứng không phù hợp |
| F5-TTS và các checkpoint cộng đồng | Code/model có thể khác license; nhiều weights hạn chế phi thương mại | Thực tế nên có GPU | Điều khiển bằng reference | Không chọn: thiếu GPU và rủi ro license weights |
| `viet-tts` 0.1.0 | Metadata package không nêu license rõ ràng | Phụ thuộc Torch 2.0.1, onnxruntime-gpu 1.16 và stack cũ | Có tiếng Việt | Không chọn vì Python 3.12/GPU và license không rõ |

## Hồ sơ được chọn

`HVL Science Male v1` sử dụng preset nam miền Nam `Thái Sơn` của VieNeu-TTS, không dùng reference audio. Sau vòng so sánh, tốc độ được chốt ở 1,166× (nhanh hơn 10% so với mẫu 1,06×), temperature 0,72, top-p 0,92 và loudness đầu ra −16 LUFS. Đây là hồ sơ dự án dựa trên preset hợp pháp, không phải bản sao chính xác của giọng tham khảo.

Model được tải một lần vào `voice/models/` và bị Git bỏ qua. Audio đầu ra nằm trong `voice/output/`, cũng không commit.

## Trạng thái mạng

Package Python tải được từ PyPI. Model weights chính thức đặt tại Hugging Face, nhưng policy mạng hiện tại chưa cho phép `huggingface.co` và các CDN liên quan. Không dùng mirror không chính thức vì không thể bảo đảm checksum/license. Cần mở quyền tải từ nguồn chính thức trước khi có thể tạo và bàn giao WAV thật.
