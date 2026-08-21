'use client';

import { useState } from 'react';
import { useApi } from '../../hooks/useApi';
import { promotionService } from '../../lib/services';
import { Promotion } from '../../lib/services/types';
import { PlusIcon, FunnelIcon, TagIcon, BoltIcon, TrashIcon, PencilIcon, EyeIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';

export default function PromotionsAdmin() {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(null);

  const getFilterParams = () => {
    const params: Record<string, unknown> = {
      page,
      limit,
    };

    if (statusFilter !== 'all') {
      params.status = statusFilter;
    }

    if (typeFilter !== 'all') {
      params.promotionType = typeFilter === 'regular' ? 'regular' : 'flash_sale';
    }

    return params;
  };

  const fetchPromotions = async () => {
    const params = getFilterParams();
    return promotionService.getAll(params);
  };

  const { data, loading, error, refetch } = useApi(fetchPromotions, true, [page, statusFilter, typeFilter]);

  const promotions = data?.data?.promotions || [];
  const pagination = data?.data?.pagination || { currentPage: 1, totalPages: 1, totalCount: 0 };

  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
    setPage(1);
  };

  const handleTypeFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTypeFilter(e.target.value);
    setPage(1);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    refetch();
  };

  const handleDeleteClick = (promotion: Promotion) => {
    setSelectedPromotion(promotion);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedPromotion) return;

    try {
      await promotionService.delete(selectedPromotion._id);
      refetch();
      setDeleteDialogOpen(false);
    } catch (err) {
      console.error('Error deleting promotion:', err);
    }
  };

  const getStatusBadge = (promotion: Promotion) => {
    const now = new Date();
    const startDate = new Date(promotion.startDate);
    const endDate = new Date(promotion.endDate);

    if (!promotion.isActive) {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700">
          Tạm Ngưng
        </span>
      );
    }

    if (now < startDate) {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/10 text-sky-400 border border-sky-500/20">
          Sắp Diễn Ra
        </span>
      );
    }

    if (now > endDate) {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
          Hết Hạn
        </span>
      );
    }

    return (
      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
        Đang Áp Dụng
      </span>
    );
  };

  const isLastPage = pagination.currentPage >= pagination.totalPages;
  const isFirstPage = pagination.currentPage <= 1;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center space-x-2.5">
            <TagIcon className="w-6 h-6 text-emerald-400" />
            <span>Chương Trình Ưu Đãi & Khuyến Mãi</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Quản lý mã giảm giá, voucher dinh dưỡng và sự kiện Flash Sale ẩm thực chay
          </p>
        </div>

        <Link href="/admin/promotions/create" className="self-start sm:self-auto">
          <button className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center space-x-2 transition shadow-sm">
            <PlusIcon className="h-4 w-4 stroke-[2.5]" />
            <span>Tạo Mã Ưu Đãi</span>
          </button>
        </Link>
      </div>

      {/* Filters Bar */}
      <div className="bg-slate-900/80 backdrop-blur-xl p-4 sm:p-5 rounded-2xl border border-slate-800/80 space-y-3">
        <div className="flex items-center space-x-2 text-xs font-semibold text-slate-300">
          <FunnelIcon className="h-4 w-4 text-emerald-400" />
          <span>Bộ Lọc Khuyến Mãi</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <select
              value={statusFilter}
              onChange={handleStatusFilterChange}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="all">Trạng thái: Tất cả</option>
              <option value="active">Đang áp dụng</option>
              <option value="upcoming">Sắp diễn ra</option>
              <option value="expired">Đã hết hạn</option>
            </select>
          </div>

          <div>
            <select
              value={typeFilter}
              onChange={handleTypeFilterChange}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="all">Loại ưu đãi: Tất cả</option>
              <option value="regular">Mã thông thường</option>
              <option value="flash_sale">Flash Sale giờ vàng</option>
            </select>
          </div>

          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo mã hoặc tên..."
              className="flex-1 px-3 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 transition"
            >
              Tìm
            </button>
          </form>
        </div>
      </div>

      {/* Promotions Table */}
      <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-800/80 overflow-hidden">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center space-y-3">
            <div className="h-7 w-7 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
            <span className="text-xs text-slate-400 font-mono">Đang tải danh sách ưu đãi...</span>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-rose-400 text-xs font-semibold">
            Không thể tải danh sách ưu đãi. Vui lòng thử lại sau.
          </div>
        ) : promotions.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            Chưa có chương trình ưu đãi nào trong hệ thống
          </div>
        ) : (
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-xs divide-y divide-slate-800">
              <thead className="bg-slate-950/70 text-slate-400 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3.5 whitespace-nowrap">Tên Ưu Đãi</th>
                  <th className="px-5 py-3.5 whitespace-nowrap">Mã Code</th>
                  <th className="px-5 py-3.5 whitespace-nowrap">Mức Giảm</th>
                  <th className="px-5 py-3.5 whitespace-nowrap">Hình Thức</th>
                  <th className="px-5 py-3.5 whitespace-nowrap">Đã Dùng / Tổng</th>
                  <th className="px-5 py-3.5 whitespace-nowrap">Thời Gian Hiệu Lực</th>
                  <th className="px-5 py-3.5 whitespace-nowrap">Trạng Thái</th>
                  <th className="px-5 py-3.5 text-right whitespace-nowrap">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {promotions.map((promotion) => (
                  <tr key={promotion._id} className="hover:bg-slate-800/40 transition group">
                    <td className="px-5 py-4 font-semibold text-slate-100 whitespace-nowrap">
                      {promotion.name}
                    </td>
                    <td className="px-5 py-4 font-mono font-bold text-emerald-400 whitespace-nowrap">
                      {promotion.code}
                    </td>
                    <td className="px-5 py-4 font-mono font-semibold text-slate-200 whitespace-nowrap">
                      {promotion.type === 'percentage'
                        ? `${promotion.value ?? promotion.discountValue ?? 0}%`
                        : `${(promotion.value ?? promotion.discountValue ?? 0).toLocaleString()} ₫`}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      {promotion.promotionType === 'regular' ? (
                        <span className="inline-flex items-center text-[11px] text-emerald-400 font-medium">
                          <TagIcon className="h-3.5 w-3.5 mr-1" />
                          Tiêu Chuẩn
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-[11px] text-amber-400 font-medium">
                          <BoltIcon className="h-3.5 w-3.5 mr-1" />
                          Flash Sale
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 font-mono text-slate-300 whitespace-nowrap">
                      {promotion.usedCodes} / {promotion.totalCodes}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-slate-400 font-mono text-[11px]">
                      {format(new Date(promotion.startDate), 'dd/MM/yyyy')} —{' '}
                      {format(new Date(promotion.endDate), 'dd/MM/yyyy')}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">{getStatusBadge(promotion)}</td>
                    <td className="px-5 py-4 text-right space-x-1.5 whitespace-nowrap">
                      <Link
                        href={`/admin/promotions/${promotion._id}`}
                        className="inline-flex p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-emerald-300 hover:bg-slate-700 transition"
                        title="Xem chi tiết"
                      >
                        <EyeIcon className="h-3.5 w-3.5" />
                      </Link>
                      <Link
                        href={`/admin/promotions/${promotion._id}/edit`}
                        className="inline-flex p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-emerald-300 hover:bg-slate-700 transition"
                        title="Chỉnh sửa"
                      >
                        <PencilIcon className="h-3.5 w-3.5" />
                      </Link>
                      <button
                        onClick={() => handleDeleteClick(promotion)}
                        className="inline-flex p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
                        title="Xóa ưu đãi"
                      >
                        <TrashIcon className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {promotions.length > 0 && (
          <div className="flex justify-between items-center px-5 py-3.5 bg-slate-950/60 border-t border-slate-800 text-xs">
            <div className="text-slate-400">
              Hiển thị <span className="font-mono text-slate-200">{promotions.length}</span> trên{' '}
              <span className="font-mono text-slate-200">{pagination.totalCount}</span> chương trình
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setPage(page - 1)}
                disabled={isFirstPage}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 rounded-lg border border-slate-700 transition"
              >
                Trước
              </button>
              <button
                onClick={() => setPage(page + 1)}
                disabled={isLastPage}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 rounded-lg border border-slate-700 transition"
              >
                Sau
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-slate-900 border border-slate-700 text-slate-100 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white font-bold">Xác Nhận Xóa Ưu Đãi</DialogTitle>
            <DialogDescription className="text-slate-400 text-xs pt-2 leading-relaxed">
              Bạn có chắc chắn muốn xóa chương trình ưu đãi &ldquo;{selectedPromotion?.name}&rdquo;?
              Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2 pt-4">
            <button
              onClick={() => setDeleteDialogOpen(false)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
            >
              Hủy
            </button>
            <button
              onClick={confirmDelete}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold"
            >
              Xóa Ngay
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}