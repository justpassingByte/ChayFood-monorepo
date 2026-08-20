# Quy Tắc Kiểm Thử Tự Động & Đường Ống CI/CD (Automated Testing & CI/CD Rules)

# RULE-TEST-001: Domain Business Engine Test Coverage & Test Pyramid

## Trigger
Khi phát triển hoặc chỉnh sửa các thuật toán tính toán nghiệp vụ cốt lõi (Domain Calculation & Business Logic Engines), bao gồm: công cụ tính toán định mức cấu thành, thuật toán phân bổ chỉ số, phân tích giá vốn và biên lợi nhuận, công cụ trừ kho/tài nguyên, và kiểm soát phân quyền bảo mật.

## Rule
Mọi thay đổi trong các Domain Business Engines bắt buộc phải có Unit / Spec Tests tương ứng kiểm thử đầy đủ: Phân tích giá trị biên (Boundary Value Analysis), Kịch bản phân nhánh (Branch Coverage), Kịch bản ngoại lệ (Error Handling) và Kiểm thử dữ liệu mẫu xác định (Deterministic Fixtures).

## Why
Các lỗi sai lệch về công thức tính toán nghiệp vụ cốt lõi hoặc sai lệch trừ tài nguyên hữu hạn có thể gây tổn thất tài chính, sai lệch dữ liệu hệ thống nghiêm trọng và vi phạm các ràng buộc an toàn của ứng dụng.

## Violation signal
Tạo mới hoặc sửa đổi thuật toán tính toán nghiệp vụ lõi trong tầng Domain/Service mà không có hoặc không cập nhật bộ test suite `.spec.ts` / `.test.ts` đi kèm.

## Preferred pattern
```typescript
describe('DomainCalculationEngine - calculateMetrics', () => {
  it('should compute deterministic output for valid input boundaries', () => {
    const result = service.calculateMetrics(testInput);
    expect(result.totalValue).toBe(expectedTotal);
    expect(result.marginPercentage).toBeCloseTo(expectedMargin, 1);
  });

  it('should throw DomainValidationException when input exceeds permissible threshold', () => {
    expect(() => service.calculateMetrics(invalidInput)).toThrow(DomainValidationException);
  });
});
```

---

# RULE-TEST-002: Hermetic Fast Unit Tests & Isolated Mocking

## Trigger
Khi viết unit tests cho tầng Service và UI logic trong ứng dụng Backend và Frontend.

## Rule
1. Toàn bộ Unit Test phải chạy cô lập hoàn toàn (Hermetic & Isolated) với mock dependencies (mock database client, mock network HTTP client).
2. Đảm bảo thời gian thực thi toàn bộ unit test suite dưới **10 giây** trên môi trường cục bộ.
3. Tuyệt đối không phụ thuộc vào cơ sở dữ liệu thật hoặc kết nối mạng internet bên ngoài trong Unit Tests.

## Why
Unit test chậm hoặc chập chờn (flaky) do phụ thuộc I/O ngoại vi sẽ làm chậm chu kỳ phản hồi của lập trình viên và kéo dài thời gian chờ của đường ống CI/CD.

## Violation signal
Unit test gọi trực tiếp database thật hoặc gọi API qua mạng internet thay vì sử dụng mock/stub.

## Preferred pattern
```typescript
const mockDatabaseService = {
  resource: {
    findUnique: jest.fn().mockResolvedValue({ id: 'res-1', currentBalance: 1000 }),
    update: jest.fn().mockResolvedValue({ id: 'res-1', currentBalance: 800 }),
  },
  $transaction: jest.fn((callback) => callback(mockDatabaseService)),
};
```

---

# RULE-TEST-003: Database Integration & Migration Seed Verification

## Trigger
Khi chỉnh sửa lược đồ cơ sở dữ liệu (Database Schema), tạo bản migration mới hoặc cập nhật script nạp dữ liệu khởi tạo (Seed Data).

## Rule
Bắt buộc chạy kiểm tra toàn vẹn cơ sở dữ liệu thực tế trên PostgreSQL container cô lập:
1. Quá trình áp dụng Schema / Migrations (`prisma db push` hoặc `migrate deploy`) thực thi thành công không phát sinh xung đột.
2. Script nạp dữ liệu khởi tạo (`seed`) thực thi trơn tru, không vi phạm các ràng buộc khóa ngoại (Foreign Key Constraints) hay ràng buộc duy nhất (Unique Constraints).

## Why
Đảm bảo môi trường triển khai mới (Clean Staging / Production) luôn có thể tái lập từ đầu mà không bị lỗi schema hoặc dữ liệu seed lỗi thời.

## Violation signal
Đẩy mã nguồn lên repository khi script `seed` chứa các trường dữ liệu cũ không còn tồn tại trong lược đồ cơ sở dữ liệu hiện tại.

## Preferred pattern
Thực thi kiểm tra trước khi commit:
```bash
pnpm db:push
pnpm db:seed
```

---

# RULE-CICD-001: 4-Stage Enterprise Quality Gate

## Trigger
Khi cấu hình hoặc thực thi đường ống tích hợp liên tục CI/CD (`.github/workflows/ci.yml`) trên các sự kiện `push` hoặc `pull_request` vào nhánh chính (`main`, `master`).

## Rule
Đường ống CI bắt buộc phải vượt qua 4 chặng kiểm định chất lượng nghiêm ngặt theo thứ tự tuần tự (Fail-Fast Quality Gate):
1. **Chặng 1: Code Quality & Strict Type Safety**: `pnpm type-check` (100% 0 lỗi trên toàn bộ workspace) + `pnpm lint`
2. **Chặng 2: Automated Unit Tests Suite**: `pnpm test` (toàn bộ test suites pass)
3. **Chặng 3: Database & Migration Verification**: Khởi chạy service container PostgreSQL, chạy `pnpm db:push` và `pnpm db:seed`
4. **Chặng 4: Monorepo Production Build**: `pnpm build` (build thành công toàn bộ các ứng dụng trong monorepo)

## Why
Ngăn chặn tuyệt đối tình trạng mã nguồn bị lỗi biên dịch, vỡ giao diện, lỗi kiểu dữ liệu hoặc hỏng cơ sở dữ liệu lọt vào nhánh production.

## Violation signal
Bỏ qua bước `type-check` hoặc cho phép bypass test suite khi đóng gói container production.

## Preferred pattern
```yaml
name: Enterprise Quality Gate CI Pipeline

on:
  push:
    branches: [main, master]
  pull_request:
    branches: [main, master]

jobs:
  quality-gate:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16-alpine
        env:
          POSTGRES_DB: test_db
          POSTGRES_USER: postgres
          POSTGRES_PASSWORD: postgrespassword
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Stage 1 - Strict Type Check
        run: pnpm type-check

      - name: Stage 2 - Automated Unit Tests
        run: pnpm test

      - name: Stage 3 - Database Migration & Seed Check
        env:
          DATABASE_URL: postgresql://postgres:postgrespassword@localhost:5432/test_db
        run: |
          pnpm db:push
          pnpm db:seed

      - name: Stage 4 - Monorepo Production Build
        run: pnpm build
```

---

# RULE-CICD-002: Trunk Protection & Zero-Tolerance Failing PR Policy

## Trigger
Khi mở Pull Request hoặc đánh giá mã nguồn (Code Review) trước khi merge vào nhánh chính.

## Rule
Nếu bất kỳ một bước nào trong 4 chặng CI thất bại (dù chỉ là 1 lỗi TypeScript nhỏ hay 1 test case thất bại), Pull Request bắt buộc bị chặn (Blocked) và không được phép merge.

## Why
Duy trì trạng thái luôn sẵn sàng triển khai (Always Deployable) của nhánh chính, loại bỏ hiện tượng hỏng build lây lan sang toàn bộ đội ngũ kỹ thuật.

## Violation signal
Sử dụng quyền Admin để Force Merge một Pull Request đang có trạng thái CI đỏ (Failed).

## Preferred pattern
Sửa lỗi triệt để tại nhánh feature, đảm bảo `pnpm type-check && pnpm test && pnpm build` đều vượt qua trước khi yêu cầu review.
