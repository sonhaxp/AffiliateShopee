# Danh Sách Task Chi Tiết Toàn Bộ Hệ Thống (Full Suite Roadmap)

Tài liệu này bẻ nhỏ mọi thành phần cần thiết để xây dựng Affiliate Automation Suite từ MVP lên Product-Ready.

---

## 🏗️ 1. Kiến Trúc Tổng Thể & Hạ Tầng Frontend
- [x] **Next.js App Router & Layouts:** 
    - [x] Thiết lập hệ thống Layout chung (Shared Layout) cho Sidebar và Header.
    - [x] Cấu hình Dynamic Routing cho các phân hệ chính (Dashboard, Library, Products, Settings).
- [ ] **State Management (Zustand):** 
    - [ ] Quản lý Global State cho các Job đang render (để chuyển trang vẫn theo dõi được).
    - [ ] Lưu trữ thông tin User và Cấu hình hệ thống.
- [x] **Authentication (Auth Layer):**
    - [x] Trang Đăng nhập / Đăng ký (Premium UI).
    - [ ] Middleware bảo vệ các route yêu cầu đăng nhập.
    - [ ] Tích hợp JWT Token vào API Client.

---

## 📺 2. Phân Hệ Quản Lý Video (Library Page)
- [x] **Giao diện Danh sách (Video Grid):**
    - [x] Hiển thị danh sách Video với bộ lọc: Trạng thái (Xong/Lỗi/Đang chạy), Ngày tạo.
    - [x] Ô tìm kiếm theo tên Sản phẩm hoặc Link.
- [ ] **Chức năng Quản lý:**
    - [ ] Chế độ xem chi tiết Job (Log lỗi nếu render thất bại).
    - [ ] Chức năng Xóa/Ẩn video.
    - [ ] Chức năng Re-render (Chạy lại job lỗi với cấu hình mới).
- [ ] **Bulk Actions:** Chọn nhiều video để tải về hoặc đăng hàng loạt.

---

## 📦 3. Phân Hệ Quản Lý Sản Phẩm (Product Management)
- [x] **Database Product List:** Hiển thị toàn bộ sản phẩm đã từng cào dữ liệu (UI Table).
- [ ] **AI Script Editor:** 
    - [ ] Sau khi cào data, cho phép User xem và chỉnh sửa kịch bản AI (Hook, Content, CTA) trước khi đưa vào hàng đợi Render.
    - [ ] Lưu lịch sử các phiên bản kịch bản.
- [ ] **Media Assets:** Quản lý kho ảnh/video gốc đã tải về của từng sản phẩm.

---

## 🔗 4. Phân Hệ Tích Hợp & Cấu Hình (Settings & Integrations)
- [x] **Account & Profile:**
    - [x] Giao diện cài đặt tài khoản, hồ sơ cá nhân.
    - [x] Menu điều khiển (Dropdown) trên Topbar.
- [ ] **Social Accounts:**
    - [ ] Kết nối API TikTok (OAuth).
    - [ ] Cấu hình tự động đăng (Auto-post) theo lịch trình.
- [ ] **AI Engine Settings:**
    - [ ] Quản lý API Key (OpenAI, Claude, Gemini).
    - [ ] Cấu hình Prompt mặc định cho hệ thống.
- [ ] **Storage Settings:** Lựa chọn nơi lưu trữ (Local / AWS S3 / Cloudflare R2).

---

## 🤖 5. Nâng Cấp Worker (AI & Media Engine)
- [/] **Scraper Engine:** (Đang triển khai) Hỗ trợ đa nền tảng (Shopee, TikTok Shop, Lazada).
- [ ] **AI Video Engine:** 
    - [ ] Tạo nhiều mẫu Template video khác nhau (Review, Unboxing, Cinematic).
    - [ ] Tự động chèn nhạc nền theo nhịp (Beat sync - Nâng cao).
- [ ] **Logging & Monitoring:** Gửi log chi tiết quá trình render về Backend để hiển thị lên UI cho User.

---

## 📈 6. Dashboard & Analytics
- [x] **Tổng quan:** Thống kê số lượng video đã tạo, lượt xem, doanh thu (UI Stats).
- [ ] **Hiệu quả:** (Giai đoạn sau) Theo dõi lượt view/click từ các video đã đăng.

---
*Ghi chú: [x] Đã hoàn thành | [/] Đang thực hiện | [ ] Chưa bắt đầu*
