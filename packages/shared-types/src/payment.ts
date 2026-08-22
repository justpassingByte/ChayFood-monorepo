// ─── Payment Provider Types ────────────────────────────────────

export const PaymentProviderType = {
  SEPAY: 'sepay',
  STRIPE: 'stripe',
  COD: 'cod',
  MOCK: 'mock',
} as const;
export type PaymentProviderType = (typeof PaymentProviderType)[keyof typeof PaymentProviderType];

// ─── Payment Transaction Status ────────────────────────────────

export const PaymentTransactionStatus = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  EXPIRED: 'EXPIRED',
} as const;
export type PaymentTransactionStatus =
  (typeof PaymentTransactionStatus)[keyof typeof PaymentTransactionStatus];

// ─── Result Interfaces ─────────────────────────────────────────

export interface PaymentIntentResult {
  transactionId: string;
  status: PaymentTransactionStatus;
  /** URL hình QR (VietQR) — chỉ có khi provider hỗ trợ QR */
  qrUrl?: string;
  /** URL redirect (Stripe Checkout) — chỉ có khi provider redirect */
  redirectUrl?: string;
  /** Nội dung chuyển khoản cho khách ghi khi CK */
  transferContent?: string;
  /** Client secret khi dùng Stripe Elements flow */
  clientSecret?: string;
  /** Thời điểm hết hạn thanh toán */
  expiresAt?: string;
}

export interface WebhookVerificationResult {
  isValid: boolean;
  transactionId?: string;
  amount?: number;
  /** Nội dung chuyển khoản mà Sepay trích xuất */
  content?: string;
}

export interface PaymentStatusResult {
  orderId: string;
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED';
  transactionStatus: PaymentTransactionStatus;
  provider: PaymentProviderType;
  paidAt?: string;
}

// ─── Transfer Content Generator ────────────────────────────────

/**
 * Sinh nội dung chuyển khoản theo format: `CF {DDMMYYYY} {sequenceNumber}`
 * Ví dụ: `CF 21082026 5`
 */
export function generateTransferContent(
  date: Date,
  sequenceNumber: number,
): string {
  const d = date.getDate();
  const m = date.getMonth() + 1;
  const dd = d < 10 ? `0${d}` : `${d}`;
  const mm = m < 10 ? `0${m}` : `${m}`;
  const yyyy = String(date.getFullYear());
  return `CF ${dd}${mm}${yyyy} ${sequenceNumber}`;
}

/**
 * Parse nội dung CK để trích xuất sequenceNumber.
 * Trả về null nếu format không hợp lệ.
 */
export function parseTransferContent(
  content: string,
): { date: string; sequenceNumber: number } | null {
  const match = content.match(/CF\s*(\d{8})\s+(\d+)\b/i);
  if (!match) return null;
  return {
    date: match[1],
    sequenceNumber: parseInt(match[2], 10),
  };
}

