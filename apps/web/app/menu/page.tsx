"use client"

import { useState, useCallback, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useApi } from '@/hooks/useApi';
import { menuService } from '@/lib/services';
import { MenuItem } from '@/lib/services/types';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Layers, BarChart3, Flame, Clock, X, RotateCcw } from 'lucide-react';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { MenuItemCard } from "@/components/ui/menu-item-card"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { categoryService, Category } from '../services/categoryService';

interface MenuResponse {
  data: MenuItem[] | { data?: MenuItem[], items?: MenuItem[] };
  status: number;
}

const DEBOUNCE_DELAY = 300;

export default function MenuPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'visual' | 'macro'>('visual');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [quickMacroGoal, setQuickMacroGoal] = useState<'all' | 'high-protein' | 'low-cal' | 'low-carb'>('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [nutritionRange, setNutritionRange] = useState<{
    calories: [number, number];
    protein: [number, number];
    fat: [number, number];
    carbs: [number, number];
  }>({
    calories: [0, 1000],
    protein: [0, 50],
    fat: [0, 50],
    carbs: [0, 100]
  });

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, DEBOUNCE_DELAY);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getAll();
        setCategories(data);
      } catch (error: unknown) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const fetchMenuItems = useCallback(async () => {
    return menuService.getAll();
  }, []);

  const { data, loading } = useApi<MenuResponse>(fetchMenuItems, true, []);

  // Process menu items
  const menuItems = useMemo(() => {
    if (!data) return [];

    let items: MenuItem[] = [];
    if (Array.isArray(data.data)) {
      items = data.data;
    } else if (typeof data.data === 'object' && data.data !== null) {
      const nestedData = data.data as { data?: MenuItem[], items?: MenuItem[] };
      if (Array.isArray(nestedData.data)) items = nestedData.data;
      else if (Array.isArray(nestedData.items)) items = nestedData.items;
    }

    if (items.length === 0) return [];

    return items.filter(item => {
      // Category filter
      if (selectedCategory) {
        const itemCatId = typeof item.category === 'object'
          ? (item.category as { _id?: string; slug?: string })?._id || (item.category as { slug?: string })?.slug
          : item.category;
        if (itemCatId !== selectedCategory && item.category !== selectedCategory) {
          return false;
        }
      }

      // Search query
      if (debouncedSearchQuery) {
        const query = debouncedSearchQuery.toLowerCase();
        const matches =
          item.name.toLowerCase().includes(query) ||
          (item.description && item.description.toLowerCase().includes(query));
        if (!matches) return false;
      }

      // Quick Macro Goal
      const protein = Number(item.protein ?? item.nutritionInfo?.protein ?? 0);
      const calories = Number(item.calories ?? item.nutritionInfo?.calories ?? 0);
      const carbs = Number(item.carbs ?? item.nutritionInfo?.carbs ?? 0);

      if (quickMacroGoal === 'high-protein' && protein < 18) return false;
      if (quickMacroGoal === 'low-cal' && calories > 400 && calories > 0) return false;
      if (quickMacroGoal === 'low-carb' && carbs > 40 && carbs > 0) return false;

      // Range filters
      const { calories: [minCal, maxCal], protein: [minProt, maxProt] } = nutritionRange;
      if (calories > 0 && (calories < minCal || calories > maxCal)) return false;
      if (protein > 0 && (protein < minProt || protein > maxProt)) return false;

      return true;
    });
  }, [data, selectedCategory, debouncedSearchQuery, quickMacroGoal, nutritionRange]);

  const handleResetFilters = () => {
    setSelectedCategory(null);
    setSearchQuery('');
    setQuickMacroGoal('all');
    setNutritionRange({
      calories: [0, 1000],
      protein: [0, 50],
      fat: [0, 50],
      carbs: [0, 100]
    });
  };

  return (
    <div className="min-h-screen bg-[#FAFBF9] pb-24">
      {/* 1. Compact Content-First Header */}
      <section className="bg-slate-950 text-white pt-6 pb-6 border-b border-slate-800">
        <div className="container-custom flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400 text-[10px] font-bold uppercase mb-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Thực Đơn Dinh Dưỡng Khoa Học 2.0
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Khám Phá Món Chay Tươi Lành
            </h1>
          </div>
          <p className="text-xs text-slate-400 max-w-md md:text-right leading-relaxed">
            Minh bạch chỉ số Calo, Protein thực vật và vi chất cho từng khẩu phần ăn tươi ngon
          </p>
        </div>
      </section>

      {/* 2. Sticky Control Bar */}
      <div className="sticky top-20 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm py-4">
        <div className="container-custom flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Tìm kiếm món ăn, nguyên liệu, đạm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2.5 text-xs rounded-full border-slate-200 bg-slate-50 focus:bg-white focus-visible:ring-emerald-500 w-full"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* DUAL VIEW MODE SWITCHER TOGGLE */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-2xl border border-slate-200">
              <button
                type="button"
                onClick={() => setViewMode('visual')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'visual'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-emerald-700" />
                Trực Quan
              </button>

              <button
                type="button"
                onClick={() => setViewMode('macro')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'macro'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5 text-blue-700" />
                Dinh Dưỡng Macro
              </button>
            </div>

            {/* Advanced Filters Sheet Button */}
            <button
              type="button"
              onClick={() => setIsFilterOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold bg-emerald-50 text-emerald-900 border border-emerald-300 hover:bg-emerald-100 hover:border-emerald-400 transition-colors shadow-sm cursor-pointer"
            >
              <Filter className="w-4 h-4 text-emerald-700" />
              <span>Bộ Lọc Dinh Dưỡng</span>
              {(nutritionRange.calories[0] > 0 || nutritionRange.calories[1] < 1000 || nutritionRange.protein[0] > 0) && (
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              )}
            </button>

            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <SheetContent className="bg-white p-6 overflow-y-auto flex flex-col justify-between">
                <div>
                  <SheetHeader className="text-left pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                        <Filter className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <SheetTitle className="text-sm font-bold text-slate-900">Bộ Lọc Dinh Dưỡng Chi Tiết</SheetTitle>
                        <SheetDescription className="text-[11px] text-slate-500">
                          Tùy chỉnh ngưỡng Calo và Protein theo phác đồ dinh dưỡng
                        </SheetDescription>
                      </div>
                    </div>
                  </SheetHeader>

                  <div className="py-5 space-y-6">
                    {/* 1. Personalized Health Profile Section */}
                    <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-950">
                          Hồ Sơ Sức Khỏe Cá Nhân
                        </span>
                        <Link
                          href="/nutrition-planner"
                          className="text-[11px] font-bold text-emerald-700 hover:underline"
                        >
                          Thiết Lập / Sửa
                        </Link>
                      </div>
                      <p className="text-[11px] text-emerald-800/80 leading-relaxed">
                        Tự động lọc các món ăn khớp với chỉ số TDEE, lượng đạm mục tiêu và phác đồ thể trạng của bạn.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          const saved = localStorage.getItem('chayfood_health_profile')
                          if (saved) {
                            try {
                              const parsed = JSON.parse(saved) as { primaryGoal?: string }
                              if (parsed.primaryGoal === 'muscle_gain' || parsed.primaryGoal === 'MUSCLE_GAIN') {
                                setQuickMacroGoal('high-protein')
                                setNutritionRange({ calories: [350, 750], protein: [18, 50], fat: [0, 30], carbs: [0, 80] })
                              } else if (parsed.primaryGoal === 'fat_loss' || parsed.primaryGoal === 'WEIGHT_LOSS') {
                                setQuickMacroGoal('low-cal')
                                setNutritionRange({ calories: [200, 450], protein: [12, 50], fat: [0, 20], carbs: [0, 60] })
                              } else {
                                setNutritionRange({ calories: [250, 600], protein: [14, 50], fat: [0, 25], carbs: [0, 70] })
                              }
                              setIsFilterOpen(false)
                            } catch {}
                          } else {
                            window.location.href = '/nutrition-planner'
                          }
                        }}
                        className="w-full py-2 rounded-xl btn-primary-gradient text-white text-xs font-bold shadow-sm text-center block cursor-pointer"
                      >
                        Áp Dụng Chỉ Số Cá Nhân
                      </button>
                    </div>

                    {/* 2. Quick Macro Presets */}
                    <div>
                      <label className="text-xs font-bold text-slate-800 block mb-2.5">
                        Mục Tiêu Thể Trạng Nhanh
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setQuickMacroGoal('high-protein')
                            setNutritionRange(prev => ({ ...prev, calories: [0, 800], protein: [18, 100] }))
                          }}
                          className="p-2.5 rounded-xl border border-blue-200 bg-blue-50/60 hover:bg-blue-100/60 text-left transition-colors cursor-pointer"
                        >
                          <span className="text-[11px] font-bold text-blue-800 block">Gym Tăng Cơ</span>
                          <span className="text-[10px] text-blue-600">Đạm ≥ 18g</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setQuickMacroGoal('low-cal')
                            setNutritionRange(prev => ({ ...prev, calories: [0, 400], protein: [0, 100] }))
                          }}
                          className="p-2.5 rounded-xl border border-emerald-200 bg-emerald-50/60 hover:bg-emerald-100/60 text-left transition-colors cursor-pointer"
                        >
                          <span className="text-[11px] font-bold text-emerald-800 block">Giảm Mỡ Low-Cal</span>
                          <span className="text-[10px] text-emerald-600">Calo ≤ 400 kcal</span>
                        </button>
                      </div>
                    </div>

                    {/* 3. Calorie Range */}
                    <div>
                      <label className="text-xs font-bold text-slate-800 flex items-center justify-between mb-2">
                        <span>Mức Năng Lượng (Calories)</span>
                        <span className="text-emerald-700 font-extrabold text-xs">{nutritionRange.calories[0]} - {nutritionRange.calories[1]} kcal</span>
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={nutritionRange.calories[0]}
                          onChange={(e) => setNutritionRange(prev => ({ ...prev, calories: [Number(e.target.value), prev.calories[1]] }))}
                          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600"
                          placeholder="Từ (kcal)"
                        />
                        <span className="text-xs text-slate-400 font-medium">—</span>
                        <input
                          type="number"
                          value={nutritionRange.calories[1]}
                          onChange={(e) => setNutritionRange(prev => ({ ...prev, calories: [prev.calories[0], Number(e.target.value)] }))}
                          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600"
                          placeholder="Đến (kcal)"
                        />
                      </div>
                    </div>

                    {/* 4. Protein Range */}
                    <div>
                      <label className="text-xs font-bold text-slate-800 flex items-center justify-between mb-2">
                        <span>Lượng Đạm Thực Vật (Protein)</span>
                        <span className="text-blue-700 font-extrabold text-xs">{nutritionRange.protein[0]} - {nutritionRange.protein[1]} g</span>
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={nutritionRange.protein[0]}
                          onChange={(e) => setNutritionRange(prev => ({ ...prev, protein: [Number(e.target.value), prev.protein[1]] }))}
                          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
                          placeholder="Từ (g)"
                        />
                        <span className="text-xs text-slate-400 font-medium">—</span>
                        <input
                          type="number"
                          value={nutritionRange.protein[1]}
                          onChange={(e) => setNutritionRange(prev => ({ ...prev, protein: [prev.protein[0], Number(e.target.value)] }))}
                          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
                          placeholder="Đến (g)"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-2">
                  <button
                    onClick={handleResetFilters}
                    type="button"
                    className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Đặt Lại Mặc Định
                  </button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* 3. Category & Goal Navigation Tabs */}
      <div className="container-custom pt-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-4 no-scrollbar border-b border-slate-200">
          <button
            type="button"
            onClick={() => setIsFilterOpen(true)}
            className="px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap bg-emerald-100 text-emerald-950 border border-emerald-300 hover:bg-emerald-200 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer shadow-sm"
          >
            <Filter className="w-3.5 h-3.5 text-emerald-700" />
            Lọc Cá Nhân Hóa & Macro
          </button>

          <button
            type="button"
            onClick={() => setQuickMacroGoal('all')}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              quickMacroGoal === 'all'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
            }`}
          >
            Tất Cả Thực Đơn
          </button>

          <button
            type="button"
            onClick={() => setQuickMacroGoal('high-protein')}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              quickMacroGoal === 'high-protein'
                ? 'bg-blue-700 text-white shadow-sm'
                : 'bg-white text-blue-700 border border-blue-200 hover:bg-blue-50'
            }`}
          >
            Giàu Đạm (Protein ≥ 18g)
          </button>

          <button
            type="button"
            onClick={() => setQuickMacroGoal('low-cal')}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              quickMacroGoal === 'low-cal'
                ? 'bg-amber-700 text-white shadow-sm'
                : 'bg-white text-amber-800 border border-amber-200 hover:bg-amber-50'
            }`}
          >
            Kiểm Soát Calo (≤ 400 kcal)
          </button>

          <button
            type="button"
            onClick={() => setQuickMacroGoal('low-carb')}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              quickMacroGoal === 'low-carb'
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'bg-white text-emerald-800 border border-emerald-200 hover:bg-emerald-50'
            }`}
          >
            Low-Carb Dinh Dưỡng
          </button>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between py-4 text-xs font-semibold text-slate-500">
          <span>Tìm thấy <strong>{menuItems.length}</strong> món ăn phù hợp tiêu chuẩn</span>
          {(searchQuery || selectedCategory || quickMacroGoal !== 'all') && (
            <button type="button" onClick={handleResetFilters} className="text-emerald-800 hover:underline flex items-center gap-1 cursor-pointer">
              <RotateCcw className="w-3 h-3" />
              Xóa bộ lọc
            </button>
          )}
        </div>

        {/* 4. Menu Items Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 py-8">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-80 rounded-2xl bg-slate-200/70 animate-pulse" />
            ))}
          </div>
        ) : menuItems.length > 0 ? (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {menuItems.map((item) => (
                <MenuItemCard
                  key={item._id || item.id || item.name}
                  item={item}
                  viewMode={viewMode}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8 my-6">
            <div className="text-4xl mb-3">🔍</div>
            <h3 className="text-base font-bold text-slate-900 mb-1">Không tìm thấy món ăn phù hợp</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mb-6">
              Hãy thử nới lỏng mức Calo hoặc tìm kiếm với từ khóa khác như Cơm, Nấm, Đậu hũ.
            </p>
            <Button type="button" onClick={handleResetFilters} className="btn-primary-gradient rounded-full text-xs font-bold px-6 cursor-pointer">
              Xem Tất Cả Thực Đơn
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}