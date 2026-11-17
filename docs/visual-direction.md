# Mặc định sản xuất HIGH VOLTAGE LIFE

Cập nhật: ưu tiên minh họa bằng SVG/code trong Remotion, sạch, đơn giản, dễ hiểu và màu sắc rõ ràng. Hoạt cảnh đối tượng là bắt buộc; camera chỉ bổ trợ. Footage/ảnh mẫu là tài nguyên tùy chọn, không phải phong cách chính. Giữ số cảnh gọn theo ý nghĩa lời thoại, không ấn định số cảnh chung cho mọi video.

Dây có điện dùng `CurrentFlow`: hạt vàng nhỏ chạy liên tục, hào quang nhẹ, đúng đường dây và hướng nguồn→tải đã khai báo. Hỗ trợ dây thẳng hoặc quadratic (control X ở trung điểm); nháy nhẹ đầu nối bằng `terminalPulse`. Đường hạt cần biến đổi cùng dây khi dây chuyển động. Khi cắt điện phải ẩn hoặc dừng hạt. Đây là biểu diễn truyền năng lượng quy ước; với AC không trình bày chuyển động một chiều của hạt như chiều dòng điện tức thời. Dùng pan/zoom/parallax nhẹ, chuyển cảnh mềm theo ý và animation thiết bị theo trạng thái; tránh slideshow chữ. Công thức/nhãn chỉ xuất hiện ngắn lúc cần giải thích.

Nguồn cấu hình: `agent/visual-defaults.json`. Áp dụng cho mọi video tiếp theo. Mặc định tạo video hoàn chỉnh; preview chỉ khi được yêu cầu. Nhiệm vụ cập nhật cấu hình này không render video.

Kể chuyện chủ yếu bằng hoạt cảnh đối tượng, minh họa kỹ thuật có chiều sâu và footage thực tế ngắn phù hợp. Chọn bố cục/phối cảnh/ánh sáng theo cảnh, giữ chuyển động tự nhiên. Dùng màu trời, cây, động vật và vật liệu thiết bị theo thực tế; logo, nhãn, karaoke và nhận diện giữ bảng màu thương hiệu. Không nhuộm toàn cảnh bằng navy/xanh điện/vàng.

Storyboard chia theo diễn biến lời thoại và timestamp, không cố định số cảnh. Chọn pan, zoom, dolly, parallax và chuyển động đối tượng theo điểm cần chú ý. Chuyển cảnh có liên kết về hành động, đối tượng hoặc ý nghĩa. Đồng bộ nhãn, footage, công thức và phụ đề với câu đang đọc. Không giữ hình ảnh đứng yên quá 3 giây nếu không có lý do giải thích.

Giảm chữ: karaoke, từ khóa và nhãn thiết yếu. Không để tiêu đề lớn kéo dài toàn video. Chỉ dùng sơ đồ điện động, công thức và đồ thị khi cần làm rõ nguyên lý. Ưu tiên 2.5D cho bối cảnh/chiều sâu, 2D động cho logic; chỉ chọn 3D khi cấu tạo hoặc chuyển động không gian cần nó. Tái sử dụng component hiện có và bảo đảm tính chính xác kỹ thuật.

Chủ động cân nhắc footage cho mỗi cảnh quan sát thực tế. Trước khi dùng, lưu URL nguồn, tác giả, giấy phép, URL điều khoản, yêu cầu ghi công và kết quả xác minh quyền trong manifest asset. Xem quyền sử dụng thương mại, sửa đổi và phân phối; không suy diễn quyền từ việc tải được file. Clip phải khớp bối cảnh, màu/ánh sáng và nhịp kể. Khi chưa xác minh quyền, dùng animation tự có; không mua footage hoặc dịch vụ ngoài nếu chưa được cho phép.

Pipeline đính cấu hình vào project và chỉ dẫn từng cảnh vào `visualDirection`. Đây là quyết định dựng cảnh cho Agent đọc và thực hiện, chưa phải bộ tìm/tải footage tự động. Renderer cũ và preview lịch sử được giữ nguyên ở nhiệm vụ này; khi sản xuất video mới, Agent phải áp dụng các chỉ dẫn vào composition và kiểm tra đầu ra thực tế trước khi báo đạt phong cách.
