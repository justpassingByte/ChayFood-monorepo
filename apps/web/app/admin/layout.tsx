'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowTopRightOnSquareIcon,
  BellIcon,
  ChevronRightIcon,
  Bars3BottomLeftIcon,
} from '@heroicons/react/24/outline';
import AdminSidebar from '../components/admin/AdminSidebar';
import { useAuth } from '../context/AuthContext';
import { AdminLayoutProvider, useAdminLayout } from '../context/AdminLayoutContext';

interface AdminLayoutProps {
  children: ReactNode;
}

const routeNameMap: Record<string, string> = {
  admin: 'Tổng quan',
  orders: 'Quản lý đơn hàng',
  menu: 'Thực đơn & Món ăn',
  promotions: 'Chương trình ưu đãi',
  customers: 'Danh sách khách hàng',
  analytics: 'Báo cáo & Phân tích',
  revenue: 'Báo cáo doanh thu',
  settings: 'Cài đặt hệ thống',
  create: 'Thêm mới',
  edit: 'Chỉnh sửa',
};

function AdminShellInternal({ children }: AdminLayoutProps) {
  const { isAuthenticated, isAdmin, isLoading, user } = useAuth();
  const { toggleSidebar, isSidebarCollapsed } = useAdminLayout();
  const router = useRouter();
  const pathname = usePathname();

  // Strict Enterprise RBAC Guard: Redirect unauthorized users to home
  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated || !isAdmin) {
        router.replace('/');
      }
    }
  }, [isAuthenticated, isAdmin, isLoading, router]);

  // Generate dynamic breadcrumb segments
  const pathSegments = pathname.split('/').filter(Boolean);
  const breadcrumbs = pathSegments.map((segment, index) => {
    const href = '/' + pathSegments.slice(0, index + 1).join('/');
    const title = routeNameMap[segment] || segment;
    const isLast = index === pathSegments.length - 1;
    return { title, href, isLast };
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-100">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
          <p className="text-sm font-medium text-slate-400">
            Đang xác thực quyền quản trị viên...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-100">
        <div className="flex flex-col items-center space-y-4 text-center max-w-sm px-6">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center">
            <span className="text-xl font-bold">!</span>
          </div>
          <h2 className="text-lg font-semibold text-white">Yêu cầu quyền Quản trị viên</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Bạn không có quyền truy cập vào cổng quản trị này. Đang chuyển hướng về trang chủ...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Collapsible Luxury Admin Sidebar */}
      <AdminSidebar />

      {/* Main View Area with Dedicated Topbar */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Dedicated Admin Topbar */}
        <header className="h-16 px-4 sm:px-6 bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 flex items-center justify-between z-10 select-none flex-shrink-0">
          {/* Left: Sidebar Toggle Button + Breadcrumb Navigation */}
          <div className="flex items-center space-x-3 min-w-0">
            {/* Quick Collapse / Expand Button */}
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors border border-slate-700/60"
              title={isSidebarCollapsed ? 'Mở rộng sidebar' : 'Thu gọn sidebar thành icon'}
            >
              <Bars3BottomLeftIcon className="w-4 h-4" />
            </button>

            {/* Breadcrumb Navigation */}
            <nav className="flex items-center space-x-1.5 text-xs font-medium text-slate-400 truncate" aria-label="Breadcrumb">
              <Link
                href="/admin"
                className="text-slate-300 hover:text-emerald-400 transition-colors whitespace-nowrap"
              >
                Quản Trị
              </Link>
              {breadcrumbs.slice(1).map((crumb) => (
                <div key={crumb.href} className="flex items-center space-x-1.5 truncate">
                  <ChevronRightIcon className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />
                  {crumb.isLast ? (
                    <span className="text-emerald-400 font-semibold truncate whitespace-nowrap">
                      {crumb.title}
                    </span>
                  ) : (
                    <Link
                      href={crumb.href}
                      className="text-slate-400 hover:text-slate-200 transition-colors truncate whitespace-nowrap"
                    >
                      {crumb.title}
                    </Link>
                  )}
                </div>
              ))}
            </nav>
          </div>

          {/* Right: Quick Action Utilities */}
          <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0 pl-2">
            {/* Storefront Quick Switcher */}
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-800/70 hover:bg-emerald-500/10 text-slate-300 hover:text-emerald-300 border border-slate-700/60 hover:border-emerald-500/30 transition-all duration-150 shadow-sm whitespace-nowrap"
              title="Mở giao diện khách hàng ở tab mới"
            >
              <span className="hidden sm:inline">Xem Cửa Hàng</span>
              <span className="sm:hidden">Web</span>
              <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5" />
            </Link>

            {/* Notification Indicator */}
            <button
              className="p-2 rounded-xl bg-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors border border-slate-700/50 relative"
              title="Thông báo hệ thống"
            >
              <BellIcon className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-slate-900 animate-pulse" />
            </button>

            {/* Admin User Chip */}
            <div className="flex items-center space-x-2 pl-2 sm:pl-3 border-l border-slate-800">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-bold text-xs shadow-md shadow-emerald-950/50 flex-shrink-0">
                {user?.name?.charAt(0)?.toUpperCase() || 'A'}
              </div>
              <div className="hidden md:flex flex-col text-left truncate">
                <span className="text-xs font-medium text-slate-200 leading-tight truncate whitespace-nowrap">
                  {user?.name || 'Quản Trị Viên'}
                </span>
                <span className="text-[10px] text-emerald-400 font-mono tracking-tight">
                  ADMINISTRATOR
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Main Admin Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-950 custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <AdminLayoutProvider>
      <AdminShellInternal>{children}</AdminShellInternal>
    </AdminLayoutProvider>
  );
}