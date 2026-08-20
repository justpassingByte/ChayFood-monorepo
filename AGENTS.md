# 🛡️ Project Coding Guidelines & Architectural Rules

## 1. 🚫 Nghiêm Cấm Sử Dụng Type `any` và `unknown` (Strict TypeScript Mandate)
- **Tuyệt đối KHÔNG sử dụng `any` hoặc `unknown`** trong khai báo kiểu dữ liệu, tham số hàm, giá trị trả về hoặc type assertions (`as any`, `as unknown`).
- Mọi dữ liệu phải có Interface hoặc Type rõ ràng từ `@chayfood/shared-types`, `@chayfood/db` hoặc các file kiểu dữ liệu chuẩn của module.
- Xử lý lỗi trong khối `try...catch` phải dùng Type Narrowing: `if (error instanceof Error)`.

---

## 2. 🎯 Nguồn Chân Lý Duy Nhất (Single Source of Truth - SSOT)
- **Kiểu dữ liệu & Schemas**: Tất cả các Types, DTOs, Enums dùng chung giữa Backend và Frontend **PHẢI** được định nghĩa duy nhất tại `packages/shared-types` hoặc `packages/db/prisma/schema.prisma`. Tuyệt đối không sao chép (duplicate) định nghĩa type ở nhiều nơi.
- **Design Tokens & Hằng Số**: Toàn bộ màu sắc, typography, spacing, breakpoints tuân thủ duy nhất tại [.system-design/rules/ui-and-design.md](file:///c:/Users/MSI/Desktop/chayfood/.system-design/rules/ui-and-design.md) và `tailwind.config.js`.
- **API Endpoints & Service Calls**: Tập trung tại tầng Service Layer (`apps/web/app/lib/services/*` và NestJS Services), không viết lệnh `fetch`/`axios` rải rác trực tiếp trong UI components.

---

## 3. ♻️ Khả Năng Tái Sử Dụng & Nguyên Tắc DRY (Don't Repeat Yourself)
- Tách biệt rõ ràng giữa **UI Component** (Giao diện hiển thị) và **Logic / State** (Custom Hooks, Services).
- Mọi khối giao diện lặp lại từ 2 lần trở lên (như Card món ăn, Macro Badges, Search Input, Form Controls, Buttons, Dialogs) phải được trừu tượng hóa thành Reusable Component đặt trong `components/ui/` hoặc `components/shared/`.

---

## 4. 📦 Giới Hạn Dung Lượng File & Tính Module Hóa (Modular Architecture)
- **Không để 1 file quá lớn**: Khuyến nghị mỗi file không vượt quá **250 - 300 dòng code**.
- Khi một trang hoặc component phình to:
  1. Tách nhỏ thành các sub-components trong thư mục con riêng biệt (ví dụ: `app/menu/components/MenuList.tsx`, `MenuFilters.tsx`, `MacroOverview.tsx`).
  2. Tách custom hook xử lý logic / filtering (ví dụ: `useMenuFilters.ts`).
  3. Tách hằng số và types ra file riêng (`types.ts`, `constants.ts`).
- Tuân thủ **Single Responsibility Principle (SRP)**: Mỗi file chỉ chịu một trách nhiệm duy nhất.

---

## 5. ✍️ Quy Tắc Ngữ Văn: Tuyệt Đối KHÔNG Để Dấu Chấm Cuối Câu (No Trailing Dots)
- **Tuyệt đối KHÔNG để dấu chấm (`.`) ở cuối các thành phần sau**:
  - Tiêu đề chính và phụ (H1, H2, H3, H4, H5, H6)
  - Slogan, Tagline, Sub-heading ngắn
  - Nhãn nút bấm (Buttons, Links, CTAs)
  - Thẻ huy hiệu (Badges, Pills, Tags)
  - Tiêu đề form và Placeholder
  - Các mục danh sách ngắn (Bullet points)
- **Chỉ sử dụng dấu chấm** khi kết thúc câu văn hoàn chỉnh trong đoạn mô tả dài (paragraphs).

---

## 6. 🎨 Tiết Chế Icon & Tránh Bố Cục Đại Trà (Icon Minimalism & Editorial Layout)
- **Dùng ít icon lại**: Chỉ sử dụng icon khi thực sự có công năng điều hướng (Search, Cart, Arrow, Close, Filter). Không chèn emoji/icon trang trí bừa bãi trước mọi tiêu đề.
- **Tránh thiết kế kiểu template AI đại trà**: Bố cục mang phong cách Editorial Culinary sang trọng, hiện đại, có chiều sâu thị giác và tính chân thực cao.

---

## 7. 🔌 Kiến Trúc Generic & Thiết Kế Nhà Cung Cấp Linh Hoạt (Pluggable Providers via Design Patterns)
- **Áp dụng Strategy Pattern & Factory Pattern** cho tất cả các dịch vụ tích hợp bên ngoài (Payment, Auth, AI, Mailer, Storage):
  - **Payment Integration**: Định nghĩa Interface chung `IPaymentProvider` / `IPaymentStrategy` (hỗ trợ `StripePaymentProvider`, `VietQRPaymentProvider`, `VnPayPaymentProvider`, `MockPaymentProvider`). Cho phép hoán đổi liền mạch giữa môi trường phát triển (Mock/Dev) và môi trường thực (Production) chỉ qua biến môi trường hoặc Factory.
  - **Authentication Integration**: Định nghĩa `IAuthProvider` / `IAuthStrategy` (hỗ trợ `JwtAuthProvider`, `OAuthGoogleProvider`, `OAuthFacebookProvider`, `MockAuthProvider`).
  - **AI / Nutrition Engine**: Định nghĩa `INutritionEngine` (hỗ trợ `RuleBasedNutritionEngine`, `OpenAINutritionEngine`, `MockNutritionEngine`).
- **Nghiêm cấm hardcode logic của một bên thứ ba cụ thể** trực tiếp vào UI Component hoặc Business Use Case. Mọi tương tác phải đi qua lớp trừu tượng (Abstraction Layer / Interface) và Dependency Injection.

---

## 8. 🗣️ Văn Phong Tiếng Việt Bản Địa Hóa Cao Cấp & Trung Tính (Natural & Neutral Copywriting)
- **Nghiêm cấm dịch thô từng từ (No Word-by-Word / Robotic Machine Translation)**:
  - Tuyệt đối không sử dụng các câu cú dịch máy thô ráp (như *"bắt đầu hành trình của bạn"*, *"mở khóa giải pháp"*, *"chúng tôi cam kết mang lại trải nghiệm tốt nhất"*).
- **Tuyệt đối TRÁNH sử dụng từ "mọi" và các tuyên bố tuyệt đối "100%" (Zero "mọi" & Zero "100%" Mandate)**:
  - Cấm sử dụng từ *"mọi"* và các cụm từ tâng bốc *"100%"* (như *"100% Thuần chay"*, *"Minh bạch 100%"*, *"100% Hữu cơ"*, *"mọi lúc"*, *"mọi nơi"*, *"mọi nhu cầu"*, *"cho mọi người"*).
  - Luôn thay thế bằng từ ngữ trung tính, thanh lịch, chuẩn mực y khoa & ẩm thực (*"Thuần thực vật"*, *"Minh bạch chỉ số"*, *"Nông trại hữu cơ liên kết"*, *"từng khẩu phần"*, *"các món ăn"*, *"thông tin giải đáp"*).
- **Văn phong thuần Việt, tinh tế, giàu tính ẩm thực & dinh dưỡng**:
  - Dùng từ ngữ tự nhiên, chuẩn xác, gần gũi với đời sống và văn hóa ẩm thực Việt Nam (Ví dụ: *"Món chay tươi lành"*, *"Thực đơn đổi vị mỗi ngày"*, *"Đậm đà chuẩn vị"*, *"Thanh nhiệt dưỡng nhan"*, *"Giao nóng tận nơi"*, *"Khẩu phần cân đối"*).
- **Câu cú chủ động, súc tích, gãy gọn**:
  - Tránh các cấu trúc câu bị động lủng củng (*"được chế biến bởi"*, *"được thiết kế để"* ➔ đổi thành *"Đầu bếp chế biến tươi trong ngày"*, *"Tối ưu cho mục tiêu..."*).

---

---

## 10. 🏛️ Hệ Thống Quy Tắc Thiết Kế Hệ Thống (System Design Rules)
- Trước khi triển khai hoặc chỉnh sửa bất kỳ tính năng nào, Agent **bắt buộc tra cứu Ma Trận Kích Hoạt (Trigger Matrix)** tại [SYSTEM_DESIGN.md](file:///c:/Users/MSI/Desktop/chayfood/SYSTEM_DESIGN.md).
- Tuân thủ nghiêm ngặt các quy tắc thiết kế kiến trúc, an ninh, tính nhất quán và xử lý đồng thời tại thư mục [.system-design/rules/](file:///c:/Users/MSI/Desktop/chayfood/.system-design/rules/).
- Tham khảo báo cáo kiểm toán thực tế tại [.system-design/audits/initial_audit.md](file:///c:/Users/MSI/Desktop/chayfood/.system-design/audits/initial_audit.md).

