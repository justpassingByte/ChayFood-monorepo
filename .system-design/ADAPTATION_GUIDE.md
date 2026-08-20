# 🧭 Hướng Dẫn Cá Nhân Hóa Hệ Thống Quy Tắc Thiết Kế (System Design Adaptation Guide)

> **Mục Đích**: Hướng dẫn kỹ sư và AI Coding Agent cách tiếp nhận bộ khung quy tắc mẫu (Generic System Design Rule Starter Kit) và tự động cá nhân hóa toàn diện theo công nghệ, cấu trúc thực thể, quy trình GitHub và nghiệp vụ đặc thù của bất kỳ dự án phần mềm mới nào.

---

## ⚡ 1. Master Meta-Prompt: Cá Nhân Hóa 1 Lần Nhấn (1-Click Adaptation Prompt)

Khi bạn sao chép hai thư mục `.system-design/`, `.github/` và `.agents/` cùng tệp `SYSTEM_DESIGN.md`, `AGENTS.md` sang một repository mới, hãy gửi toàn bộ nội dung prompt dưới đây cho AI Coding Agent (Antigravity, Claude, Gemini, Cursor) trong phiên làm việc đầu tiên:

```markdown
# MISSION: ADAPT & PERSONALIZE SYSTEM DESIGN RULE SYSTEM FOR THIS REPOSITORY

Bạn là chuyên gia Kiến Trúc Phần Mềm (Principal Software Architect) và Chuyên Gia Bảo Mật (Security Code Reviewer).

Repository này vừa được tích hợp bộ khung "System Design Rule System" từ thư mục `.system-design/`, `.github/` và `SYSTEM_DESIGN.md`. Nhiệm vụ của bạn là thực hiện quy trình cá nhân hóa toàn diện qua 6 giai đoạn sau:

---

### GIAI ĐOẠN 1: KHÁM PHÁ CÔNG NGHỆ & NGHIỆP VỤ (STACK & DOMAIN DISCOVERY)
1. Quét toàn bộ mã nguồn để nhận diện chính xác:
   - **Ngôn ngữ & Runtime**: (Ví dụ: TypeScript/Node.js, Python 3.12, Go 1.22, C#/.NET 8, Java/Kotlin)
   - **Tầng Backend & Web Framework**: (Ví dụ: NestJS, Express, Fastify, FastAPI, Gin, Spring Boot)
   - **Tầng Cơ Sở Dữ Liệu & ORM/Query Builder**: (Ví dụ: PostgreSQL + Prisma/Drizzle/TypeORM, MySQL + SQLAlchemy, MongoDB + Mongoose)
   - **Tầng Frontend & Styling**: (Ví dụ: Next.js App Router + Tailwind CSS, React + Vite + Vanilla CSS, Vue/Nuxt)
   - **Danh Mục Thực Thể Nghiệp Vụ Cốt Lõi (Core Domain Entities)**: Liệt kê các bảng/models chính, các dịch vụ tài chính, các trạng thái máy trạng thái (State Machines), và các tài nguyên hữu hạn cần bảo vệ số dư.

---

### GIAI ĐOẠN 2: KIỂM TOÁN KIẾN TRÚC & AN NINH THỰC TẾ (CODEBASE AUDIT)
1. Rà soát toàn bộ codebase để phát hiện ít nhất 5-10 rủi ro thực tế thuộc các nhóm:
   - **BOLA / IDOR**: Endpoint nhận ID mà thiếu kiểm tra quyền sở hữu của Principal
   - **Concurrency / Race Conditions**: Read-Modify-Write trên số dư, thiếu cập nhật nguyên tử hoặc khóa dòng
   - **Data Consistency**: Ghi nhiều bảng không qua Transaction hoặc gọi mạng bên trong Transaction
   - **Security / PII**: Ghi log chứa mật khẩu/token, tin tưởng giá tiền từ client, thiếu DTO whitelist
   - **Performance**: Thiếu DB Index trên Foreign Keys, truy vấn không phân trang an toàn
2. Ghi đè kết quả phân tích chi tiết vào `.system-design/audits/initial_audit.md` theo cấu trúc: ID rủi ro, Mức độ nghiêm trọng, Vị trí code thực tế, Bản chất lỗi và Quy tắc khắc phục.

---

### GIAI ĐOẠN 3: CÁ NHÂN HÓA QUY TẮC & MẪU CODE MINH HỌA (RULE ADAPTATION)
1. Cập nhật các ví dụ code minh họa (`Preferred pattern`) trong toàn bộ các tệp tại `.system-design/rules/*.md` sang đúng cú pháp, tên hàm và thư viện ORM/Framework thực tế của dự án này.
2. Tùy biến tệp `.system-design/rules/ui-and-design.md`:
   - Thay thế bảng màu (Brand Color Tokens), Typography và quy chuẩn giao diện theo đúng ngôn ngữ thiết kế của dự án.
3. Cập nhật bảng Ma Trận Kích Hoạt (Trigger Matrix) trong `SYSTEM_DESIGN.md` và `.agents/rules/system-design-dispatcher.md` với đúng tên Controller, Service và Thực thể của dự án mới.

---

### GIAI ĐOẠN 4: CÁ NHÂN HÓA QUY TRÌNH GITHUB & CI/CD (GOVERNANCE ADAPTATION)
1. Cập nhật `.github/pull_request_template.md`: Thay thế danh mục module (`<package-or-module>`) bằng cấu trúc thư mục thực tế của dự án.
2. Cập nhật `.github/workflows/ci.yml`: Đồng bộ phiên bản Node/Python/Go, package manager (pnpm/npm/yarn/poetry), các lệnh kiểm thử `type-check`, `test`, `build` và cấu hình service database.
3. Cập nhật quy chuẩn đặt tên nhánh và commit trong `.system-design/rules/git-and-code-review.md` khớp với chính sách Git của dự án.

---

### GIAI ĐOẠN 5: MỞ RỘNG QUY TẮC NGHIỆP VỤ ĐẶC THÙ (DOMAIN INVARIANT EXTENSION)
1. Nếu dự án có các yêu cầu nghiệp vụ chuyên sâu (ví dụ: Sổ cái kép Fintech - Double-entry Ledger, Tuân thủ y tế HIPAA/HL7, Giới hạn tần suất Flash Sale, Multi-tenancy Isolation), hãy tự động tạo thêm tệp quy tắc tương ứng tại `.system-design/rules/<domain-rule>.md` theo cấu trúc 5 phần chuẩn:
   - `# RULE-<CATEGORY>-XXX: <Tên Nguyên Lý>`
   - `## Trigger`
   - `## Rule`
   - `## Why`
   - `## Violation signal`
   - `## Preferred pattern`
2. Bổ sung quy tắc mới vào Ma trận kích hoạt của `SYSTEM_DESIGN.md`.

---

### GIAI ĐOẠN 6: KIỂM ĐỊNH TÍNH TOÀN VẸN & BÁO CÁO (VALIDATION)
1. Chạy lệnh kiểm tra kiểu dữ liệu (type-check / linter / compiler) của dự án để đảm bảo không có lỗi biên dịch.
2. Cập nhật `AGENTS.md` ở thư mục gốc để đóng vai trò là bản quy chuẩn cốt lõi điều hướng vào `SYSTEM_DESIGN.md`.
3. Xuất bảng tóm tắt kết quả cá nhân hóa cho lập trình viên.
```

---

## 🛠️ 2. Hướng Dẫn Chi Tiết Từng Bước Cá Nhân Hóa (Step-by-Step Breakdown)

### Bước 1: Khám Phá Cấu Trúc Ngăn Xếp Công Nghệ (Tech Stack Discovery)
Agent sẽ đọc các tệp cấu hình cốt lõi:
- `package.json`, `pnpm-workspace.yaml`, `turbo.json` (Hệ sinh thái Node/TypeScript)
- `pyproject.toml`, `requirements.txt` (Hệ sinh thái Python)
- `go.mod` (Hệ sinh thái Go)
- `schema.prisma`, `drizzle.config.ts`, `ormconfig.json`, `models.py` (Lược đồ cơ sở dữ liệu)

### Bước 2: Chuyển Đổi Mẫu Code Minh Họa (Translating Code Patterns)
Các nguyên lý kiến trúc là bất biến, nhưng cú pháp minh họa cần được chuyển ngữ phù hợp:

| Nguyên Lý Kiến Trúc | Mẫu TypeScript / Prisma | Mẫu Python / SQLAlchemy | Mẫu Go / GORM |
| :--- | :--- | :--- | :--- |
| **Atomic Decrement** | `updateMany({ where: { balance: { gte: x } }, data: { balance: { decrement: x } } })` | `update(Account).where(Account.balance >= x).values(balance=Account.balance - x)` | `db.Model(&Account{}).Where("balance >= ?", x).Update("balance", gorm.Expr("balance - ?", x))` |
| **State Machine Guard** | `updateMany({ where: { id, status: 'PENDING' }, data: { status: 'PAID' } })` | `update(Order).where(Order.id == id, Order.status == 'PENDING').values(status='PAID')` | `db.Model(&Order{}).Where("id = ? AND status = ?", id, "PENDING").Update("status", "PAID")` |
| **Unit of Work** | `prisma.$transaction(async (tx) => { ... })` | `with session.begin(): ...` | `db.Transaction(func(tx *gorm.DB) error { ... })` |
| **Resource Ownership** | `if (item.userId !== user.id && user.role !== 'ADMIN') throw ForbiddenException()` | `if item.user_id != user.id and not user.is_admin: raise HTTPException(403)` | `if item.UserID != user.ID && !user.IsAdmin { return ErrForbidden }` |

---

### Bước 3: Tinh Chỉnh Quy Chuẩn Giao Diện (`ui-and-design.md`)
1. Cập nhật bảng Design Tokens (Màu chủ đạo `Primary`, Điểm nhấn `Accent`, Màu hành động `Action`, Bề mặt `Surface Light/Dark`).
2. Cập nhật Typography (Font gia đình, Cỡ chữ, Chiều cao dòng).
3. Thiết lập các quy tắc dấu câu và văn phong đặc thù của thương hiệu mới.

---

### Bước 4: Tinh Chỉnh Quy Chuẩn GitHub Governance (`.github/`)
1. **Pull Request Template** (`.github/pull_request_template.md`): Tùy biến các đầu mục module và tiêu chí checklist phù hợp với cấu trúc phân lớp của dự án.
2. **CI Pipeline** (`.github/workflows/ci.yml`): Thiết lập 4 chặng kiểm định phù hợp với bộ công cụ CI của dự án.
3. **Quy Chuẩn Nhánh & Commit** (`git-and-code-review.md`): Khai báo các tiền tố nhánh (`feat/`, `fix/`, `refactor/`) và phạm vi scope hợp lệ.

---

### Bước 5: Mở Rộng Quy Tắc Nghiệp Vụ Chuyên Biệt (Domain Extensions)
Khi tạo quy tắc mới trong `.system-design/rules/`, luôn tuân thủ cấu trúc chuẩn 5 phần:

```markdown
# RULE-<PREFIX>-001: <Tên Nguyên Lý Ngắn Gọn>

## Trigger
Ngữ cảnh kích hoạt cụ thể khi thao tác trên mã nguồn

## Rule
Yêu cầu kiến trúc hoặc ràng buộc bất biến bắt buộc phải thực hiện

## Why
Giải thích nguy cơ hệ thống hoặc rủi ro vận hành nếu vi phạm

## Violation signal
Dấu hiệu code có mùi (code smell) hoặc đoạn code vi phạm cụ thể khi review

## Preferred pattern
Mẫu code triển khai chuẩn mực bằng ngôn ngữ/framework của dự án
```

---

## 📋 3. Bảng Kiểm Tra Sau Cá Nhân Hóa (Post-Adaptation Checklist)

Trước khi bắt đầu chu kỳ lập trình tính năng mới, hãy xác nhận danh sách sau:
- [ ] Báo cáo kiểm toán `.system-design/audits/initial_audit.md` đã phản ánh đúng codebase mới
- [ ] Bảng Ma Trận Kích Hoạt `SYSTEM_DESIGN.md` đã liên kết đúng tên Service và Controller của dự án
- [ ] Bảng màu và Design Tokens trong `ui-and-design.md` đã đồng bộ với giao diện thương hiệu
- [ ] Tệp `.github/pull_request_template.md` và `.github/workflows/ci.yml` đã được cá nhân hóa
- [ ] Toàn bộ ví dụ code trong các tệp quy tắc đã sử dụng đúng cú pháp của Stack công nghệ mới
- [ ] Lệnh kiểm tra kiểu dữ liệu (`pnpm type-check`, `mypy`, `go vet`) hoàn tất với 0 lỗi
- [ ] Tệp chỉ thị `.agents/rules/system-design-dispatcher.md` đã được nạp vào cấu hình IDE của Agent
