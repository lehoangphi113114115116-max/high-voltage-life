# Vì sao đường dây cao áp rè khi trời mưa?

Video hoàn chỉnh: `HVL-CORONA-RAIN`, 84,3 giây, 2529 frame, 1080×1920, 30 FPS. Kịch bản `agent/corona-script.json`; pipeline asset theo chủ đề `agent/produce-corona-media.mjs`. Không dùng kịch bản tổng quát của rule-based Content Director cho hiện tượng này: Agent đã nghiên cứu và viết nội dung riêng rồi dùng lại các công cụ TTS/karaoke/footage/render đã có.

## Kiểm chứng kỹ thuật

Nguồn đã đọc ngày 17/11/2026:

- Electrical4U, *Corona Effect in Power System*: https://www.electrical4u.com/corona-effect-in-power-system/ — phần Atmospheric Conditions ghi rõ giọt nước/mưa gây tăng điện trường cục bộ; phần conductor radius/bundling nói về giảm stress bề mặt. Chỉ dùng các nguyên lý định tính này; không dùng số “30 kV” trong tóm tắt như ngưỡng chung vì ngưỡng phụ thuộc hình học, mật độ khí và điều kiện bề mặt.
- Wikipedia, *Corona discharge*: https://en.wikipedia.org/wiki/Corona_discharge — đối chiếu bản chất ion hóa vùng khí gần điện cực, luminous glow, audible noise, phân biệt sự hình thành kênh dẫn toàn khe với corona cục bộ. Đây là nguồn tham khảo thứ cấp, không phải chứng nhận thiết bị hay tiêu chuẩn vận hành.

Lập luận: đường dây mang điện → điện trường gần bề mặt; giọt nước biến dạng bề mặt/tăng điện trường ở đầu giọt → ion hóa/phóng điện cục bộ → biến thiên áp suất tạo tiếng rít/lách tách → nhiều xung tạo cảm giác rè. Tiếng nghe được có thể có nguồn khác; narration nói “một nguyên nhân phổ biến/có thể”, không kết luận mọi tiếng rè đều là corona.

Corona không nhất thiết tạo cầu dẫn giữa pha–pha hoặc pha–đất. Không vẽ tia hồ quang nối dây xuống đất, không mô tả nước mưa như đường dẫn ngắn mạch liên tục. Hạt vàng biểu diễn truyền năng lượng quy ước; các hạt màu nhạt trong cảnh ion chỉ minh họa tương tác gần bề mặt. Field lines, sóng áp suất và bó dây là sơ đồ định tính, không phải mô phỏng FEM/điện trường theo tỷ lệ. Tốc độ hiện tượng được làm chậm; ánh sáng violet tăng khi phóng đại và có chú thích, không tuyên bố corona sáng rực ban ngày. Bó dây làm thay đổi điện trường bề mặt nhưng không dùng so sánh số định lượng. Mưa vẫn có thể đi kèm sự cố thực; cảnh cuối nhắc giữ khoảng cách và báo điện lực khi thấy dây rơi/bất thường.

## Storyboard theo audio thực

| Giây | Nhịp hình ảnh |
| --- | --- |
| 0–9 | Cột/dây, nhiều lớp địa hình và cây; mây, mưa tăng dần, giọt nước và corona nhỏ cục bộ |
| 9–18,9 | Cận dây, đường điện trường chuyển động; inset đường dây thật 5 giây đã kiểm tra |
| 18,9–29,07 | Giọt nước lớn và điện trường tập trung ở đầu giọt, giọt tách rơi |
| 29,07–40,37 | Hạt mang điện/ion và microdischarge ngắn sát bề mặt |
| 40,37–50,73 | Xung corona và các vòng sóng áp suất lan ra, không dùng công thức dài |
| 50,73–62,57 | Phạm vi cục bộ, không nối hai pha; chú thích tăng sáng minh họa |
| 62,57–72,6 | So sánh định tính dây đơn/bó dây, giảm tập trung điện trường |
| 72,6–84,3 | Trở về toàn cảnh mưa, khoảng cách an toàn, kết luận |

Mỗi nhịp có animation đối tượng; camera pan/parallax trong toàn cảnh, pan nhẹ trong macro, chuyển cảnh dissolve và wipe overlap 24 frame. Label/footage/karaoke nằm ngoài world camera. Reusable mới: `Rain`, `FieldLines`, `CoronaGlow`, `WaterDrop`, `PressureWaves` ở `src/components/CoronaWeather.tsx`, cũng export qua `src/illustration/index.ts`. Tái sử dụng EnergyWire, Cloud, Tree, GridTower, MaterialSurface, motionProgress và Karaoke.

## Audio và media

Giọng Thái Sơn preset đã chọn, VieNeu-TTS v3 Turbo cục bộ offline, tốc độ 1,166× giữ nguyên. Tổng 8 chunk được đo FFprobe và ghép với 150ms đệm giữa nhịp, không kéo giọng cho đủ thời lượng. Mốc cảnh lấy thời lượng chunk thực. Karaoke dùng helper timestamp hiện có, ranh giới câu hỗ trợ bằng im lặng và word timing ước lượng; chưa forced alignment. Không thay engine/giọng, không train/clone/API trả phí.

`agent/prepare-power-journey.mjs` chỉ bổ sung output-directory tùy chọn, giữ hành vi mặc định cho video cũ. Các JSON trung gian của video này nằm trong run cache, không commit.

## Ghi công footage — cần giữ khi đăng video

**Fernando Moital — “REN overhead power line maintenance PT 2018 E” — CC BY 2.0**

- Nguồn: https://commons.wikimedia.org/wiki/File:REN_overhead_power_line_maintenance_PT_2018_E.webm
- License: https://creativecommons.org/licenses/by/2.0/
- Thay đổi: cắt 5 giây, resize, bỏ audio gốc, hiệu chỉnh màu nhẹ, chèn trong khung inset có ghi tác giả/license.

Đã kiểm tra hình thực tế từ clip: đường dây/bảo trì ban ngày. Chỉ dùng đoạn giới thiệu đường dây quanh giây 9–14, không gắn nhãn đây là mưa hay corona. Review theo asset/hash lưu `agent/corona-footage-review.json`. Cảnh cơ chế luôn dùng SVG để tránh dùng clip hồ quang sai hiện tượng. Manifest license đầy đủ nằm trong project JSON/run report; bản footage cache và weights/audio/MP4 không commit.

## Sản xuất lại

```bash
node agent/produce-corona-media.mjs
npm run typecheck
node_modules/.bin/remotion render src/index.ts HVL-CORONA-RAIN out/hvl-corona-rain.mp4 --codec=h264 --browser-executable=/usr/bin/chromium --crf=18 --concurrency=4 --is-production=false
```

Script tái sử dụng audio đã đúng nội dung/giọng, không tổng hợp lại nếu cache khớp. Footage chỉ giữ nếu khớp hash đã review; nếu không, bỏ footage thay vì tự nhận đã xem. File bàn giao `out/hvl-corona-rain.mp4` và tài liệu ghi công này.

Điểm tích hợp đã sửa qua QC: Karaoke giữ từ/vị trí cuối trong khoảng nghỉ thay vì nhảy về đầu kịch bản, và không tô sáng từ khi audio đang nghỉ. Không thay engine căn timestamp; ranh giới word vẫn là ước lượng đã nêu ở trên.

## Kết quả QC bản bàn giao

Đạt: 2529 frame, 1080×1920, 30 FPS, H.264/AAC 48 kHz; container 84,309 giây, khoảng 21,6 MB. TypeScript, timestamp/duration/voice assertions và FFmpeg decode đạt; không phát hiện khung đen. Loudness -16,4 LUFS, true peak -4,5 dBFS, không clipping. Đã xem contact sheet 8 nhịp, khung đầy đủ của footage/corona và khoảng nghỉ karaoke. Chuyển cảnh có overlap hòa hình, nhãn cũng chuyển hòa trong thời gian ngắn.

Freezedetect theo chênh lệch pixel trung bình gắn cờ hai đoạn ít chuyển động trong sơ đồ bó dây (62,87–69,27 và 69,27–72,27 giây). Đã kiểm tra riêng vùng minh họa, loại karaoke khỏi phép đo: 12 khung/3 giây có 12 hash khác nhau ở mỗi đoạn; điện trường vẫn pulse, bố cục giữ để giải thích kỹ thuật. Ghi nhận đây là đoạn ít chuyển động, không giấu metric hoặc kết luận mọi frame đều có chuyển động lớn. Báo cáo/log tại `agent/runs/corona-rain/qc.json`, `qc-scan.log`; lệnh kiểm tra lại `node agent/qc-corona.mjs`.
