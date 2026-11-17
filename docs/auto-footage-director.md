# Auto Footage Director

Entry point: `agent/footage/director.mjs`; component Remotion: `src/footage/FootageLayer.tsx`. Không có module tìm/tải footage trước lượt này; quy tắc cũ trong visual defaults được giữ và bổ sung triển khai thực tế. Không thêm package, API key hoặc dịch vụ trả phí.

## Quy trình

1. Sau khi có audio và storyboard, phân tích **nội dung từng câu**, không chỉ tiêu đề chủ đề. Nhận diện SF6/máy cắt, máy biến áp, điện gió, thủy điện, mặt trời, truyền tải và trạm biến áp. Câu giải thích logic/công thức/khử ion ưu tiên SVG. Chủ đề chưa nhận diện tự giữ SVG.
2. Tìm video qua API Wikimedia Commons. Bộ lọc yêu cầu tên file nêu đúng đối tượng; mô tả hỗ trợ kiểm tra ngữ cảnh. Không lấy video minh họa/CGI hoặc video sự cố để minh họa vận hành bình thường. Ví dụ Jacob's ladder chỉ nhắc transformer trong mô tả không được chọn làm footage máy biến áp; video hồ quang chung không được nhận là SF6.
3. Kiểm tra URL license chính xác, tên license, tác giả, trang nguồn và Restrictions. Hiện chỉ nhận CC0 hoặc CC BY; bỏ qua NC/ND/SA, license thiếu/mâu thuẫn và tuyên bố public-domain không đủ điều kiện. Đây là xác minh metadata/điều khoản công bố của nguồn, không phải bảo đảm độc lập về quyền sở hữu của người đăng.
4. Trước khi tải phải có slot an toàn. Tải HTTPS từ host media chính thức, giới hạn 40 MiB, timeout, không đi theo redirect tùy ý. Cache theo URL/hash; cắt tối đa 5 giây, bỏ âm thanh gốc, chuẩn hóa H.264/30 FPS, lưu FFprobe và hash. Clip nguồn không commit. Dùng curl có sẵn để tôn trọng proxy/CA của Cloud, không thay biến proxy.
5. `FootageLayer` dùng `OffthreadVideo` đã có trong Remotion, Sequence đúng frame của câu, crop/contain và object-position có thể cấu hình, hiệu chỉnh màu nhẹ, bo góc/viền/bóng và fade/slide 10 frame. Hình SVG vẫn là lớp chính; âm thanh chỉ giữ narration.

## Bố cục và timeline

Mỗi scene có thể khai báo `footageLayout: {reservedAreas, candidates}` với hình chữ nhật `{x,y,width,height}` trong tọa độ 1080×1920. Candidate thêm `mode` (`inset`, `picture-in-picture`, `split`) và `side`. Chọn trái/phải thay đổi theo các slot còn trống; mode là ngữ nghĩa bố cục, kích thước thực do rectangle quyết định. Module không tự thu nhỏ hoặc đẩy thiết bị/subtitle sang chỗ khác để ép clip vào. Split cần scene chủ động dành vùng trống cạnh hoạt cảnh chính.

Mặc định giới hạn khung phụ dưới 22% diện tích, tối thiểu 240×135, tối đa hai clip/video, từng clip nằm trong câu được thuyết minh. Nếu không có thông tin vùng an toàn, thiếu giấy phép, không tìm thấy clip chính xác hoặc lỗi mạng thì không chèn footage. Không dùng B-roll chung chung thay thế.

`AutonomousExplainer` đã nối `FootageLayer`; pipeline cấp safe band đã biết giữa tiêu đề và hình chính cho headline không quá dài, không dùng profile này cho motion preview hoặc composition khác. Những scene khác nên truyền vùng bảo vệ/vị trí từ bố cục của chính nó, không sao chép profile này tùy tiện.

## Dùng lại

`npm run agent -- --topic "..."` tự gọi Director sau Storyboard và trước render. Tắt bằng `agent/visual-defaults.json` → `footageDirector.enabled: false`.

Với composition riêng, gọi `directFootage({topic,scenes,fps,layout})`, lưu plan vào project và thêm:

```tsx
import {FootageLayer} from '../footage/FootageLayer';
// Above the SVG, using the same composition frame coordinates:
<FootageLayer plan={project.footage}/>
```

Hoặc chỉ lập kế hoạch/tải clip từ project có `footageLayout`, không render:

```bash
node agent/footage/cli.mjs project.json footage-manifest.json
```

Nguồn, license, tác giả, evidence snapshot, ngày xác minh, thay đổi clip và hash nằm trong `public/generated/footage/*.json`, `agent/runs/<topic>/footage-manifest.json`; credits đủ tại `footage-credits.txt`. Khung hiển thị tác giả/license ngắn. Khi xuất bản cần kèm credits đầy đủ trong mô tả hoặc phần ghi công. Cache/media và run reports đã được `.gitignore` hiện có loại khỏi Git; task Cloud mới sẽ tải lại khi cần.

## Kiểm tra và giới hạn

Chạy `node --test agent/footage/footage.test.mjs` và TypeScript: đã đạt. Live smoke test thành công với `File:Wind turbines in the snow as viewed from FPV drone.webm`, tác giả SE FPV, CC BY 3.0, source `https://commons.wikimedia.org/wiki/File:Wind_turbines_in_the_snow_as_viewed_from_FPV_drone.webm`. Đã tải nguồn, chuẩn hóa clip 3,8 giây (~515 KB), kiểm tra FFprobe; không render video/preview Remotion.

Bộ chọn hiện là rule-based dựa tên/mô tả và license, chưa có model thị giác tự xác minh nội dung từng frame. Plan ghi `contentMatch.visualReview: not-automatically-verified` và `requiresEditorialReview`; Agent phải kiểm tra clip được chọn trong QC trước khi bàn giao video tiếp theo. Không coi match metadata là bằng chứng mọi frame khớp chính xác lời thoại. Chưa dùng nguồn trả phí, chưa thêm adapter cho nguồn khác. Không thay đổi TTS, karaoke hoặc hình học hoạt cảnh.
