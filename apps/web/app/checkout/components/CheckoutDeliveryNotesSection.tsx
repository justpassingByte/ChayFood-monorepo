'use client';

import React from 'react';
import { Clock, MessageSquare, Utensils } from 'lucide-react';

interface CheckoutDeliveryNotesSectionProps {
  deliveryTimeType: 'asap' | 'lunch' | 'dinner';
  onSelectTimeType: (type: 'asap' | 'lunch' | 'dinner') => void;
  kitchenNotes: string;
  onChangeKitchenNotes: (notes: string) => void;
}

export function CheckoutDeliveryNotesSection({
  deliveryTimeType,
  onSelectTimeType,
  kitchenNotes,
  onChangeKitchenNotes,
}: CheckoutDeliveryNotesSectionProps) {
  const timeSlots = [
    {
      id: 'asap',
      title: 'Giao ngay nóng hổi',
      subtitle: 'Khoảng 30 - 45 phút',
    },
    {
      id: 'lunch',
      title: 'Bữa trưa tươi ngon',
      subtitle: 'Khung 11:00 - 12:00',
    },
    {
      id: 'dinner',
      title: 'Bữa tối thanh nhẹ',
      subtitle: 'Khung 17:30 - 18:30',
    },
  ] as const;

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-black text-xs border border-emerald-200/80">
          3
        </div>
        <div>
          <h2 className="text-base font-black text-slate-950 tracking-tight">
            Thời Gian Giao & Ghi Chú Bếp
          </h2>
          <p className="text-[11px] text-slate-500">
            Tùy chọn thời điểm thưởng thức và khẩu vị riêng biệt
          </p>
        </div>
      </div>

      {/* Time Slot Selection */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
        {timeSlots.map((slot) => {
          const isSelected = deliveryTimeType === slot.id;
          return (
            <div
              key={slot.id}
              onClick={() => onSelectTimeType(slot.id)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer text-center ${
                isSelected
                  ? 'border-emerald-600 bg-emerald-50/60 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="font-bold text-xs text-slate-950">{slot.title}</div>
              <div className="text-[10px] text-slate-500 font-medium mt-0.5">{slot.subtitle}</div>
            </div>
          );
        })}
      </div>

      {/* Kitchen Notes */}
      <div className="pt-2">
        <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
          Ghi chú chế biến & giao hàng
        </label>
        <div className="relative">
          <textarea
            rows={2}
            placeholder="Ví dụ: Giảm cay, không ăn ớt, giao trước cửa phòng..."
            value={kitchenNotes}
            onChange={(e) => onChangeKitchenNotes(e.target.value)}
            className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600 resize-none"
          />
        </div>
      </div>
    </div>
  );
}
