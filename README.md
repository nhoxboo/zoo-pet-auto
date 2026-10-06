# 🐾 Zoo Pet - All-in-One Auto Pro Tool v2.9.3

Tool Auto & VIP Cheats toàn diện, **An Toàn 100% Anti-Detection** cho web game **Zoo Pet** (https://zoo-pet.store/).

---

## 🌟 Bản Cập Nhật v2.9.3: Fix Lỗi Không Kết Nối Được Game Trên Web Thật (Production Hook)

### 1. 🔍 Nguyên nhân cốt lõi phát hiện trên domain https://zoo-pet.store/
* Trong mã nguồn game gốc:
  ```javascript
  Pb = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
  ...
  Pb && (window.game = $)
  ```
  * Biến `Pb` (kiểm tra môi trường Dev) **chỉ bằng `true` khi chạy trên localhost**.
  * Khi người dùng chơi trên trang web thật `https://zoo-pet.store/` hoặc CloudFront CDN, `Pb` mang giá trị `false`. Game gốc **không bao giờ gán `window.game = $`** vào `window`.
  * Hậu quả: Userscript trước đây đợi `window.game` thì không bao giờ tìm thấy, biểu tượng trạng thái không thể kết nối và các chức năng tự động (Câu Cá, Săn Boss, Farm...) đều không thể chạy!

### 2. 🚀 Khắc phục triệt để trong v2.9.3: Production Proactive Hook
* ✅ **Bắt chủ động Game Instance (`$`):** Sử dụng cơ chế Object Property Traps (`fishing`, `player`, `world`) đón đầu ngay từ mili-giây đầu tiên khi các hệ thống game được khởi tạo để tự động trích xuất thực thể Game gốc và gán vào `G` cũng như `window.game`.
* ✅ **Kết Nối Ngay Lập Tức:** Ngay khi vào game tại `https://zoo-pet.store/`, badge góc trên chuyển thành `🟢 Đã kết nối` và kích hoạt toàn bộ hệ thống Auto.
* ✅ **Auto Câu Cá Chạy Mượt Mà 100%:** Nhân vật tự đứng đúng mép nước, quăng phao, cắn câu siêu tốc (`Ultra Catch`) và tự động giật cần kéo cá vào balo liên tục.

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