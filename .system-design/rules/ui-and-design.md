# 🌿 Quy Chuẩn Thiết Kế Giao Diện & Trải Nghiệm (UI & Design System Rules)

> **Phiên Bản**: 3.1 (Editorial Culinary, Content-First UX & Human-Crafted Minimalist)  
> **Định Vị Thương Hiệu**: *Nền Tảng Ẩm Thực Thực Vật & Dinh Dưỡng Khoa Học Chuẩn Mực*  
> **Ngôn Ngữ Thiết Kế**: *Editorial Food Tech — Thanh Lịch, Chân Thực, Tối Giản, Không Đại Trà*  
> **Stack Công Nghệ UI**: Next.js 15, Tailwind CSS, Functional Micro-interactions, Font Be Vietnam Pro

---

## 🎨 1. Hệ Thống Design Tokens & Bảng Màu (Color Tokens)

### 1.1. Bảng Màu Thương Hiệu Chính (Core Brand Colors)

| Vai Trò | Tên Màu | Mã HEX | HSL | Mục Đích Sử Dụng |
| :--- | :--- | :--- | :--- | :--- |
| **Primary Base** | **Sage Forest** | `#1B4332` | `hsl(154, 42%, 18%)` | Tiêu đề chính, Header, Nút hành động đẳng cấp |
| **Primary Accent**| **Deep Emerald** | `#2D6A4F` | `hsl(153, 40%, 30%)` | Điểm nhấn thương hiệu, liên kết active |
| **Primary Action**| **Refined Mint** | `#059669` | `hsl(160, 90%, 31%)` | Nút đặt hàng, CTA chuyển đổi |
| **Deep Anchor** | **Obsidian Teal**| `#081C15` | `hsl(160, 56%, 6%)` | Thanh điều hướng, Thẻ tổng hợp, Footer |
| **Warm Accent** | **Warm Amber** | `#D97706` | `hsl(38, 92%, 44%)` | Chỉ số Calo, điểm xếp hạng sao |

---

### 1.2. Bảng Màu Bề Mặt (Surfaces & Backgrounds)

#### ☀️ Light Surface (Ngọc Trai Ấm & Thanh Khiết)
- **App Background**: `#FAFBF9` — Tông ngọc trai dịu nhẹ, hạn chế lóa mắt
- **Card Surface**: `#FFFFFF` — Bề mặt thẻ tinh khiết với viền mỏng tinh tế `border-slate-200/80`
- **Surface Hover**: `#F3F6F2` — Chuyển màu nhẹ nhàng khi di chuột
- **Border / Divider**: `#E5E9E2` — Đường kẻ thanh mảnh 1px
- **Text Primary**: `#0F172A` (Slate 900) — Tiêu đề sắc nét
- **Text Secondary**: `#475569` (Slate 600) — Văn bản phụ, chỉ số

#### 🌙 Dark Surface (Chuyên Sâu)
- **App Background**: `#081C15` — Nền than chì ngọc lục bảo sâu thẳm
- **Card Surface**: `#102B21` — Bề mặt nổi chống lóa
- **Text Primary**: `#F8FAFC` — Văn bản sáng rõ

---

### 1.3. Chuyển Động Điềm Tĩnh (Calm Motion)
- **Duration**: `150ms` – `200ms`
- **Easing**: `cubic-bezier(0.16, 1, 0.3, 1)`
- **Quy tắc**: Tuyệt đối không dùng hiệu ứng rung giật, nhảy múa hay phát sáng neon AI

---

## 🧭 2. Các Quy Tắc Kích Hoạt (Triggerable UI Rules)

# RULE-UI-001: Editorial Culinary Aesthetics & Anti-AI Template Layout

## Trigger
Khi thiết kế, dàn trang (layout), styling các component hoặc xây dựng trang web mới trên `@chayfood/web`.

## Rule
Tuân thủ phong cách Editorial Food Tech sang trọng, thanh lịch, tối giản và có chiều sâu thị giác. Sử dụng bố cục tạp chí ẩm thực kết hợp bảng chỉ số dinh dưỡng rõ ràng. Tuyệt đối không sử dụng phong cách template AI đại trà (không dùng hiệu ứng neon chói lọi, không dùng các khối sticker hoạt hình nổi bồng bềnh thiếu tự nhiên).

## Why
Tạo nên sự khác biệt thương hiệu cao cấp cho ChayFood, mang lại cảm giác chân thực, tin cậy về chuẩn mực y khoa và ẩm thực thực vật lành mạnh.

## Violation signal
Giao diện có màu sắc lòe loẹt, viền neon phát sáng, hoặc các khối nổi 3D hoạt hình thiếu tính thực tế.

## Preferred pattern
Sử dụng các tokens chuẩn: Sage Forest (`#1B4332`), Deep Emerald (`#2D6A4F`), Refined Mint (`#059669`), Obsidian Teal (`#081C15`), nền ngọc trai ấm (`#FAFBF9`), viền mỏng tinh tế `border-slate-200/80`.

---

# RULE-UI-002: Icon Minimalism & Functional-Only Usage

## Trigger
Khi chèn biểu tượng (icon) hoặc emoji vào giao diện người dùng.

## Rule
Chỉ sử dụng icon khi thực sự có công năng điều hướng hoặc hỗ trợ thao tác rõ ràng (`Search`, `ShoppingBag`, `Arrow`, `X`, `SlidersHorizontal`, `Check`). Tuyệt đối không gắn icon/emoji trang trí bừa bãi trước mọi tiêu đề, đề mục, nút bấm hoặc badge.

## Why
Lạm dụng icon gây rối mắt (visual clutter), làm giảm tính chuyên nghiệp và che lấp nội dung chính.

## Violation signal
Chèn icon/emoji vào đầu tất cả các tiêu đề H1-H6 hoặc trước từng nhãn nút bấm đơn giản.

## Preferred pattern
Giữ khoảng trắng (negative space) thoáng đãng, tôn vinh nghệ thuật chữ (Typography) và hình ảnh món ăn chất lượng cao.

---

# RULE-UI-003: Strict Punctuation & Zero Trailing Dots

## Trigger
Khi viết văn bản hiển thị trên giao diện người dùng cho tiêu đề, nhãn, nút bấm, badge, form label và danh sách ngắn.

## Rule
Tuyệt đối không để dấu chấm (`.`) ở cuối các thành phần sau:
- Tiêu đề chính và phụ (H1, H2, H3, H4, H5, H6)
- Slogan, Tagline, Sub-heading ngắn
- Nhãn nút bấm (Buttons, Links, CTAs)
- Thẻ huy hiệu (Badges, Pills, Tags)
- Tiêu đề form và Placeholder
- Các mục danh sách ngắn (Bullet points)

Chỉ sử dụng dấu chấm khi kết thúc câu văn hoàn chỉnh trong đoạn mô tả dài (paragraphs) có từ 2 câu trở lên.

## Why
Quy chuẩn biên tập hiện đại giúp giao diện gãy gọn, mạch lạc và chuyên nghiệp.

## Violation signal
`<h1>Thực Đơn Chay Tươi Lành.</h1>` hoặc `<button>Đặt Hàng Ngay.</button>`.

## Preferred pattern
`<h1>Thực Đơn Chay Tươi Lành</h1>` và `<button>Đặt Hàng Ngay</button>`.

---

# RULE-UI-004: Natural Vietnamese Copywriting & Zero "mọi" / Zero "100%"

## Trigger
Khi viết nội dung tiếng Việt (copywriting, placeholder, thông báo, mô tả món ăn).

## Rule
1. Nghiêm cấm dịch thô từng từ từ tiếng Anh (No robotic machine translation).
2. Tuyệt đối không sử dụng từ "mọi" và các tuyên bố tuyệt đối "100%" (Zero "mọi" & Zero "100%" Mandate). Thay thế bằng từ ngữ trung tính, chuẩn mực: "Thuần thực vật", "Minh bạch chỉ số", "Nông trại hữu cơ liên kết", "các món ăn", "từng khẩu phần", "thông tin chi tiết".
3. Câu cú chủ động, súc tích, đậm chất văn hóa ẩm thực Việt Nam ("Món chay tươi lành", "Thực đơn đổi vị mỗi ngày", "Đậm đà chuẩn vị", "Giao nóng tận nơi").

## Why
Tạo nên sự tin cậy cao, loại bỏ các khẩu hiệu sáo rỗng, tiếp cận khách hàng một cách tự nhiên và văn minh.

## Violation signal
"100% Thuần chay cho mọi người", "Mở khóa hành trình sức khỏe của bạn", "Chúng tôi cam kết 100%".

## Preferred pattern
"Ẩm thực thuần thực vật tươi ngon trong ngày", "Tối ưu cho mục tiêu dinh dưỡng khoa học".

---

# RULE-UI-005: Compact Subpage Headers & Content-First UX

## Trigger
Khi xây dựng hoặc chỉnh sửa Header/Banner các trang con (`/menu`, `/nutrition-planner`, `/subscriptions`, `/party`, `/news`, `/faqs`).

## Rule
1. Header trang con phải cực kỳ nhỏ gọn: padding `py-5` đến `py-7`, chiều cao tối đa không vượt quá 15-20% chiều cao màn hình (100px - 140px).
2. Đảm bảo người dùng nhìn thấy ngay danh sách món ăn, bộ lọc, bảng chỉ số và form tương tác ngay khi tải trang mà không cần phải cuộn màn hình (Above-the-Fold Priority).

## Why
Giúp người dùng tập trung trực tiếp vào trải nghiệm cốt lõi (chọn món, đặt hàng, tính dinh dưỡng) mà không bị che khuất bởi các banner trang trí cồng kềnh.

## Violation signal
Header trang con chiếm 40-50% chiều cao màn hình (`py-20`, `min-h-[400px]`).

## Preferred pattern
Header nhỏ gọn với tiêu đề `text-2xl sm:text-3xl font-extrabold` và nội dung danh sách món ăn nằm ngay phía dưới trong tầm mắt.
