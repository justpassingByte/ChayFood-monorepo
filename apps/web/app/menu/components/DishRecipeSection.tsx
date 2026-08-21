"use client"

import React, { useState, useEffect } from 'react'
import { Clock, ChefHat, Sparkles, CheckCircle2, ChevronDown, ChevronUp, Scale, Utensils } from 'lucide-react'
import { recipeService, Recipe } from '@/lib/services/recipeService'

interface DishRecipeSectionProps {
  menuItemId: string
  dishName: string
  ingredients?: string[]
}

export function DishRecipeSection({ menuItemId, dishName, ingredients = [] }: DishRecipeSectionProps) {
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [isExpanded, setIsExpanded] = useState(true)
  const [activeTab, setActiveTab] = useState<'instructions' | 'ingredients'>('instructions')

  useEffect(() => {
    let isMounted = true
    const fetchRecipe = async () => {
      if (!menuItemId) return
      const res = await recipeService.getByMenuItemId(menuItemId)
      if (isMounted && res.data) {
        setRecipe(res.data)
      }
    }
    fetchRecipe()
    return () => {
      isMounted = false
    }
  }, [menuItemId])

  if (!recipe && ingredients.length === 0) return null

  const steps = recipe?.instructions && recipe.instructions.length > 0
    ? recipe.instructions
    : [
        { stepNumber: 1, title: 'Chuẩn bị và sơ chế', description: 'Rửa sạch nguyên liệu nông sản tươi, định lượng vừa đủ theo khẩu phần ăn.', timeInMinutes: 5 },
        { stepNumber: 2, title: 'Chế biến nhiệt chuẩn nhiệt độ', description: 'Nấu nướng theo phương pháp gia nhiệt chậm để giữ độ tươi giòn và trọn vẹn vi chất dinh dưỡng.', timeInMinutes: 10 },
        { stepNumber: 3, title: 'Bày trí đĩa ăn', description: 'Trình bày món ăn thẩm mỹ, rưới nước sốt thảo mộc và thưởng thức khi còn nóng.', timeInMinutes: 3 },
      ]

  return (
    <div className="mt-14 pt-10 border-t border-slate-200">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            <ChefHat className="w-3.5 h-3.5" />
            Bí Quyết Nhà Bếp
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight mt-2">
            Công Thức & Quy Trình Nấu Ăn
          </h2>
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors self-start sm:self-auto cursor-pointer"
        >
          {isExpanded ? (
            <>
              Thu gọn <ChevronUp className="w-4 h-4 text-slate-500" />
            </>
          ) : (
            <>
              Xem chi tiết <ChevronDown className="w-4 h-4 text-slate-500" />
            </>
          )}
        </button>
      </div>

      {isExpanded && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-8">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white text-emerald-800 flex items-center justify-center shrink-0 border border-emerald-100 shadow-2xs">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400">Sơ chế</div>
                <div className="text-sm font-black text-slate-900">{recipe?.prepTimeMinutes || 12} phút</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white text-emerald-800 flex items-center justify-center shrink-0 border border-emerald-100 shadow-2xs">
                <Utensils className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400">Nấu chín</div>
                <div className="text-sm font-black text-slate-900">{recipe?.cookTimeMinutes || 15} phút</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white text-emerald-800 flex items-center justify-center shrink-0 border border-emerald-100 shadow-2xs">
                <Scale className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400">Khẩu phần</div>
                <div className="text-sm font-black text-slate-900">{recipe?.servingSize || 1} người</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white text-emerald-800 flex items-center justify-center shrink-0 border border-emerald-100 shadow-2xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400">Độ phức tạp</div>
                <div className="text-sm font-black text-emerald-800">Chuẩn Bếp Chay</div>
              </div>
            </div>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <button
              type="button"
              onClick={() => setActiveTab('instructions')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'instructions'
                  ? 'bg-slate-950 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Các Bước Nấu Ăn ({steps.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('ingredients')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'ingredients'
                  ? 'bg-slate-950 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Định Lượng Nguyên Liệu ({recipe?.items?.length || ingredients.length})
            </button>
          </div>

          {/* Tab Content 1: Step by Step Instructions */}
          {activeTab === 'instructions' && (
            <div className="space-y-6">
              <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-emerald-100">
                {steps.map((step) => (
                  <div key={step.stepNumber} className="relative group">
                    {/* Step badge on timeline */}
                    <div className="absolute -left-6 sm:-left-8 top-0 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-emerald-800 text-white text-xs font-black flex items-center justify-center ring-4 ring-white shadow-xs">
                      {step.stepNumber}
                    </div>

                    {/* Step details */}
                    <div className="bg-slate-50/70 group-hover:bg-emerald-50/40 rounded-2xl p-4 sm:p-5 border border-slate-200/80 transition-colors">
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <h4 className="font-black text-sm text-slate-900">
                          {step.title}
                        </h4>
                        {step.timeInMinutes && (
                          <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100/70 px-2.5 py-0.5 rounded-full shrink-0">
                            ~ {step.timeInMinutes} phút
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab Content 2: Ingredients BOM List */}
          {activeTab === 'ingredients' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {recipe?.items && recipe.items.length > 0 ? (
                recipe.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span className="font-bold text-slate-800">
                        {item.ingredient?.name || item.notes || `Nguyên liệu ${idx + 1}`}
                      </span>
                    </div>
                    <span className="font-black text-emerald-900 bg-emerald-100/60 px-2.5 py-1 rounded-lg">
                      {item.quantity} {item.unit?.toLowerCase()}
                    </span>
                  </div>
                ))
              ) : (
                ingredients.map((ing, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span className="font-bold text-slate-800">{ing}</span>
                    </div>
                    <span className="font-semibold text-slate-500">Chuẩn bị tươi</span>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Chef's Notes Alert */}
          {recipe?.notes && (
            <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-xs text-amber-950 flex items-start gap-3">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Lưu ý từ Bếp Trưởng: </span>
                <span className="text-amber-900">{recipe.notes}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
