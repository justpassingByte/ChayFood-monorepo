/**
 * Tiện ích chuẩn hóa và dịch thông báo lỗi API sang Tiếng Việt thân thiện, thanh lịch
 */
export function formatApiErrorMessage(
  error: unknown,
  fallbackMessage = 'Đã có lỗi xảy ra. Vui lòng thử lại sau'
): string {
  if (!error) return fallbackMessage;

  let rawMessage = '';

  // 1. Trích xuất message từ các định dạng lỗi khác nhau
  if (typeof error === 'object' && error !== null) {
    const obj = error as {
      response?: {
        data?: {
          message?: string | string[];
          issues?: Array<{ field?: string; message: string }>;
          error?: string;
        };
        status?: number;
      };
      message?: string;
    };

    if (obj.response?.data?.issues && Array.isArray(obj.response.data.issues) && obj.response.data.issues.length > 0) {
      return obj.response.data.issues.map((i) => i.message).join('. ');
    }

    if (obj.response?.data?.message) {
      const msg = obj.response.data.message;
      rawMessage = Array.isArray(msg) ? msg.join(', ') : String(msg);
    } else if (obj.message) {
      rawMessage = String(obj.message);
    }
  } else if (typeof error === 'string') {
    rawMessage = error;
  }

  if (!rawMessage) return fallbackMessage;

  const lower = rawMessage.trim().toLowerCase();

  // 2. Xử lý các mã lỗi hoặc từ khóa kỹ thuật đơn lẻ
  if (lower === 'required' || lower.includes('required')) {
    return 'Vui lòng cung cấp đầy đủ thông tin bắt buộc trước khi tiếp tục';
  }

  // A. Lỗi liên quan đến giỏ hàng & món ăn
  if (lower.includes('menuitemid') || lower.includes('menuitem') || lower.includes('mã món ăn')) {
    return 'Món ăn trong giỏ hàng không hợp lệ. Vui lòng chọn lại món trong thực đơn';
  }

  // B. Lỗi phương thức thanh toán
  if (lower.includes('paymentmethod') || lower.includes('phương thức thanh toán')) {
    return 'Phương thức thanh toán đã chọn không hợp lệ. Vui lòng chọn lại';
  }

  // C. Lỗi địa chỉ giao hàng
  if (lower.includes('street') || lower.includes('city') || lower.includes('deliveryaddress') || lower.includes('địa chỉ')) {
    return 'Vui lòng cung cấp đầy đủ số nhà, tên đường và khu vực nhận hàng';
  }

  // D. Lỗi quyền truy cập & xác thực
  if (lower.includes('unauthorized') || lower.includes('jwt') || lower.includes('token') || lower.includes('401')) {
    return 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại để tiếp tục';
  }

  if (lower.includes('forbidden') || lower.includes('403')) {
    return 'Bạn không có quyền thực hiện thao tác này';
  }

  // E. Lỗi mạng / kết nối
  if (lower.includes('network error') || lower.includes('econnrefused')) {
    return 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại kết nối mạng';
  }

  // F. Nếu có nhiều lỗi ngăn cách bởi dấu phẩy, tách và dịch từng phần
  if (rawMessage.includes(',') || rawMessage.includes(';')) {
    const parts = rawMessage.split(/[,;]/).map((p) => p.trim()).filter(Boolean);
    const translatedParts = parts.map((p) => {
      const pLower = p.toLowerCase();
      if (pLower.includes('menuitemid')) return 'Món ăn trong giỏ hàng không hợp lệ';
      if (pLower.includes('paymentmethod')) return 'Phương thức thanh toán không hợp lệ';
      if (pLower.includes('street') || pLower.includes('city')) return 'Thiếu địa chỉ nhận hàng';
      if (pLower.includes('required')) return 'Thiếu thông tin bắt buộc';
      return p;
    });
    return Array.from(new Set(translatedParts)).join(' • ');
  }

  return rawMessage;
}
