"use client"

import React, { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { useCart } from "../../hooks/useCart"
import { useAuth } from "../../context/AuthContext"
import { cn } from "../../lib/utils"
import { ShoppingCart, Eye, Flame, Clock, Check } from "lucide-react"
import { toast } from "react-hot-toast"
import { MenuItem } from "../../lib/services/types"

export interface MenuItemCardProps {
  id?: string
  _id?: string
  name?: string
  price?: number
  description?: string
  image?: string
  category?: string
  calories?: number
  protein?: number
  carbs?: number
  fat?: number
  nutritionInfo?: {
    calories?: number
    protein?: number
    carbs?: number
    fat?: number
  }
  isAvailable?: boolean
  preparationTime?: number
  ingredients?: string[]
  allergens?: string[]
  isVegetarian?: boolean
  item?: MenuItem | {
    id?: string
    _id?: string
    name: string
    price: number
    image: string
    description: string
    category?: string
    calories?: number
    protein?: number
    carbs?: number
    fat?: number
    nutritionInfo?: {
      calories?: number
      protein?: number
      carbs?: number
      fat?: number
    }
    isAvailable?: boolean
    preparationTime?: number
    ingredients?: string[]
    allergens?: string[]
    isVegetarian?: boolean
  }
  className?: string
  viewMode?: 'visual' | 'macro'
}

export function MenuItemCard(props: MenuItemCardProps) {
  const { item, className, viewMode = 'visual' } = props
  const itemData = item || props
  const id = itemData.id || itemData._id || 'item-id'
  const name = itemData.name || 'Món chay tinh tuyển'
  const price = itemData.price || 75000
  const description = itemData.description || 'Chế biến từ nguyên liệu rau củ hữu cơ tươi trong ngày'
  const image = itemData.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600'
  const category = itemData.category || 'Món chính'

  const calories = itemData.calories ?? itemData.nutritionInfo?.calories ?? 420
  const protein = Number(itemData.protein ?? itemData.nutritionInfo?.protein ?? 16)
  const carbs = Number(itemData.carbs ?? itemData.nutritionInfo?.carbs ?? 60)
  const fat = Number(itemData.fat ?? itemData.nutritionInfo?.fat ?? 10)
  
  // 🌟 Chuẩn Hóa Tỷ Lệ Macro Theo Năng Lượng Thực Tế (Clinical 4-4-9 Standard):
  // - 1g Protein = 4 kcal, 1g Carbs = 4 kcal, 1g Fat = 9 kcal
  // - Tránh chia theo trọng lượng gam thô làm méo mó tỷ lệ đóng góp năng lượng của chất béo
  const proteinKcal = protein * 4
  const carbsKcal = carbs * 4
  const fatKcal = fat * 9
  const totalKcal = (proteinKcal + carbsKcal + fatKcal) || 1
  const proteinPct = Math.round((proteinKcal / totalKcal) * 100)
  const carbsPct = Math.round((carbsKcal / totalKcal) * 100)
  const fatPct = Math.round((fatKcal / totalKcal) * 100)



  const { addToCartWithMessage, isItemInCart, getItemQuantity } = useCart()
  const { isAuthenticated } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [justAdded, setJustAdded] = useState(false)

  const inCart = isItemInCart ? isItemInCart(id) : false
  const quantity = getItemQuantity ? getItemQuantity(id) : 0

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      setIsLoading(true)
      const fullItem: MenuItem = {
        _id: id,
        id: id,
        name,
        price,
        image,
        description,
        category,
        calories,
        protein,
        carbs,
        fat,
        isAvailable: itemData.isAvailable ?? true,
        preparationTime: itemData.preparationTime || 15,
        ingredients: itemData.ingredients || [],
        allergens: itemData.allergens || [],
        isVegetarian: itemData.isVegetarian ?? true,
      }
      if (addToCartWithMessage) {
        await addToCartWithMessage(fullItem, 1)
      }
      setJustAdded(true)
      setTimeout(() => setJustAdded(false), 1400)
      toast.success(`Đã thêm ${name} vào giỏ hàng`)
    } catch {
      toast.error('Không thể thêm món vào giỏ hàng')
    } finally {
      setIsLoading(false)
    }
  }

  // --- 1. MACRO ANALYTICS VIEW MODE ---
  if (viewMode === 'macro') {
    return (
      <motion.div
        layout
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        className={cn(
          "relative flex flex-col h-full rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm hover:shadow-md transition-all",
          className
        )}
      >
        {/* Top bar with Category & Calorie badge */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200/80">
            🌱 {category}
          </span>
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200/80">
            <Flame className="w-3.5 h-3.5 text-amber-600" />
            {calories} kcal
          </span>
        </div>

        {/* Title & Description */}
        <Link href={`/menu/${id}`} className="group">
          <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-800 transition-colors line-clamp-1 mb-1">
            {name}
          </h3>
        </Link>
        <p className="text-xs text-slate-500 line-clamp-2 mb-4">
          {description}
        </p>

        {/* Macro Nutrition Distribution Bar */}
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 mb-4">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-2">
            <span>Phân Bổ Dinh Dưỡng (Macro)</span>
            <span className="text-slate-400 font-normal">{protein + carbs + fat}g tổng</span>
          </div>

          <div className="macro-progress-track mb-3">
            <div className="macro-seg-protein" style={{ width: `${proteinPct}%` }} title={`Protein: ${protein}g (${proteinPct}%)`} />
            <div className="macro-seg-carbs" style={{ width: `${carbsPct}%` }} title={`Carbs: ${carbs}g (${carbsPct}%)`} />
            <div className="macro-seg-fat" style={{ width: `${fatPct}%` }} title={`Fat: ${fat}g (${fatPct}%)`} />
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-1.5 rounded-lg bg-blue-50/80 border border-blue-100">
              <div className="text-[10px] text-blue-700 font-medium">Đạm (Protein)</div>
              <div className="font-bold text-blue-800">{protein}g <span className="text-[10px] font-normal">({proteinPct}%)</span></div>
            </div>
            <div className="p-1.5 rounded-lg bg-amber-50/80 border border-amber-100">
              <div className="text-[10px] text-amber-700 font-medium">Tinh bột</div>
              <div className="font-bold text-amber-800">{carbs}g <span className="text-[10px] font-normal">({carbsPct}%)</span></div>
            </div>
            <div className="p-1.5 rounded-lg bg-pink-50/80 border border-pink-100">
              <div className="text-[10px] text-pink-700 font-medium">Chất béo</div>
              <div className="font-bold text-pink-800">{fat}g <span className="text-[10px] font-normal">({fatPct}%)</span></div>
            </div>
          </div>
        </div>

        {/* Meta details */}
        <div className="flex items-center justify-between text-xs text-slate-500 mb-4 px-1">
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{itemData.preparationTime || 15} phút chế biến</span>
          </div>
          <div className="text-emerald-800 font-semibold">
            Thuần thực vật
          </div>
        </div>

        {/* Footer with Price and CTA */}
        <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <div className="text-[11px] text-slate-400 uppercase font-semibold">Đơn giá</div>
            <div className="text-lg font-extrabold text-emerald-800">
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)}
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isLoading}
            className={cn(
              "px-4 py-2.5 rounded-xl font-bold text-xs inline-flex items-center gap-1.5 transition-all shadow-sm cursor-pointer",
              justAdded
                ? "bg-emerald-700 text-white"
                : inCart
                ? "bg-emerald-100 text-emerald-900 hover:bg-emerald-200"
                : "btn-primary-gradient text-white"
            )}
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                Đã thêm
              </>
            ) : inCart ? (
              <>
                <ShoppingCart className="w-3.5 h-3.5" />
                Trong giỏ ({quantity})
              </>
            ) : (
              <>
                <ShoppingCart className="w-3.5 h-3.5" />
                Chọn món
              </>
            )}
          </button>
        </div>
      </motion.div>
    )
  }

  // --- 2. VISUAL CARD VIEW MODE (DEFAULT) ---
  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className={cn(
        "group relative flex flex-col h-full rounded-2xl border border-slate-200/90 bg-white overflow-hidden shadow-sm hover:shadow-md transition-all",
        className
      )}
    >
      {/* Food Image Hero */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Nutri-Pill Calorie Overlay */}
        <div className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold bg-slate-900/80 text-white backdrop-blur-md shadow-sm flex items-center gap-1">
          <Flame className="w-3.5 h-3.5 text-amber-400" />
          {calories} kcal
        </div>

        {/* Protein Tag */}
        {protein >= 15 && (
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-600/90 text-white backdrop-blur-md shadow-sm">
            {protein}g Protein
          </div>
        )}

        {/* Quick View Button */}
        <div className="absolute inset-0 bg-slate-900/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Link
            href={`/menu/${id}`}
            className="p-3 bg-white/95 text-slate-900 rounded-full hover:bg-white transition-transform hover:scale-110 shadow-lg"
          >
            <Eye className="w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Card Body */}
      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <Link href={`/menu/${id}`} className="flex-1">
            <h3 className="font-bold text-base text-slate-900 hover:text-emerald-800 transition-colors line-clamp-1">
              {name}
            </h3>
          </Link>
        </div>

        <p className="text-xs text-slate-500 line-clamp-2 mb-4 flex-grow">
          {description}
        </p>

        {/* Mini Macro Chips */}
        <div className="flex items-center gap-2 mb-4">
          <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[11px] font-semibold">
            {protein}g Đạm
          </span>
          <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 text-[11px] font-semibold">
            {carbs}g Carbs
          </span>
          <span className="px-2 py-0.5 rounded-md bg-pink-50 text-pink-700 text-[11px] font-semibold">
            {fat}g Béo
          </span>
        </div>

        {/* Card Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <span className="text-lg font-extrabold text-emerald-800">
            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)}
          </span>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isLoading}
            className={cn(
              "px-4 py-2 rounded-xl font-bold text-xs inline-flex items-center gap-1.5 transition-all shadow-sm cursor-pointer",
              justAdded
                ? "bg-emerald-700 text-white"
                : inCart
                ? "bg-emerald-100 text-emerald-900 hover:bg-emerald-200"
                : "btn-primary-gradient text-white"
            )}
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                Đã thêm
              </>
            ) : inCart ? (
              <>
                <ShoppingCart className="w-3.5 h-3.5" />
                Trong giỏ ({quantity})
              </>
            ) : (
              <>
                <ShoppingCart className="w-3.5 h-3.5" />
                Chọn món
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default MenuItemCard;