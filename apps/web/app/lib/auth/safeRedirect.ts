/**
 * Hàm làm sạch và kiểm tra URL chuyển hướng an toàn sau đăng nhập (Safe Redirect Sanitizer).
 * 
 * Bảo vệ ứng dụng khỏi:
 * 1. Lỗ hổng Chuyển Hướng Mở (Open Redirect - CWE-601): Ngăn chặn hacker lừa người dùng sang domain độc hại.
 * 2. Vòng lặp chuyển hướng vô hạn (Infinite Redirect Loop): Cấm redirect về chính các trang auth (/login, /register...).
 * 3. Kẹt xung đột phân quyền (RBAC Conflict Bouncing): Người dùng thường không được redirect vào khu vực /admin.
 */
export function getSafeRedirectUrl(
  redirectUrl: string | null | undefined,
  userRole?: string,
): string {
  const defaultFallback = userRole?.toUpperCase() === 'ADMIN' ? '/admin' : '/';

  if (!redirectUrl || typeof redirectUrl !== 'string') {
    return defaultFallback;
  }

  const trimmed = redirectUrl.trim();

  // 1. Chống Open Redirect: Bắt buộc là đường dẫn tương đối (Relative Path)
  // Tuyệt đối không cho phép '//' (protocol-relative), 'http://', 'https://', 'javascript:', 'data:'
  const isRelativePath =
    trimmed.startsWith('/') &&
    !trimmed.startsWith('//') &&
    !trimmed.startsWith('/\\') &&
    !trimmed.includes('://') &&
    !trimmed.toLowerCase().includes('javascript:') &&
    !trimmed.toLowerCase().includes('data:');

  if (!isRelativePath) {
    return defaultFallback;
  }

  // 2. Chống Infinite Redirect Loop: Cấm chuyển hướng về các trang xác thực
  const FORBIDDEN_REDIRECT_PREFIXES = [
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/logout',
  ];

  const isForbiddenAuthRoute = FORBIDDEN_REDIRECT_PREFIXES.some(
    (prefix) =>
      trimmed === prefix ||
      trimmed.startsWith(`${prefix}?`) ||
      trimmed.startsWith(`${prefix}/`),
  );

  if (isForbiddenAuthRoute) {
    return defaultFallback;
  }

  // 3. Chống RBAC Conflict Bouncing: Nếu route yêu cầu Admin mà User không phải Admin -> Bẻ về trang chủ
  if (trimmed.startsWith('/admin') && userRole?.toUpperCase() !== 'ADMIN') {
    return '/';
  }

  return trimmed;
}
