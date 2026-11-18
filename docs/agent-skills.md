# Agent Skills bổ sung

Ba Skill được cài theo phạm vi dự án bằng chế độ `copy`; không cài global và không cài toàn bộ Skill từ các repository nguồn. Bản sao sinh ra trong `.agents/skills` không được commit, còn nguồn, commit và hash được khóa trong `skills-lock.json`. Thông tin kiểm duyệt máy đọc được nằm tại `agent/skills-manifest.json`.

| Skill dùng trong dự án | Nguồn và commit đã kiểm tra | Phiên bản | License | Phạm vi |
| --- | --- | --- | --- | --- |
| `social` (tên upstream của yêu cầu `social-content`) | `coreyhaines31/marketingskills` @ `1f837447b20bb6f0e72d87b80ece1c221c362c7d` | 2.5.2 | MIT | Hook, nhịp kể, video ngắn |
| `scientific-critical-thinking` | `K-Dense-AI/scientific-agent-skills` @ `ec59a29a03d5c40f73ab40878df04860bc00e876` | 1.5 | MIT | Đánh giá bằng chứng và tuyên bố kỹ thuật |
| `anatomy` | `wheresryan22/anatomy` @ `1482e8469b0a9e0d8cc18ea2740a01423d29ae80` | upstream không khai báo | MIT | Minh họa kỹ thuật có chiều sâu/mặt cắt |

Đã xem `SKILL.md`, license, cây scripts và phụ thuộc của đúng ba Skill. Hai Skill đầu chỉ có tài liệu/references trong thư mục được chọn. Anatomy có kit và script tùy chọn; pipeline không tự chạy publisher, WebGL, script kiểm thử của upstream hay cài thêm dependency. Tính năng sơ đồ tùy chọn qua OpenRouter của nguồn scientific cũng không được bật vì có thể phát sinh dịch vụ ngoài/chi phí.

Content Director gọi `agent/skill-router.mjs`: video ngắn dùng `social`, mọi chủ đề kỹ thuật dùng `scientific-critical-thinking`, và chỉ thêm `anatomy` khi chủ đề thiết bị/cấu tạo cần chiều sâu. Anatomy chỉ hướng dẫn bố cục; Remotion vẫn dựng video. Cấu tạo, kích thước và chuyển động của thiết bị điện thật bị khóa cho đến khi có tài liệu kỹ thuật được chấp thuận.

Khôi phục trong Codex Cloud hoặc local từ lockfile:

```bash
npx --yes skills@latest experimental_install --frozen-lockfile --agent codex
```

Kiểm tra riêng bộ định tuyến mới:

```bash
npm run agent:skills:test
```

## Technical Research

`agent/research/SKILL.md` bổ sung tìm và đọc nguồn. Module dùng lại
`scientific-critical-thinking` theo bản đã khóa. Khi chưa có bản sao cục bộ, module đọc
hướng dẫn từ commit upstream đã ghim. Tìm kiếm trực tiếp cần Codex CLI đã đăng nhập
và có quyền web search. Không cần API key mới.

```bash
npm run agent -- --topic "Điện năng lượng mặt trời được tạo ra như thế nào?" --research-only
npm run agent -- --topic "Điện năng lượng mặt trời được tạo ra như thế nào?"
```

Lệnh thứ nhất chỉ lưu/in hồ sơ. Lệnh thứ hai dùng kết luận có nguồn để lập
lời đọc, storyboard và chạy pipeline hiện có. Hồ sơ theo chủ đề nằm trong
`agent/research/cache` và bản sao của lượt sản xuất nằm trong `agent/runs`.
Dùng `--refresh-research` khi tiêu chuẩn/phiên bản thay đổi. Hồ sơ giữ link,
phiên bản nếu có, ngày truy cập, vị trí trong tài liệu và diễn giải bằng lời
của dự án. Các hồ sơ sinh tự động được giữ cục bộ. Hồ sơ mẫu đã đối chiếu về quang điện nằm ở `agent/research/verified`. Để kiểm tra riêng luồng nghiên cứu và ánh xạ storyboard, chạy `node --test agent/research/director.test.mjs`.

Mỗi kết luận cần hai nguồn độc lập. Việc đối chiếu nội dung do phiên nghiên cứu
thực hiện, validator kiểm tra cấu trúc, domain và liên kết nguồn. Storyboard chỉ
mở hoạt cảnh thiết bị có bằng chứng khớp với câu thuyết minh và luôn gắn nhãn
minh họa nguyên lý. Nếu chưa đủ bằng chứng, cảnh giữ bối cảnh biểu trưng.
Thiếu hồ sơ hợp lệ sẽ dừng trước TTS.

Trong môi trường Cloud giới hạn khởi tạo Codex CLI con, dùng web search của
phiên Agent hiện tại để tra cứu và kiểm chứng. Agent truyền hồ sơ đã đối chiếu
bằng `--research-file <đường-dẫn>`. Hồ sơ nhập phải có `schemaVersion: 1`,
`topic` trùng chủ đề, và `accessedOn` trên từng nguồn, theo cấu trúc tệp mẫu.
Pipeline kiểm tra và lưu hồ sơ trước khi cho phép bước kịch bản.
