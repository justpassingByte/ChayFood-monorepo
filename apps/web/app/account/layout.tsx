'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  User as UserIcon,
  Package,
  CalendarDays,
  Users,
  Lock,
  LogOut,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const NAV_ITEMS = [
  {
    href: '/account/profile',
    label: 'Thông tin cá nhân',
    description: 'Hồ sơ, sổ địa chỉ & sở thích',
    icon: UserIcon,
  },
  {
    href: '/account/orders',
    label: 'Lịch sử đơn hàng',
    description: 'Theo dõi và đặt lại món',
    icon: Package,
  },
  {
    href: '/account/subscriptions',
    label: 'Gói ăn định kỳ',
    description: 'Gói tuần, tháng & lịch giao',
    icon: CalendarDays,
  },
  {
    href: '/account/family',
    label: 'Dinh dưỡng gia đình',
    description: 'Hồ sơ sức khỏe người thân',
    icon: Users,
  },
  {
    href: '/account/settings',
    label: 'Đổi mật khẩu',
    description: 'Bảo mật tài khoản',
    icon: Lock,
  },
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, isAuthenticated, isLoading } = useAuth();

  const handleLogout = async () => {
    if (window.confirm('Bạn có chắc chắn muốn đăng xuất tài khoản?')) {
      await logout();
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFBF9] pb-24">
      {/* Subpage Header */}
      <div className="bg-white border-b border-slate-200/80 mb-6 py-5">
        <div className="container-custom max-w-6xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-emerald-700 font-bold text-xs uppercase tracking-wider">
                Trung Tâm Khách Hàng
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight mt-0.5">
                Tài Khoản Của Tôi
              </h1>
            </div>

            {user && (
              <div className="flex items-center gap-2 bg-emerald-50/70 border border-emerald-200/80 px-3.5 py-1.5 rounded-2xl">
                <Sparkles className="w-4 h-4 text-emerald-700" />
                <span className="text-xs font-bold text-emerald-900">
                  Thành viên Thân thiết ChayFood
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container-custom max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Sidebar Navigation (Desktop) */}
          <aside className="lg:col-span-4 space-y-4">
            {/* User Profile Card */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white font-black text-lg flex items-center justify-center shadow-xs">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div className="overflow-hidden">
                  <h2 className="text-sm font-bold text-slate-950 truncate">
                    {user?.name || 'Khách hàng'}
                  </h2>
                  <p className="text-[11px] text-slate-500 truncate">{user?.email || '—'}</p>
                </div>
              </div>
            </div>

            {/* Navigation Menu */}
            <nav className="bg-white rounded-3xl border border-slate-200/90 p-3 shadow-xs space-y-1">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/account' && pathname.startsWith(item.href));
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center justify-between p-3 rounded-2xl transition-all group ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-950 font-bold border border-emerald-200/70'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-xl transition ${
                          isActive
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200 group-hover:text-slate-800'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold">{item.label}</div>
                        <div className="text-[10px] text-slate-400 font-normal">
                          {item.description}
                        </div>
                      </div>
                    </div>

                    <ChevronRight
                      className={`w-4 h-4 transition ${
                        isActive ? 'text-emerald-700' : 'text-slate-300 group-hover:text-slate-500'
                      }`}
                    />
                  </Link>
                );
              })}

              <div className="pt-2 border-t border-slate-100 mt-2">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 p-3 rounded-2xl text-red-600 hover:bg-red-50 text-xs font-bold transition text-left"
                >
                  <div className="p-2 rounded-xl bg-red-100 text-red-700">
                    <LogOut className="w-4 h-4" />
                  </div>
                  <span>Đăng Xuất Tài Khoản</span>
                </button>
              </div>
            </nav>
          </aside>

          {/* Right Main Content */}
          <main className="lg:col-span-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
