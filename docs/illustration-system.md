# Phương pháp dựng hình dùng chung

Phong cách: **Colorful Technical Animation**. Entry point: `src/illustration/index.ts`. Stack giữ nguyên Remotion + React + SVG; không thêm dependency, không thay TTS/karaoke. Mọi animation phụ thuộc frame/fps, không dùng CSS animation, đồng hồ thực hoặc random không seed.

## Nguồn và phạm vi trích xuất

Mẫu người dùng cung cấp: `HIGH_VOLTAGE_LIFE_SF6_Remotion_V2.zip`, SHA-256 `8a38396de363d3096ad7fc8e20762fec465143665fe2e8afbd55386c184ae7a2`. Ba file gốc giữ tại `src/examples/sf6-v2/{breakerSvg.mjs,breakerSvg.d.mts,SF6BreakerScene.tsx}`. Composition tham chiếu `HVL-SF6-V2-REFERENCE`, 540 frame; chỉ đăng ký, không render. ZIP không có license riêng; ghi nhận đây là mã người dùng cung cấp cho dự án, không tự gán giấy phép upstream.

V2 sinh một chuỗi SVG hoàn chỉnh theo frame. Giữ bản đó làm ví dụ lịch sử, không dùng chuỗi SVG nguyên cảnh làm kiến trúc cho mọi chủ đề. Trích xuất bảng gradient kim loại/sứ/đồng vào tokens, smoothstep thành motion helper, và cực máy cắt thành React component `BreakerPole.tsx`. Hạt năng lượng, mây/cây/nhà/máy biến áp tái sử dụng component dự án đã có, không chép thành bản thứ hai. `EnergyWire` và easing camera được tách từ scene `PowerJourney` hiện có; scene này đã chuyển sang import thư viện dùng chung.

## Thư viện

| Nhóm | Dùng lại |
| --- | --- |
| Style | `illustrationTokens`: màu thương hiệu, màu tự nhiên/vật liệu, gradient ramps, stroke, hệ số chiều sâu; `MaterialSurface`: gradient, highlight, shadow với SVG ID riêng từng instance |
| Scene/layer | `IllustrationScene`: background → midground → foreground → technical overlay → labels → subtitles; `ParallaxLayer`: chuyển camera theo độ sâu |
| Motion | `motionProgress`, `smoothStep`, `loopPhase`, `bob`: thời gian frame/giây tường minh, seek được và không phụ thuộc thứ tự render |
| Transition | `SceneReveal`: dissolve hoặc wipe, overlap quanh ranh giới lời thoại; giữ scene cũ dưới scene mới; overlap không tự đổi timestamp audio |
| Điện | `EnergyWire`: dây và hạt cùng hình học, chiều/độ võng/trạng thái mang điện; `CurrentFlow`, `ContactSwitch`, `Arc` |
| Môi trường | `Cloud`, `Tree`, `Smoke`; chỉ bật khói ở nguồn khói có cơ sở |
| Đối tượng đã có | `PowerPlant`, `Transformer`, `GridTower`, `House`, `BirdIllustration`, `TransmissionPole` |
| Nhãn | `TechnicalLabel`, `TechnicalPanel`, `Watermark`; dùng karaoke hiện có cho subtitles |

`ContactSwitch` là biểu tượng nguyên lý, `Arc` là hiệu ứng minh họa có cửa sổ active do caller quyết định. Không coi chúng là mô phỏng hồ quang/SF6 hoặc cấu tạo hãng. Hạt vàng biểu diễn truyền năng lượng quy ước, không phải electron chạy một chiều trong AC; khi ngắt phải dừng/ẩn dòng phù hợp trạng thái. Timeline SF6 v2 dài nhiều giây chỉ nhằm giải thích, không dùng như thời gian cắt thật. `BirdIllustration` hiện mới có bob; nếu chủ đề cần bay, bổ sung chuyển động cánh/quỹ đạo vào component đó, không khẳng định đã có tính năng bay hoàn chỉnh.

## Quy trình dùng cho chủ đề tiếp theo

1. Đọc cấu hình `agent/visual-defaults.json` và storyboard theo timestamp audio. Mỗi câu xác định sự kiện/đối tượng/chuyển trạng thái cần thấy; không áp số cảnh cố định.
2. Tìm component trong entry point; chỉ thêm loại đối tượng hoặc hành động còn thiếu. Đối tượng phải nhận props vị trí/trạng thái để điều khiển độc lập.
3. Ghép lớp bằng `IllustrationScene`, dùng `ParallaxLayer` cho bối cảnh. Dùng SVG gradients/highlights/shadows để có chiều sâu; camera hỗ trợ, không thay hoạt cảnh đối tượng.
4. Animate bằng frame/fps và props trạng thái. Dùng `EnergyWire` để hạt luôn bám dây kể cả dây chéo/võng; chọn nguồn/tải và trạng thái mang điện theo câu chuyện.
5. Đặt `SceneReveal` ở ranh giới ý, giữ overlap đủ mượt. Chỉ hiện nhãn ngắn/công thức cần thiết đúng câu; labels/karaoke nằm ngoài world camera.
6. Tái sử dụng TTS/karaoke/render hiện có. Kiểm tra component mới và điểm tích hợp; chỉ render khi nhiệm vụ yêu cầu video.

Ví dụ có JSX hoàn chỉnh: `src/examples/ReusableIllustrationExample.tsx` (không đăng ký preview). Cách import:

```tsx
import {IllustrationScene, ParallaxLayer, EnergyWire, Transformer, motionProgress} from '../illustration';
```

`agent/storyboard.mjs` đã đính đường dẫn hệ thống và ví dụ vào `visualDirection.illustrationSystem`. Đây là thư viện để Agent lắp và animate scene cho mỗi chủ đề; chưa phải engine tự suy ra hình học chính xác từ một câu nhập. Các cấu tạo thiết bị thật vẫn cần tài liệu kỹ thuật.

Lượt tích hợp này chỉ typecheck, kiểm tra cú pháp/manifest, xác minh nguồn và hàm SVG bằng code. Không cài lại package/model, không tạo preview, không render ảnh/video mới.
