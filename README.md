# 🐾 Zoo Pet - All-in-One Auto Pro Tool v2.9.1

Tool Auto & VIP Cheats toàn diện, **An Toàn 100% Anti-Detection** cho web game **Zoo Pet** (https://zoo-pet.store/).

---

## 🌟 Bản Cập Nhật v2.9.1: Fix Triệt Để Quăng Cần Thu Về Bậy & Auto Săn Boss

### 1. 🎣 Sửa Lỗi Quăng Cần Ra Tự Thu Về (Cần Thu Ngay Sau Khi Quăng)
* **Nguyên nhân chính xác được phát hiện:**
  1. **Can thiệp sớm trong giai đoạn `phase === 'cast'`:** Khi vừa quăng cần (0.5s đầu tiên phao đang bay trên không), hàm Ultra Catch và Rare Hunter cũ can thiệp gán `phase = 'bite'` và gọi `fishing.finish(true)`. Do cá chưa bơi tới phao (`interest` chưa có), `finish(true)` văng lỗi và kích hoạt `fishing.cancel(true)` khiến **phao vừa chạm nước đã lập tức bị giật thu cần về**.
  2. **Hủy câu cá thường khi chưa cắn câu:** Bộ lọc cá hiếm cũ hủy câu ngay từ lúc cá bơi tới (`approach`), khiến $95\%$ số lần quăng đều bị hủy ngay trong 0.2s.
* **Khắc phục trong v2.9.1:**
  * ✅ Giữ nguyên trạng thái `phase === 'cast'` để phao bay và rơi chạm nước tự nhiên.
  * ✅ Chỉ kích hoạt cắn câu siêu tốc (Ultra Catch) khi phao đã chạm nước (`phase === 'wait'`).
  * ✅ Chỉ kéo cá khi cá đã cắn câu (`phase === 'bite'`) và có đối tượng cá hợp lệ, giúp phao câu tồn tại $100\%$ ổn định, không còn hiện tượng thu cần bậy!

### 2. ⚔️ Kích Hoạt Auto Săn Boss Chuẩn Xác 100%
* **Tự Động Kích Hoạt khi bật "Chỉ Giết Boss":** Trước đây nếu chưa bật nút "Tự Động Đánh Quái" thì bật "Chỉ Giết Boss" không chạy. Bản v2.9.1 tự động kích hoạt chế độ săn Boss ngay khi bật `Chỉ Giết Boss` hoặc `Auto Du Hành`.
* **Điều Hướng Native Không Giật Lag:** Sử dụng cơ chế nhắm mục tiêu chuẩn của game engine `{ type: 'enemy', enemy: boss, point: boss.pos.clone(), auto: true }`, nhân vật tự động tìm và bơi/chạy thẳng đến vị trí Boss mượt mà, sau đó xả combo 4 chiêu `spin`, `dash`, `slam`, `special` liên tục.

---

## 🛠️ Danh Sách Tính Năng Tổng Thể
* **⚡ Hồi chiêu 0s (No Cooldown):** Xả chiêu liên tục không chờ thời gian hồi.
* **🛡️ Chế độ Bất Tử (God Mode):** Miễn nhiễm sát thương.
* **⚔️ Tăng Sát Thương (Damage Multiplier):** Nhân sát thương đầu ra cực mạnh.
* **🏃 Tăng Tốc Chạy (Speed Boost):** Di chuyển siêu tốc qua các vùng đất.
* **💡 Sáng Bản Đồ Bóng Tối:** Xóa bỏ màn đen tối và sương mù.
* **🌾 Auto Nông Trại:** Tự động thu hoạch cây chín và gieo hạt giống cấp cao nhất.
* **🎣 Câu Cá Siêu Tốc & Săn Cá Hiếm:** Lọc bỏ cá rác, săn cá Rồng Vàng, Bạch Tuộc, Cá Voi.
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
