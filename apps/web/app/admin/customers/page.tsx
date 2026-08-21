'use client';

import { useState, useEffect } from 'react';
import { customerService } from '../../lib/services';
import { Customer } from '../../lib/services/types';
import { toast } from 'react-hot-toast';
import { UsersIcon, MagnifyingGlassIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const itemsPerPage = 10;

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

  const handleSearch = () => {
    setCurrentPage(1);
    fetchCustomers(1, searchTerm);
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

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(val);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center space-x-2.5">
            <UsersIcon className="w-6 h-6 text-emerald-400" />
            <span>Danh Sách Khách Hàng & Thành Viên</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Theo dõi dữ liệu thực khách, lịch sử đặt món chay và tổng chi tiêu tích lũy
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm theo tên, email, SĐT..."
              className="pl-9 pr-4 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <MagnifyingGlassIcon className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>
          <button
            onClick={handleSearch}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-3.5 py-2 rounded-xl text-xs transition"
          >
            Tìm
          </button>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-800/80 overflow-hidden">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center space-y-3">
            <div className="h-7 w-7 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
            <span className="text-xs text-slate-400 font-mono">Đang đồng bộ hồ sơ khách hàng...</span>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left text-xs divide-y divide-slate-800">
                <thead className="bg-slate-950/70 text-slate-400 font-semibold uppercase tracking-wider">
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
                <tbody className="divide-y divide-slate-800/60">
                  {customers && customers.length > 0 ? (
                    customers.map((customer) => (
                      <tr key={customer._id} className="hover:bg-slate-800/40 transition group">
                        <td className="px-5 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-xs">
                              {customer.name?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                            <div>
                              <span className="font-semibold text-slate-100 block">
                                {customer.name}
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono">
                                #{customer._id.substring(0, 8)}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-slate-300 font-mono whitespace-nowrap">
                          {customer.email}
                        </td>
                        <td className="px-5 py-4 text-slate-300 font-mono whitespace-nowrap">
                          {customer.phone || '—'}
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap">
                          <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-200 font-mono text-[11px] border border-slate-700">
                            {customer.totalOrders || 0} đơn
                          </span>
                        </td>
                        <td className="px-5 py-4 font-mono font-bold text-emerald-400 whitespace-nowrap">
                          {customer.totalSpent != null && !isNaN(customer.totalSpent)
                            ? formatCurrency(customer.totalSpent)
                            : '0 ₫'}
                        </td>
                        <td className="px-5 py-4 text-slate-400 font-mono text-[11px] whitespace-nowrap">
                          {new Date(customer.joinDate || customer.createdAt || Date.now()).toLocaleDateString('vi-VN')}
                        </td>
                        <td className="px-5 py-4 text-right space-x-1.5 whitespace-nowrap">
                          <Link
                            href={`/admin/customers/${customer._id}`}
                            className="inline-flex p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-emerald-300 hover:bg-slate-700 transition"
                            title="Xem chi tiết"
                          >
                            <EyeIcon className="h-3.5 w-3.5" />
                          </Link>
                          <button
                            onClick={() => handleDeleteCustomer(customer._id)}
                            className="inline-flex p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
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

            {totalCustomers > itemsPerPage && (
              <div className="flex justify-between items-center px-5 py-3.5 bg-slate-950/60 border-t border-slate-800 text-xs">
                <span className="text-slate-400">
                  Trang <strong className="font-mono text-slate-200">{currentPage}</strong> /{' '}
                  <strong className="font-mono text-slate-200">{Math.ceil(totalCustomers / itemsPerPage)}</strong>
                </span>
                <div className="flex space-x-2">
                  <button
                    className="px-3 py-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 rounded-lg border border-slate-700 transition"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    Trước
                  </button>
                  <button
                    className="px-3 py-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 rounded-lg border border-slate-700 transition"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(totalCustomers / itemsPerPage)))}
                    disabled={currentPage >= Math.ceil(totalCustomers / itemsPerPage)}
                  >
                    Sau
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}