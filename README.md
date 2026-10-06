# 🐾 Zoo Pet - All-in-One Auto Pro Tool v2.9.0

Tool Auto & VIP Cheats toàn diện, **An Toàn 100% Anti-Detection** cho web game **Zoo Pet** (https://zoo-pet.store/).

---

## 🌟 Bản Cập Nhật v2.9.0: Đại Tu Toàn Diện Engine Đánh Boss, Farm & Cheats

### 1. ⚔️ Khắc Phục Triệt Để Lỗi Đứng Màn Hình / Đơ Game Khi Đánh Boss
* **Nguyên nhân cốt lõi được tìm thấy trong mã nguồn:**
  1. **Lỗi Skill Key không hợp lệ:** Tool cũ gọi `player.useSkill('q')`, `player.useSkill('w')`, `player.useSkill('e')`, `player.useSkill('r')`. Nhưng trong engine game Zoo Pet, mảng skill nội bộ quy định là: `['spin', 'dash', 'slam', 'special']` (chứ không phải `['q', 'w', 'e', 'r']`). Việc truyền `'q'` làm `Kf['q']` trả về `undefined`, dẫn đến lỗi `TypeError: Cannot read properties of undefined (reading 'cd')` ngay trong luồng render `requestAnimationFrame`, làm **đứng hình và đóng băng hoàn toàn màn hình game**.
  2. **Lỗi gán Target sai cấu trúc:** Tool cũ gán `player.target = { type: 'enemy', ref: target }`, trong khi game engine yêu cầu trường `target.enemy`. Khi thiếu trường này, game cố truy cập `target.enemy.alive` làm văng lỗi ngoại lệ.
* **Giải pháp trong v2.9.0:**
  * ✅ Chuẩn hóa toàn bộ combo kỹ năng: `'spin'` (Q - Chong Chóng), `'dash'` (W - Lướt tới), `'slam'` (E - Đấm đất), `'special'` (R - Chiêu thức vũ khí đặc biệt).
  * ✅ Toàn bộ lệnh gọi kỹ năng được bọc lớp `try-catch` an toàn tuyệt đối, đảm bảo game luôn mượt mà 60 FPS không bao giờ bị đơ hay đứng hình khi giao chiến.
  * ✅ Cấu trúc Target chuẩn hóa theo engine: `{ type: 'enemy', enemy: target, point: target.pos.clone(), auto: true }`.

### 2. 👑 Nâng Cấp Bộ Nhận Diện & Tự Động Tìm Boss Toàn Bản Đồ
* **Nhận diện Boss toàn diện:** Thuật toán `isBossEntity()` quét và nhận diện chính xác $100\%$ tất cả các loại Boss trên mọi hành tinh:
  * 🐻 **Gấu Vua** (`bear` - Hành tinh Nhà)
  * 🎂 **Bánh Kem Khổng Lồ** (`cake` - Hành tinh Bánh Kẹo)
  * ❄️ **Yeti Băng Giá** & 🦣 **Voi Ma Mút Chúa** (`yeti`, `mammoth` - Hành tinh Băng)
  * 🐉 **Rồng Nham Thạch** & 🗿 **Người Đá Magma** (`dragon`, `golem` - Hành tinh Nham Thạch)
  * 🌳 **Cây Cổ Thụ** & 🐊 **Cá Sấu Chúa** (`treant`, `croc` - Hành tinh Đầm Lầy)
  * 🍪 **Bánh Gừng Khổng Lồ** (`gingerbread`)
  * 👾 **Space Colossus & Titan Bosses** (`sboss`, `titan_...`, `worldboss_...`)
* **Auto Tìm Boss & Tiến Đánh:** Tự động định vị tọa độ Boss ở bất kỳ vị trí nào trên bản đồ, điều khiển nhân vật di chuyển thẳng tới Boss và xả sát thương liên tục.

### 3. 🌾 Đại Tu Hệ Thống Tự Động Nông Trại (Auto Farm)
* **Sửa đúng chữ ký hàm engine:**
  * Sửa hàm thu hoạch thành `farm.harvest(plot)` dựa trên trạng thái `farm.ready(plot)`.
  * Sửa hàm gieo hạt thành `farm.plant(plot, cropName)` tự động chọn hạt giống cấp cao nhất có trong túi đồ (`radish`, `carrot`, `pumpkin`, `mint`, `chili`, `candy`, `bean`, `star`, `berry`, `coffee`, `moonflower`...).

### 4. 🎣 Hoàn Thiện Tự Động Câu Cá Mọi Hồ & Biển Đại Dương
* `ensureRodEquipped()` an toàn, không còn vòng lặp hủy cần câu.
* Quăng câu tự động, hút cá siêu tốc, lọc cá Hiếm & Huyền Thoại chuẩn xác.

### 5. 🧲 Nam Châm Hút Đồ Chuẩn 3D (Loot Magnet)
* Khắc phục cấu trúc `obj.position` của các túi đồ (`drops.bags`) và vật phẩm rơi (`drops.items`), hút ngay lập tức vào túi đồ người chơi khi đánh quái và diệt boss.

---

## 🛠️ Danh Sách Tính Năng Tổng Thể
* **⚡ Hồi chiêu 0s (No Cooldown):** Xả chiêu liên tục không chờ thời gian hồi.
* **🛡️ Chế độ Bất Tử (God Mode):** Miễn nhiễm sát thương.
* **⚔️ Tăng Sát Thương (Damage Multiplier):** Nhân sát thương đầu ra cực mạnh.
* **🏃 Tăng Tốc Chạy (Speed Boost):** Di chuyển siêu tốc qua các vùng đất.
* **💡 Sáng Bản Đồ Bóng Tối:** Xóa bỏ màn đen tối và sương mù.
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
