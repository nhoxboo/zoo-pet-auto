# 🐾 Zoo Pet - All-in-One Auto Pro Tool v2.7

Tool Auto & VIP Cheats toàn diện, **An Toàn 100% Anti-Detection** cho web game **Zoo Pet** (https://zoo-pet.store/).

---

## 🌟 Tính Năng Mới Bản v2.7

### 1. 💀 Chế Độ "CHỈ GIẾT BOSS" (Boss Only Mode)
* **Nguyên nhân lỗi cũ:** Tool chỉ đánh quái nhỏ gần nhất trong tầm 35m, không tự đi tới vị trí Boss ở xa nên không bao giờ chạm tới Boss.
* **Cách sửa:** Thêm công tắc **"💀 CHỈ GIẾT BOSS (Bỏ Qua Quái Nhỏ)"** trong tab Chiến Đấu.
  * Khi bật: Tool **BỎ QUA TOÀN BỘ quái nhỏ**, tự động quét toàn bản đồ, tìm Boss gần nhất và **tự đi tới vị trí Boss** để đánh.
  * Tự động nhắm mặt về Boss, tung combo Q-W-E-R liên tục.
  * Tự nhận diện cả Boss đang "ngủ" (dormant) — tool sẽ đánh thức Boss để đánh.
  * Tùy chọn **"🛡️ Bỏ qua Boss Titan"** vẫn hoạt động để né Titan trâu máu > 2500 HP.

### 2. 🛡️ Sửa Lỗi Chuyển Tab Game Đứng / Dừng
* **Nguyên nhân lỗi cũ:** Vòng lặp Auto chạy bằng `requestAnimationFrame` — trình duyệt **đình hoàn toàn** rAF khi tab ẩn (`document.hidden = true`) → nhân vật đứng yên, không di chuyển, không đánh.
* **Cách sửa:** Thay bằng **ticker lai thông minh**:
  * Tab đang hiển thị: chạy bằng rAF (mượt, 60fps).
  * Tab ẩn: chuyển sang `Interval 200ms` (timer nền vẫn chạy kể cả khi tab bị thu nhỏ/ẩn).
  * Khi chuyển lại tab: tự động đánh thức rAF ngay lập tức + bù 1 nhịp tick.
  * Kết hợp Web Worker 100ms để đánh thức game khi cần.

---

## 🛠️ Trọn Bộ Tính Năng Khác
* **⚡ Hồi chiêu 0s (No Cooldown):** Xả 4 chiêu Q-W-E-R và chong chóng liên tục không ngừng.
* **🛡️ Chế độ Bất Tử (God Mode):** Khóa máu $100\%$, miễn nhiễm mọi sát thương và debuff.
* **🎣 Câu Cá Siêu Tốc 0.1s (Ultra Fishing):** Hỗ trợ toàn bộ các map (bao gồm rạn san hô Hành Tinh Đại Dương), cá cắn câu và kéo lên tức thì.
* **💡 Làm Sáng Hành Tinh Bóng Tối:** Ẩn màn che `#dark2`, tắt sương mù, bật tầm nhìn $100\%$ quái vật và tự hồi máu.
* **🏃 Tăng Tốc Chạy (1.0x - 2.5x) & ⚔️ Tăng Sát Thương (1.0x - 5.0x).**
* **🌾 Auto Nông Trại:** Tự thu hoạch cây chín, gieo hạt theo cấp, thu sản phẩm thú nuôi.
* **📜 Auto Nhiệm Vụ 100% An Toàn:** Tự động hoàn thành nhiệm vụ theo hành động thật, tự nhận thưởng Daily, Weekly, Bounty không bị báo lỗi số bất thường.
* **🛡️ Bộ Lọc Boss:** Tự động né các Boss Titan siêu trâu máu > 2500 (Rùa núi, Mãng xà 3 đầu, Nhện đồng hồ...).
* **💤 Chạy Ẩn Nền Khi Hạ Tab:** Sử dụng Web Worker 100ms độc lập và Anti-Throttle.

---

## 🚀 Hướng Dẫn Cài Đặt & Tự Động Cập Nhật

1. Cài đặt tiện ích **Tampermonkey** trên trình duyệt (Chrome, Edge, Brave, Firefox).
2. Mở link cài đặt trực tiếp:  
👉 **[https://raw.githubusercontent.com/nhoxboo/zoo-pet-auto/main/zoo-pet-auto.user.js](https://raw.githubusercontent.com/nhoxboo/zoo-pet-auto/main/zoo-pet-auto.user.js)**
3. Bấm **Install** (hoặc **Update**).
4. Vào game [https://zoo-pet.store/](https://zoo-pet.store/) (hoặc link CloudFront CDN) và trải nghiện!
5. Phím tắt ẩn/hiện menu: **F2** hoặc click nút 🤖 ở góc dưới màn hình.
