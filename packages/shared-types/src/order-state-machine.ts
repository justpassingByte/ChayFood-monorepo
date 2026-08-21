import { OrderStatus } from './schemas/order.schema';

// ─── Transition Map ────────────────────────────────────────────

/** Map trạng thái nguồn → danh sách trạng thái đích hợp lệ */
export const ORDER_TRANSITIONS: Record<OrderStatus, readonly OrderStatus[]> = {
  PENDING:    ['CONFIRMED', 'CANCELLED'],
  CONFIRMED:  ['PREPARING', 'CANCELLED'],
  PREPARING:  ['READY'],
  READY:      ['DELIVERING'],
  DELIVERING: ['DELIVERED'],
  DELIVERED:  [],
  CANCELLED:  [],
} as const;

export function isValidTransition(from: OrderStatus, to: OrderStatus): boolean {
  const allowed = ORDER_TRANSITIONS[from];
  if (!allowed) return false;
  return (allowed as readonly string[]).indexOf(to) !== -1;
}

/** Trả về danh sách trạng thái tiếp theo hợp lệ (dùng cho admin UI buttons) */
export function getNextStatuses(current: OrderStatus): readonly OrderStatus[] {
  return ORDER_TRANSITIONS[current] ?? [];
}

// ─── Labels tiếng Việt ─────────────────────────────────────────

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: 'Chờ thanh toán',
  CONFIRMED: 'Đã xác nhận',
  PREPARING: 'Đang chế biến',
  READY: 'Sẵn sàng giao',
  DELIVERING: 'Đang giao',
  DELIVERED: 'Giao thành công',
  CANCELLED: 'Đã hủy',
};

/** Label cho nút action admin chuyển sang trạng thái đích */
export const TRANSITION_ACTION_LABELS: Partial<Record<OrderStatus, string>> = {
  CONFIRMED: 'Xác nhận đơn',
  PREPARING: 'Bắt đầu nấu',
  READY: 'Nấu xong',
  DELIVERING: 'Giao hàng',
  DELIVERED: 'Giao thành công',
  CANCELLED: 'Hủy đơn',
};

// ─── Stepper / Timeline ────────────────────────────────────────

/** Thứ tự các bước trong luồng bình thường (không bao gồm CANCELLED) */
export const ORDER_STATUS_FLOW: readonly OrderStatus[] = [
  'PENDING',
  'CONFIRMED',
  'PREPARING',
  'READY',
  'DELIVERING',
  'DELIVERED',
] as const;

/**
 * Trả về index của trạng thái trong luồng bình thường.
 * CANCELLED trả về -1.
 */
export function getStatusStepIndex(status: OrderStatus): number {
  return (ORDER_STATUS_FLOW as readonly string[]).indexOf(status);
}
