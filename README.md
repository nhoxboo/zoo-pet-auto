# 🐾 Zoo Pet - All-in-One Auto Pro Tool v2.8.1

Tool Auto & VIP Cheats toàn diện, **An Toàn 100% Anti-Detection** cho web game **Zoo Pet** (https://zoo-pet.store/).

---

## 🌟 Tính Năng Mới Bản v2.8.1

### 1. 🌊 Khắc Phục Hoàn Toàn Lỗi Câu Cá Tại Hành Tinh Đại Dương (Ocean Planet)
* **Nguyên nhân cốt lõi trong engine game:**
  * Map Đại Dương không có bờ đất liền (`shore`) thông thường mà là các **vùng rạn san hô nước mở (`reef: true`)**.
  * Tool phiên bản trước cố gắng tìm điểm bờ đất `plan.shore` vốn không tồn tại trên biển $\rightarrow$ khiến nhân vật bị kẹt vòng lặp bơi quanh rạn san hô mà không quăng cần.
  * Khi nhân vật chưa trang bị Cần Câu hoặc đang cầm vũ khí đánh quái $\rightarrow$ engine game tự động cancel câu cá ngay tức thì (`weapon.kind !== 'rod'`).
  * Điểm quăng phao (`castPos`) cần là một thực thể `Vector3` có hàm `.clone()` hợp lệ.
* **Giải pháp trong v2.8.1:**
  * ✅ **Auto-Equip Rod:** Tự động phát hiện và trang bị Cần Câu Vàng (`rod_gold` / `rod`) trước khi câu, tránh bị engine game hủy trạng thái câu.
  * ✅ **Open-Sea Reef Navigation:** Tính toán bán kính tiếp cận rạn san hô trên biển (`w.r + 2.0m`), tự bơi đến mép rạn và dừng hẳn (`vel = 0`) để quăng câu chuẩn xác.
  * ✅ **Direct Vector3 Casting:** Quăng phao trực tiếp vào lòng rạn san hô chứa 7 đàn cá bơi lội với tọa độ Vector3 chuẩn xác.
  * ✅ **Reef Fish Binding:** Tự động bắt đúng đối tượng cá (`fishing.interest`) trong rạn san hô để kéo cá lên bờ $100\%$ không bị lỗi null.

### 2. 🌟 Chế Độ "CHỈ CÂU CÁ HIẾM & HUYỀN THOẠI" (Rare & Legend Fish Hunter)
* **Tự Động Phân Loại Cá Thông Minh:**
  * Khi cá cắn câu, tool sẽ lập tức quét loại cá (`species` & `prize`).
  * **Nếu là cá thường / rác** (Cá rô, cá hề, giày cũ, cá nóc, cá trê...): Tool sẽ **TỰ ĐỘNG HỦY CÂU TỨC THÌ (0.2s)** và quăng lại ngay mà không làm tốn thời gian hay hao mồi của bạn!
  * **Chỉ kéo lên khi phát hiện:**
    * 👑 **Cá Rồng Vàng** (`fish_golden` - Huyền Thoại, 600 Vàng, hồi 9999 HP, Buff Atk/Def/Crit/Luck).
    * 🐋 **Cá Voi Con** (`fish_whale` - Huyền Thoại, 420 Vàng, Def +25, Regen máu).
    * 🐙 **Bạch Tuộc Khổng Lồ** (`fish_kraken` - Huyền Thoại, 380 Vàng, Atk +35%).
    * 🦈 **Cá Đuối Khổng Lồ** (`fish_manta` - Huyền Thoại tại Đại Dương).
    * 🌈 **Cá Cầu Vồng** (`fish_rainbow` - Hiếm, 160 Vàng, Atk +20%).
    * 🗡️ **Cá Kiếm** (`fish_swordfish` - Hiếm, 90 Vàng, Crit +10%).
    * 🏮 **Cá Lồng Đèn** (`fish_angler` - Hiếm, 85 Vàng).
    * ⚡ **Lươn Điện** (`fish_eel` - Hiếm, 70 Vàng, Tốc độ +30%).
    * 🦈 **Cá Mập Con** (`fish_shark` - Hiếm, 65 Vàng).
    * 🎏 **Cá Koi Rồng** (`fish_koi` - Hiếm, 45 Vàng, Luck +30%).
    * ❄️ **Cá Chó Băng** (`fish_icepike` - Hiếm, 48 Vàng).
    * ❓ **Bóng Cá Bí Ẩn (Mystery Fish)** & 🐳 **Cá Siêu Khổng Lồ (Giant Fish)**.
* **🔮 Triệu Hồi Bóng Cá Bí Ẩn (Mystery Fish Summoner):** Tự động gọi bóng cá phát sáng khổng lồ bơi về phía phao mỗi lần quăng câu.
* **🍀 Tăng Tỷ Lệ May Mắn Bắt Cá (+Luck Buff):** Tự động kích hoạt chỉ số may mắn để tỷ lệ roll ra cá huyền thoại đạt mức cao nhất.

### 3. 💀 Chế Độ "CHỈ GIẾT BOSS" (Boss Only Mode)
* Tự động bỏ qua quái nhỏ, quét toàn bản đồ và di chuyển tới tận vị trí Boss để tiêu diệt.

### 4. 🛡️ Ticker Lai Chống Đứng Game Khi Đổi Tab
* Tự động chuyển đổi giữa rAF và Timer nền giúp game và Auto chạy xuyên suốt khi hạ tab.

---

## 🛠️ Trọn Bộ Tính Năng Khác
* **⚡ Hồi chiêu 0s (No Cooldown):** Xả 4 chiêu Q-W-E-R và chong chóng liên tục không ngừng.
* **🛡️ Chế độ Bất Tử (God Mode):** Khóa máu $100\%$, miễn nhiễm mọi sát thương và debuff.
* **🎣 Câu Cá Siêu Tốc 0.1s (Ultra Fishing):** Hỗ trợ toàn bộ các map (bao gồm rạn san hô Hành Tinh Đại Dương), cá cắn câu và kéo lên tức thì.
* **💡 Làm Sáng Hành Tinh Bóng Tối:** Ẩn màn che `#dark2`, tắt sương mù, bật tầm nhìn $100\%$ quái vật và tự hồi máu.
* **🏃 Tăng Tốc Chạy (1.0x - 2.5x) & ⚔️ Tăng Sát Thương (1.0x - 5.0x).**
* **🌾 Auto Nông Trại:** Tự thu hoạch cây chín, gieo hạt theo cấp, thu sản phẩm thú nuôi.
* **📜 Auto Nhiệm Vụ 100% An Toàn:** Tự động hoàn thành nhiệm vụ theo hành động thật, tự nhận thưởng Daily, Weekly, Bounty không bị báo lỗi số bất thường.
* **🚀 Chuyển Hành Tinh Nhanh (1-Click Fast Travel):** 9 nút bấm hành tinh + menu chọn nhanh + nút "Bay Ngay".
* **🚀 Auto Du Hành Săn Boss Liên Hành Tinh:** Chỉ chuyển map khi ĐÃ TIÊU DIỆT XONG BOSS và nhặt hết quà.

---

## 🚀 Hướng Dẫn Cài Đặt & Tự Động Cập Nhật

1. Cài đặt tiện ích **Tampermonkey** trên trình duyệt (Chrome, Edge, Brave, Firefox).
2. Mở link cài đặt trực tiếp:  
👉 **[https://raw.githubusercontent.com/nhoxboo/zoo-pet-auto/main/zoo-pet-auto.user.js](https://raw.githubusercontent.com/nhoxboo/zoo-pet-auto/main/zoo-pet-auto.user.js)**
3. Bấm **Install** (hoặc **Update**).
4. Vào game [https://zoo-pet.store/](https://zoo-pet.store/) (hoặc link CloudFront CDN) và trải nghiệm!
5. Phím tắt ẩn/hiện menu: **F2** hoặc click nút 🤖 ở góc dưới màn hình.
