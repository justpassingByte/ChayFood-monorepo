'use client';

import { useState } from 'react';
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
  CurrencyDollarIcon,
  CheckCircleIcon,
  ArrowTopRightOnSquareIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

import AdminMetricCard from '@/components/admin/ui/AdminMetricCard';
import AdminFilterBar from '@/components/admin/ui/AdminFilterBar';
import AdminModalDialog from '@/components/admin/ui/AdminModalDialog';
import AdminDrawer from '@/components/admin/ui/AdminDrawer';

interface IngredientItem {
  id: string;
  name: string;
  code: string;
  unit: string;
  costPerUnit: number;
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
    costPerUnit: 25,
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
    costPerUnit: 80,
    currentStock: 3200,
    minThreshold: 5000,
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
    minThreshold: 3000,
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
  const [showStockModal, setShowStockModal] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeDetail | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
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

  const handleOpenRecipeDrawer = (recipe: RecipeDetail) => {
    setSelectedRecipe(recipe);
    setShowDrawer(true);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/80">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center space-x-2.5">
            <BeakerIcon className="w-6 h-6 text-emerald-600" />
            <span>Công Thức Định Lượng & Giá Vốn (Recipe BOM)</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Quản trị định lượng nguyên liệu món ăn, tính toán giá vốn thực tế (COGS) và tự động trừ kho
          </p>
        </div>

        <div className="flex items-center space-x-2 self-start sm:self-auto">
          <button
            onClick={() => setShowStockModal(true)}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-200 shadow-xs transition flex items-center space-x-1.5"
          >
            <ArchiveBoxIcon className="w-4 h-4 text-emerald-600" />
            <span>Nhập Kho Nhanh</span>
          </button>
          <Link
            href="/admin/menu"
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3.5 py-2 rounded-xl text-xs flex items-center space-x-1.5 transition shadow-xs"
          >
            <PlusIcon className="h-4 w-4 stroke-[2.5]" />
            <span>Thêm Món Ăn Mới</span>
          </Link>
        </div>
      </div>

      {/* 4 Macro KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AdminMetricCard
          title="Công Thức Đã Chuẩn Hóa"
          value={`${recipes.length} món`}
          subtitle="Khớp 100% định lượng chế biến"
          icon={BeakerIcon}
          accentColor="emerald"
          sparklineData={[1, 2, 2, 3, 3, 3, 3]}
        />
        <AdminMetricCard
          title="Tỷ Suất Lợi Nhuận Gộp TB"
          value="78.4%"
          subtitle="Chi phí vốn chỉ 21.6%"
          icon={ArrowTrendingUpIcon}
          accentColor="sky"
          sparklineData={[70, 72, 75, 74, 76, 78, 78.4]}
        />
        <AdminMetricCard
          title="Tổng Giá Trị Kho"
          value={formatCurrency(totalInventoryValue)}
          subtitle={`${ingredients.length} danh mục nguyên liệu`}
          icon={CurrencyDollarIcon}
          accentColor="indigo"
          sparklineData={[20, 22, 25, 24, 26, 28, 28.4]}
        />
        <AdminMetricCard
          title="Cảnh Báo Tồn Kho Thấp"
          value={`${lowStockCount} mặt hàng`}
          subtitle="Cần nhập thêm Nấm & Hạt"
          icon={ExclamationTriangleIcon}
          accentColor={lowStockCount > 0 ? 'amber' : 'emerald'}
          sparklineData={[1, 2, 3, 2, 2, 3, lowStockCount]}
        />
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2 text-xs">
        <button
          onClick={() => setActiveTab('recipes')}
          className={`px-4 py-2 rounded-xl font-bold transition shadow-xs ${
            activeTab === 'recipes'
              ? 'bg-emerald-600 text-white shadow-emerald-700/20'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
          }`}
        >
          Công Thức & Giá Vốn Món Ăn ({recipes.length})
        </button>
        <button
          onClick={() => setActiveTab('ingredients')}
          className={`px-4 py-2 rounded-xl font-bold transition shadow-xs ${
            activeTab === 'ingredients'
              ? 'bg-emerald-600 text-white shadow-emerald-700/20'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
          }`}
        >
          Kho Nguyên Liệu Thực Vật ({ingredients.length})
        </button>
        <button
          onClick={() => setActiveTab('optimizer')}
          className={`px-4 py-2 rounded-xl font-bold transition flex items-center space-x-1.5 shadow-xs ${
            activeTab === 'optimizer'
              ? 'bg-emerald-600 text-white shadow-emerald-700/20'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
          }`}
        >
          <SparklesIcon className="w-3.5 h-3.5" />
          <span>AI Tối Ưu Chi Phí & Thay Thế</span>
        </button>
      </div>

      {/* Tab 1: Recipe BOM & Costing Cards */}
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
                  className="bg-white rounded-2xl border border-slate-200/80 p-5 hover:border-emerald-500/50 hover:shadow-md transition group shadow-xs"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                    <div>
                      <div className="flex items-center space-x-2.5">
                        <h2 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                          {recipe.dishName}
                        </h2>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {recipe.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Chuẩn bị: {recipe.prepTimeMinutes}p • Chế biến: {recipe.cookTimeMinutes}p • Khẩu phần: {recipe.servingSize} người
                      </p>
                    </div>

                    {/* Financial Summary Badges */}
                    <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono">
                      <div className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200">
                        <span className="text-slate-500 block text-[10px] uppercase font-sans font-semibold">Giá Bán</span>
                        <span className="text-slate-900 font-bold text-sm">{formatCurrency(recipe.sellingPrice)}</span>
                      </div>
                      <div className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200">
                        <span className="text-amber-700 block text-[10px] uppercase font-sans font-semibold">Giá Vốn (COGS)</span>
                        <span className="text-amber-900 font-bold text-sm">{formatCurrency(totalCost)}</span>
                      </div>
                      <div className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200">
                        <span className="text-emerald-700 block text-[10px] uppercase font-sans font-semibold">Lợi Nhuận Gộp</span>
                        <span className="text-emerald-900 font-bold text-sm">
                          {formatCurrency(grossMargin)} ({grossMarginPercent.toFixed(1)}%)
                        </span>
                      </div>
                      <button
                        onClick={() => handleOpenRecipeDrawer(recipe)}
                        className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-emerald-700 border border-slate-200 transition"
                        title="Xem chi tiết định lượng"
                      >
                        <EyeIcon className="w-4 h-4" />
                      </button>
                      <Link
                        href={`/admin/menu`}
                        className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-emerald-700 border border-slate-200 transition"
                        title="Xem món trong Thực đơn bán hàng"
                      >
                        <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>

                  {/* Ingredients Breakdown Table */}
                  <div className="mt-4 overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left text-xs divide-y divide-slate-200">
                      <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider">
                        <tr>
                          <th className="px-4 py-2.5">Nguyên Liệu</th>
                          <th className="px-4 py-2.5">Định Lượng / Khẩu Phần</th>
                          <th className="px-4 py-2.5">Đơn Giá Nhập</th>
                          <th className="px-4 py-2.5">Chi Phí Cấu Thành</th>
                          <th className="px-4 py-2.5 text-right">% Tỷ Trọng Giá Vốn</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {recipe.ingredients.map((ing, idx) => {
                          const percent = totalCost > 0 ? (ing.totalCost / totalCost) * 100 : 0;
                          return (
                            <tr key={idx} className="hover:bg-slate-50/80 transition">
                              <td className="px-4 py-2.5 font-bold text-slate-800">{ing.name}</td>
                              <td className="px-4 py-2.5 font-mono text-slate-600">
                                {ing.quantity} {ing.unit}
                              </td>
                              <td className="px-4 py-2.5 font-mono text-slate-500">
                                {formatCurrency(ing.unitCost)} / {ing.unit}
                              </td>
                              <td className="px-4 py-2.5 font-mono font-bold text-amber-700">
                                {formatCurrency(ing.totalCost)}
                              </td>
                              <td className="px-4 py-2.5 text-right font-mono text-slate-500">
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
        <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-xs divide-y divide-slate-200">
              <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider">
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
              <tbody className="divide-y divide-slate-100">
                {ingredients.map((ing) => {
                  const isLow = ing.currentStock <= ing.minThreshold;
                  return (
                    <tr key={ing.id} className="hover:bg-slate-50/80 transition group">
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="font-bold text-slate-900 block">{ing.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">#{ing.code}</span>
                      </td>
                      <td className="px-5 py-4 text-slate-600 whitespace-nowrap">{ing.category}</td>
                      <td className="px-5 py-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                        {ing.currentStock.toLocaleString('vi-VN')} {ing.unit}
                      </td>
                      <td className="px-5 py-4 font-mono text-slate-500 whitespace-nowrap">
                        {ing.minThreshold.toLocaleString('vi-VN')} {ing.unit}
                      </td>
                      <td className="px-5 py-4 font-mono font-bold text-emerald-700 whitespace-nowrap">
                        {formatCurrency(ing.costPerUnit)} / {ing.unit}
                      </td>
                      <td className="px-5 py-4 text-slate-500 whitespace-nowrap">{ing.supplier}</td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        {isLow ? (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            <ExclamationTriangleIcon className="w-3 h-3" />
                            <span>Cần Nhập Thêm</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
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
          <div className="p-6 rounded-2xl bg-white border border-emerald-200/80 shadow-xs space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center font-bold">
                <SparklesIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Tối Ưu Giá Vốn Món Bún Riêu Chay</h3>
                <span className="text-[11px] text-emerald-700 font-mono font-semibold">Tiềm năng tiết kiệm: -14.2% Food Cost</span>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Phân tích chỉ ra chi phí hạt điều sữa chiếm tới 42% giá vốn của món. Đề xuất phối trộn 60% hạt điều + 40% hạt sen Huế bùi béo theo mùa.
            </p>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
              <div className="flex justify-between text-slate-500">
                <span>Giá vốn hiện tại:</span>
                <span className="font-mono text-amber-700 font-bold">18,900 ₫</span>
              </div>
              <div className="flex justify-between text-emerald-800">
                <span>Giá vốn sau tối ưu:</span>
                <span className="font-mono text-emerald-700 font-bold">16,200 ₫</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-sky-200/80 shadow-xs space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 border border-sky-200 flex items-center justify-center font-bold">
                <SparklesIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Dự Báo Nhu Cầu Nguyên Liệu Tuần Tới</h3>
                <span className="text-[11px] text-sky-700 font-mono font-semibold">Dựa trên 185 đơn gói tuần đã đặt trước</span>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Cần chuẩn bị tối thiểu <strong>28.5 kg Nấm đùi gà</strong> và <strong>42 kg Gạo lứt ST25</strong> trước sáng thứ Hai để đảm bảo chế biến liên tục không đứt gãy.
            </p>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
              <div className="flex justify-between text-slate-500">
                <span>Tình trạng Nấm đùi gà:</span>
                <span className="font-mono text-amber-700 font-bold">Thiếu 25.3 kg</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Tình trạng Gạo lứt:</span>
                <span className="font-mono text-emerald-700 font-bold">Đủ lượng phục vụ</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recipe Detail Drawer */}
      <AdminDrawer
        isOpen={showDrawer}
        onClose={() => setShowDrawer(false)}
        title={selectedRecipe?.dishName || 'Định Lượng Món Ăn'}
        subtitle="Bảng phân tích chi phí cấu thành và định lượng nguyên liệu"
        icon={BeakerIcon}
        width="lg"
      >
        {selectedRecipe && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">Giá Bán</span>
                <span className="text-sm font-bold font-mono text-slate-900">{formatCurrency(selectedRecipe.sellingPrice)}</span>
              </div>
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
                <span className="text-[10px] text-amber-700 uppercase font-semibold block">Giá Vốn COGS</span>
                <span className="text-sm font-bold font-mono text-amber-900">
                  {formatCurrency(calculateFoodCost(selectedRecipe))}
                </span>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2">
                Chi Tiết Nguyên Liệu Chế Biến
              </h4>
              <div className="space-y-2">
                {selectedRecipe.ingredients.map((ing, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
                    <div>
                      <span className="font-bold text-slate-900 block">{ing.name}</span>
                      <span className="text-[11px] text-slate-500 font-mono">
                        {ing.quantity} {ing.unit} @ {formatCurrency(ing.unitCost)}/{ing.unit}
                      </span>
                    </div>
                    <span className="font-mono font-bold text-emerald-700">{formatCurrency(ing.totalCost)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </AdminDrawer>

      {/* Quick Stock Import Modal Dialog */}
      <AdminModalDialog
        isOpen={showStockModal}
        onClose={() => setShowStockModal(false)}
        title="Nhập Kho Nguyên Liệu Nhanh"
        subtitle="Cập nhật trực tiếp số lượng tồn kho nguyên liệu thực vật"
        icon={ArchiveBoxIcon}
        maxWidth="md"
        footerActions={
          <>
            <button
              type="button"
              onClick={() => setShowStockModal(false)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-xs transition"
            >
              Hủy
            </button>
            <button
              onClick={handleStockImport}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition shadow-xs"
            >
              Xác Nhận Nhập Kho
            </button>
          </>
        }
      >
        <form onSubmit={handleStockImport} className="space-y-3.5">
          <div>
            <label className="block text-slate-700 font-bold mb-1">Chọn nguyên liệu</label>
            <select
              value={stockImportData.ingredientId}
              onChange={(e) => setStockImportData({ ...stockImportData, ingredientId: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white font-medium"
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
            <label className="block text-slate-700 font-bold mb-1">Số lượng nhập thêm</label>
            <input
              type="number"
              value={stockImportData.quantity}
              onChange={(e) => setStockImportData({ ...stockImportData, quantity: Number(e.target.value) })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white font-mono"
              min="1"
              required
            />
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">Ghi chú phiếu nhập</label>
            <input
              type="text"
              value={stockImportData.notes}
              onChange={(e) => setStockImportData({ ...stockImportData, notes: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white"
              placeholder="Ví dụ: Nhập đợt 1 từ HTX Đà Lạt..."
            />
          </div>
        </form>
      </AdminModalDialog>
    </div>
  );
}
