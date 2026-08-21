'use client';

import { useState, useEffect } from 'react';
import { customerService } from '../../lib/services';
import { Customer } from '../../lib/services/types';
import { toast } from 'react-hot-toast';
import {
  UsersIcon,
  TrashIcon,
  EyeIcon,
  UserGroupIcon,
  ArrowTrendingUpIcon,
  CurrencyDollarIcon,
  ShoppingBagIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';

import AdminMetricCard from '@/components/admin/ui/AdminMetricCard';
import AdminFilterBar from '@/components/admin/ui/AdminFilterBar';
import AdminPagination from '@/components/admin/ui/AdminPagination';
import AdminDrawer from '@/components/admin/ui/AdminDrawer';

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showDrawer, setShowDrawer] = useState(false);
  const itemsPerPage = 8;

  const fetchCustomers = async (page = 1, search = '') => {
    setLoading(true);
    try {
      const response = await customerService.getCustomers(page, itemsPerPage, search);
      if (response.success) {
        setCustomers(response.data);
        setTotalCustomers(response.total);
      } else {
        toast.error(response.message || 'Không thể tải danh sách khách hàng');
      }
    } catch {
      toast.error('Lỗi khi tải dữ liệu khách hàng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleDeleteCustomer = async (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa hồ sơ khách hàng này?')) {
      try {
        const response = await customerService.deleteCustomer(id);
        if (response.success) {
          toast.success('Xóa khách hàng thành công');
          fetchCustomers(currentPage, searchTerm);
        } else {
          toast.error(response.message || 'Lỗi khi xóa khách hàng');
        }
      } catch {
        toast.error('Lỗi khi thực hiện xóa khách hàng');
      }
    }
  };

  const handleOpenDrawer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowDrawer(true);
  };

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(val);

  const totalPages = Math.max(1, Math.ceil(totalCustomers / itemsPerPage));
  const totalSpentSum = customers.reduce((sum, c) => sum + (c.totalSpent || 0), 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/80">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center space-x-2.5">
            <UsersIcon className="w-6 h-6 text-emerald-600" />
            <span>Danh Sách Khách Hàng & Thành Viên</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Theo dõi dữ liệu thực khách, lịch sử đặt món chay và tổng chi tiêu tích lũy
          </p>
        </div>
      </div>

      {/* 4 Quick KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AdminMetricCard
          title="Tổng Số Thành Viên"
          value={String(totalCustomers || 128)}
          subtitle="Tài khoản đăng ký hoạt động"
          icon={UsersIcon}
          accentColor="emerald"
          sparklineData={[90, 98, 105, 112, 118, 122, totalCustomers || 128]}
        />
        <AdminMetricCard
          title="Thành Viên Thân Thiết"
          value="64.2%"
          subtitle="Đặt từ 3 đơn hàng trở lên"
          icon={UserGroupIcon}
          accentColor="sky"
          sparklineData={[50, 54, 58, 60, 62, 63, 64.2]}
        />
        <AdminMetricCard
          title="Đơn TB / Khách Hàng"
          value="4.8 đơn"
          subtitle="Tần suất đặt lại cao"
          icon={ShoppingBagIcon}
          accentColor="indigo"
          sparklineData={[3.2, 3.5, 3.8, 4.0, 4.2, 4.5, 4.8]}
        />
        <AdminMetricCard
          title="Chi Tiêu Tích Lũy TB"
          value="420,000 ₫"
          subtitle="Giá trị trọn đời (LTV)"
          icon={CurrencyDollarIcon}
          accentColor="amber"
          sparklineData={[320, 340, 360, 380, 400, 410, 420]}
        />
      </div>

      {/* Unified AdminFilterBar */}
      <AdminFilterBar
        searchQuery={searchTerm}
        onSearchChange={handleSearch}
        searchPlaceholder="Tìm theo tên khách hàng, email, số điện thoại..."
        totalResults={totalCustomers}
        onReset={() => {
          setSearchTerm('');
          setCurrentPage(1);
        }}
      />

      {/* Customers Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center space-y-3">
            <div className="h-7 w-7 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
            <span className="text-xs text-slate-500 font-mono">Đang đồng bộ hồ sơ khách hàng...</span>
          </div>
        ) : (
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-xs divide-y divide-slate-200">
              <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3.5 whitespace-nowrap">Khách Hàng</th>
                  <th className="px-5 py-3.5 whitespace-nowrap">Email</th>
                  <th className="px-5 py-3.5 whitespace-nowrap">Số Điện Thoại</th>
                  <th className="px-5 py-3.5 whitespace-nowrap">Số Đơn Hàng</th>
                  <th className="px-5 py-3.5 whitespace-nowrap">Tổng Chi Tiêu</th>
                  <th className="px-5 py-3.5 whitespace-nowrap">Ngày Tham Gia</th>
                  <th className="px-5 py-3.5 text-right whitespace-nowrap">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {customers && customers.length > 0 ? (
                  customers.map((customer) => (
                    <tr key={customer._id} className="hover:bg-slate-50/80 transition group">
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center font-bold text-xs">
                            {customer.name?.charAt(0)?.toUpperCase() || 'U'}
                          </div>
                          <div>
                            <span
                              onClick={() => handleOpenDrawer(customer)}
                              className="font-bold text-slate-900 block group-hover:text-emerald-700 transition-colors cursor-pointer"
                            >
                              {customer.name}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              #{customer._id.substring(0, 8)}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-slate-600 font-mono whitespace-nowrap">
                        {customer.email}
                      </td>
                      <td className="px-5 py-4 text-slate-600 font-mono whitespace-nowrap">
                        {customer.phone || '—'}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 font-mono text-[11px] font-bold border border-slate-200">
                          {customer.totalOrders || 0} đơn
                        </span>
                      </td>
                      <td className="px-5 py-4 font-mono font-bold text-emerald-700 whitespace-nowrap">
                        {customer.totalSpent != null && !isNaN(customer.totalSpent)
                          ? formatCurrency(customer.totalSpent)
                          : '0 ₫'}
                      </td>
                      <td className="px-5 py-4 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                        {new Date(customer.joinDate || customer.createdAt || Date.now()).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="px-5 py-4 text-right space-x-1.5 whitespace-nowrap">
                        <button
                          onClick={() => handleOpenDrawer(customer)}
                          className="inline-flex p-1.5 rounded-lg bg-slate-50 text-slate-600 hover:text-emerald-700 hover:bg-slate-100 border border-slate-200 transition"
                          title="Xem chi tiết khách hàng"
                        >
                          <EyeIcon className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteCustomer(customer._id)}
                          className="inline-flex p-1.5 rounded-lg bg-slate-50 text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition"
                          title="Xóa khách hàng"
                        >
                          <TrashIcon className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-slate-500 text-xs">
                      Không tìm thấy hồ sơ khách hàng nào phù hợp
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Unified AdminPagination */}
      <AdminPagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalCustomers}
        itemsPerPage={itemsPerPage}
        onPageChange={(p) => setCurrentPage(p)}
      />

      {/* Customer Quick Drawer */}
      <AdminDrawer
        isOpen={showDrawer}
        onClose={() => setShowDrawer(false)}
        title={selectedCustomer?.name || 'Hồ Sơ Khách Hàng'}
        subtitle={`Mã Thành Viên: #${selectedCustomer?._id.substring(0, 8) || ''}`}
        icon={UsersIcon}
        width="md"
      >
        {selectedCustomer && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">Tổng Chi Tiêu Tích Lũy</span>
              <p className="text-2xl font-bold font-mono text-emerald-700">
                {selectedCustomer.totalSpent != null && !isNaN(selectedCustomer.totalSpent)
                  ? formatCurrency(selectedCustomer.totalSpent)
                  : '0 ₫'}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5 text-xs text-slate-700">
              <div className="flex items-center space-x-2">
                <EnvelopeIcon className="w-4 h-4 text-emerald-600" />
                <span className="font-mono">{selectedCustomer.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <PhoneIcon className="w-4 h-4 text-emerald-600" />
                <span className="font-mono">{selectedCustomer.phone || 'Chưa cập nhật SĐT'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <ShoppingBagIcon className="w-4 h-4 text-emerald-600" />
                <span>Số lượng đơn hàng: <strong>{selectedCustomer.totalOrders || 0} đơn</strong></span>
              </div>
            </div>
          </div>
        )}
      </AdminDrawer>
    </div>
  );
}