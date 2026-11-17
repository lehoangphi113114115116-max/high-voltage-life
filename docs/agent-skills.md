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
