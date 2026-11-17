# Bàn giao video MP4

MP4 không được commit vào Git. Sau mỗi lần render, dùng artifact của Codex Cloud bằng file trong `out/`. Nếu trình xem không mở trực tiếp, tạo bản fast-start từ chính file đã có:

```sh
node agent/deliver-video.mjs out/<render>.mp4 out/<render>-download.mp4
```

Helper chỉ sao chép stream (`ffmpeg -c copy`), không render, không đổi codec và không phát sinh dịch vụ/chi phí. Sau đó kiểm tra đường dẫn tuyệt đối và dùng nó làm artifact tải xuống.

GitHub Release là phương án dự phòng, chỉ dùng khi artifact không hoạt động và token GitHub có quyền `contents:write`/Release upload. Nếu nhận `401 Bad credentials` hoặc thiếu scope, giữ artifact Cloud và báo blocker; tuyệt đối không đưa MP4 vào Git history.
