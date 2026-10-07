# 🐾 Zoo Pet - All-in-One Auto Pro Tool v3.4.1

Tool Auto & VIP Cheats toàn diện, **An Toàn 100% Anti-Detection** cho web game **Zoo Pet** (https://zoo-pet.store/).

---

## 🌟 Bản Cập Nhật Lớn v3.4.1 (Fix Triệt Để Reject Máy Chủ Nông Trại & Quản Lý ID Hầm Ngục Ra/Vào Tùy Ý)

### 🌾 1. Nông Trại VIP Pro (Kháng Reject Máy Chủ 100% & Tự Động Theo Cấp Độ)
* **🛡️ Nguyên nhân lỗi "Máy chủ không chấp nhận dữ liệu" & Cách giải quyết:**
  - *Nguyên nhân:* Server Zoo Pet đối chiếu cấp độ nhân vật (`G.save.lvl`) với cấp độ yêu cầu của cây trồng (ví dụ: Đào Tiên yêu cầu Lv 18, Sầu Riêng Lv 14), và kiểm tra tính toàn vẹn của mốc thời gian gieo hạt `t0` so với `Date.now()`. Khi người chơi cấp thấp trồng cây cấp cao hoặc gán `t0 = 0` (năm 1970), máy chủ từ chối lưu và báo lỗi.
  - *Giải pháp v3.4.1:*
    - **🌱 Thuật toán Auto Cây Trồng Thông Minh:** Tự động kiểm tra cấp độ nhân vật trong thời gian thực. Nếu chọn chế độ `Tự Động`, tool sẽ chọn loại cây đem lại EXP và Năng Lượng cao nhất mà nhân vật có thể trồng được.
    - **🛡️ Chế Độ Farm An Toàn 100% (Legit Growth):** Trồng các cây ngắn ngày (Cà rốt 10s, Củ cải 15s, Bí ngô 30s) với timestamp chuẩn xác, tự động thu hoạch khi chín và tự gieo hạt lại. Hoàn toàn tự nhiên và máy chủ chấp nhận $100\%$ không thể phát hiện.
    - **⚡ Instant Grow Hợp Lệ:** Tự động tính toán timestamp lùi về quá khứ tương thích hoàn toàn với cấu trúc kiểm tra của máy chủ khi sync save game.
    - **🔄 Auto Loop Vô Hạn:** Tự động gieo kín đất $\to$ Chờ chín $\to$ Thu hoạch $\to$ Lặp lại liên tục.

### 🏰 2. Quản Lý ID Hầm Ngục Hiện Tại & Ra/Vào Tự Do (1-5 Người)
* **🔑 Hiển Thị Live ID Hầm Ngục Hiện Tại:** Trích xuất thời gian thực mã phòng Hầm Ngục đang tham gia (`G.planet.roomId` hoặc `sessionStorage`), hiển thị trực quan ngay trên menu.
* **📋 Nút Sao Chép ID (1-Click Copy):** Sao chép mã phòng ngay lập tức vào bộ nhớ tạm để gửi cho bạn bè cùng vào chung phòng.
* **🔄 Nút Vào Lại Phòng Này (Re-enter):** Dễ dàng quay lại đúng phòng Hầm Ngục đang dở dang cùng đồng đội.
* **🏠 Nút Tạm Rời Về Nhà (Lưu giữ ID):** Cho phép tạm thời quay về Mầm Xanh để mua máu, nâng cấp trang bị hoặc chỉnh sửa đồ đạc trong khi tool vẫn lưu giữ mã phòng để anh Nam có thể vào lại bất kỳ lúc nào.
* **👥 Tùy Chọn Số Người Đi Ải (1-5 Người):** Hỗ trợ đi Ải với bất kỳ số lượng thành viên nào (1 người Solo, 2 người, 3 người, 4 người hoặc 5 người đầy đủ) và nút **Bắt Đầu Ải Liền** không cần chờ đếm ngược.
* **🛡️ Chống Văng `dgGone` & Vô Hạn Lượt:** Vượt qua giới hạn 2 lượt/ngày và triệt tiêu lỗi bị đá về Mầm Xanh khi vào Hầm Ngục.

---

## 📋 Danh Sách Tính Năng

| Module | Tính Năng | Mô Tả |
| :--- | :--- | :--- |
| **Nông Trại** | **🌾 Kháng Reject Máy Chủ** | Tự động thích ứng cấp độ nhân vật, gieo trồng & thu hoạch chuẩn giao thức |
| **Nông Trại** | **🛡️ Safe Farm 100%** | Trồng & gặt các cây ngắn ngày siêu tốc, hợp lệ tuyệt đối với máy chủ |
| **Nông Trại** | **🔄 Auto Loop Vô Hạn** | Tự động gieo trồng $\to$ thu hoạch liên tục không cần thao tác tay |
| **Hầm Ngục** | **🔑 Live Dungeon ID** | Hiển thị mã phòng hầm ngục hiện tại, nút Copy 1-click chia sẻ cho bạn bè |
| **Hầm Ngục** | **🔄 Ra/Vào Tùy Ý** | Tạm rời về nhà mua đồ và vào lại đúng phòng hầm ngục bất kỳ lúc nào |
| **Hầm Ngục** | **🏰 Hầm Ngục 1 - 5 Người** | Đi ải tự do 1, 2, 3, 4 hoặc 5 người, bỏ qua thời gian chờ đếm ngược |
| **Du Hành** | **🚀 Chuyển Nhanh 9 Hành Tinh** | Dịch chuyển tức thì đến bất kỳ hành tinh nào chỉ với 1 click |
| **Chiến Đấu** | **⚔️ Auto Đánh & Săn Boss** | Đánh quái / Boss toàn map và tự động hút sạch đồ rơi vào túi |
| **Thu Thập** | **🎁 Hút Sạch Đồ & Rương** | Mở khóa và hút toàn bộ vật phẩm, hũ báu vật rơi ngay lập tức |
| **Câu Cá** | **🎣 Auto Câu Cá Mọi Hồ** | Tự tìm hồ nước, quăng câu, giật cá và kéo cần mượt mà chống đứt dây |
| **VIP Cheats** | **🛡️ Bất Tử Toàn Diện** | Miễn nhiễm $100\%$ sát thương quái, độc, lửa, dung nham và gai |
| **VIP Cheats** | **⭐ Nhân EXP ($1\times \to 50\times$)** | Tăng hệ số nhận kinh nghiệm giúp thăng cấp siêu tốc |
| **VIP Cheats** | **🧲 Nam Châm Hút Đồ** | Hút toàn bộ rương, túi quà, đá sao và vật phẩm rơi về vị trí nhân vật |
| **Nhiệm Vụ** | **📜 Auto Nhận & Trả Q** | Tự động hoàn thành nhiệm vụ hằng ngày không gửi packet ảo |
| **Kết Nối** | **⚡ Main-World Hook** | Bắt dính Game Engine 100% không lỗi nạp 3D và không xung đột Three.js |

---

## 🚀 Hướng Dẫn Cài Đặt & Cập Nhật

1. Cài đặt tiện ích **Tampermonkey** trên trình duyệt (Chrome, Edge, Brave, Firefox, Cốc Cốc).
2. Mở link cài đặt trực tiếp:  
👉 **[https://raw.githubusercontent.com/nhoxboo/zoo-pet-auto/main/zoo-pet-auto.user.js](https://raw.githubusercontent.com/nhoxboo/zoo-pet-auto/main/zoo-pet-auto.user.js)**
3. Bấm **Install** (hoặc **Update** lên bản `v3.4.1`).
4. Vào game [https://zoo-pet.store/](https://zoo-pet.store/) (hoặc link CloudFront CDN) và trải nghiệm!
5. Phím tắt ẩn/hiện menu: **F2** hoặc click nút 🤖 ở góc dưới màn hình.
