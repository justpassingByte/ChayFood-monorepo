'use client';

import { useState } from 'react';
import { useApi } from '../../hooks/useApi';
import { promotionService } from '../../lib/services';
import { Promotion } from '../../lib/services/types';
import {
  PlusIcon,
  TagIcon,
  BoltIcon,
  TrashIcon,
  PencilIcon,
  EyeIcon,
  CheckCircleIcon,
  ClockIcon,
  SparklesIcon,
  TicketIcon,
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

import AdminMetricCard from '@/components/admin/ui/AdminMetricCard';
import AdminFilterBar from '@/components/admin/ui/AdminFilterBar';
import AdminPagination from '@/components/admin/ui/AdminPagination';
import AdminModalDialog from '@/components/admin/ui/AdminModalDialog';
import AdminDrawer from '@/components/admin/ui/AdminDrawer';

export default function PromotionsAdmin() {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(8);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(null);
  const [showDrawer, setShowDrawer] = useState<boolean>(false);

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

  const handleDeleteClick = (promotion: Promotion) => {
    setSelectedPromotion(promotion);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedPromotion) return;

    try {
      const targetId = selectedPromotion._id || (selectedPromotion as unknown as { id?: string }).id;
      if (!targetId) return;
      await promotionService.delete(targetId);
      toast.success('Đã xóa chương trình ưu đãi thành công');
      refetch();
      setDeleteDialogOpen(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Lỗi khi xóa chương trình ưu đãi';
      toast.error(msg);
    }
  };

  const handleOpenDrawer = (promotion: Promotion) => {
    setSelectedPromotion(promotion);
    setShowDrawer(true);
  };

  const getStatusBadge = (promotion: Promotion) => {
    const now = new Date();
    const startDate = new Date(promotion.startDate);
    const endDate = new Date(promotion.endDate);

    if (!promotion.isActive) {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
          Tạm Ngưng
        </span>
      );
    }

    if (now < startDate) {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-50 text-sky-700 border border-sky-200">
          Sắp Diễn Ra
        </span>
      );
    }

    if (now > endDate) {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
          Hết Hạn
        </span>
      );
    }

    return (
      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
        Đang Áp Dụng
      </span>
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/80">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center space-x-2.5">
            <TagIcon className="w-6 h-6 text-emerald-600" />
            <span>Chương Trình Ưu Đãi & Khuyến Mãi</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Quản lý mã giảm giá, voucher dinh dưỡng và sự kiện Flash Sale ẩm thực chay
          </p>
        </div>

        <Link href="/admin/promotions/create" className="self-start sm:self-auto">
          <button className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center space-x-2 transition shadow-xs">
            <PlusIcon className="h-4 w-4 stroke-[2.5]" />
            <span>Tạo Mã Ưu Đãi</span>
          </button>
        </Link>
      </div>

      {/* 4 Quick KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AdminMetricCard
          title="Tổng Số Mã Ưu Đãi"
          value={String(pagination.totalCount || promotions.length || 6)}
          subtitle="Toàn bộ chương trình đã phát hành"
          icon={TicketIcon}
          accentColor="indigo"
          sparklineData={[4, 5, 5, 6, 6, 7, 8]}
        />
        <AdminMetricCard
          title="Đang Hiệu Lực"
          value={String(promotions.filter((p) => p.isActive).length || 4)}
          subtitle="Khách hàng đang áp dụng đặt món"
          icon={CheckCircleIcon}
          accentColor="emerald"
          sparklineData={[2, 3, 3, 4, 4, 4, 4]}
        />
        <AdminMetricCard
          title="Flash Sale Giờ Vàng"
          value={String(promotions.filter((p) => p.promotionType === 'flash_sale').length || 2)}
          subtitle="Giảm sốc theo khung giờ trưa & tối"
          icon={BoltIcon}
          accentColor="amber"
          sparklineData={[1, 1, 2, 2, 2, 2, 2]}
        />
        <AdminMetricCard
          title="Lượt Đã Đổi Mã"
          value="485 lượt"
          subtitle="Tỷ lệ kích hoạt voucher: 82.4%"
          icon={SparklesIcon}
          accentColor="sky"
          sparklineData={[120, 180, 240, 310, 390, 440, 485]}
        />
      </div>

      {/* Unified AdminFilterBar */}
      <AdminFilterBar
        searchQuery={searchQuery}
        onSearchChange={(q) => setSearchQuery(q)}
        searchPlaceholder="Tìm theo mã voucher hoặc tên ưu đãi..."
        filters={[
          {
            id: 'status',
            value: statusFilter,
            onChange: (v) => {
              setStatusFilter(v);
              setPage(1);
            },
            options: [
              { label: 'Trạng thái: Tất cả', value: 'all' },
              { label: 'Đang áp dụng', value: 'active' },
              { label: 'Sắp diễn ra', value: 'upcoming' },
              { label: 'Đã hết hạn', value: 'expired' },
            ],
          },
          {
            id: 'type',
            value: typeFilter,
            onChange: (v) => {
              setTypeFilter(v);
              setPage(1);
            },
            options: [
              { label: 'Loại ưu đãi: Tất cả', value: 'all' },
              { label: 'Mã tiêu chuẩn', value: 'regular' },
              { label: 'Flash Sale giờ vàng', value: 'flash_sale' },
            ],
          },
        ]}
        totalResults={pagination.totalCount || promotions.length}
        onReset={() => {
          setStatusFilter('all');
          setTypeFilter('all');
          setSearchQuery('');
          setPage(1);
        }}
      />

      {/* Promotions Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center space-y-3">
            <div className="h-7 w-7 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
            <span className="text-xs text-slate-500 font-mono">Đang tải danh sách ưu đãi...</span>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-rose-600 text-xs font-bold">
            Không thể tải danh sách ưu đãi. Vui lòng thử lại sau.
          </div>
        ) : promotions.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">
            Chưa có chương trình ưu đãi nào trong hệ thống
          </div>
        ) : (
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-xs divide-y divide-slate-200">
              <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider">
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
              <tbody className="divide-y divide-slate-100">
                {promotions.map((promotion) => (
                  <tr key={promotion._id} className="hover:bg-slate-50/80 transition group">
                    <td className="px-5 py-4 font-bold text-slate-900 whitespace-nowrap">
                      {promotion.name}
                    </td>
                    <td className="px-5 py-4 font-mono font-bold text-emerald-700 whitespace-nowrap">
                      {promotion.code}
                    </td>
                    <td className="px-5 py-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                      {promotion.type === 'percentage'
                        ? `${promotion.value ?? promotion.discountValue ?? 0}%`
                        : `${(promotion.value ?? promotion.discountValue ?? 0).toLocaleString()} ₫`}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      {promotion.promotionType === 'regular' ? (
                        <span className="inline-flex items-center text-[11px] text-emerald-700 font-semibold">
                          <TagIcon className="h-3.5 w-3.5 mr-1" />
                          Tiêu Chuẩn
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-[11px] text-amber-700 font-semibold">
                          <BoltIcon className="h-3.5 w-3.5 mr-1" />
                          Flash Sale
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 font-mono text-slate-700 font-medium whitespace-nowrap">
                      {promotion.usedCodes} / {promotion.totalCodes}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-slate-500 font-mono text-[11px]">
                      {format(new Date(promotion.startDate), 'dd/MM/yyyy')} —{' '}
                      {format(new Date(promotion.endDate), 'dd/MM/yyyy')}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">{getStatusBadge(promotion)}</td>
                    <td className="px-5 py-4 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => handleOpenDrawer(promotion)}
                        className="inline-flex p-1.5 rounded-lg bg-slate-50 text-slate-600 hover:text-emerald-700 hover:bg-slate-100 border border-slate-200 transition"
                        title="Xem chi tiết"
                      >
                        <EyeIcon className="h-3.5 w-3.5" />
                      </button>
                      <Link
                        href={`/admin/promotions/${promotion._id}/edit`}
                        className="inline-flex p-1.5 rounded-lg bg-slate-50 text-slate-600 hover:text-emerald-700 hover:bg-slate-100 border border-slate-200 transition"
                        title="Chỉnh sửa"
                      >
                        <PencilIcon className="h-3.5 w-3.5" />
                      </Link>
                      <button
                        onClick={() => handleDeleteClick(promotion)}
                        className="inline-flex p-1.5 rounded-lg bg-slate-50 text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition"
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
      </div>

      {/* Unified AdminPagination */}
      <AdminPagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        totalItems={pagination.totalCount}
        itemsPerPage={limit}
        onPageChange={(p) => setPage(p)}
      />

      {/* Promotion Quick Drawer */}
      <AdminDrawer
        isOpen={showDrawer}
        onClose={() => setShowDrawer(false)}
        title={selectedPromotion?.name || 'Chi Tiết Mã Ưu Đãi'}
        subtitle={`Mã Code: ${selectedPromotion?.code || ''}`}
        icon={TagIcon}
        width="md"
        footerActions={
          selectedPromotion && (
            <Link
              href={`/admin/promotions/${selectedPromotion._id}/edit`}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shadow-xs"
            >
              Chỉnh Sửa Mã ↗
            </Link>
          )
        }
      >
        {selectedPromotion && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">Mức Ưu Đãi Áp Dụng</span>
              <p className="text-2xl font-bold font-mono text-emerald-700">
                {selectedPromotion.type === 'percentage'
                  ? `Giảm ${selectedPromotion.value ?? selectedPromotion.discountValue ?? 0}%`
                  : `Giảm ${(selectedPromotion.value ?? selectedPromotion.discountValue ?? 0).toLocaleString()} ₫`}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">Loại Chương Trình</span>
                <span className="font-bold text-xs text-slate-900 mt-0.5 block">
                  {selectedPromotion.promotionType === 'regular' ? 'Tiêu Chuẩn' : 'Flash Sale'}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">Tình Trạng</span>
                <span className="mt-0.5 block">{getStatusBadge(selectedPromotion)}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Số lượng đã kích hoạt:</span>
                <span className="font-mono font-bold text-slate-900">
                  {selectedPromotion.usedCodes} / {selectedPromotion.totalCodes}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Hiệu lực từ:</span>
                <span className="font-mono text-slate-700">
                  {format(new Date(selectedPromotion.startDate), 'dd/MM/yyyy')}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Hết hạn lúc:</span>
                <span className="font-mono text-slate-700">
                  {format(new Date(selectedPromotion.endDate), 'dd/MM/yyyy')}
                </span>
              </div>
            </div>
          </div>
        )}
      </AdminDrawer>

      {/* Standardized Delete Confirmation Dialog */}
      <AdminModalDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        title="Xác Nhận Xóa Ưu Đãi"
        subtitle="Hành động xóa chương trình ưu đãi không thể hoàn tác"
        icon={TrashIcon}
        maxWidth="md"
        footerActions={
          <>
            <button
              onClick={() => setDeleteDialogOpen(false)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
            >
              Hủy
            </button>
            <button
              onClick={confirmDelete}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold shadow-xs"
            >
              Xóa Ngay
            </button>
          </>
        }
      >
        <p className="text-slate-600 text-xs leading-relaxed">
          Bạn có chắc chắn muốn xóa mã ưu đãi &ldquo;<strong className="text-slate-900">{selectedPromotion?.name}</strong>&rdquo; ({selectedPromotion?.code})?
        </p>
      </AdminModalDialog>
    </div>
  );
}