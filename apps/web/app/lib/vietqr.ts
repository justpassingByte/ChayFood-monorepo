/**
 * VietQR Helper (Lớp 1: QR Adapter)
 * Sinh URL mã QR chuyển khoản theo định dạng chuẩn VietQR
 */

export interface VietQRConfig {
  bankBin: string;
  accountNumber: string;
  accountName: string;
}

export function getDefaultBankConfig(): VietQRConfig {
  return {
    bankBin: process.env.NEXT_PUBLIC_BANK_BIN || '970418',
    accountNumber: process.env.NEXT_PUBLIC_BANK_ACCOUNT || '3148149311',
    accountName: process.env.NEXT_PUBLIC_BANK_ACCOUNT_NAME || 'NGUYEN HUU THANG',
  };
}

/**
 * Sinh link ảnh VietQR miễn phí từ img.vietqr.io
 * Format: https://img.vietqr.io/image/{bankBin}-{accountNumber}-qr_only.png?amount={amount}&addInfo={content}&accountName={name}
 */
export function generateVietQRUrl(
  amount: number,
  transferContent: string,
  config: VietQRConfig = getDefaultBankConfig(),
): string {
  const cleanContent = encodeURIComponent(transferContent.trim());
  const cleanName = encodeURIComponent(config.accountName.trim());
  const cleanAmount = Math.max(0, Math.round(amount));

  return `https://img.vietqr.io/image/${config.bankBin}-${config.accountNumber}-qr_only.png?amount=${cleanAmount}&addInfo=${cleanContent}&accountName=${cleanName}`;
}
