# Bàn giao Google Drive

Trạng thái: đã nối upload vào pipeline; chưa cấp OAuth và chưa upload thực tế.

Google Drive for desktop trên máy cá nhân không mount thư mục vào Codex Cloud. Phiên hiện tại không cung cấp connector OAuth/upload Drive. Dùng Drive API qua OAuth client riêng là phương án thay thế; không cần thư viện npm mới.

## Cấu hình một lần

1. Trong Google Cloud Console, bật Drive API và tạo OAuth client loại Web application cho ứng dụng kết nối. Cấu hình redirect HTTPS của ứng dụng; chế độ External cần thêm tài khoản Google làm test user nếu chưa publish. Refresh token của ứng dụng External ở Testing thường hết hạn sau 7 ngày với quyền Drive.
2. Ứng dụng kết nối phải mở OAuth Authorization Code + PKCE, xác minh state, dùng `prompt=select_account consent`, `access_type=offline`, scope duy nhất `https://www.googleapis.com/auth/drive.file`. Đây là thao tác chọn tài khoản/cấp quyền trong Safari trên iPhone. Không dùng luồng copy mã OAuth đã bị Google ngừng hỗ trợ.
3. Dùng Google Picker cùng OAuth client để người dùng chọn đúng thư mục `HIGH VOLTAGE LIFE/VIDEO OUTPUT`. Chỉ biết tên hoặc URL thư mục không tự cấp quyền `drive.file`. Picker cần cấu hình project/API key với giới hạn origin/API phù hợp.
4. Lưu `HVL_DRIVE_CLIENT_ID`, `HVL_DRIVE_CLIENT_SECRET`, `HVL_DRIVE_REFRESH_TOKEN` trong secret store Cloud; `HVL_DRIVE_FOLDER_ID` là ID thư mục đã chọn. Không gửi refresh token vào chat hay Git. Đặt `HVL_DRIVE_ENABLED=1` sau khi kiểm tra upload thành công.

Luồng web OAuth/Picker chưa được triển khai hoặc triển khai lên HTTPS: hiện chưa có OAuth client, redirect URL và connector khả dụng. Các bước trên là yêu cầu còn thiếu, không phải tuyên bố rằng đã kết nối. Không xin scope toàn bộ Drive để vượt qua giới hạn folder chưa được cấp quyền.

## Upload và thử lại

Sau khi cấu hình OAuth, Agent chạy lệnh dưới với MP4 đã có:

```sh
node agent/drive-upload.mjs out/hvl-corona-rain.mp4
```

Pipeline gọi cùng module sau render/QC khi `HVL_DRIVE_ENABLED=1`. Lỗi bàn giao giữ nguyên MP4; thử lại bằng lệnh upload độc lập, không gọi lại pipeline render. Module kiểm tra parent folder, quyền không public/domain, kích thước và MD5 remote; receipt nằm trong `agent/runs/drive-delivery` (ignored). Upload trùng nội dung được nhận diện bằng appProperties và checksum. Không tạo quyền chia sẻ, không xóa file nguồn. Quyền cá nhân đã được người dùng chia sẻ cho folder vẫn được kế thừa.

Chỉ báo hoàn tất sau khi receipt có `status: verified` và trả link Drive thật. Hiện chưa có receipt này.
