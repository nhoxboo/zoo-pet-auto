# 🐾 Zoo Pet - All-in-One Auto Pro Tool v3.3.3

Tool Auto & VIP Cheats toàn diện, **An Toàn 100% Anti-Detection** cho web game **Zoo Pet** (https://zoo-pet.store/).

---

## 🌟 Bản Cập Nhật Lớn v3.3.3 (Khắc Phục Lỗi Tải Game .clone() & Tối Ưu Hóa Hook Kết Nối)

* **🛡️ Sửa Dứt Điểm Lỗi "Lỗi tải game: Cannot read properties of undefined (reading 'clone')":**
  - Đã loại bỏ hoàn toàn các can thiệp vào `Object.prototype`, đảm bảo hệ thống Three.js của game và các mô hình 3D (.glb) tải $100\%$ mượt mà không bị lỗi sao chép thuộc tính.
* **⚡ Native Main-World Regex Hook & Window.game Setter:**
  - Patch `RegExp.prototype.test` và bẫy setter trên `window.game` tại Main World, đảm bảo `Pb = true` và bắt dính `window.game = $` ngay khi game vừa nạp xong map.
* **🎁 Tự Động Lụm Sạch Đồ Khi Đánh Quái & Boss:**
  - Tích hợp Nam Châm hút đồ tự động ngay trong chu trình chiến đấu `runCombatEngine()`.
  - Quét và hút sạch cả 3 nguồn rơi đồ: `drops.items` (vật phẩm), `drops.bags` (hũ/túi đồ), và `drops.world` (vật phẩm rơi từ máy chủ).
  - Tự động mở khóa `item.lock = false` và cập nhật tuổi thọ `item.age > 0.6s` để nhân vật hấp thụ ngay lập tức vào túi đồ mà không bị rơi rớt lại phía sau.
* **⚔️ Tiêu Diệt Lần Lượt 100% TẤT CẢ Boss Trên Map:**
  - Nhận diện toàn bộ 68 loại Boss trong game (`Df`), quét sạch từng Boss một trên toàn bộ bản đồ trước khi chuyển sang giai đoạn nhặt đồ.
* **🏰 Hầm Ngục Cổ Đại Solo 1 Người & Vô Hạn Lượt:**
  - Chống văng map (`Anti-dgGone`) vĩnh viễn cho đến khi phá đảo 5 Ải.
* **🎣 Cơ Chế Kéo Cần Câu Cá Mượt Mà:**
  - Đầy đủ hoạt ảnh quăng cần, giật cá, uốn cần kéo cá và cá nhảy lên bờ.
* **👑 Trọn Bộ VIP Cheats:**
  - Bất Tử Toàn Diện (Kháng độc, nham thạch, gai).
  - Tăng Điểm Kinh Nghiệm EXP ($2\times \to 50\times$).
  - One-Hit Sát Thương & Không Thời Gian Hồi Chiêu.

---

## 📋 Danh Sách Tính Năng

| Module | Tính Năng | Mô Tả |
| :--- | :--- | :--- |
| **Kết Nối** | **⚡ Main-World Hook** | Bắt dính Game Engine 100% không lỗi nạp 3D và không xung đột Three.js |
| **Chiến Đấu** | **⚔️ Auto Đánh & Săn Boss** | Đánh quái / Boss toàn map và tự động hút sạch đồ rơi vào túi |
| **Thu Thập** | **🎁 Hút Sạch Đồ & Rương** | Mở khóa và hút toàn bộ vật phẩm, hũ báu vật rơi ngay lập tức |
| **Du Hành & Đi Ải** | **🏰 Hầm Ngục Cổ Đại Solo** | Vào 5 Ải hầm ngục 1 mình ngay lập tức, chống văng map, không giới hạn lượt |
| **Du Hành & Đi Ải** | **🚀 Chuyển Nhanh 9 Hành Tinh** | Dịch chuyển tức thì đến bất kỳ hành tinh nào chỉ với 1 click |
| **Câu Cá** | **🎣 Auto Câu Cá Mọi Hồ** | Tự tìm hồ nước, quăng câu, giật cá và kéo cần mượt mà chống đứt dây |
| **VIP Cheats** | **🛡️ Bất Tử Toàn Diện** | Miễn nhiễm $100\%$ sát thương quái, độc, lửa, dung nham và gai |
| **VIP Cheats** | **⭐ Nhân EXP ($1\times \to 50\times$)** | Tăng hệ số nhận kinh nghiệm giúp thăng cấp siêu tốc |
| **VIP Cheats** | **🧲 Nam Châm Hút Đồ** | Hút toàn bộ rương, túi quà, đá sao và vật phẩm rơi về vị trí nhân vật |
| **Nhiệm Vụ** | **📜 Auto Nhận & Trả Q** | Tự động hoàn thành nhiệm vụ hằng ngày không gửi packet ảo |
| **Hệ Thống** | **🔄 Nút Kết Nối Lại 5s** | Quét kiên trì 5 giây kết nối lại tức thì không cần reload map |

---

## 🚀 Hướng Dẫn Cài Đặt & Cập Nhật

1. Cài đặt tiện ích **Tampermonkey** trên trình duyệt (Chrome, Edge, Brave, Firefox).
2. Mở link cài đặt trực tiếp:  
👉 **[https://raw.githubusercontent.com/nhoxboo/zoo-pet-auto/main/zoo-pet-auto.user.js](https://raw.githubusercontent.com/nhoxboo/zoo-pet-auto/main/zoo-pet-auto.user.js)**
3. Bấm **Install** (hoặc **Update**).
4. Vào game [https://zoo-pet.store/](https://zoo-pet.store/) (hoặc link CloudFront CDN) và trải nghiệm!
5. Phím tắt ẩn/hiện menu: **F2** hoặc click nút 🤖 ở góc dưới màn hình.
