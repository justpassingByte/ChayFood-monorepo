'use client';

import React from 'react';
import {
  Check,
  Clock,
  ChefHat,
  PackageCheck,
  Truck,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import {
  OrderStatus,
  ORDER_STATUS_FLOW,
  ORDER_STATUS_LABELS,
  getStatusStepIndex,
} from '@chayfood/shared-types';

interface OrderStatusTimelineProps {
  currentStatus: OrderStatus | string;
  createdAt: string;
  updatedAt?: string;
  deliveryTime?: string | null;
}

interface StepConfig {
  status: OrderStatus;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const STEPS: StepConfig[] = [
  {
    status: 'PENDING',
    label: 'Đặt hàng & Chờ thanh toán',
    description: 'Đơn hàng đã được ghi nhận',
    icon: Clock,
  },
  {
    status: 'CONFIRMED',
    label: 'Đã xác nhận',
    description: 'Hệ thống đã nhận đơn & chuyển tới bếp',
    icon: CheckCircle2,
  },
  {
    status: 'PREPARING',
    label: 'Đang chế biến',
    description: 'Bếp chay đang nấu món tươi ngon',
    icon: ChefHat,
  },
  {
    status: 'READY',
    label: 'Sẵn sàng giao',
    description: 'Món ăn đã đóng gói cẩn thận',
    icon: PackageCheck,
  },
  {
    status: 'DELIVERING',
    label: 'Đang giao hàng',
    description: 'Tài xế đang trên đường mang tới bạn',
    icon: Truck,
  },
  {
    status: 'DELIVERED',
    label: 'Giao thành công',
    description: 'Chúc bạn có bữa ăn thanh lành trọn vị',
    icon: Check,
  },
];

export function OrderStatusTimeline({
  currentStatus,
  createdAt,
  updatedAt,
}: OrderStatusTimelineProps) {
  const normStatus = currentStatus.toUpperCase() as OrderStatus;
  const isCancelled = normStatus === 'CANCELLED';
  const currentStepIdx = getStatusStepIndex(normStatus);

  const formatTime = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return new Intl.DateTimeFormat('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit',
      }).format(d);
    } catch {
      return '';
    }
  };

  if (isCancelled) {
    return (
      <div className="bg-red-50/80 border border-red-200 rounded-3xl p-6 text-center space-y-2">
        <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
          <XCircle className="w-6 h-6" />
        </div>
        <h3 className="text-base font-black text-red-900">Đơn Hàng Đã Hủy</h3>
        <p className="text-xs text-red-700 max-w-md mx-auto">
          Đơn hàng này đã bị hủy. Nếu bạn cần hỗ trợ thêm, vui lòng liên hệ bộ phận chăm sóc khách hàng.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-xs">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-base sm:text-lg font-black text-slate-950 tracking-tight">
            Tiến Trình Đơn Hàng
          </h2>
          <p className="text-[11px] text-slate-500">
            Cập nhật trạng thái chế biến và giao món theo thời gian thực
          </p>
        </div>
        <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
          {ORDER_STATUS_LABELS[normStatus] || normStatus}
        </span>
      </div>

      <div className="relative pl-6 sm:pl-8 space-y-6 sm:space-y-8 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
        {STEPS.map((step, idx) => {
          const isPassed = currentStepIdx > idx;
          const isCurrent = currentStepIdx === idx;
          const Icon = step.icon;

          return (
            <div key={step.status} className="relative flex items-start gap-4">
              {/* Step Circle Marker */}
              <div
                className={`absolute -left-6 sm:-left-8 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                  isPassed
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : isCurrent
                    ? 'bg-emerald-600 text-white ring-4 ring-emerald-100 animate-pulse'
                    : 'bg-white text-slate-400 border-2 border-slate-300'
                }`}
              >
                {isPassed ? (
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                ) : (
                  <Icon className="w-3.5 h-3.5" />
                )}
              </div>

              {/* Step Content */}
              <div className="space-y-0.5 flex-1">
                <div className="flex items-center justify-between">
                  <h4
                    className={`text-xs sm:text-sm font-bold tracking-tight ${
                      isCurrent
                        ? 'text-emerald-950 font-black'
                        : isPassed
                        ? 'text-slate-800'
                        : 'text-slate-400'
                    }`}
                  >
                    {step.label}
                  </h4>
                  {isCurrent && (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/80">
                      Hiện tại
                    </span>
                  )}
                  {isPassed && idx === 0 && (
                    <span className="text-[10px] text-slate-400 font-medium">
                      {formatTime(createdAt)}
                    </span>
                  )}
                  {isCurrent && updatedAt && idx > 0 && (
                    <span className="text-[10px] text-emerald-700 font-bold">
                      {formatTime(updatedAt)}
                    </span>
                  )}
                </div>
                <p
                  className={`text-[11px] leading-relaxed ${
                    isCurrent ? 'text-slate-600' : isPassed ? 'text-slate-500' : 'text-slate-400'
                  }`}
                >
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
