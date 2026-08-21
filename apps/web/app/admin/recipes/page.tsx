'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BeakerIcon,
  ArchiveBoxIcon,
  SparklesIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  ArrowTopRightOnSquareIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

interface IngredientItem {
  id: string;
  name: string;
  code: string;
  unit: string;
  costPerUnit: number; // VND per unit (e.g. per gram or ml)
  currentStock: number;
  minThreshold: number;
  supplier: string;
  category: string;
}

interface RecipeIngredient {
  ingredientId: string;
  name: string;
  quantity: number;
  unit: string;
  unitCost: number;
  totalCost: number;
}

interface RecipeDetail {
  id: string;
  menuItemId: string;
  dishName: string;
  category: string;
  sellingPrice: number;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servingSize: number;
  ingredients: RecipeIngredient[];
}

const mockIngredients: IngredientItem[] = [
  {
    id: 'ing-1',
    name: 'Gạo Lứt Huyết Rồng ST25',
    code: 'GL-ST25',
    unit: 'gram',
    costPerUnit: 25, // 25,000 VND / kg
    currentStock: 45000,
    minThreshold: 10000,
    supplier: 'Nông Trại Hữu Cơ Sóc Trăng',
    category: 'Ngũ cốc & Tinh bột',
  },
  {
    id: 'ing-2',
    name: 'Nấm Đùi Gà Tươi',
    code: 'NDG-01',
    unit: 'gram',
    costPerUnit: 80, // 80,000 VND / kg
    currentStock: 3200,
    minThreshold: 5000, // Low stock!
    supplier: 'Hợp Tác Xã Nấm Đà Lạt',
    category: 'Nấm tươi cao cấp',
  },
  {
    id: 'ing-3',
    name: 'Đậu Hũ Non Hữu Cơ',
    code: 'DHN-02',
    unit: 'gram',
    costPerUnit: 40,
    currentStock: 12000,
    minThreshold: 4000,
    supplier: 'Bếp Đậu Sạch Làng Sen',
    category: 'Đạm thực vật',
  },
  {
    id: 'ing-4',
    name: 'Hạt Điều Sữa Bình Phước',
    code: 'HDBP-01',
    unit: 'gram',
    costPerUnit: 220,
    currentStock: 1800,
    minThreshold: 3000, // Low stock!
    supplier: 'Hợp Tác Xã Điều Bù Đăng',
    category: 'Hạt dinh dưỡng',
  },
  {
    id: 'ing-5',
    name: 'Dầu Oliu Nguyên Chất Extra Virgin',
    code: 'DO-EV',
    unit: 'ml',
    costPerUnit: 180,
    currentStock: 8500,
    minThreshold: 2000,
    supplier: 'Nhập khẩu Địa Trung Hải',
    category: 'Gia vị & Dầu hạt',
  },
  {
    id: 'ing-6',
    name: 'Nấm Đông Cô Khô',
    code: 'NDC-K01',
    unit: 'gram',
    costPerUnit: 350,
    currentStock: 6200,
    minThreshold: 2000,
    supplier: 'Nông Sản Cao Nguyên',
    category: 'Nấm tươi cao cấp',
  },
];

const mockRecipes: RecipeDetail[] = [
  {
    id: 'rec-1',
    menuItemId: 'menu-1',
    dishName: 'Cơm Gạo Lứt Chả Nấm Đậu Hũ',
    category: 'Gói Chuẩn Macro',
    sellingPrice: 85000,
    prepTimeMinutes: 15,
    cookTimeMinutes: 20,
    servingSize: 1,
    ingredients: [
      { ingredientId: 'ing-1', name: 'Gạo Lứt Huyết Rồng ST25', quantity: 150, unit: 'gram', unitCost: 25, totalCost: 3750 },
      { ingredientId: 'ing-2', name: 'Nấm Đùi Gà Tươi', quantity: 80, unit: 'gram', unitCost: 80, totalCost: 6400 },
      { ingredientId: 'ing-3', name: 'Đậu Hũ Non Hữu Cơ', quantity: 100, unit: 'gram', unitCost: 40, totalCost: 4000 },
      { ingredientId: 'ing-5', name: 'Dầu Oliu Nguyên Chất Extra Virgin', quantity: 10, unit: 'ml', unitCost: 180, totalCost: 1800 },
    ],
  },
  {
    id: 'rec-2',
    menuItemId: 'menu-2',
    dishName: 'Bún Riêu Thuần Chay Dưỡng Sinh',
    category: 'Món Nước Thanh Nhiệt',
    sellingPrice: 75000,
    prepTimeMinutes: 20,
    cookTimeMinutes: 25,
    servingSize: 1,
    ingredients: [
      { ingredientId: 'ing-3', name: 'Đậu Hũ Non Hữu Cơ', quantity: 120, unit: 'gram', unitCost: 40, totalCost: 4800 },
      { ingredientId: 'ing-2', name: 'Nấm Đùi Gà Tươi', quantity: 60, unit: 'gram', unitCost: 80, totalCost: 4800 },
      { ingredientId: 'ing-4', name: 'Hạt Điều Sữa Bình Phước', quantity: 30, unit: 'gram', unitCost: 220, totalCost: 6600 },
      { ingredientId: 'ing-5', name: 'Dầu Oliu Nguyên Chất Extra Virgin', quantity: 15, unit: 'ml', unitCost: 180, totalCost: 2700 },
    ],
  },
  {
    id: 'rec-3',
    menuItemId: 'menu-3',
    dishName: 'Salad Quinoa Bơ Sáp Hạt Điều',
    category: 'Eat Clean Ít Calo',
    sellingPrice: 90000,
    prepTimeMinutes: 10,
    cookTimeMinutes: 10,
    servingSize: 1,
    ingredients: [
      { ingredientId: 'ing-4', name: 'Hạt Điều Sữa Bình Phước', quantity: 45, unit: 'gram', unitCost: 220, totalCost: 9900 },
      { ingredientId: 'ing-5', name: 'Dầu Oliu Nguyên Chất Extra Virgin', quantity: 20, unit: 'ml', unitCost: 180, totalCost: 3600 },
      { ingredientId: 'ing-3', name: 'Đậu Hũ Non Hữu Cơ', quantity: 80, unit: 'gram', unitCost: 40, totalCost: 3200 },
    ],
  },
];

export default function AdminRecipesPage() {
  const [activeTab, setActiveTab] = useState<'recipes' | 'ingredients' | 'optimizer'>('recipes');
  const [recipes, setRecipes] = useState<RecipeDetail[]>(mockRecipes);
  const [ingredients, setIngredients] = useState<IngredientItem[]>(mockIngredients);
  const [showRecipeModal, setShowRecipeModal] = useState(false);
  const [showStockModal, setShowStockModal] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<RecipeDetail | null>(null);
  const [stockImportData, setStockImportData] = useState({
    ingredientId: '',
    quantity: 1000,
    unitCost: 0,
    notes: '',
  });

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(val);

  const calculateFoodCost = (recipe: RecipeDetail) => {
    return recipe.ingredients.reduce((sum, item) => sum + item.totalCost, 0);
  };

  const calculateGrossMargin = (recipe: RecipeDetail) => {
    const cost = calculateFoodCost(recipe);
    return recipe.sellingPrice - cost;
  };

  const calculateGrossMarginPercent = (recipe: RecipeDetail) => {
    const cost = calculateFoodCost(recipe);
    if (recipe.sellingPrice === 0) return 0;
    return ((recipe.sellingPrice - cost) / recipe.sellingPrice) * 100;
  };

  const lowStockCount = ingredients.filter((ing) => ing.currentStock <= ing.minThreshold).length;
  const totalInventoryValue = ingredients.reduce((sum, ing) => sum + ing.currentStock * ing.costPerUnit, 0);

  const handleStockImport = (e: React.FormEvent) => {
    e.preventDefault();
    const target = ingredients.find((i) => i.id === stockImportData.ingredientId);
    if (!target) return;

    setIngredients((prev) =>
      prev.map((i) =>
        i.id === stockImportData.ingredientId
          ? { ...i, currentStock: i.currentStock + Number(stockImportData.quantity) }
          : i
      )
    );
    toast.success(`Đã nhập thêm ${stockImportData.quantity} ${target.unit} ${target.name} vào kho`);
    setShowStockModal(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center space-x-2.5">
            <BeakerIcon className="w-6 h-6 text-emerald-400" />
            <span>Công Thức Định Lượng & Giá Vốn (Recipe BOM)</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Quản trị định lượng nguyên liệu món ăn, tính toán giá vốn thực tế (COGS) và tự động trừ kho
          </p>
        </div>

        <div className="flex items-center space-x-2 self-start sm:self-auto">
          <button
            onClick={() => setShowStockModal(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-700 transition flex items-center space-x-1.5"
          >
            <ArchiveBoxIcon className="w-4 h-4 text-emerald-400" />
            <span>Nhập Kho Nhanh</span>
          </button>
          <button
            onClick={() => {
              setEditingRecipe(null);
              setShowRecipeModal(true);
            }}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-3.5 py-2 rounded-xl text-xs flex items-center space-x-1.5 transition shadow-sm"
          >
            <PlusIcon className="h-4 w-4 stroke-[2.5]" />
            <span>Tạo Công Thức Mới</span>
          </button>
        </div>
      </div>

      {/* 4 Macro KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-slate-800/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Công Thức Đã Chuẩn Hóa
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <BeakerIcon className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold font-mono text-white mt-2">
            {recipes.length} <span className="text-xs text-slate-400 font-normal">món ăn</span>
          </p>
          <p className="text-xs text-emerald-400 mt-2 font-medium flex items-center space-x-1">
            <CheckCircleIcon className="w-3.5 h-3.5" />
            <span>100% Khớp định lượng</span>
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-slate-800/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Tỷ Suất Lợi Nhuận Gộp TB
            </span>
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <ArrowTrendingUpIcon className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold font-mono text-white mt-2">78.4%</p>
          <p className="text-xs text-sky-400 mt-2 font-medium flex items-center space-x-1">
            <span>Chi phí vốn: 21.6%</span>
            <span className="text-slate-500 font-normal">(Rất Tối Ưu)</span>
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-slate-800/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Tổng Giá Trị Kho Nguyên Liệu
            </span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <CurrencyDollarIcon className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold font-mono text-white mt-2">
            {formatCurrency(totalInventoryValue)}
          </p>
          <p className="text-xs text-indigo-400 mt-2 font-medium flex items-center space-x-1">
            <span>{ingredients.length} danh mục nguyên liệu</span>
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-slate-800/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Cảnh Báo Tồn Kho Thấp
            </span>
            <div className={`p-2 rounded-xl border ${lowStockCount > 0 ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>
              <ExclamationTriangleIcon className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold font-mono text-white mt-2">
            {lowStockCount} <span className="text-xs text-slate-400 font-normal">mặt hàng</span>
          </p>
          <p className="text-xs text-amber-400 mt-2 font-medium flex items-center space-x-1">
            <span>Cần nhập thêm Nấm & Hạt</span>
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-2 text-xs">
        <button
          onClick={() => setActiveTab('recipes')}
          className={`px-4 py-2 rounded-xl font-semibold transition ${
            activeTab === 'recipes'
              ? 'bg-emerald-500 text-slate-950 shadow-sm'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          Công Thức & Giá Vốn Món Ăn ({recipes.length})
        </button>
        <button
          onClick={() => setActiveTab('ingredients')}
          className={`px-4 py-2 rounded-xl font-semibold transition ${
            activeTab === 'ingredients'
              ? 'bg-emerald-500 text-slate-950 shadow-sm'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          Kho Nguyên Liệu Thực Vật ({ingredients.length})
        </button>
        <button
          onClick={() => setActiveTab('optimizer')}
          className={`px-4 py-2 rounded-xl font-semibold transition flex items-center space-x-1.5 ${
            activeTab === 'optimizer'
              ? 'bg-emerald-500 text-slate-950 shadow-sm'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <SparklesIcon className="w-3.5 h-3.5 text-emerald-400" />
          <span>AI Tối Ưu Chi Phí & Thay Thế</span>
        </button>
      </div>

      {/* Tab 1: Recipe BOM & Costing Table */}
      {activeTab === 'recipes' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-5">
            {recipes.map((recipe) => {
              const totalCost = calculateFoodCost(recipe);
              const grossMargin = calculateGrossMargin(recipe);
              const grossMarginPercent = calculateGrossMarginPercent(recipe);

              return (
                <div
                  key={recipe.id}
                  className="bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-800/80 p-5 hover:border-emerald-500/30 transition group"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
                    <div>
                      <div className="flex items-center space-x-2.5">
                        <h2 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
                          {recipe.dishName}
                        </h2>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {recipe.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        Thời gian chuẩn bị: {recipe.prepTimeMinutes}p • Chế biến: {recipe.cookTimeMinutes}p • Khẩu phần: {recipe.servingSize} người
                      </p>
                    </div>

                    {/* Financial Summary Badges */}
                    <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
                      <div className="px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800">
                        <span className="text-slate-400 block text-[10px] uppercase">Giá Bán Niêm Yết</span>
                        <span className="text-slate-100 font-bold text-sm">{formatCurrency(recipe.sellingPrice)}</span>
                      </div>
                      <div className="px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800">
                        <span className="text-slate-400 block text-[10px] uppercase">Giá Vốn Nguyên Liệu (COGS)</span>
                        <span className="text-amber-400 font-bold text-sm">{formatCurrency(totalCost)}</span>
                      </div>
                      <div className="px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800">
                        <span className="text-slate-400 block text-[10px] uppercase">Lợi Nhuận Gộp (Margin)</span>
                        <span className="text-emerald-400 font-bold text-sm">
                          {formatCurrency(grossMargin)} ({grossMarginPercent.toFixed(1)}%)
                        </span>
                      </div>
                      <Link
                        href={`/admin/menu`}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                        title="Xem món trong Thực đơn bán hàng"
                      >
                        <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>

                  {/* Ingredients Breakdown Table */}
                  <div className="mt-4 overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left text-xs divide-y divide-slate-800">
                      <thead className="bg-slate-950/60 text-slate-400 font-semibold uppercase tracking-wider">
                        <tr>
                          <th className="px-4 py-2.5">Nguyên Liệu</th>
                          <th className="px-4 py-2.5">Định Lượng / Khẩu Phần</th>
                          <th className="px-4 py-2.5">Đơn Giá Nhập</th>
                          <th className="px-4 py-2.5">Chi Phí Cấu Thành</th>
                          <th className="px-4 py-2.5 text-right">% Tỷ Trọng Giá Vốn</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {recipe.ingredients.map((ing, idx) => {
                          const percent = totalCost > 0 ? (ing.totalCost / totalCost) * 100 : 0;
                          return (
                            <tr key={idx} className="hover:bg-slate-800/30 transition">
                              <td className="px-4 py-2.5 font-medium text-slate-200">{ing.name}</td>
                              <td className="px-4 py-2.5 font-mono text-slate-300">
                                {ing.quantity} {ing.unit}
                              </td>
                              <td className="px-4 py-2.5 font-mono text-slate-400">
                                {formatCurrency(ing.unitCost)} / {ing.unit}
                              </td>
                              <td className="px-4 py-2.5 font-mono font-bold text-amber-400">
                                {formatCurrency(ing.totalCost)}
                              </td>
                              <td className="px-4 py-2.5 text-right font-mono text-slate-400">
                                {percent.toFixed(1)}%
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Ingredients & Inventory Table */}
      {activeTab === 'ingredients' && (
        <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-800/80 overflow-hidden">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-xs divide-y divide-slate-800">
              <thead className="bg-slate-950/70 text-slate-400 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3.5 whitespace-nowrap">Mã & Tên Nguyên Liệu</th>
                  <th className="px-5 py-3.5 whitespace-nowrap">Danh Mục</th>
                  <th className="px-5 py-3.5 whitespace-nowrap">Tồn Kho Hiện Tại</th>
                  <th className="px-5 py-3.5 whitespace-nowrap">Ngưỡng Tối Thiểu</th>
                  <th className="px-5 py-3.5 whitespace-nowrap">Đơn Giá Nhập</th>
                  <th className="px-5 py-3.5 whitespace-nowrap">Nhà Cung Cấp</th>
                  <th className="px-5 py-3.5 whitespace-nowrap">Tình Trạng</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {ingredients.map((ing) => {
                  const isLow = ing.currentStock <= ing.minThreshold;
                  return (
                    <tr key={ing.id} className="hover:bg-slate-800/40 transition group">
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="font-semibold text-slate-100 block">{ing.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{ing.code}</span>
                      </td>
                      <td className="px-5 py-4 text-slate-300 whitespace-nowrap">{ing.category}</td>
                      <td className="px-5 py-4 font-mono font-bold text-slate-100 whitespace-nowrap">
                        {ing.currentStock.toLocaleString('vi-VN')} {ing.unit}
                      </td>
                      <td className="px-5 py-4 font-mono text-slate-400 whitespace-nowrap">
                        {ing.minThreshold.toLocaleString('vi-VN')} {ing.unit}
                      </td>
                      <td className="px-5 py-4 font-mono font-semibold text-emerald-400 whitespace-nowrap">
                        {formatCurrency(ing.costPerUnit)} / {ing.unit}
                      </td>
                      <td className="px-5 py-4 text-slate-400 whitespace-nowrap">{ing.supplier}</td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        {isLow ? (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            <ExclamationTriangleIcon className="w-3 h-3" />
                            <span>Cần Nhập Thêm</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <CheckCircleIcon className="w-3 h-3" />
                            <span>Tồn Kho An Toàn</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: AI Recipe Cost Optimizer */}
      {activeTab === 'optimizer' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-emerald-950/40 border border-emerald-500/30 space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                <SparklesIcon className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-sm">Tối Ưu Giá Vốn Món Bún Riêu Chay</h3>
                <span className="text-[11px] text-emerald-400 font-mono">Tiềm năng tiết kiệm: -14.2% Food Cost</span>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Phân tích chỉ ra chi phí hạt điều sữa chiếm tới 42% giá vốn của món. Đề xuất phối trộn 60% hạt điều + 40% hạt sen Huế bùi béo theo mùa.
            </p>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>Giá vốn hiện tại:</span>
                <span className="font-mono text-amber-400 font-bold">18,900 ₫</span>
              </div>
              <div className="flex justify-between text-emerald-300">
                <span>Giá vốn sau tối ưu:</span>
                <span className="font-mono text-emerald-400 font-bold">16,200 ₫</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-teal-950/40 border border-teal-500/30 space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center">
                <SparklesIcon className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-sm">Dự Báo Nhu Cầu Nguyên Liệu Tuần Tới</h3>
                <span className="text-[11px] text-teal-400 font-mono">Dựa trên 185 đơn gói tuần đã đặt trước</span>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Cần chuẩn bị tối thiểu <strong>28.5 kg Nấm đùi gà</strong> và <strong>42 kg Gạo lứt ST25</strong> trước sáng thứ Hai để đảm bảo chế biến liên tục không đứt gãy.
            </p>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>Tình trạng Nấm đùi gà:</span>
                <span className="font-mono text-amber-400 font-bold">Thiếu 25.3 kg</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Tình trạng Gạo lứt:</span>
                <span className="font-mono text-emerald-400 font-bold">Đủ lượng phục vụ</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stock Import Modal */}
      {showStockModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Nhập Kho Nguyên Liệu Nhanh</h3>
              <button onClick={() => setShowStockModal(false)} className="text-slate-400 hover:text-white">
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleStockImport} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Chọn nguyên liệu</label>
                <select
                  value={stockImportData.ingredientId}
                  onChange={(e) => setStockImportData({ ...stockImportData, ingredientId: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-emerald-500"
                  required
                >
                  <option value="">Chọn nguyên liệu nhập kho...</option>
                  {ingredients.map((ing) => (
                    <option key={ing.id} value={ing.id}>
                      {ing.name} ({ing.unit}) — Tồn: {ing.currentStock.toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Số lượng nhập thêm</label>
                <input
                  type="number"
                  value={stockImportData.quantity}
                  onChange={(e) => setStockImportData({ ...stockImportData, quantity: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-emerald-500 font-mono"
                  min="1"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Ghi chú phiếu nhập</label>
                <input
                  type="text"
                  value={stockImportData.notes}
                  onChange={(e) => setStockImportData({ ...stockImportData, notes: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-emerald-500"
                  placeholder="Ví dụ: Nhập định kỳ đợt 1..."
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowStockModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-500 text-slate-950 font-bold rounded-xl hover:bg-emerald-400"
                >
                  Xác Nhận Nhập Kho
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
