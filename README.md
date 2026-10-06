# 🐾 Zoo Pet - All-in-One Auto Pro Tool v2.9.4

Tool Auto & VIP Cheats toàn diện, **An Toàn 100% Anti-Detection** cho web game **Zoo Pet** (https://zoo-pet.store/).

---

## 🌟 Bản Cập Nhật v2.9.4: Fix Triệt Để Lỗi "Cannot read properties of undefined (reading 'clone')"

### 1. 🔍 Nguyên nhân chính xác của lỗi loading
* Trong bản v2.9.3, việc can thiệp vào `Object.prototype` để đón bắt các thuộc tính `player` và `fishing` đã làm ảnh hưởng tới chuỗi Prototype của toàn bộ đối tượng trong Three.js (đặc biệt là `Scene.background` và `Scene.fog`).
* Khi game khởi tạo module Boss `$.sboss = new zb($)`, hàm khởi tạo gọi `e.scene.background.clone()` bị mất dữ liệu và văng lỗi trên màn hình: `Lỗi tải game: Cannot read properties of undefined (reading 'clone')`.

### 2. 🚀 Khắc phục hoàn hảo trong v2.9.4: Native Dev Environment Bypass
* ✅ **Gỡ bỏ hoàn toàn mọi can thiệp vào `Object.prototype`:** Đảm bảo $100\%$ đối tượng Three.js và Game Engine nguyên bản tuyệt đối, load game siêu tốc không có bất kỳ lỗi nào.
* ✅ **Mở khóa Native Game Engine:** Can thiệp thông minh và an toàn vào hàm regex kiểm tra môi trường dev (`Pb`) để Game Engine gốc tự động gán `window.game = $` một cách tự nhiên và sạch sẽ $100\%$.
* ✅ **Auto Câu Cá & Kéo Cần Trơn Tru:** Tự động kết nối Game Engine ngay lập tức, tự tìm hồ nước, quăng phao, cắn câu siêu tốc (`Ultra Catch`) và kéo cá liên tục vào túi.

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