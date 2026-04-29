# Kế Hoạch Triển Khai (Implementation Plan)

Xây dựng và phát triển hệ thống **Affiliate Automation Suite** theo mô hình kiến trúc đa ngôn ngữ (Polyglot Microservices), bao gồm Frontend (Next.js), Backend API (.NET 8), và Worker xử lý ngầm (Python). Hệ thống hướng tới tự động hóa toàn bộ quy trình: lấy thông tin sản phẩm, sinh nội dung/kịch bản bằng AI, render video bằng FFmpeg, và tự động đăng lên mạng xã hội.

---

## Các Giai Đoạn Triển Khai (Phased Approach)

### Phase 1: MVP & Nền Tảng Cơ Sở (Ước tính: 2 - 4 tuần)
**Mục tiêu:** Chạy thành công luồng cốt lõi nhất từ khi nhập thông tin đến khi render xong video. Chưa bao gồm Auto-posting.

#### 1. Thiết Lập Hạ Tầng (Mock-First với Dependency Injection)
- Khởi tạo 3 dự án độc lập: Frontend (Next.js), Backend (.NET), Worker (Python).
- Khởi tạo các Interface cốt lõi (`IStorageService`, `IQueueService`, `ICacheService`) để áp dụng Dependency Injection.
- Thiết lập môi trường Local: Sử dụng In-Memory Queue (BackgroundService), In-Memory Cache và thư mục lưu trữ cục bộ (Local Storage). Tạm thời **không cần** cài đặt Docker, RabbitMQ, Redis hay S3 ở giai đoạn này.

#### 2. Xây Dựng Backend (.NET 8 API)
- Thiết lập project với Entity Framework Core.
- Khởi tạo Database Schema: Bảng `Users`, `Products`, `VideoJobs`.
- Xây dựng API Authentication (JWT cơ bản).
- Xây dựng API `POST /api/videos/generate`: Tiếp nhận thông tin sản phẩm và **đẩy Job vào In-Memory Queue** (thông qua `IQueueService`).

#### 3. Xây Dựng Worker (Python)
- Viết script Python giao tiếp ngầm (như một Local Worker) nhận Job thay vì kết nối RabbitMQ trực tiếp.
- Tích hợp OpenAI/Anthropic API để tự động sinh kịch bản (Hook, Body, CTA) từ thông tin sản phẩm.
- Tích hợp `MoviePy / FFmpeg` để render ra 1 video template tĩnh (gồm ảnh sản phẩm chạy slide + âm thanh/nhạc nền cơ bản).
- Lưu video trực tiếp vào thư mục tĩnh của máy chủ (`/uploads`) và gọi webhook/API báo kết quả lại cho .NET Backend (qua `IStorageService`).

#### 4. Xây Dựng Frontend (Next.js)
- Thiết kế UI Dashboard bằng TailwindCSS & Shadcn UI.
- Xây dựng Form nhập liệu (Dán link sản phẩm hoặc nhập file CSV).
- Xây dựng bảng theo dõi danh sách Video (Hiển thị trạng thái *Pending*, *Processing*, *Completed*).

---

### Phase 2: Nâng Cấp AI & Auto-posting (Ước tính: 1.5 - 2 tháng)
**Mục tiêu:** Tự động hóa khâu phân phối nội dung và hoàn thiện chất lượng video.

#### 1. Auto-posting Engine (Python)
- Bổ sung Worker mới sử dụng **Playwright** để tự động đăng nhập và đăng video lên các nền tảng mạng xã hội ưu tiên (TikTok, Shopee Video, FB Reels).
- Xử lý bài toán lưu giữ session/cookie trình duyệt để tránh bị checkpoint.

#### 2. Nâng Cấp Chất Lượng Video
- Tích hợp API **Text-to-Speech** (ví dụ: Edge-TTS miễn phí hoặc ElevenLabs) để có giọng đọc AI tự động.
- Tự động tạo và chèn Phụ đề (Subtitles) khớp với giọng đọc.

#### 3. Affiliate Link Engine (.NET 8)
- Module Rút gọn link (URL Shortener).
- Tự động tạo mã tracking UTM cho mỗi chiến dịch.
- Cung cấp API danh sách link để chèn vào phần caption khi Worker thực hiện Auto-post.

#### 4. Frontend - Lập Lịch
- Thêm giao diện Lịch (Calendar) để user hẹn giờ đăng bài.
- Bổ sung tính năng Quản lý các tài khoản Mạng xã hội.

---

### Phase 3: Hoàn Thiện & Đóng Gói SaaS (Ước tính: 1 tháng)
**Mục tiêu:** Thương mại hóa sản phẩm, mở bán cho người dùng.

#### 1. Quản Lý Gói Cước (Billing & Subscription)
- Backend: Logic phân quyền User (Free, Pro, Agency), giới hạn số lượng video sinh ra mỗi tháng.
- Frontend: Xây dựng trang Bảng giá (Pricing) và tích hợp cổng thanh toán (VNPay / Stripe).

#### 2. Analytics & Thống Kê
- Xây dựng biểu đồ theo dõi hiệu quả: Lượt tạo video, lượt đăng bài thành công, lượt click link affiliate.

#### 3. Tối Ưu Hạ Tầng & Khả Năng Mở Rộng
- Tối ưu Worker: Scale nhiều container Python Worker chạy song song trên nhiều máy chủ để đáp ứng lượng request lớn.
- Bổ sung cơ chế dọn dẹp file rác định kỳ trên máy chủ Worker.

---

## Kế Hoạch Kiểm Tra & Đảm Bảo Chất Lượng (QA)

- **Automated Tests:** 
  - Viết Unit Test cho core logic tính toán gói cước (.NET).
  - Mock API của OpenAI để đảm bảo Worker Python không bị crash khi API lỗi.
- **Manual End-to-End Test:** 
  - Thử nghiệm đăng ký -> Chọn sản phẩm -> Lệnh render -> Theo dõi Console Log của In-Memory Queue -> Xem video trả về qua link tĩnh (Localhost).
- **Stress Test:** Giả lập request tạo video liên tục để xem In-Memory Queue xử lý tuần tự có làm treo Web API không.
