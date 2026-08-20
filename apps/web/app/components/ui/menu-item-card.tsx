"use client"

import React, { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ShoppingBagIcon, SparklesIcon } from "@heroicons/react/24/outline"
import { useCart } from "../../hooks/useCart"
import { useAuth } from "../../context/AuthContext"
import { cn } from "../../lib/utils"

export interface MenuItemCardProps {
  id?: string
  _id?: string
  name?: string
  price?: number
  description?: string
  image?: string
  category?: string
  nutritionInfo?: {
    calories?: number
    protein?: number
    carbs?: number
    fat?: number
  }
  isBestSeller?: boolean
  isPopular?: boolean
  item?: any
  className?: string
}

export function MenuItemCard(props: MenuItemCardProps) {
  const itemData = props.item || props
  const id = itemData.id || itemData._id || 'item-id'
  const name = itemData.name || 'Món chay tinh tuyển'
  const price = itemData.price || 75000
  const description = itemData.description || 'Chế biến từ nguyên liệu rau củ hữu cơ tươi trong ngày'
  const image = itemData.image || '/meals/meal1.jpg'
  const category = itemData.category || 'Món chính'
  const nutritionInfo = itemData.nutritionInfo
  const isBestSeller = itemData.isBestSeller
  const isPopular = itemData.isPopular

  const { addToCartWithMessage } = useCart()
  const { isAuthenticated } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [added, setAdded] = useState(false)

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      if (addToCartWithMessage) {
        await addToCartWithMessage({
          _id: id,
          id: id,
          name,
          price,
          image,
          description,
          category
        } as any, 1)
      }
      setAdded(true)
      setTimeout(() => setAdded(false), 2000)
    } catch {
      // Handled
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "editorial-card group flex flex-col h-full bg-white relative",
        props.className
      )}
    >
      {/* Visual Image Container */}
      <div className="relative h-52 w-full overflow-hidden bg-sage-50">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/40 via-transparent to-transparent opacity-60" />

        {/* Badges Top */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <span className="px-2.5 py-1 rounded-full bg-pearl-100/90 backdrop-blur-sm text-sage-900 text-[10px] font-bold uppercase tracking-wider shadow-sm">
            {category}
          </span>
          {isBestSeller && (
            <span className="px-2.5 py-1 rounded-full bg-saffron-500 text-charcoal-950 text-[10px] font-bold uppercase tracking-wider shadow-sm flex items-center gap-1">
              <SparklesIcon className="w-3 h-3" />
              Bán chạy
            </span>
          )}
          {!isBestSeller && isPopular && (
            <span className="px-2.5 py-1 rounded-full bg-sage-700 text-pearl-50 text-[10px] font-semibold uppercase tracking-wider shadow-sm">
              Đặc biệt
            </span>
          )}
        </div>

        {/* Floating Macro Strip */}
        {nutritionInfo && (
          <div className="absolute bottom-2.5 left-2.5 right-2.5 px-3 py-1.5 rounded-xl glassmorphism flex items-center justify-between text-[11px] font-semibold text-sage-900">
            {nutritionInfo.protein !== undefined && (
              <span>Đạm: <strong className="text-sage-950">{nutritionInfo.protein}g</strong></span>
            )}
            {nutritionInfo.calories !== undefined && (
              <span>Năng lượng: <strong className="text-saffron-700">{nutritionInfo.calories} Kcal</strong></span>
            )}
          </div>
        )}
      </div>

      {/* Content Body */}
      <div className="p-5 flex flex-col flex-1">
        <Link href={`/menu/${id}`} className="hover:text-sage-700 transition-colors">
          <h3 className="font-serif font-bold text-lg text-sage-950 line-clamp-1 mb-1.5">
            {name}
          </h3>
        </Link>
        <p className="text-xs text-charcoal-700 line-clamp-2 leading-relaxed mb-4">
          {description}
        </p>

        {/* Bottom Price & Add Action */}
        <div className="mt-auto pt-3 border-t border-sage-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-sage-600 block">Đơn giá</span>
            <span className="font-serif font-bold text-lg text-sage-900">
              {price.toLocaleString('vi-VN')}₫
            </span>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isLoading}
            className={`btn !px-4 !py-2 !text-xs !font-semibold flex items-center gap-1.5 ${
              added 
                ? '!bg-sage-800 !text-pearl-50' 
                : 'btn-accent'
            }`}
          >
            <ShoppingBagIcon className="w-4 h-4" />
            {added ? 'Đã thêm' : 'Chọn món'}
          </button>
        </div>
      </div>
    </motion.div>
  )
}
export default MenuItemCard;