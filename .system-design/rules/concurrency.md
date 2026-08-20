# Quy Tắc Xử Lý Đồng Thời & Chống Xung Đột (Concurrency Rules)

# RULE-CONC-001: Atomic Balance & Inventory Mutation (Lost Update Prevention)

## Trigger
Khi thực hiện thao tác giảm trừ số dư, xuất kho tài nguyên hữu hạn, tiêu trừ điểm thưởng, hoặc phân bổ chỉ tiêu số lượng trong môi trường xử lý đồng thời.

## Rule
Bắt buộc sử dụng phép cập nhật nguyên tử ở cấp cơ sở dữ liệu (`decrement` / atomic arithmetic) kết hợp điều kiện ràng buộc số dư khả dụng tại thời điểm ghi (`where: { currentBalance: { gte: requiredAmount } }`) hoặc khóa dòng độc quyền (`SELECT ... FOR UPDATE`) trong giao dịch. Tuyệt đối không đọc giá trị ra bộ nhớ ứng dụng rồi tính toán và gán đè (Read-Modify-Write pattern).

## Why
Trong môi trường xử lý đồng thời (concurrent transactions), mẫu Read-Modify-Write ở mức cô lập Read Committed sẽ dẫn đến hiện tượng Lost Update và Race Condition, làm sai lệch số dư thực tế và gây ra tình trạng xuất âm/bán khống tài nguyên (Overdraft / Overselling).

## Violation signal
Đọc số dư từ kết quả `findUnique`, thực hiện phép trừ trong biến JavaScript/TypeScript (`currentBalance - requiredAmount`), rồi gọi `update({ data: { currentBalance: newBalance } })`.

## Preferred pattern
```typescript
const result = await tx.resource.updateMany({
  where: {
    id: resourceId,
    currentBalance: { gte: requiredAmount },
  },
  data: {
    currentBalance: { decrement: requiredAmount },
  },
});

if (result.count === 0) {
  throw new ConflictException('Số dư hoặc tài nguyên khả dụng không đủ để hoàn tất giao dịch');
}
```

---

# RULE-CONC-002: Atomic Conditional State Machine Transitions

## Trigger
Khi cập nhật trạng thái của các thực thể có vòng đời tuần tự (State Machine Lifecycle) như Giao dịch, Đơn đặt hàng, Yêu cầu phê duyệt, hoặc Chu kỳ dịch vụ.

## Rule
Bao gồm trạng thái hiện tại mong đợi trong mệnh đề `where` khi cập nhật (`where: { id: entityId, status: ExpectedState }`). Nếu số bản ghi cập nhật bằng 0, từ chối chuyển đổi trạng thái và trả về lỗi xung đột trạng thái (State Conflict).

## Why
Ngăn chặn hiện tượng hai tiến trình xử lý đồng thời (như hai worker, hai webhook hoặc hai người dùng) cùng kích hoạt chuyển trạng thái từ một trạng thái ban đầu, gây ra hiện tượng thực thi tác vụ phụ kép (Double Side-Effects / Double Processing).

## Violation signal
Gọi `update({ where: { id }, data: { status: newStatus } })` mà chỉ kiểm tra trạng thái cũ ở bước `findUnique` trước đó ngoài giao dịch.

## Preferred pattern
```typescript
const updated = await tx.entity.updateMany({
  where: {
    id: entityId,
    status: EntityStatus.PENDING, // Chỉ cho phép chuyển đổi nếu trạng thái đang là PENDING
  },
  data: {
    status: EntityStatus.CONFIRMED,
  },
});

if (updated.count === 0) {
  throw new ConflictException('Thực thể đã được xử lý bởi tiến trình khác hoặc đang ở trạng thái không hợp lệ');
}
```

---

# RULE-CONC-003: Idempotent Request Processing & Double-Submission Guarding

## Trigger
Khi tiếp nhận các yêu cầu tạo mới tài nguyên có tác động tài chính hoặc biến động trạng thái quan trọng từ phía máy khách (Client-initiated Mutations).

## Rule
Áp dụng cơ chế Idempotency Key hoặc khóa phân tán / deduplication guard. Yêu cầu mã khóa trùng lặp (`Idempotency-Key`) từ header hoặc kiểm tra và chặn các yêu cầu trùng lặp được gửi liên tiếp trong khoảng thời gian ngắn (In-flight request deduplication).

## Why
Người dùng bấm nút nhiều lần khi mạng chậm hoặc client tự động retry khi gặp timeout mạng sẽ gây ra tình trạng tạo nhiều bản ghi trùng lặp và trừ tiền hoặc tài nguyên nhiều lần.

## Violation signal
Endpoint tiếp nhận mutation (`POST /orders`, `POST /transactions`) tạo mới bản ghi mà không có cơ chế kiểm tra Idempotency Key hoặc không kiểm tra bản ghi tương tự đang chờ xử lý của cùng một Principal trong cửa sổ thời gian ngắn.

## Preferred pattern
```typescript
// Kiểm tra yêu cầu trùng lặp gần nhất của cùng một người dùng / principal
const duplicateRecentRequest = await this.prisma.entity.findFirst({
  where: {
    userId,
    status: EntityStatus.PENDING,
    totalAmount,
    createdAt: { gte: new Date(Date.now() - 10000) }, // Cửa sổ 10 giây
  },
});

if (duplicateRecentRequest) {
  return duplicateRecentRequest; // Trả về bản ghi đang tồn tại thay vì tạo bản ghi trùng lặp
}
```
