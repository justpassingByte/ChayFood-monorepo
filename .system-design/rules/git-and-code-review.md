# Quy Tắc Quản Trị Git & Đánh Giá Mã Nguồn (Git & Code Review Rules)

# RULE-GIT-001: Conventional Branch Naming Standards

## Trigger
Khi khởi tạo một nhánh Git mới (Git Branch) để phát triển tính năng, sửa lỗi hoặc tái cấu trúc mã nguồn.

## Rule
Tên nhánh bắt buộc phải tuân theo cấu trúc chuẩn Conventional Branching: `<type>/<scope>-<short-description>` viết thường toàn bộ (lowercase), phân cách bởi dấu gạch ngang (`-`):
- `feat/<scope>-<description>`: Tính năng mới (ví dụ: `feat/nutrition-family-planner`, `feat/menu-macro-filters`)
- `fix/<scope>-<description>`: Sửa lỗi (ví dụ: `fix/orders-bola-idor`, `fix/inventory-lost-update`)
- `refactor/<scope>-<description>`: Tái cấu trúc code không đổi hành vi (ví dụ: `refactor/shared-types-ssot`)
- `test/<scope>-<description>`: Thêm hoặc cập nhật test suites (ví dụ: `test/recipes-costing-specs`)
- `chore/<scope>-<description>`: Cập nhật dependency, CI/CD, cấu hình (ví dụ: `chore/github-actions-ci`)

Tuyệt đối không đặt tên nhánh tự do (ví dụ: `test1`, `fix-bug`, `nam-branch`).

## Why
Giúp đội ngũ kỹ thuật và các công cụ CI/CD tự động phân loại phạm vi ảnh hưởng của nhánh, dễ dàng truy vết lịch sử phát triển và kích hoạt đúng pipeline kiểm thử tương ứng.

## Violation signal
Tên nhánh không có tiền tố `<type>/` hoặc chứa ký tự hoa, dấu gạch dưới `_`, dấu cách.

## Preferred pattern
```bash
git checkout -b feat/checkout-idempotency-key
git checkout -b fix/api-client-sensitive-log-leak
```

---

# RULE-GIT-002: Semantic & Atomic Commit Messages

## Trigger
Khi ghi nhận một commit mới vào lịch sử Git (`git commit`).

## Rule
1. Tuân thủ định dạng Conventional Commits: `<type>(<scope>): <imperative summary>`
2. **Tính nguyên tử (Atomic Commit)**: Mỗi commit chỉ thực hiện một thay đổi logic duy nhất có thể chạy và kiểm tra được. Không gộp các thay đổi không liên quan (như vừa sửa giao diện vừa đổi logic DB) vào cùng một commit.
3. Không để dấu chấm ở cuối dòng tiêu đề commit.

## Why
Lịch sử commit rõ ràng giúp dễ dàng `git bisect` tìm lỗi, tự động sinh Changelog và hỗ trợ rollback từng tính năng độc lập mà không gây hỏng chéo các phần khác.

## Violation signal
Commit message chung chung như `update code`, `fix bugs`, `wip`, `done`.

## Preferred pattern
```text
feat(inventory): implement atomic decrement to prevent lost updates
fix(orders): add principal ownership check on findById endpoint
refactor(types): unify menu item contract under shared-types
```

---

# RULE-GIT-003: Mandatory PR Template & Invariant Compliance

## Trigger
Khi mở một Pull Request (PR) mới trên GitHub để chuẩn bị merge vào nhánh `main` / `master`.

## Rule
1. Bắt buộc sử dụng đầy đủ nội dung theo mẫu [pull_request_template.md](file:///c:/Users/MSI/Desktop/chayfood/.github/pull_request_template.md).
2. Tác giả PR phải tự kiểm tra và đánh dấu đầy đủ `[x]` vào bảng **System Design Rules Compliance Checklist** trước khi gắn thẻ Reviewer.
3. Cung cấp bằng chứng chạy lệnh kiểm tra cục bộ (`pnpm type-check`, `pnpm test`, `pnpm build`) không có lỗi.

## Why
Đảm bảo tác giả PR đã chủ động tự rà soát các rủi ro kiến trúc và bảo mật trước khi làm phiền thời gian của Reviewer.

## Violation signal
Tạo PR với phần mô tả trống hoặc xóa bỏ bảng Checklist tuân thủ quy tắc System Design.

## Preferred pattern
Điền đầy đủ các mục trong PR: Bối cảnh, Thay đổi kỹ thuật, Checklist quy tắc và kết quả kiểm thử.

---

# RULE-GIT-004: Rigorous Code Reviewer Verification Protocol

## Trigger
Khi một Kỹ sư hoặc AI Reviewer thực hiện đánh giá mã nguồn (Code Review) trên Pull Request.

## Rule
Reviewer bắt buộc đối chiếu mã nguồn của PR với 5 trọng tâm kiến trúc cốt lõi:
1. **Bảo mật & Phân quyền**: Kiểm tra BOLA/IDOR trên các route nhận ID, kiểm tra Guard trên các route nội bộ.
2. **Xử lý đồng thời & Giao dịch**: Kiểm tra race condition, cập nhật nguyên tử trên số dư, cấm gọi I/O mạng trong DB transaction.
3. **An toàn kiểu dữ liệu**: Kiểm tra không có `any`, `unknown` hoặc type casting thiếu an toàn.
4. **Quy chuẩn UX/UI**: Kiểm tra không có dấu chấm cuối câu ở tiêu đề/nút bấm, không có từ ngữ "mọi" hoặc "100%".
5. **Độ phủ kiểm thử**: Đảm bảo các thuật toán nghiệp vụ mới có Unit Tests đầy đủ.

Chỉ chấp thuận (Approve) PR khi toàn bộ 5 trọng tâm trên đã được thỏa mãn.

## Why
Reviewer đóng vai trò là chốt chặn bảo vệ chất lượng cuối cùng (Human Quality Gate), ngăn chặn các lỗi kiến trúc âm thầm lọt vào production.

## Violation signal
Reviewer bấm "Approve" một PR có vi phạm `any` hoặc có nguy cơ BOLA mà không để lại bất kỳ nhận xét phản biện nào.

## Preferred pattern
Để lại nhận xét rõ ràng, trích dẫn mã quy tắc cụ thể (ví dụ: *"Đoạn code này cần áp dụng `RULE-AUTHZ-001` để kiểm tra quyền sở hữu của `userId` trước khi trả về dữ liệu"*).

---

# RULE-GIT-005: Transparent Review Response & Resolution Protocol

## Trigger
Khi tác giả PR nhận được các ý kiến phản hồi (review comments) từ Reviewer.

## Rule
1. Phản hồi 100% các nhận xét bằng văn bản giải thích rõ ràng trước khi yêu cầu re-review.
2. Tuân thủ hướng dẫn tại [review_response_template.md](file:///c:/Users/MSI/Desktop/chayfood/.github/review_response_template.md): Đính kèm commit SHA khi đã sửa đổi, hoặc đưa ra lý do kiến trúc khi giữ nguyên.
3. Tuyệt đối không bấm nút "Resolve conversation" trong im lặng (No Silent Dismissals).

## Why
Duy trì văn hóa giao tiếp kỹ thuật minh bạch, tôn trọng thời gian của nhau và lưu lại lịch sử ra quyết định kiến trúc cho toàn đội ngũ.

## Violation signal
Đẩy commit mới lên nhưng không trả lời các comment của reviewer hoặc bấm resolve comment mà không sửa code.

## Preferred pattern
Trả lời từng thread: *"Đã cập nhật theo góp ý của bạn tại commit `abc1234` bằng cách áp dụng `RULE-CONC-001`."*
