# Chi Tiết Giao Diện & Checklist Hoàn Thiện Frontend

Tài liệu này mô tả các thành phần hiện có của giao diện Affiliate Automation và các bước cần thiết để hoàn thiện từ bản Mockup thành bản Product.

---

## 🎨 1. Các Thành Phần Hiện Có (UI Components)

### 1.1 Layout Chính
- **Sidebar:** Thanh điều hướng bên trái (fixed) chứa Logo và các menu chính.
- **Main Content:** Khu vực hiển thị nội dung thay đổi theo tab, có hiệu ứng background gradient và blur.
- **Header:** Hiển thị lời chào cá nhân hóa và thông tin User.

### 1.2 Module Tạo Video (Generator)
- **Link Input:** Ô nhập liệu lớn với hiệu ứng glow, hỗ trợ dán link URL.
- **AI Settings:** Các lựa chọn nhanh cho Giọng đọc (Voice) và Nhạc nền (BGM).
- **Action Button:** Nút kích hoạt render với hiệu ứng scale và loading spinner.

### 1.3 Module Theo Dõi (Monitoring)
- **Progress Bar:** Thanh tiến trình phần trăm.
- **Status Steps:** Các bước trạng thái (Phân tích -> Kịch bản -> Render) với icon và màu sắc thay đổi theo trạng thái (Done/Active/Pending).
- **Status Sidebar:** Danh sách rút gọn các Job đang xử lý ở cột bên phải.

---

## 🛠️ 2. Checklist Chức Năng Cần Hoàn Thiện (Next Steps)

### 🟢 Giai đoạn 1: Chuyển đổi từ Tĩnh sang Động
- [x] **Tách nhỏ Component:** Chuyển các khối code trong `page.tsx` vào thư mục `src/components/` để dễ quản lý.
- [x] **Cấu hình API Client:** Tạo thư viện `src/lib/api.ts` để quản lý các hàm gọi Axios/Fetch tới Backend .NET.
- [x] **CORS Config:** Kiểm tra và tối ưu cấu hình CORS để Frontend gọi được API Port 5000 ổn định.

### 🔵 Giai đoạn 2: Kết nối Dữ liệu (Integration)
- [x] **Submit Form:** Khi bấm "Tạo Video", dữ liệu phải được lưu vào Database SQLite qua API Backend.
- [x] **Real-time Tracking:** 
    - Viết logic gọi API `status/{id}` mỗi 3-5 giây.
    - Cập nhật giao diện khi trạng thái từ "Processing" sang "Completed".
- [x] **Video Preview:** Tích hợp trình phát video thật để xem file MP4 được lưu trong thư mục `uploads` của Backend.

### 🟠 Giai đoạn 3: UX/UI Nâng Cao
- [ ] **Toast Notifications:** Hiển thị thông báo góc màn hình khi video đã sẵn sàng.
- [ ] **Route Navigation:** Cài đặt các trang `/library`, `/products` để người dùng có thể xem lại lịch sử.
- [ ] **Responsive:** Tối ưu hóa giao diện cho thiết bị di động (Mobile Menu).

---

## 📌 Ghi chú Lập trình
- **Tech Stack:** Next.js 15, TailwindCSS, React Icons.
- **Quản lý State khuyến nghị:** Zustand (nhẹ và nhanh cho các job render).
- **Backend URL:** `http://localhost:5000`
