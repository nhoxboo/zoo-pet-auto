# 🐾 Zoo Pet - All-in-One Auto Pro Tool v3.0.0

Tool Auto & VIP Cheats toàn diện, **An Toàn 100% Anti-Detection** cho web game **Zoo Pet** (https://zoo-pet.store/).

---

## 🌟 Bản Cập Nhật Đột Phá v3.0.0

### 1. 🎣 Khắc phục triệt để Buff May Mắn (Luck Buff) khi Auto Câu Cá
* **Nguyên nhân:** Thuộc tính `player.luck` trong Game Engine là `getter-only`. Khi bật Buff May Mắn, việc gán trực tiếp đã gây lỗi `TypeError` ngầm làm đứng tiến trình câu.
* **Khắc phục:** Chuyển sang kích hoạt thông qua bảng hiệu ứng `player.buffs['luck']`. Giờ đây khi bật Tăng May Mắn, nhân vật vừa nhận đầy đủ tỷ lệ ra cá quý hiếm vừa quăng cần & kéo cá mượt mà $100\%$.

### 2. 👑 Săn Boss & Quét Quái Chuẩn Xác Toàn Map (Full-Map Hunting)
* **Xóa bỏ giới hạn bán kính:** Loại bỏ hoàn toàn bộ lọc khoảng cách và kiểm tra ẩn hiện `obj.visible` (do cơ chế Three.js camera culling).
* **Chế độ Săn Boss Chuyên Biệt (Boss-Only):** Tự động phát hiện Boss thường, Boss Titan, World Boss ở bất kỳ đâu trên bản đồ và phi thẳng tới vị trí Boss để xả combo tiêu diệt.
* **Auto Đánh Thường Toàn Map:** Quét và tiêu diệt sạch sẽ mọi quái vật trên toàn hành tinh mà không bị giới hạn trong khu vực hẹp.

### 3. 🛡️ Bất Tử Toàn Diện (God Mode Ultimate)
* **Kháng độc, nham thạch & môi trường:** Bổ sung hook phương thức `player.hazard()` và kích hoạt `fireres = 1.0` cùng `invuln = 999999`.
* Giờ đây khi bật Bất Tử, nhân vật hoàn toàn miễn nhiễm với **chất độc, dung nham (lava), acid, bẫy gai và mọi sát thương từ Boss/quái vật** — máu luôn giữ ở mức $100\%$ tối đa!

### 4. ✨ Tăng Điểm Kinh Nghiệm EXP Siêu Tốc (EXP Multiplier)
* **Nâng cấp cấp độ thần tốc:** Bổ sung tùy chọn nhân hệ số EXP: **1x, 2x, 5x, 10x, 20x, 50x**.
* Hook trực tiếp hàm `player.gainExp()` và buff `xp`, giúp bạn nhận lượng EXP khổng lồ sau mỗi lần hạ gục quái hoặc hoàn thành nhiệm vụ để lên cấp vùn vụt!

---

## 🛠️ Danh Sách Tính Năng Tổng Thể
* **✨ Tăng Điểm Kinh Nghiệm (EXP Multiplier):** Tùy chọn 2x đến 50x EXP giúp lên cấp nhanh như chớp.
* **🛡️ Chế độ Bất Tử Toàn Diện (God Mode):** Miễn nhiễm mọi sát thương, độc, nham thạch, acid.
* **⚔️ Tăng Sát Thương (Damage Multiplier):** Nhân sát thương đầu ra cực mạnh (One-Hit).
* **⚡ Hồi chiêu 0s (No Cooldown):** Xả chiêu liên tục không chờ thời gian hồi.
* **🏃 Tăng Tốc Chạy (Speed Boost):** Di chuyển siêu tốc qua các vùng đất.
* **💡 Sáng Bản Đồ Bóng Tối:** Xóa bỏ màn đen tối và sương mù.
* **🌾 Auto Nông Trại:** Tự động thu hoạch cây chín và gieo hạt giống cấp cao nhất.
* **🎣 Auto Câu Cá & Ultra Catch:** Tự tìm hồ, quăng cần, cắn câu siêu tốc và kéo cá liên tục (hỗ trợ Luck Buff).
* **👑 Săn Boss & Đánh Quái Toàn Map:** Tìm và tiêu diệt mục tiêu trên toàn hành tinh.
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