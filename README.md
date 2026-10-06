# 🐾 Zoo Pet - All-in-One Auto Pro Tool v2.8.2

Tool Auto & VIP Cheats toàn diện, **An Toàn 100% Anti-Detection** cho web game **Zoo Pet** (https://zoo-pet.store/).

---

## 🌟 Tính Năng Mới Bản v2.8.2

### 1. 🎣 Sửa Triệt Để Lỗi Tự Động Câu Cá (Cả Hồ Nước Thường & Hành Tinh Đại Dương)
* **Nguyên nhân sâu xa được phát hiện:**
  1. **Lỗi `refreshEquip()` chạy lặp vô tận:** Hàm `autoEquipRod` cũ kiểm tra biến `window.W` (vốn không tồn tại trên window do biến cục bộ), khiến tool hiểu nhầm chưa có Cần Câu và liên tục gọi `player.refreshEquip()` mỗi 100ms. Mỗi lần gọi `refreshEquip()` engine game lập tức xóa bỏ cần câu và HỦY lệnh câu cá (`fishing.cancel()`).
  2. **Lỗi kẹt di chuyển `walkTo`:** Khi nhân vật ở cách hồ nước $> 2.5$m, hàm quăng câu liên tục tính lại tọa độ mục tiêu mỗi 100ms làm ngắt quãng bước đi của nhân vật.
  3. **Hết cá trong hồ sau khi câu nhanh:** Khi dùng Ultra Catch câu hết cá trong hồ, hồ bị trống cá trong 15s khiến tool đứng chờ vô tận.
* **Giải pháp hoàn thiện trong v2.8.2:**
  * ✅ **`ensureRodEquipped()` an toàn:** Chỉ trang bị cần câu đúng 1 lần duy nhất khi `player.weapon.kind !== 'rod'`. Một khi đã cầm cần câu, tuyệt đối không chạm vào `refreshEquip()` giúp phao câu và dây câu tồn tại ổn định $100\%$.
  * ✅ **Điều hướng mượt mà `isWalkingToWater`:** Khóa đích đến của bước đi khi đến gần hồ nước, không làm giật lag hay ngắt quãng nhân vật.
  * ✅ **Auto Fish Respawn:** Khi hồ nước bị câu cạn sạch cá, tool tự động kích hoạt hồi sinh cá mới ngay lập tức để tiếp tục câu liên tục không bị gián đoạn.
  * ✅ **Tương thích toàn diện:** Hoạt động hoàn hảo trên tất cả các hành tinh (Hành tinh Nhà, Đầm Lầy, Băng Giá, Rừng Rậm, Hành Tinh Đại Dương...).

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
