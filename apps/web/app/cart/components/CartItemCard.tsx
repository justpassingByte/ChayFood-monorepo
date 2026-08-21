'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Plus, Minus, Trash2, Flame, User, MessageSquare } from 'lucide-react';
import { CartLineItem } from '../../store/useCartStore';

interface CartItemCardProps {
  item: CartLineItem;
  onIncrease: (id: string) => void;
  onDecrease: (id: string) => void;
  onRemove: (id: string) => void;
}

export function CartItemCard({ item, onIncrease, onDecrease, onRemove }: CartItemCardProps) {
  const dish = item.menuItem;
  const dishId = dish._id || dish.id || '';
  const unitPrice = dish.price || 0;
  const lineTotal = unitPrice * item.quantity;
  const calories = Number(dish.calories ?? dish.nutritionInfo?.calories ?? 400);
  const protein = Number(dish.protein ?? dish.nutritionInfo?.protein ?? 15);

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-4 sm:p-5 shadow-xs hover:border-slate-300 transition-colors group">
      <div className="flex flex-col sm:flex-row items-start gap-4">
        {/* Left: Image */}
        <Link
          href={`/menu/${dishId}`}
          className="relative w-full sm:w-28 h-36 sm:h-28 rounded-2xl overflow-hidden bg-slate-900 shrink-0 border border-slate-200/80 group-hover:shadow-xs transition-shadow"
        >
          <Image
            src={dish.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400'}
            alt={dish.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, 112px"
          />
          <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-slate-950/80 text-white text-[9px] font-bold backdrop-blur-xs">
            {typeof dish.category === 'string' ? dish.category.toUpperCase() : 'MÓN CHAY'}
          </div>
        </Link>

        {/* Middle: Details & Badges */}
        <div className="flex-1 min-w-0 w-full">
          <div className="flex items-start justify-between gap-3">
            <div>
              <Link
                href={`/menu/${dishId}`}
                className="font-bold text-sm sm:text-base text-slate-950 hover:text-emerald-800 transition-colors line-clamp-1"
              >
                {dish.name}
              </Link>

              {/* Badges: Portion & Assigned Member */}
              <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                {item.portionName && (
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-md">
                    {item.portionName}
                  </span>
                )}

                {item.assignedMemberName && item.assignedMemberName !== 'Bản thân' && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                    <User className="w-2.5 h-2.5 text-slate-500" />
                    Khẩu phần: {item.assignedMemberName}
                  </span>
                )}

                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-800 bg-amber-50/80 border border-amber-200/60 px-2 py-0.5 rounded-md">
                  <Flame className="w-2.5 h-2.5 text-amber-600" />
                  {calories * item.quantity} kcal • {(protein * item.quantity).toFixed(1)}g Đạm
                </span>
              </div>
            </div>

            {/* Trash button (Desktop) */}
            <button
              type="button"
              onClick={() => onRemove(item.id)}
              className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
              title="Xóa món khỏi giỏ hàng"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Special Instructions / Notes */}
          {item.specialInstructions && (
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-2 bg-slate-50 p-2 rounded-xl border border-slate-100">
              <MessageSquare className="w-3 h-3 text-slate-400 shrink-0" />
              <span className="truncate">Ghi chú: {item.specialInstructions}</span>
            </div>
          )}

          {/* Bottom Row: Stepper & Price */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
            {/* Stepper Controls */}
            <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-0.5 shadow-2xs">
              <button
                type="button"
                onClick={() => onDecrease(item.id)}
                className="w-7 h-7 rounded-lg bg-white hover:bg-slate-100 flex items-center justify-center text-slate-700 transition-colors cursor-pointer font-bold shadow-2xs"
                title="Giảm số lượng"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>

              <span className="w-8 text-center font-black text-xs text-slate-950">
                {item.quantity}
              </span>

              <button
                type="button"
                onClick={() => onIncrease(item.id)}
                className="w-7 h-7 rounded-lg bg-white hover:bg-slate-100 flex items-center justify-center text-slate-700 transition-colors cursor-pointer font-bold shadow-2xs"
                title="Tăng số lượng"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Price block */}
            <div className="text-right">
              <div className="text-sm sm:text-base font-black text-slate-950">
                {lineTotal.toLocaleString('vi-VN')} <span className="text-xs font-bold text-slate-500">đ</span>
              </div>
              {item.quantity > 1 && (
                <div className="text-[10px] text-slate-400 font-medium">
                  {unitPrice.toLocaleString('vi-VN')} đ / phần
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
