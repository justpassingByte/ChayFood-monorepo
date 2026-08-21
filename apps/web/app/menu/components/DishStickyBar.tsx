"use client"

import React from "react"
import { ShoppingBag, Check } from "lucide-react"

interface DishStickyBarProps {
  name: string
  price: number
  quantity: number
  onQuantityChange: (qty: number) => void
  onAddToCart: () => void
  isAdded?: boolean
  assignedMemberName?: string
}

export function DishStickyBar({
  name,
  price,
  quantity,
  onQuantityChange,
  onAddToCart,
  isAdded,
  assignedMemberName,
}: DishStickyBarProps) {
  const totalPrice = price * quantity

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-3 shadow-2xl">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-xs font-bold text-slate-900 truncate max-w-[140px]">
            {name}
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-sm font-black text-emerald-800">
              {totalPrice.toLocaleString("vi-VN")} đ
            </span>
            {assignedMemberName && (
              <span className="text-[10px] text-slate-500 font-medium truncate max-w-[80px]">
                ({assignedMemberName})
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Quantity stepper */}
          <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-0.5">
            <button
              type="button"
              onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
              className="w-7 h-7 flex items-center justify-center font-bold text-slate-600 hover:bg-white rounded-lg transition-colors cursor-pointer text-sm"
            >
              -
            </button>
            <span className="w-6 text-center text-xs font-black text-slate-900">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => onQuantityChange(quantity + 1)}
              className="w-7 h-7 flex items-center justify-center font-bold text-slate-600 hover:bg-white rounded-lg transition-colors cursor-pointer text-sm"
            >
              +
            </button>
          </div>

          {/* Add to Cart CTA */}
          <button
            type="button"
            onClick={onAddToCart}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs transition-all shadow-sm cursor-pointer ${
              isAdded
                ? "bg-emerald-600 text-white"
                : "bg-slate-950 hover:bg-emerald-900 text-white"
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                Đã thêm
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                Thêm món
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
