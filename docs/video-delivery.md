# Bàn giao video MP4

MP4 không được commit vào Git. Sau mỗi lần render, dùng artifact của Codex Cloud bằng file trong `out/`. Nếu trình xem không mở trực tiếp, tạo bản fast-start từ chính file đã có:

```sh
node agent/deliver-video.mjs out/<render>.mp4 out/<render>-download.mp4
```

Helper chỉ sao chép stream (`ffmpeg -c copy`), không render, không đổi codec và không phát sinh dịch vụ/chi phí. Sau đó kiểm tra đường dẫn tuyệt đối và dùng nó làm artifact tải xuống.

GitHub Release là phương án dự phòng, chỉ dùng khi artifact không hoạt động và token GitHub có quyền `contents:write`/Release upload. Nếu nhận `401 Bad credentials` hoặc thiếu scope, giữ artifact Cloud và báo blocker; tuyệt đối không đưa MP4 vào Git history.

## GitHub Actions artifact

Workflow `.github/workflows/video-artifact.yml` cung cấp cơ chế tái sử dụng cho các lần sau: vào tab **Actions → Video artifact → Run workflow**, chọn composition và chạy. Sau khi job xanh, mở run đó, phần **Artifacts** sẽ có file ZIP chứa MP4 để tải xuống. Workflow chỉ render trong GitHub Actions khi các asset nguồn (đặc biệt `public/generated/.../voice.wav`) đã được tạo trong CI; nó không thể đọc file đang nằm trong workspace Codex.

MP4 hiện tại không thể chuyển nguyên trạng vào run này vì file chỉ tồn tại trong workspace Codex, không có URL tải công khai và token GitHub hiện tại không có quyền upload Release asset. Do đó chưa có Actions run/artifact để xác nhận, và không báo cáo giả là đã tải được.
