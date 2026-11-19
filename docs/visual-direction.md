# Mặc định sản xuất HIGH VOLTAGE LIFE

Phong cách chính thức: **Colorful Technical Animation**. Dùng Remotion + React + SVG và thư viện component hiện có. Tách mây, cây, chim, nhà máy, máy biến áp, cột điện và các phần thiết bị thành đối tượng có thể chuyển động độc lập; chỉ bổ sung component còn thiếu khi sản xuất chủ đề cần chúng. Không ghép cả cảnh thành ảnh tĩnh. Bầu trời xanh, cây xanh, màu động vật và vật liệu thiết bị theo thực tế; giữ nhận diện HIGH VOLTAGE LIFE trên logo/nhãn/karaoke.

Chọn hành động theo lời thoại và trạng thái vật lý: chim bay, vỗ cánh, đáp xuống dây; mây trôi; khói bốc và tan ở nguồn khói phù hợp (không mặc định gán khói cho thiết bị điện); thiết bị thay đổi trạng thái có căn cứ; hạt năng lượng di chuyển trên dây. Tạo chiều sâu qua background/midground/foreground, phối cảnh nhất quán và parallax theo lớp. Camera không thay thế hoạt cảnh đối tượng. Số cảnh và chuyển cảnh theo diễn biến câu chuyện, ít cảnh có trọng tâm, không có con số cố định. Công thức, sơ đồ, nhãn chỉ xuất hiện đúng lúc cần giải thích. Footage/3D là bổ trợ khi chủ đề thực sự cần; minh họa code nhiều màu là mặc định.

Cập nhật: ưu tiên minh họa bằng SVG/code trong Remotion, sạch, đơn giản, dễ hiểu và màu sắc rõ ràng. Hoạt cảnh đối tượng là bắt buộc; camera chỉ bổ trợ. Footage/ảnh mẫu là tài nguyên tùy chọn, không phải phong cách chính. Giữ số cảnh gọn theo ý nghĩa lời thoại, không ấn định số cảnh chung cho mọi video.

Dây có điện dùng `CurrentFlow`: hạt vàng nhỏ chạy liên tục, hào quang nhẹ, đúng đường dây và hướng nguồn→tải đã khai báo. Hỗ trợ dây thẳng hoặc quadratic (control X ở trung điểm); nháy nhẹ đầu nối bằng `terminalPulse`. Đường hạt cần biến đổi cùng dây khi dây chuyển động. Khi cắt điện phải ẩn hoặc dừng hạt. Đây là biểu diễn truyền năng lượng quy ước; với AC không trình bày chuyển động một chiều của hạt như chiều dòng điện tức thời. Dùng pan/zoom/parallax nhẹ, chuyển cảnh mềm theo ý và animation thiết bị theo trạng thái; tránh slideshow chữ. Công thức/nhãn chỉ xuất hiện ngắn lúc cần giải thích.

Nguồn cấu hình: `agent/visual-defaults.json`. Áp dụng cho mọi video tiếp theo. Mặc định tạo video hoàn chỉnh; preview chỉ khi được yêu cầu. Nhiệm vụ cập nhật cấu hình này không render video.

Kể chuyện chủ yếu bằng hoạt cảnh đối tượng và minh họa kỹ thuật có chiều sâu. Chọn bố cục/phối cảnh/ánh sáng theo cảnh, giữ chuyển động tự nhiên. Dùng màu trời, cây, động vật và vật liệu thiết bị theo thực tế; logo, nhãn, karaoke và nhận diện giữ bảng màu thương hiệu. Không nhuộm toàn cảnh bằng navy/xanh điện/vàng.

Storyboard chia theo diễn biến lời thoại và timestamp, không cố định số cảnh. Chọn pan, zoom, dolly, parallax và chuyển động đối tượng theo điểm cần chú ý. Chuyển cảnh có liên kết về hành động, đối tượng hoặc ý nghĩa. Đồng bộ nhãn, footage, công thức và phụ đề với câu đang đọc. Không giữ hình ảnh đứng yên quá 3 giây nếu không có lý do giải thích.

Giảm chữ: karaoke, từ khóa và nhãn thiết yếu. Không để tiêu đề lớn kéo dài toàn video. Chỉ dùng sơ đồ điện động, công thức và đồ thị khi cần làm rõ nguyên lý. Ưu tiên 2.5D cho bối cảnh/chiều sâu, 2D động cho logic; chỉ chọn 3D khi cấu tạo hoặc chuyển động không gian cần nó. Tái sử dụng component hiện có và bảo đảm tính chính xác kỹ thuật.

Chỉ cân nhắc footage khi nội dung thực sự cần hình quay thực. Trước khi dùng, lưu URL nguồn, tác giả, giấy phép, URL điều khoản, yêu cầu ghi công và kết quả xác minh quyền trong manifest asset. Xem quyền sử dụng thương mại, sửa đổi và phân phối; không suy diễn quyền từ việc tải được file. Clip phải khớp bối cảnh, màu/ánh sáng và nhịp kể. Khi chưa xác minh quyền, dùng animation tự có; không mua footage hoặc dịch vụ ngoài nếu chưa được cho phép.

**Visual-first Scientific Explainer** là cách kể mặc định trên nền Colorful Technical Animation. Storyboard dùng timestamp của lời đọc, ưu tiên ngắt ở cuối câu hoặc mệnh đề dài. Composition chính đọc `visualDirection.shot` để chọn góc nhìn, hành động và chuyển cảnh trên cùng timeline với footage và karaoke. Tiêu đề lớn chỉ còn ở dữ liệu cũ.

Bộ dựng có hoạt cảnh chim đáp dây, sơ đồ hiệu điện thế, tiếp điểm minh họa và truyền tín hiệu 87L. Chủ đề chưa có minh họa riêng dùng đường dây khái niệm. Khi video cần mô tả thiết bị hoặc hiện tượng cụ thể hơn, chọn hình minh họa có căn cứ cho đề tài. Footage vẫn đi qua bộ chọn và khung inset hiện có. Kiểm tra hình và tiếng thực tế ở lần sản xuất tiếp theo trước khi báo đạt phong cách.

Preview điện gió V2 đã được duyệt là mẫu chuẩn. Mã ở `src/compositions/WindPowerPreview.tsx`, composition `HVL-WIND-POWER-PREVIEW`, bản MP4 tham chiếu trong Cloud ở `out/hvl-wind-power-preview-v2.mp4`. Mã dựng, timeline karaoke và công cụ chuẩn bị WAV nằm trong Git. WAV và MP4 là đầu ra sinh tự động. Dùng mẫu để so sánh cách đặt điểm nhìn, ánh sáng, các lớp chuyển động, cú máy bám chủ thể và chuyển cảnh khớp hành động. Chọn diễn tiến hình ảnh mới cho mỗi chủ đề. Dùng footage có quyền sử dụng như một lớp bổ trợ khi nó làm rõ lời đọc.

## Công thức trong video mặc định

`agent/formula-director.mjs` dò quan hệ vật lý trong câu thoại có bằng chứng
Technical Research. Danh mục `src/formula/catalog.json` chứa công thức, đơn vị,
phạm vi áp dụng và đường dẫn tham chiếu. Danh mục ban đầu có định luật Ôm,
tổn hao nhiệt trên điện trở và công suất một chiều không đổi.

Remotion dựng công thức bằng SVG và nhấn đại lượng theo timestamp karaoke.
Mỗi video tối đa hai công thức, mỗi công thức tối đa 4,8 giây. Công thức dùng
vùng trống trên hoạt cảnh và được ưu tiên hơn inset ảnh thật trong cùng cảnh.
Khi thiếu nguồn, quan hệ chưa rõ hoặc không đủ thời lượng đọc, cảnh chỉ dùng
hoạt cảnh. Mở rộng danh mục bằng công thức đã kiểm chứng và quy tắc khớp
ngữ cảnh cụ thể.

## Mật độ và chiều sâu cho storyboard mới

Visual Director dùng `sceneDetail` trong `agent/visual-defaults.json`.
Bối cảnh 2.5D chọn lớp trung cảnh nhà máy, sân trạm hoặc cảnh quan theo câu
thoại, với mây và cây chuyển động độc lập và parallax theo lớp. Cảnh cận tăng
zoom quanh điểm nhìn chính. Chuyển cảnh chọn match cut khi cùng góc nhìn, mở
sơ đồ theo hướng khi cần làm rõ logic, hoặc hòa hình khi đổi nội dung. Thời
lượng hiệu ứng được giới hạn theo thời lượng cảnh thực tế.

Mặt cắt 3D nguyên lý hiện có dùng góc nhìn rộng hơn, độ phân giải bề mặt cao
hơn và ánh sáng viền để thấy rõ vỏ và tiếp điểm. Cấu tạo, số lượng bộ phận và
chuyển động kỹ thuật vẫn theo bằng chứng hay theo mẫu nguyên lý đã ghi rõ.
Với chủ đề mới cần thiết bị cụ thể, ưu tiên component có nguồn kỹ thuật hoặc
ảnh/footage có quyền sử dụng. Các bố cục thủ công vẫn chọn thiết lập theo
từng cảnh. Storyboard cũ thiếu `visualDirection.detail` tiếp tục đọc bằng đường dựng cũ.
