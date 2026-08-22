# 🏛️ Hệ Thống Quy Tắc Thiết Kế Hệ Thống ChayFood (System Design Rule System)

> **Tài liệu tham chiếu chuẩn mực kiến trúc & an ninh dự án ChayFood**  
> Dành cho các AI Coding Agents và Kỹ sư phần mềm khi triển khai hoặc chỉnh sửa tính năng trên toàn bộ Monorepo.

---

## 1. Giới Thiệu & Mục Đích (Introduction)

Hệ thống **System Design Rules** này không phải là một cuốn sách giáo khoa lý thuyết chung chung. Đây là tập hợp các **quy tắc hành động nhỏ gọn, có ngữ cảnh kích hoạt (Context-Triggered)**, được đúc kết trực tiếp từ đợt kiểm toán toàn diện mã nguồn ChayFood, nhằm triệt tiêu các lỗi phổ biến về:
- Tính nhất quán dữ liệu (Data Consistency)
- Lỗi tranh chấp đồng thời (Concurrency & Race Conditions)
- Lỗ hổng phân quyền & kiểm soát truy cập (Authorization & BOLA/IDOR)
- Bảo mật xác thực & an toàn thông tin (Authentication & PII Protection)
- Bất đồng bộ định dạng giữa các tầng (SSOT Divergence)

---

## 2. Bảng Ma Trận Kích Hoạt Quy Tắc (Trigger Matrix)

Trước khi thực hiện bất kỳ nhiệm vụ nào, Agent **bắt buộc tra cứu bảng ma trận sau** để xác định danh sách quy tắc cần kích hoạt:

| Ngữ cảnh triển khai (Context) | Quy tắc bắt buộc kích hoạt | Tệp tin quy tắc chi tiết |
| :--- | :--- | :--- |
| **Giao diện, Styling, Bố cục UI** | `RULE-UI-001`, `RULE-UI-002`, `RULE-UI-005` | [.system-design/rules/ui-and-design.md](file:///c:/Users/MSI/Desktop/chayfood/.system-design/rules/ui-and-design.md) |
| **Ngữ văn, Tiêu đề, Dấu câu tiếng Việt**| `RULE-UI-003`, `RULE-UI-004` (Zero "mọi" & No Dot) | [.system-design/rules/ui-and-design.md](file:///c:/Users/MSI/Desktop/chayfood/.system-design/rules/ui-and-design.md) |
| **Khai báo Type, Refactor, Dung lượng file**| `RULE-CODE-001`, `RULE-CODE-002`, `RULE-CODE-003` | [.system-design/rules/code-standards.md](file:///c:/Users/MSI/Desktop/chayfood/.system-design/rules/code-standards.md) |
| **Ghi nhiều bản ghi DB cùng lúc** | `RULE-DATA-001`, `RULE-DATA-002` | [.system-design/rules/data-consistency.md](file:///c:/Users/MSI/Desktop/chayfood/.system-design/rules/data-consistency.md) |
| **Đột biến số dư & Tài nguyên hữu hạn** | `RULE-CONC-001`, `RULE-DATA-003` | [.system-design/rules/concurrency.md](file:///c:/Users/MSI/Desktop/chayfood/.system-design/rules/concurrency.md) |
| **Chuyển đổi vòng đời máy trạng thái (State Machine)** | `RULE-CONC-002`, `RULE-CONC-003`, `RULE-SEC-002` | [.system-design/rules/concurrency.md](file:///c:/Users/MSI/Desktop/chayfood/.system-design/rules/concurrency.md) |
| **Truy vấn tài nguyên theo ID từ Client** | `RULE-AUTHZ-001` (BOLA/IDOR Check) | [.system-design/rules/authorization.md](file:///c:/Users/MSI/Desktop/chayfood/.system-design/rules/authorization.md) |
| **Dữ liệu nội bộ, Báo cáo & Tài chính nhạy cảm** | `RULE-AUTHZ-002` (Default-Deny Guards) | [.system-design/rules/authorization.md](file:///c:/Users/MSI/Desktop/chayfood/.system-design/rules/authorization.md) |
| **Xác thực, JWT, Cookie, Phiên làm việc** | `RULE-AUTH-001`, `RULE-AUTH-002`, `RULE-AUTH-003` | [.system-design/rules/authentication.md](file:///c:/Users/MSI/Desktop/chayfood/.system-design/rules/authentication.md) |
| **Tích hợp dịch vụ bên thứ ba (Providers)**| `RULE-INT-001`, `RULE-INT-002` | [.system-design/rules/integrations.md](file:///c:/Users/MSI/Desktop/chayfood/.system-design/rules/integrations.md) |
| **Định nghĩa Type, Hợp đồng DTOs, API Call** | `RULE-API-001`, `RULE-API-002`, `RULE-API-003` | [.system-design/rules/api.md](file:///c:/Users/MSI/Desktop/chayfood/.system-design/rules/api.md) |
| **Thêm bảng, quan hệ, chỉ mục cơ sở dữ liệu** | `RULE-DB-001`, `RULE-DB-002`, `RULE-DB-003` | [.system-design/rules/database.md](file:///c:/Users/MSI/Desktop/chayfood/.system-design/rules/database.md) |
| **Lưu đệm dữ liệu (Cache-Aside & Invalidation)** | `RULE-CACHE-001`, `RULE-CACHE-002` | [.system-design/rules/caching.md](file:///c:/Users/MSI/Desktop/chayfood/.system-design/rules/caching.md) |
| **Kiểm thử thuật toán nghiệp vụ lõi (Domain Testing)** | `RULE-TEST-001`, `RULE-TEST-002`, `RULE-TEST-003` | [.system-design/rules/testing-and-cicd.md](file:///c:/Users/MSI/Desktop/chayfood/.system-design/rules/testing-and-cicd.md) |
| **Đường ống CI/CD, PR & Quality Gate** | `RULE-CICD-001`, `RULE-CICD-002` | [.system-design/rules/testing-and-cicd.md](file:///c:/Users/MSI/Desktop/chayfood/.system-design/rules/testing-and-cicd.md) |
| **Nhánh Git, Commit, PR & Code Review** | `RULE-GIT-001`, `RULE-GIT-002`, `RULE-GIT-003`, `RULE-GIT-004`, `RULE-GIT-005` | [.system-design/rules/git-and-code-review.md](file:///c:/Users/MSI/Desktop/chayfood/.system-design/rules/git-and-code-review.md) |
| **Ghi Log, Bắt lỗi Try/Catch & Tracing** | `RULE-SEC-001`, `RULE-OBS-001`, `RULE-OBS-003` | [.system-design/rules/observability.md](file:///c:/Users/MSI/Desktop/chayfood/.system-design/rules/observability.md) |

---

## 3. Quy Tắc Lựa Chọn Mẫu Thiết Kế (Pattern Selection Rules)

Không áp dụng tràn lan các mẫu thiết kế phức tạp khi không có nhu cầu thực tế. Hãy tuân thủ hướng dẫn sau:

- **Sử dụng Strategy & Factory Pattern**: Khi hành vi nghiệp vụ phụ thuộc vào nhà cung cấp bên ngoài (ví dụ: Thanh toán qua Stripe/VietQR/VNPay/Mock, Xác thực qua Google/Facebook/Password). Trừu tượng hóa qua Interface chung.
- **Sử dụng State Machine Pattern**: Khi một thực thể có vòng đời chuyển đổi trạng thái nghiêm ngặt (như Đơn hàng: `PENDING` -> `CONFIRMED` -> `PREPARING` -> `DELIVERING` -> `DELIVERED`). Luôn kiểm tra trạng thái nguồn trong câu lệnh `where` khi cập nhật.
- **Sử dụng Transaction / Unit of Work**: Khi một thao tác nghiệp vụ tác động lên từ 2 bảng trở lên và yêu cầu tính nguyên tử (Atomicity). Không đặt lệnh gọi mạng ngoại vi vào trong transaction.
- **Sử dụng Atomic Decrement / Row Lock**: Khi cập nhật số lượng tồn kho hoặc tài nguyên hữu hạn để chống Lost Update.
- **Sử dụng Outbox Pattern**: Khi thao tác ghi cơ sở dữ liệu bắt buộc phải phát ra sự kiện bất đồng bộ mà không được phép thất lạc.
- **KHÔNG sử dụng Generic Repository rập khuôn**: Khi Prisma Service đã cung cấp đầy đủ Type-safe Query Client; không tạo các lớp Repository vô nghĩa chỉ để bọc lại một dòng lệnh của Prisma.

---

## 4. Quy Trình Làm Việc Chuẩn Cho AI Coding Agent (Agent Workflow)

Khi nhận một yêu cầu phát triển hoặc sửa lỗi, Agent thực hiện theo quy trình 8 bước:

```text
1. Phân tích yêu cầu (Understand Task)
       ↓
2. Xác định ngữ cảnh kiến trúc bị ảnh hưởng
       ↓
3. Tra cứu Trigger Matrix và đọc các SYSTEM_DESIGN Rules liên quan
       ↓
4. Kiểm tra các Invariants (Tính bất biến) của nghiệp vụ
       ↓
5. Thực hiện chỉnh sửa mã nguồn
       ↓
6. Chạy kiểm tra & Review đối chiếu với các Rules đã kích hoạt
       ↓
7. Đảm bảo tuân thủ Strict TypeScript & Quy tắc ngữ văn không dấu chấm cuối
       ↓
8. Cập nhật thêm Rule mới nếu phát hiện dạng lỗi mới chưa được ghi nhận
```

---

## 5. Danh Mục Các Tệp Tin Quy Tắc Chi Tiết

- [ui-and-design.md](file:///c:/Users/MSI/Desktop/chayfood/.system-design/rules/ui-and-design.md): Phong cách Editorial Food Tech, icon tối giản, không dấu chấm cuối câu, văn phong thuần Việt trung tính (Zero "mọi" & Zero "100%"), header trang con nhỏ gọn
- [code-standards.md](file:///c:/Users/MSI/Desktop/chayfood/.system-design/rules/code-standards.md): Nghiêm cấm type `any`/`unknown`, giới hạn dung lượng file <= 250-300 dòng, phân tách UI và State (DRY)
- [data-consistency.md](file:///c:/Users/MSI/Desktop/chayfood/.system-design/rules/data-consistency.md): Tính nguyên tử của giao dịch, giới hạn ranh giới mạng, kiểm soát bất biến số lượng không âm
- [concurrency.md](file:///c:/Users/MSI/Desktop/chayfood/.system-design/rules/concurrency.md): Trừ kho nguyên tử, chống Check-Then-Act race condition, chuyển đổi trạng thái lũy thừa, chống double-click
- [authentication.md](file:///c:/Users/MSI/Desktop/chayfood/.system-design/rules/authentication.md): Cô lập Secret, kiểm soát phiên đăng nhập theo DB, thiết lập an toàn Cookie
- [authorization.md](file:///c:/Users/MSI/Desktop/chayfood/.system-design/rules/authorization.md): Chống BOLA/IDOR trên tài nguyên cá nhân, bảo vệ mặc định endpoint kho/tài chính, xác thực quyền phía máy chủ
- [security.md](file:///c:/Users/MSI/Desktop/chayfood/.system-design/rules/security.md): Loại bỏ thông tin nhạy cảm trong Log, máy chủ tính toán giá độc quyền, kiểm soát DTO Whitelist
- [database.md](file:///c:/Users/MSI/Desktop/chayfood/.system-design/rules/database.md): Chỉ mục khóa ngoại và bộ lọc tần suất cao, ràng buộc Unique bảng liên kết, phân trang an toàn
- [api.md](file:///c:/Users/MSI/Desktop/chayfood/.system-design/rules/api.md): Nguồn chân lý duy nhất (SSOT) cho kiểu dữ liệu, cấm che giấu lỗi bằng dữ liệu giả lập, chuẩn hóa danh xưng RESTful
- [integrations.md](file:///c:/Users/MSI/Desktop/chayfood/.system-design/rules/integrations.md): Trừu tượng hóa nhà cung cấp linh hoạt, kiểm tra chữ ký và chống trùng lặp Webhook
- [caching.md](file:///c:/Users/MSI/Desktop/chayfood/.system-design/rules/caching.md): Xóa đệm ngay khi đột biến dữ liệu, cấm cache phân quyền dùng chung
- [distributed-systems.md](file:///c:/Users/MSI/Desktop/chayfood/.system-design/rules/distributed-systems.md): Mẫu Transactional Outbox, Consumer lũy thừa chống trùng lặp
- [observability.md](file:///c:/Users/MSI/Desktop/chayfood/.system-design/rules/observability.md): Log có cấu trúc kèm Request ID, nhật ký kiểm toán cho thao tác đặc quyền, xử lý lỗi an toàn kiểu dữ liệu
- [testing-and-cicd.md](file:///c:/Users/MSI/Desktop/chayfood/.system-design/rules/testing-and-cicd.md): Kiểm thử tự động 4 lõi nghiệp vụ, mock độc lập siêu tốc (<10s), kiểm tra schema/seed và đường ống CI/CD 4 chặng chất lượng cao
- [git-and-code-review.md](file:///c:/Users/MSI/Desktop/chayfood/.system-design/rules/git-and-code-review.md): Quy chuẩn đặt tên nhánh Conventional, commit nguyên tử, PR Template kèm checklist System Design và giao thức phản hồi review minh bạch

---

## 6. 🚀 Tái Sử Dụng & Cá Nhân Hóa Cho Dự Án Khác (Portability & Adaptation)

Nếu bạn muốn mang bộ khung quy tắc này sang một repository phần mềm mới:
- Đọc tài liệu hướng dẫn tại **[.system-design/ADAPTATION_GUIDE.md](file:///c:/Users/MSI/Desktop/chayfood/.system-design/ADAPTATION_GUIDE.md)**
- Sao chép prompt **1-Click Master Meta-Prompt** trong tài liệu hướng dẫn gửi cho AI Agent để tự động quét Stack, kiểm toán rủi ro và chuyển đổi toàn bộ mẫu code minh họa sang công nghệ của dự án mới

---

## 7. Báo Cáo Kiểm Toán Toàn Diện (Audit Report Reference)

Chi tiết đầy đủ về các phát hiện thực tế trên mã nguồn, mức độ nghiêm trọng, nguyên nhân gốc rễ và vị trí tệp tin được lưu trữ tại:
👉 [initial_audit.md](file:///c:/Users/MSI/Desktop/chayfood/.system-design/audits/initial_audit.md)
