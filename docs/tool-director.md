# Auto Tool & Repository Director

Bộ chọn mặc định lập kế hoạch theo storyboard sau khi đã có câu thoại, bằng chứng,
renderer, công thức và quyết định inset. Mỗi cảnh có công cụ chính và các lớp bổ trợ
đang dùng. `agent/visual-director.mjs` quyết định renderer và công cụ theo cảnh,
`agent/skill-router.mjs` gắn Scientific Critical Thinking và Anatomy khi cần cấu tạo
3D. Remotion giữ timeline và kết xuất cuối.

- Dùng SVG cho sơ đồ, dòng điện, đồ thị và chuyển động kỹ thuật có thể xác định
  theo frame. Dùng parallax cho bối cảnh nhiều lớp. Ưu tiên ThreeCanvas cho
  quan hệ không gian hoặc cơ cấu có component và bằng chứng phù hợp.
- Dùng lớp footage/ảnh và công thức đã tích hợp khi planner tương ứng đã chọn
  được nội dung. Chúng không tạo nhu cầu cài thêm package.
- Chỉ xét công cụ ngoài khi có yêu cầu hình ảnh chuyên biệt trong `toolRequirement`
  hoặc ghi chú `visualReview` của claim gắn vào cảnh. Chẳng hạn, asset Lottie đã
  có quyền hay morph giữa hai path khác topology. Từ khóa chủ đề đứng riêng
  không đủ để tra repository.
- `agent/tool-manifest.json` ghi danh mục, repository chính thức, công dụng và
  cách seek cho từng ứng viên. Tool inventory đọc phiên bản thật từ lockfile
  và package trong workspace. Package có mặt nhưng chưa có adapter vẫn cần
  đánh giá tích hợp.
- Một video tra tối đa hai repository qua GitHub CLI. Kết quả gồm giấy phép,
  dấu hiệu duy trì, commit cố định, phiên bản package, dependencies, peer
  dependencies, engines, lifecycle scripts và advisory công khai của package
  nếu có. Cache dùng lại trong bảy ngày tại `agent/runs/tool-reviews/`.
- Mục `manual-review` là ứng viên có metadata để Agent xem tiếp. Đối chiếu phiên
  bản React/Remotion/Node, kiểm tra cả dependency bắc cầu và giấy phép của file
  sẽ dùng, rồi xác minh seek được ở các frame bất kỳ. Với chuyển động nguồn
  ngoài, điều khiển bằng frame/fps và seed cố định hoặc bake vào asset. Motion
  Canvas dùng project riêng và nhập kết quả vào Remotion. Chọn tối đa một
  thư viện timeline cho một hiệu ứng. GitHub advisory sạch không bảo đảm
  package an toàn hay tương thích.
- Workflow ghi ứng viên và fallback, không tự tải mã, chạy script, cài thư
  viện hoặc bật dịch vụ. Nếu GitHub không khả dụng, video dùng kế hoạch dựng
  hiện có; lưu trạng thái thiếu metadata để xử lý cho đúng cảnh.

Kiểm tra inventory mà không tạo video:

```bash
npm run agent -- --tool-inventory
node --test agent/tool-director.test.mjs
```

Các lượt dựng mặc định ghi `agent/runs/<chủ-đề>/tool-plan.json` cùng storyboard.
