'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ChartBarIcon,
  ClipboardDocumentListIcon,
  Cog8ToothIcon,
  HomeIcon,
  UsersIcon,
  ShoppingBagIcon,
  BanknotesIcon,
  TagIcon,
  ArrowRightOnRectangleIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  SparklesIcon,
  BeakerIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import { useAdminLayout } from '../../context/AdminLayoutContext';

interface NavigationItem {
  name: string;
  href: string;
  icon: typeof HomeIcon;
}

const navigation: NavigationItem[] = [
  { name: 'Tổng quan', href: '/admin', icon: HomeIcon },
  { name: 'Đơn hàng', href: '/admin/orders', icon: ClipboardDocumentListIcon },
  { name: 'Thực đơn & Món', href: '/admin/menu', icon: ShoppingBagIcon },
  { name: 'Công thức & Kho', href: '/admin/recipes', icon: BeakerIcon },
  { name: 'Ưu đãi', href: '/admin/promotions', icon: TagIcon },
  { name: 'Khách hàng', href: '/admin/customers', icon: UsersIcon },
  { name: 'Báo cáo & Phân tích', href: '/admin/analytics', icon: ChartBarIcon },
  { name: 'Doanh thu', href: '/admin/revenue', icon: BanknotesIcon },
  { name: 'Cài đặt', href: '/admin/settings', icon: Cog8ToothIcon },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { isSidebarCollapsed, toggleSidebar } = useAdminLayout();
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  return (
    <aside
      className={`bg-slate-900 border-r border-slate-800 text-slate-200 transition-all duration-300 flex flex-col h-screen select-none z-20 flex-shrink-0 ${
        isSidebarCollapsed ? 'w-[72px]' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 px-3.5 border-b border-slate-800/80 flex items-center justify-between">
        {!isSidebarCollapsed ? (
          <Link href="/admin" className="flex items-center space-x-3 group min-w-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-950/40 flex-shrink-0">
              <SparklesIcon className="w-4 h-4 text-emerald-100" />
            </div>
            <div className="flex flex-col truncate">
              <span className="text-xs font-bold tracking-wider text-white uppercase group-hover:text-emerald-400 transition-colors truncate">
                ChayFood Admin
              </span>
              <span className="text-[10px] text-emerald-400 font-medium tracking-tight truncate">
                Cổng Điều Hành
              </span>
            </div>
          </Link>
        ) : (
          <Link href="/admin" className="mx-auto" title="ChayFood Admin Portal">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-950/40">
              <SparklesIcon className="w-4 h-4 text-emerald-100" />
            </div>
          </Link>
        )}

        <button
          onClick={toggleSidebar}
          className={`p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors ${
            isSidebarCollapsed ? 'hidden' : 'block'
          }`}
          title="Thu gọn sidebar thành icon"
        >
          <ChevronDoubleLeftIcon className="w-4 h-4" />
        </button>
      </div>

      {/* Main Navigation Items */}
      <nav className="flex-1 overflow-y-auto px-2.5 py-3 space-y-1 custom-scrollbar">
        {navigation.map((item) => {
          const isActive =
            item.href === '/admin'
              ? pathname === '/admin'
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center px-2.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 relative ${
                isActive
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
              } ${isSidebarCollapsed ? 'justify-center' : 'justify-start space-x-3'}`}
              title={isSidebarCollapsed ? item.name : undefined}
            >
              <item.icon
                className={`w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110 ${
                  isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-slate-200'
                }`}
                aria-hidden="true"
              />

              {!isSidebarCollapsed && (
                <span className="truncate whitespace-nowrap">{item.name}</span>
              )}

              {/* Active Indicator Pip */}
              {isActive && (
                <span
                  className={`w-1.5 h-1.5 rounded-full bg-emerald-400 absolute ${
                    isSidebarCollapsed ? 'top-1.5 right-1.5' : 'right-3'
                  }`}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Collapsed Toggle Button when collapsed */}
      {isSidebarCollapsed && (
        <div className="p-2 border-t border-slate-800/80 flex justify-center">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-xl text-slate-400 hover:text-emerald-400 hover:bg-slate-800/80 transition-colors"
            title="Mở rộng sidebar"
          >
            <ChevronDoubleRightIcon className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* User Profile & Logout Section */}
      <div className="p-2.5 border-t border-slate-800/80 bg-slate-950/40">
        {!isSidebarCollapsed ? (
          <div className="flex items-center space-x-2.5 px-2 py-1.5 mb-1.5 rounded-xl bg-slate-800/40 border border-slate-800/60">
            <div className="w-7 h-7 rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-xs flex-shrink-0">
              {user?.name?.charAt(0)?.toUpperCase() || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-200 truncate whitespace-nowrap">
                {user?.name || 'Quản Trị Viên'}
              </p>
              <p className="text-[10px] text-emerald-400 font-mono truncate">
                {user?.email || 'admin@chayfood.vn'}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center mb-1.5" title={user?.name || 'Quản Trị Viên'}>
            <div className="w-7 h-7 rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-xs">
              {user?.name?.charAt(0)?.toUpperCase() || 'A'}
            </div>
          </div>
        )}

        <button
          onClick={handleLogout}
          className={`w-full flex items-center py-2 rounded-xl text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors border border-transparent hover:border-rose-500/20 ${
            isSidebarCollapsed ? 'justify-center px-0' : 'justify-start space-x-2.5 px-2.5'
          }`}
          title="Đăng xuất"
        >
          <ArrowRightOnRectangleIcon className="w-4 h-4 flex-shrink-0" />
          {!isSidebarCollapsed && <span className="whitespace-nowrap">Đăng xuất</span>}
        </button>
      </div>
    </aside>
  );
}