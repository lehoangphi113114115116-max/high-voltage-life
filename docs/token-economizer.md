# TokenEconomizer trong Codex Cloud

## Trạng thái kiểm tra

- Nguồn chính thức: <https://github.com/microsoft/TokenEconomizer>
- Giấy phép upstream được công bố trong `LICENSE`: MIT.
- Codex Cloud hiện tại: `codex-cli 0.167.0-alpha.4`.
- TokenEconomizer công bố dải Codex đã kiểm thử: `0.153.1`–`0.164.0`.
- `codex plugin` và tùy chọn hook tồn tại, nhưng phiên bản hiện tại nằm ngoài dải đã xác minh.
- `codex plugin list` không phát hiện plugin đã cài; marketplace từ xa cũng không khả dụng trong phiên này (HTTP 451 từ catalog của Codex).

**Kết luận:** chưa cài TokenEconomizer. Cài vào phiên bản `0.167.0-alpha.4` sẽ là triển khai ngoài phạm vi được upstream xác nhận, nên không được coi là tương thích hay đã kích hoạt.

## Ba chức năng chưa kích hoạt

Micro-skills, tool pruning và failure-loop intervention đều phụ thuộc vào hook/plugin lifecycle của Codex. Vì vậy không ghi cấu hình giả, không vô hiệu hóa công cụ, và không tạo model call phụ. Pipeline Remotion, TTS, karaoke, footage và render MP4 không bị thay đổi.

## Cách kích hoạt an toàn khi phiên bản tương thích

1. Kiểm tra `codex --version` thuộc `0.153.1`–`0.164.0` và đọc release notes của Codex/TokenEconomizer.
2. Clone upstream vào một thư mục công cụ ngoài repository; không commit clone hoặc cache vào Git.
3. Thực hiện theo hướng dẫn Codex chính thức của upstream:

   ```sh
   git clone https://github.com/microsoft/TokenEconomizer.git
   codex plugin marketplace add /absolute/path/TokenEconomizer
   codex plugin add tokeneconomizer@tokeneconomizer
   ```

4. Chấp thuận hook trust trong phiên Codex mới, thoát và khởi động lại Codex.
5. Kiểm tra bằng `$tokeneconomizer:status`. Chỉ khi status thành công mới coi ba cơ chế hoạt động.

Không bật các tùy chọn model/side-call ngoài mặc định nếu chưa có chấp thuận chi phí. Việc gỡ plugin là thao tác đảo ngược bằng `codex plugin remove tokeneconomizer` và không xóa dữ liệu dự án.

## Phương án hiện tại không cần plugin

Agent tiếp tục dùng `AGENTS.md` và `PROJECT_STATUS.md` làm bộ nhớ dự án: đọc trạng thái trước, chỉ mở module liên quan, không render lại đầu ra cũ và ghi nhận blocker sau mỗi thay đổi. Đây là quy tắc hướng dẫn repository, không phải TokenEconomizer hook và không được báo cáo như plugin đã hoạt động.
