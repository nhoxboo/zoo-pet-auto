# 🐾 Zoo Pet - All-in-One Auto Pro Tool v2.2

Tool Auto toàn diện cho web game **Zoo Pet** (https://zoo-pet.store/).

---

## 🌟 Tính Năng Mới Bản v2.2

### 1. 🚀 Săn Boss Xuyên Hành Tinh & Cày Cấp Vô Hạn
* **Tự động quét Boss**: Quét và nhắm vào Boss trên hành tinh hiện tại, áp sát và dồn combo kỹ năng `Q` (Chong chóng), `W` (Lướt), `E` (Đấm đất), `R` (Tuyệt kỹ).
* **Tự động nhặt đồ & Chuyển hành tinh**: Sau khi dọn sạch Boss, tool đợi nhặt toàn bộ đồ rơi (Vương miện, Mũ huyền thoại, EXP, Vàng, Mảnh pet) rồi tự động bay sang hành tinh kế tiếp để săn tiếp.
* **Tùy chọn danh sách hành tinh săn**: Có thể bật/tắt từng hành tinh (Đồ Chơi, Kẹo Ngọt, Rừng Rậm, Băng Giá, Đại Dương, Dung Nham, Mây Trời, Bóng Tối).

### 2. 🎯 Bộ Lọc Boss Thông Minh & Bỏ Qua Titan
* **Bỏ qua Boss Titan (Mặc định: BẬT)**: Tự động bỏ qua các Boss Titan siêu trâu (Rùa Núi, Mãng Xà 3 Đầu, Nhện Đồng Hồ, Bọ Cạp Hỏa Ngục,...) để tránh bị hạ gục khi cấp/đồ chưa đủ mạnh.
* **Tùy chọn danh sách từng con Boss**: Có bảng checklist chi tiết kèm lượng máu (HP) và hành tinh để tự chọn Boss muốn săn.
* **Né đòn khi máu dưới X%**: Khi máu dưới 30%, nhân vật tự động lướt lùi né đòn để bảo toàn tính mạng.

### 3. 📜 Tự Động Làm & Nhận Thưởng Nhiệm Vụ (Quests & Bounty)
* **Tự động nhận thưởng Nhiệm Vụ Ngày & Rương Ngày** (`claim`, `claimAll`).
* **Tự động nhận thưởng Nhiệm Vụ Tuần & Rương Tuần** (`claimWeek`, `claimWeekChest`).
* **Tự động nộp Lệnh Truy Nã (Bounty)** khi hạ đủ số quái yêu cầu.
* **Tự động nhận thưởng Hành Trình (Story)** và quà hoàn thành chương.
* **Tự động nhận toàn bộ quà Thẻ Sao (Star Pass)**.

### 4. 🛡️ Chạy Ẩn Nền Khi Hạ Tab (Background Running)
* Tích hợp **Web Worker Timer 100ms** + cơ chế **Visibility API Bypass** (`document.hidden = false`).
* Trình duyệt Chrome / Edge sẽ **KHÔNG THỂ THROTTLE / ĐÓNG BĂNG GAME** khi anh Nam thu nhỏ cửa sổ hoặc chuyển tab làm việc khác. Tool vẫn tự đánh quái, combo, câu cá, thu hoạch và bay map liên tục!

### 5. 🎣 Auto Câu Cá Chuẩn Xác 100% (Khớp Engine Game)
* Tự động trang bị cần câu từ túi đồ.
* Nhận diện hồ nước gần nhất và quăng mồi.
* Giật cần chuẩn xác 100% ngay khi cá cắn câu.
* 2 chế độ: **Chuẩn xác (Perfect - giữ lực căng dây)** hoặc **Siêu tốc (Instant Catch)**.

---

## 🚀 Hướng Dẫn Cài Đặt

### Cách 1: Dùng Tampermonkey (Khuyên dùng - Tự động chạy mỗi khi vào game)
1. Cài extension **Tampermonkey** trên trình duyệt (Chrome, Edge, Cốc Cốc, Brave).
2. Mở Tampermonkey -> Chọn **Create a new script (Tạo script mới)**.
3. Sao chép toàn bộ mã nguồn trong file `zoo-pet-auto.user.js` và dán đè vào.
4. Nhấn `Ctrl + S` để Lưu.
5. Vào game https://zoo-pet.store/ -> Bảng điều khiển Trắng - Xanh sẽ tự động xuất hiện!

### Cách 2: Dán trực tiếp vào Console (F12)
1. Mở game https://zoo-pet.store/
2. Nhấn `F12` -> Chọn tab **Console**.
3. Sao chép toàn bộ code trong file `zoo-pet-auto.user.js` và dán vào -> Nhấn `Enter`.

---

## 🎮 Phím Tắt & Điều Khiển
* **Phím F2**: Ẩn / Hiện bảng điều khiển Auto.
* **Nút tròn 🤖**: Nhấn vào để mở lại menu nếu bị ẩn.
* **Thanh tiêu đề**: Nhấn giữ chuột để kéo thả menu đến bất kỳ vị trí nào trên màn hình.
