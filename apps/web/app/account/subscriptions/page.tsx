'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  CalendarDays,
  Clock,
  MapPin,
  PauseCircle,
  PlayCircle,
  Sparkles,
  ArrowRight,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Heart,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import {
  subscriptionService,
  UserSubscription,
} from '../../lib/services/subscriptionService';

export default function AccountSubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<UserSubscription[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const fetchSubscriptions = useCallback(async () => {
    try {
      setLoading(true);
      const data = await subscriptionService.getMySubscriptions();
      setSubscriptions(data);
    } catch {
      toast.error('Không thể tải thông tin gói ăn');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  const handleToggle = async (subId: string, currentActive: boolean) => {
    const actionText = currentActive ? 'tạm dừng' : 'tiếp tục phục vụ';
    if (!window.confirm(`Bạn có chắc chắn muốn ${actionText} gói ăn này?`)) return;

    try {
      setActionLoadingId(subId);
      await subscriptionService.toggle(subId);
      toast.success(`Đã ${actionText} gói ăn`);
      await fetchSubscriptions();
    } catch {
      toast.error('Không thể thay đổi trạng thái gói ăn');
    } finally {
      setActionLoadingId(null);
    }
  };

  const formatDate = (iso: string) => {
    try {
      const d = new Date(iso);
      return new Intl.DateTimeFormat('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }).format(d);
    } catch {
      return iso;
    }
  };

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

  if (loading) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200/90 p-12 flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
        <span className="text-xs text-slate-500 font-medium">Đang tải gói ăn định kỳ...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200/60">
              <CalendarDays className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-950 tracking-tight">
                Gói Ăn Định Kỳ Của Tôi
              </h2>
              <p className="text-[11px] text-slate-500">
                Quản lý lịch giao món, tạm dừng hoặc gia hạn các mâm cơm chay tuần/tháng
              </p>
            </div>
          </div>

          <Link
            href="/subscriptions"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Đăng Ký Gói Mới</span>
          </Link>
        </div>
      </div>

      {/* Subscriptions List or Empty State */}
      {subscriptions.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-12 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200/80">
            <CalendarDays className="w-8 h-8" />
          </div>

          <div className="max-w-md mx-auto space-y-2">
            <h3 className="text-base font-black text-slate-950">
              Bạn Chưa Đăng Ký Gói Ăn Nào
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Tiết kiệm thời gian mỗi ngày với dịch vụ giao mâm cơm chay tận nơi đúng giờ, thực đơn đổi vị liên tục và chuẩn cân bằng dinh dưỡng.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto text-left text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
              <span className="font-bold text-emerald-800">Gói 7 Ngày Thanh Tịnh</span>
              <p className="text-slate-500 text-[11px]">Bữa trưa thanh nhẹ, hỗ trợ tiêu hóa êm dịu</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
              <span className="font-bold text-emerald-800">Gói 30 Ngày Cân Bằng</span>
              <p className="text-slate-500 text-[11px]">Đổi mới món ăn liên tục, tặng lẩu nấm cuối tuần</p>
            </div>
          </div>

          <Link
            href="/subscriptions"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition shadow-xs"
          >
            <span>Khám Phá Các Gói Ăn Chay</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {subscriptions.map((sub) => {
            const isActive = sub.isActive;
            const isProcessing = actionLoadingId === sub.id;

            return (
              <div
                key={sub.id}
                className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-5"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-black text-slate-950">
                        {sub.plan?.name || 'Gói Ăn Chay Định Kỳ'}
                      </h3>
                      <span
                        className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${
                          isActive
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}
                      >
                        {isActive ? 'ĐANG PHỤC VỤ' : 'TẠM DỪNG'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Thời hạn: <strong>{formatDate(sub.startDate)}</strong> &rarr; <strong>{formatDate(sub.endDate)}</strong>
                    </p>
                  </div>

                  <span className="text-sm font-black text-emerald-800">
                    {formatCurrency(Number(sub.totalAmount))}
                  </span>
                </div>

                {/* Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600 bg-slate-50/70 p-4 rounded-2xl border border-slate-200/70">
                  <div className="space-y-1">
                    <span className="text-slate-400 font-medium">Khẩu phần mỗi ngày:</span>
                    <p className="font-bold text-slate-900">
                      {sub.plan?.mealsPerDay || 1} bữa / ngày (Giao tận nơi)
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-slate-400 font-medium">Địa chỉ nhận món:</span>
                    <p className="font-bold text-slate-900 truncate">
                      {sub.deliveryAddress?.street || 'Theo địa chỉ mặc định'}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-2">
                  <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Tự động tạm ngưng giao khi bạn cần đi công tác hoặc du lịch</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggle(sub.id, isActive)}
                      disabled={isProcessing}
                      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition border ${
                        isActive
                          ? 'bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-200'
                          : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200'
                      }`}
                    >
                      {isProcessing ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : isActive ? (
                        <PauseCircle className="w-3.5 h-3.5" />
                      ) : (
                        <PlayCircle className="w-3.5 h-3.5" />
                      )}
                      <span>{isActive ? 'Tạm Dừng Gói' : 'Tiếp Tục Giao'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
