# Điện gió từ cánh quạt tới phụ tải

Composition `HVL-WIND-100`. Bản bàn giao có 3.000 khung hình, 1080 × 1920, 30 FPS. Tám đoạn lời đọc dùng preset Adam đã lưu. Mốc karaoke từng từ được ước lượng trong phạm vi thời lượng câu đo từ WAV và hiệu chỉnh theo tốc độ của từng cảnh.

## Storyboard

| Giây | Hoạt cảnh | Nội dung kỹ thuật |
| --- | --- | --- |
| 0–10 | Đồi, mây, cỏ và trang trại gió nhiều lớp | Đặt câu hỏi và tiến về rô to |
| 10–23 | Tiết diện cánh SVG và luồng gió | Lực nâng và thành phần tiếp tuyến tạo mô-men |
| 23–38 | Mặt cắt Three.js, vỏ mở và cụm trục quay | Truyền động trực tiếp, rô to ngoài, stato cố định |
| 38–53 | Mặt đầu máy phát và sóng điện áp | Biến thiên từ thông qua cuộn dây |
| 53–65 | Nhiều tua-bin, bộ biến đổi và các nhánh cáp | Biến đổi toàn công suất và gom về trạm |
| 65–78 | Trạm và đường dây | Nâng áp và giảm dòng khi cùng công suất, hệ số công suất |
| 78–90 | Sơ đồ hệ thống điện | Truyền tải, hạ áp, phân phối; minh họa một cấu hình |
| 90–100 | Kéo ra khu dân cư và nhà máy | Tóm tắt chuỗi chuyển đổi, các phụ tải hoạt động |

## Bằng chứng

Hồ sơ [research.json](./research.json) ghi đường dẫn, bản tài liệu, ngày truy cập, mục tham chiếu, phạm vi và đối chiếu hình ảnh. Tài liệu [Siemens Gamesa SG 14-236 DD](https://www.siemensgamesa.com/global/en/home/products-and-services/offshore/wind-turbine-sg-14-236-dd.html) (truy cập 2026-11-18, mục Direct drive technology, không ghi phiên bản) xác nhận cấu hình truyền động trực tiếp và máy phát nam châm vĩnh cửu có trong thiết bị thương mại. Mặt cắt dùng nguyên lý rô to ngoài đã công bố trong NREL/TP-5000-75698 §5. Phần hình không sao chép hình học sản phẩm, thông số hoặc tỉ lệ từ các nguồn. Không dùng footage bên thứ ba.

## Dựng lại

Dùng môi trường VieNeu-TTS và Remotion hiện có. `HVL_TTS_PYTHON` có thể trỏ tới Python của môi trường TTS đã cài ở checkout khác.

```bash
node agent/wind-100/prepare.mjs
bash agent/wind-100/render.sh
```

Bước render tách vùng dùng WebGL khỏi các cảnh SVG rồi ghép H.264 theo cùng trục thời gian 30 FPS. Audio Adam được ghép một lần vào MP4 fast-start.
