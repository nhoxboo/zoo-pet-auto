# 🐾 Zoo Pet - All-in-One Auto Pro Tool v3.2.0

Tool Auto & VIP Cheats toàn diện, **An Toàn 100% Anti-Detection** cho web game **Zoo Pet** (https://zoo-pet.store/).

---

## 🌟 Bản Cập Nhật Lớn v3.2.0 (Hệ Thống Tự Động Kết Nối Đa Tầng Bất Khả Xâm Phạm)

* **⚡ Cơ Chế Tự Động Bắt Dính Engine Đa Tầng (Triple-Resilient Auto-Connect):**
  - **Nguyên nhân trước đây:** Game gốc kiểm tra `Pb` qua regex máy chủ nội bộ (`localhost|127.0.0.1`), nếu chạy trên domain chính hoặc khi chuyển map/hầm ngục mà regex bị bỏ qua thì `window.game` sẽ không được gán, dẫn đến tình trạng tool bị kẹt ở trạng thái *"🟡 Đang kết nối..."* và bấm kết nối lại cũng không nhận được.
  - **Khắc phục trên v3.2.0:**
    1. **Bảo vệ toàn diện chuỗi Regex/String Methods:** Hook đồng thời `RegExp.test`, `RegExp.exec`, `String.match`, `String.search` để kích hoạt cờ `Pb = true` ở mọi tình huống.
    2. **Property Trap trên `window.game`:** Đặt getter/setter chủ động bắt dính ngay mili-giây đầu tiên khi Game Instance được gán.
    3. **Bộ quét liên tục 5 giây (Resilient 5s Scanner):** Khi người dùng bấm nút *"🔄 Kết nối lại"*, tool sẽ chủ động quét và thử lại liên tục trong 5 giây cho đến khi toàn bộ tài nguyên 3D và nhân vật được tải hoàn tất.
    4. **Hiển thị tên bản đồ hiện tại trực quan:** Badge trạng thái tự động cập nhật tên map (ví dụ: `🟢 Đã kết nối (Mầm Xanh)`, `🟢 Đã kết nối (Hầm Ngục Ải 1)`).
* **🏰 Hầm Ngục Cổ Đại Solo 1 Người & Vô Hạn Lượt:**
  - Không cần chờ ghép đủ 5 người, vào thẳng hầm ngục tự động đánh ngay.
  - Chống văng map (`Anti-dgGone`) vĩnh viễn cho đến khi phá đảo 5 Ải.
* **⚡ Tự Động Vượt 5 Ải & Bước Qua Cổng:**
  - Tự động diệt quái, gọi Trùm và hạ gục 5 Boss Hầm Ngục (Ải 1 $\rightarrow$ Ải 2 $\rightarrow$ Ải 3 $\rightarrow$ Ải 4 $\rightarrow$ Ải 5 - Trùm Cuối Cổ Vương).
  - Tự động bước vào Cổng Dịch Chuyển ngay khi Boss ải ngã xuống.
* **🎣 Cơ Chế Kéo Cần Câu Cá Mượt Mà:**
  - Đầy đủ hoạt ảnh quăng cần, giật cá, uốn cần kéo cá và cá nhảy lên bờ.
  - Tích hợp kiểm soát lực căng dây chống đứt cần tuyệt đối.
* **👑 Trọn Bộ VIP Cheats:**
  - Bất Tử Toàn Diện (Kháng độc, nham thạch, gai).
  - Tăng Điểm Kinh Nghiệm EXP ($2\times \to 50\times$).
  - One-Hit Sát Thương & Không Thời Gian Hồi Chiêu.

---

## 📋 Danh Sách Tính Năng

| Module | Tính Năng | Mô Tả |
| :--- | :--- | :--- |
| **Kết Nối** | **⚡ Triple-Resilient Auto-Connect** | Tự động bắt dính Game Engine ngay lập tức ở mọi map và hầm ngục |
| **Du Hành & Đi Ải** | **🏰 Hầm Ngục Cổ Đại Solo** | Vào 5 Ải hầm ngục 1 mình ngay lập tức, chống văng map, không giới hạn lượt |
| **Du Hành & Đi Ải** | **🚀 Chuyển Nhanh 9 Hành Tinh** | Dịch chuyển tức thì đến bất kỳ hành tinh nào chỉ với 1 click |
| **Câu Cá** | **🎣 Auto Câu Cá Mọi Hồ** | Tự tìm hồ nước, quăng câu, giật cá và kéo cần mượt mà chống đứt dây |
| **Chiến Đấu** | **⚔️ Auto Săn Boss Toàn Map** | Tự động quét và diệt Boss trên toàn bộ bề mặt hành tinh |
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
