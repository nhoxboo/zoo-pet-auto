# 🐾 Zoo Pet - All-in-One Auto Pro Tool v2.9.2

Tool Auto & VIP Cheats toàn diện, **An Toàn 100% Anti-Detection** cho web game **Zoo Pet** (https://zoo-pet.store/).

---

## 🌟 Bản Cập Nhật v2.9.2: Đại Tu Auto Câu Cá 100% & Săn Boss

### 1. 🎣 Đại Tu Toàn Diện Auto Câu Cá (100% Mọi Hồ & Mọi Map)
* **Gỡ bỏ cơ chế lọc cá gây hủy cần:** Theo yêu cầu từ người dùng, toàn bộ logic tự hủy cần khi gặp cá thường đã được loại bỏ hoàn toàn.
* **Tự Động Tính Điểm Bờ & Quăng Phao Chuẩn Xác:** Tích hợp hàm `fishing.plan()` của game engine để nhân vật tự đi tới vị trí đứng bờ (`shore`) và quăng phao vào lòng hồ (`cast`) chuẩn xác $100\%$.
* **Độc Lập & Chống Xung Đột State:** Khi đang câu cá (`fishing.active`), toàn bộ các module khác (Combat, Boss Hunt, Farm) tạm dừng can thiệp vào `player.target`, `player.state` hoặc di chuyển của nhân vật để không bao giờ làm đứt dây hay ngắt trạng thái câu.
* **Kéo Cá Tự Động 100%:** Khi cá cắn câu (`phase === 'bite'`), tool tự động giật cần (`hook`) và hoàn thành kéo cá (`finish`) liên tục, sau đó tự quăng mồi mới.

### 2. ⚔️ Auto Săn Boss Chuẩn Xác Toàn Map
* **Tự Động Kích Hoạt khi bật "Chỉ Giết Boss":** Gạt bật nút `Chỉ Giết Boss` hoặc `Auto Du Hành` là tool tự động quét và đi săn Boss ngay lập tức không cần phụ thuộc nút đánh quái thường.
* **Tự Động Di Chuyển & Tấn Công:** Nếu ở xa ngoài tầm đánh, nhân vật tự chạy mượt mà tới vị trí Boss. Khi đã áp sát tầm đánh, nhân vật tự target Boss, đánh thường và xả liên hoàn 4 chiêu `spin`, `dash`, `slam`, `special`.

---

## 🛠️ Danh Sách Tính Năng Tổng Thể
* **⚡ Hồi chiêu 0s (No Cooldown):** Xả chiêu liên tục không chờ thời gian hồi.
* **🛡️ Chế độ Bất Tử (God Mode):** Miễn nhiễm sát thương.
* **⚔️ Tăng Sát Thương (Damage Multiplier):** Nhân sát thương đầu ra cực mạnh.
* **🏃 Tăng Tốc Chạy (Speed Boost):** Di chuyển siêu tốc qua các vùng đất.
* **💡 Sáng Bản Đồ Bóng Tối:** Xóa bỏ màn đen tối và sương mù.
* **🌾 Auto Nông Trại:** Tự động thu hoạch cây chín và gieo hạt giống cấp cao nhất.
* **🎣 Auto Câu Cá & Ultra Catch:** Tự tìm hồ, quăng cần, cắn câu siêu tốc và kéo cá liên tục.
* **🚀 Chuyển Hành Tinh Nhanh 1-Click:** 9 nút bấm trực quan trên menu.
* **📜 Auto Nhiệm Vụ An Toàn:** Tự nhận thưởng Daily, Weekly, Bounty không sợ bị lỗi server.

---

## 🚀 Hướng Dẫn Cài Đặt & Cập Nhật

1. Cài đặt tiện ích **Tampermonkey** trên trình duyệt (Chrome, Edge, Brave, Firefox).
2. Mở link cài đặt trực tiếp:  
👉 **[https://raw.githubusercontent.com/nhoxboo/zoo-pet-auto/main/zoo-pet-auto.user.js](https://raw.githubusercontent.com/nhoxboo/zoo-pet-auto/main/zoo-pet-auto.user.js)**
3. Bấm **Install** (hoặc **Update**).
4. Vào game [https://zoo-pet.store/](https://zoo-pet.store/) (hoặc link CloudFront CDN) và trải nghiệm!
5. Phím tắt ẩn/hiện menu: **F2** hoặc click nút 🤖 ở góc dưới màn hình.