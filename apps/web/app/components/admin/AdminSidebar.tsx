'use client';

import { useState } from 'react';
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
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';

interface NavigationItem {
  name: string;
  href: string;
  icon: typeof HomeIcon;
  badge?: string;
}

const navigation: NavigationItem[] = [
  { name: 'Tổng quan', href: '/admin', icon: HomeIcon },
  { name: 'Đơn hàng', href: '/admin/orders', icon: ClipboardDocumentListIcon },
  { name: 'Thực đơn & Món', href: '/admin/menu', icon: ShoppingBagIcon },
  { name: 'Ưu đãi & Khuyến mãi', href: '/admin/promotions', icon: TagIcon },
  { name: 'Khách hàng', href: '/admin/customers', icon: UsersIcon },
  { name: 'Báo cáo & Phân tích', href: '/admin/analytics', icon: ChartBarIcon },
  { name: 'Doanh thu', href: '/admin/revenue', icon: BanknotesIcon },
  { name: 'Cài đặt hệ thống', href: '/admin/settings', icon: Cog8ToothIcon },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  return (
    <aside
      className={`bg-slate-900 border-r border-slate-800 text-slate-200 transition-all duration-300 flex flex-col h-screen select-none ${
        collapsed ? 'w-20' : 'w-72'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 px-4 border-b border-slate-800/80 flex items-center justify-between">
        {!collapsed ? (
          <Link href="/admin" className="flex items-center space-x-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-emerald-950/40">
              <SparklesIcon className="w-5 h-5 text-emerald-100" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold tracking-wide text-white uppercase group-hover:text-emerald-400 transition-colors">
                ChayFood Admin
              </span>
              <span className="text-[11px] text-emerald-400 font-medium tracking-tight">
                Cổng Điều Hành Hệ Thống
              </span>
            </div>
          </Link>
        ) : (
          <Link href="/admin" className="mx-auto">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-emerald-950/40">
              <SparklesIcon className="w-5 h-5 text-emerald-100" />
            </div>
          </Link>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors ${
            collapsed ? 'hidden' : 'block'
          }`}
          title={collapsed ? 'Mở rộng sidebar' : 'Thu gọn sidebar'}
        >
          <ChevronDoubleLeftIcon className="w-4 h-4" />
        </button>
      </div>

      {/* Main Navigation Items */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5 custom-scrollbar">
        {navigation.map((item) => {
          const isActive =
            item.href === '/admin'
              ? pathname === '/admin'
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-sm shadow-emerald-950/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
              } ${collapsed ? 'justify-center' : 'justify-between'}`}
              title={collapsed ? item.name : undefined}
            >
              <div className="flex items-center space-x-3">
                <item.icon
                  className={`w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                  aria-hidden="true"
                />
                {!collapsed && <span className="truncate">{item.name}</span>}
              </div>

              {!collapsed && isActive && (
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Collapsed Toggle Button when collapsed */}
      {collapsed && (
        <div className="p-3 border-t border-slate-800/80 flex justify-center">
          <button
            onClick={() => setCollapsed(false)}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
            title="Mở rộng sidebar"
          >
            <ChevronDoubleRightIcon className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* User Profile & Logout Section */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/40">
        {!collapsed && (
          <div className="flex items-center space-x-3 px-2 py-2 mb-2 rounded-xl bg-slate-800/40 border border-slate-800/60">
            <div className="w-8 h-8 rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-semibold text-xs">
              {user?.name?.charAt(0)?.toUpperCase() || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-slate-200 truncate">
                {user?.name || 'Quản Trị Viên'}
              </p>
              <p className="text-[10px] text-emerald-400 font-mono truncate">
                {user?.email || 'admin@chayfood.vn'}
              </p>
            </div>
          </div>
        )}

        <button
          onClick={handleLogout}
          className={`w-full flex items-center px-3 py-2 rounded-xl text-xs font-medium text-rose-400/90 hover:text-rose-300 hover:bg-rose-500/10 transition-colors border border-transparent hover:border-rose-500/20 ${
            collapsed ? 'justify-center' : 'justify-start space-x-3'
          }`}
          title="Đăng xuất khỏi hệ thống quản trị"
        >
          <ArrowRightOnRectangleIcon className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span>Đăng xuất</span>}
        </button>
      </div>
    </aside>
  );
}