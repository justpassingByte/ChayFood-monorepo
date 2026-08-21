'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  SparklesIcon,
  BeakerIcon,
  MagnifyingGlassIcon,
  Squares2X2Icon,
  ListBulletIcon,
  FunnelIcon,
  ArrowsUpDownIcon,
  FireIcon,
  BoltIcon,
  TagIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  FolderPlusIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import { categoryService, Category } from '../../services/categoryService';
import { menuService } from '@/lib/services';
import { MenuItem } from '@/lib/services/types';

interface ExtendedCategory extends Category {
  id?: number;
  _id?: string;
}

interface MenuItemFormState {
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
  isAvailable: boolean;
  preparationTime: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  allergens: string;
}

const defaultFormData: MenuItemFormState = {
  name: '',
  category: '',
  price: 65000,
  description: '',
  image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
  isAvailable: true,
  preparationTime: 15,
  calories: 420,
  protein: 18,
  carbs: 52,
  fat: 8,
  allergens: 'Đậu phộng, Hạt điều',
};

const initialFallbackDishes: MenuItem[] = [
  {
    _id: 'item-1',
    name: 'Cơm Gạo Lứt Chả Nấm Đậu Hũ',
    category: 'Gói Chuẩn Macro',
    price: 85000,
    description: 'Gạo lứt huyết rồng ST25 kết hợp chả nấm đùi gà thơm bùi, đậu hũ non chiên giòn ráo dầu và sốt tiêu đen nguyên hạt.',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
  },
  {
    _id: 'item-2',
    name: 'Bún Riêu Thuần Chay Dưỡng Sinh',
    category: 'Món Nước Thanh Nhiệt',
    price: 75000,
    description: 'Nước dùng chua thanh từ cà chua bi hữu cơ và me tươi, riêu hạt điều béo ngậy, nấm tuyết giòn sần sật.',
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
  },
  {
    _id: 'item-3',
    name: 'Salad Quinoa Bơ Sáp Hạt Điều',
    category: 'Eat Clean Ít Calo',
    price: 90000,
    description: 'Hạt diêm mạch hữu cơ nhập khẩu, bơ sáp Đắk Lắk dẻo mịn, sốt mè rang bùi béo và hạt điều sấy nguyên vị.',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
  },
  {
    _id: 'item-4',
    name: 'Phở Nấm Hương Đậu Hũ Non',
    category: 'Món Nước Thanh Nhiệt',
    price: 80000,
    description: 'Nước phở hầm 8 tiếng từ mía lau và củ quả tươi, nấm hương rừng Tây Bắc dậy mùi thơm nức.',
    image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
  },
  {
    _id: 'item-5',
    name: 'Cà Rốt & Bí Đỏ Hầm Nấm Đông Cô',
    category: 'Chăm Sóc Gia Đình',
    price: 95000,
    description: 'Món tiềm bổ dưỡng thanh ngọt tự nhiên, củ sen giòn mát và táo đỏ Tân Cương dưỡng huyết an thần.',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
  },
  {
    _id: 'item-6',
    name: 'Cơm Tấm Sườn Nấm Sốt BBQ Chay',
    category: 'Gói Chuẩn Macro',
    price: 79000,
    description: 'Sườn chay từ chân nấm đông cô tẩm ướp gia vị thảo mộc, nướng vàng thơm ăn kèm bì thính gạo rang.',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',
    isAvailable: false,
  },
  {
    _id: 'item-7',
    name: 'Gỏi Cuốn Bơ Sáp Tôm Chay Hạt Sen',
    category: 'Eat Clean Ít Calo',
    price: 65000,
    description: 'Bánh tráng gạo lứt dẻo dai cuốn cùng rau thơm sông nước, bơ sáp tươi và sốt tương đậu phộng mè rang.',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
  },
  {
    _id: 'item-8',
    name: 'Canh Chua Nam Bộ Bạc Hà Đậu Bắp',
    category: 'Chăm Sóc Gia Đình',
    price: 72000,
    description: 'Hương vị chua thanh từ nước cốt me tươi, bạc hà giòn rụm, đậu bắp tươi và nấm rơm đồng ngọt bùi.',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
  },
];

export default function RebuiltMenuPage() {
  const [categories, setCategories] = useState<ExtendedCategory[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialFallbackDishes);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'unavailable'>('all');
  const [priceFilter, setPriceFilter] = useState<'all' | 'under75' | '75to90' | 'above90'>('all');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'name-asc'>('default');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Modals state
  const [showItemModal, setShowItemModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [formData, setFormData] = useState<MenuItemFormState>(defaultFormData);
  const [editingCategory, setEditingCategory] = useState<ExtendedCategory | null>(null);
  const [categoryFormData, setCategoryFormData] = useState({
    name: '',
    description: '',
    slug: '',
    image: '',
    isActive: true,
    displayOrder: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchCategories();
    fetchMenuItems();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await categoryService.getAll();
      if (data && data.length > 0) {
        setCategories(data);
      } else {
        setCategories([
          { id: 1, name: 'Gói Chuẩn Macro', description: 'Tối ưu tỷ lệ Protein, Calo và dinh dưỡng theo mục tiêu' },
          { id: 2, name: 'Món Nước Thanh Nhiệt', description: 'Nước dùng rau củ quả hầm thanh ngọt tự nhiên' },
          { id: 3, name: 'Eat Clean Ít Calo', description: 'Ít dầu mỡ, hỗ trợ vóc dáng thanh mảnh nhẹ nhàng' },
          { id: 4, name: 'Chăm Sóc Gia Đình', description: 'Món chay thuần khiết, phong vị ấm cúng trọn vẹn' },
        ]);
      }
    } catch {
      setCategories([
        { id: 1, name: 'Gói Chuẩn Macro', description: 'Tối ưu tỷ lệ Protein, Calo và dinh dưỡng theo mục tiêu' },
        { id: 2, name: 'Món Nước Thanh Nhiệt', description: 'Nước dùng rau củ quả hầm thanh ngọt tự nhiên' },
        { id: 3, name: 'Eat Clean Ít Calo', description: 'Ít dầu mỡ, hỗ trợ vóc dáng thanh mảnh nhẹ nhàng' },
        { id: 4, name: 'Chăm Sóc Gia Đình', description: 'Món chay thuần khiết, phong vị ấm cúng trọn vẹn' },
      ]);
    }
  };

  const fetchMenuItems = async () => {
    try {
      const response = await menuService.getAll();
      if (response && response.data && response.data.length > 0) {
        setMenuItems(response.data);
      }
    } catch {
      // keep initial fallback dishes
    }
  };

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(val);

  // Multi-dimensional filtering logic
  const filteredAndSortedItems = useMemo(() => {
    return menuItems
      .filter((item) => {
        // Category filter
        if (selectedCategory !== 'all') {
          const itemCat = typeof item.category === 'string' ? item.category : (item.category as { name?: string })?.name || '';
          if (itemCat !== selectedCategory) return false;
        }

        // Search query filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = item.name.toLowerCase().includes(q);
          const matchDesc = item.description?.toLowerCase().includes(q);
          if (!matchName && !matchDesc) return false;
        }

        // Status filter
        if (statusFilter === 'available' && item.isAvailable === false) return false;
        if (statusFilter === 'unavailable' && item.isAvailable !== false) return false;

        // Price range filter
        if (priceFilter === 'under75' && item.price >= 75000) return false;
        if (priceFilter === '75to90' && (item.price < 75000 || item.price > 90000)) return false;
        if (priceFilter === 'above90' && item.price <= 90000) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'name-asc') return a.name.localeCompare(b.name, 'vi');
        return 0;
      });
  }, [menuItems, selectedCategory, searchQuery, statusFilter, priceFilter, sortBy]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredAndSortedItems.length / itemsPerPage));
  const paginatedItems = filteredAndSortedItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const availableCount = menuItems.filter((i) => i.isAvailable !== false).length;
  const unavailableCount = menuItems.filter((i) => i.isAvailable === false).length;

  const handleToggleAvailability = (id: string, currentStatus: boolean) => {
    setMenuItems((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, isAvailable: !currentStatus } : item
      )
    );
    toast.success('Đã cập nhật trạng thái phục vụ món ăn');
  };

  const handleDeleteItem = (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa món ăn này khỏi thực đơn?')) return;
    setMenuItems((prev) => prev.filter((item) => item._id !== id));
    toast.success('Đã xóa món ăn thành công');
  };

  const handleOpenCreateModal = () => {
    setEditingItem(null);
    setFormData({
      ...defaultFormData,
      category: categories[0]?.name || 'Gói Chuẩn Macro',
    });
    setShowItemModal(true);
  };

  const handleOpenEditModal = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      category: typeof item.category === 'string' ? item.category : (item.category as { name?: string })?.name || categories[0]?.name || '',
      price: item.price,
      description: item.description || '',
      image: item.image || defaultFormData.image,
      isAvailable: item.isAvailable ?? true,
      preparationTime: 15,
      calories: 420,
      protein: 18,
      carbs: 52,
      fat: 8,
      allergens: 'Đậu phộng',
    });
    setShowItemModal(true);
  };

  const handleItemFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (editingItem) {
      setMenuItems((prev) =>
        prev.map((item) =>
          item._id === editingItem._id
            ? {
                ...item,
                name: formData.name,
                category: formData.category,
                price: Number(formData.price),
                description: formData.description,
                image: formData.image,
                isAvailable: formData.isAvailable,
              }
            : item
        )
      );
      toast.success('Cập nhật món ăn thành công');
    } else {
      const newItem: MenuItem = {
        _id: `item-${Date.now()}`,
        name: formData.name,
        category: formData.category,
        price: Number(formData.price),
        description: formData.description,
        image: formData.image,
        isAvailable: formData.isAvailable,
      };
      setMenuItems((prev) => [newItem, ...prev]);
      toast.success('Thêm món ăn mới vào thực đơn thành công');
    }

    setIsSubmitting(false);
    setShowItemModal(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center space-x-2.5">
            <SparklesIcon className="w-6 h-6 text-emerald-400" />
            <span>Quản Lý Thực Đơn & Danh Mục Món Ăn</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Tùy biến danh mục dinh dưỡng, thiết lập giá niêm yết và liên kết định lượng nguyên liệu
          </p>
        </div>

        <div className="flex items-center space-x-2 self-start sm:self-auto">
          <button
            onClick={() => setShowCategoryModal(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-700 transition flex items-center space-x-1.5"
          >
            <FolderPlusIcon className="w-4 h-4 text-emerald-400" />
            <span>Quản Lý Danh Mục</span>
          </button>

          <button
            onClick={handleOpenCreateModal}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center space-x-1.5 transition shadow-sm"
          >
            <PlusIcon className="h-4 w-4 stroke-[2.5]" />
            <span>Thêm Món Mới</span>
          </button>
        </div>
      </div>

      {/* 4 Quick Stat KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-slate-800/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Tổng Món Ăn
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <SparklesIcon className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold font-mono text-white mt-1.5">{menuItems.length}</p>
          <span className="text-[11px] text-emerald-400 font-medium">Toàn bộ thực đơn</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-slate-800/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Đang Phục Vụ
            </span>
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <CheckCircleIcon className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold font-mono text-white mt-1.5">{availableCount}</p>
          <span className="text-[11px] text-sky-400 font-medium">Sẵn sàng nhận đơn</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-slate-800/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Tạm Hết / Tạm Ngưng
            </span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <ExclamationCircleIcon className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold font-mono text-white mt-1.5">{unavailableCount}</p>
          <span className="text-[11px] text-rose-400 font-medium">Cần bổ sung kho</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-slate-800/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Danh Mục Hoạt Động
            </span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <TagIcon className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold font-mono text-white mt-1.5">{categories.length}</p>
          <span className="text-[11px] text-indigo-400 font-medium">Nhóm dinh dưỡng</span>
        </div>
      </div>

      {/* Category Matrix Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar text-xs">
        <button
          onClick={() => {
            setSelectedCategory('all');
            setCurrentPage(1);
          }}
          className={`px-4 py-2 rounded-xl font-semibold whitespace-nowrap transition-all ${
            selectedCategory === 'all'
              ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm shadow-emerald-950/40'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          Tất cả món ({menuItems.length})
        </button>

        {categories.map((cat) => {
          const count = menuItems.filter((i) => {
            const itemCat = typeof i.category === 'string' ? i.category : (i.category as { name?: string })?.name || '';
            return itemCat === cat.name;
          }).length;

          return (
            <button
              key={cat.id || cat._id}
              onClick={() => {
                setSelectedCategory(cat.name);
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-xl font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.name
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm shadow-emerald-950/40'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat.name} ({count})
            </button>
          );
        })}
      </div>

      {/* Filter Matrix & View Controls */}
      <div className="bg-slate-900/80 backdrop-blur-xl p-4 sm:p-5 rounded-2xl border border-slate-800/80 space-y-3.5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
          {/* Search Box (5 cols) */}
          <div className="lg:col-span-4 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Tìm theo tên món ăn, mô tả..."
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
            <MagnifyingGlassIcon className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>

          {/* Status Filter (2 cols) */}
          <div className="lg:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as 'all' | 'available' | 'unavailable');
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="all">Trạng thái: Tất cả</option>
              <option value="available">Sẵn sàng phục vụ</option>
              <option value="unavailable">Tạm ngưng mở bán</option>
            </select>
          </div>

          {/* Price Filter (2 cols) */}
          <div className="lg:col-span-3">
            <select
              value={priceFilter}
              onChange={(e) => {
                setPriceFilter(e.target.value as 'all' | 'under75' | '75to90' | 'above90');
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="all">Khoảng giá: Tất cả</option>
              <option value="under75">Dưới 75,000 ₫</option>
              <option value="75to90">75,000 ₫ — 90,000 ₫</option>
              <option value="above90">Trên 90,000 ₫</option>
            </select>
          </div>

          {/* View Switcher (2 cols) */}
          <div className="lg:col-span-2 flex items-center justify-end space-x-1.5">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-xl border transition ${
                viewMode === 'grid'
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
              }`}
              title="Chế độ Lưới Thẻ Ẩm Thực"
            >
              <Squares2X2Icon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-xl border transition ${
                viewMode === 'table'
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
              }`}
              title="Chế độ Bảng Danh Sách"
            >
              <ListBulletIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Sort and Count Summary */}
        <div className="flex flex-wrap items-center justify-between pt-3 border-t border-slate-800 text-xs text-slate-400 gap-2">
          <span>
            Tìm thấy <strong className="font-mono text-emerald-400">{filteredAndSortedItems.length}</strong> món ăn
          </span>

          <div className="flex items-center space-x-2">
            <span>Sắp xếp:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="px-2.5 py-1 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-medium"
            >
              <option value="default">Mặc định</option>
              <option value="price-asc">Giá: Thấp đến Cao</option>
              <option value="price-desc">Giá: Cao đến Thấp</option>
              <option value="name-asc">Tên món (A - Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content: Grid vs Table */}
      {filteredAndSortedItems.length === 0 ? (
        <div className="bg-slate-900/80 rounded-2xl border border-slate-800/80 p-12 text-center text-slate-400 space-y-2">
          <SparklesIcon className="w-8 h-8 mx-auto text-slate-600" />
          <p className="text-sm font-semibold text-slate-200">Không tìm thấy món ăn nào phù hợp</p>
          <p className="text-xs">Hãy thử thay đổi danh mục hoặc từ khóa tìm kiếm</p>
        </div>
      ) : viewMode === 'grid' ? (
        /* Grid Cards View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {paginatedItems.map((item) => (
            <div
              key={item._id}
              className="bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-800/80 overflow-hidden flex flex-col justify-between hover:border-emerald-500/30 transition-all duration-200 group"
            >
              <div>
                {/* Image Container */}
                <div className="relative h-44 w-full bg-slate-950 overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2.5 right-2.5">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        item.isAvailable !== false
                          ? 'bg-emerald-500/90 text-slate-950 border-emerald-400 shadow-sm'
                          : 'bg-rose-500/90 text-white border-rose-400 shadow-sm'
                      }`}
                    >
                      {item.isAvailable !== false ? 'Sẵn sàng' : 'Tạm ngưng'}
                    </span>
                  </div>
                  <div className="absolute bottom-2.5 left-2.5">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-950/80 text-emerald-300 border border-slate-800 backdrop-blur-sm">
                      {typeof item.category === 'string' ? item.category : (item.category as { name?: string })?.name || 'Món chay'}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex justify-between items-start gap-2 mb-1.5">
                    <h3 className="font-bold text-sm text-white group-hover:text-emerald-400 transition-colors line-clamp-1">
                      {item.name}
                    </h3>
                    <span className="font-mono font-bold text-emerald-400 text-sm whitespace-nowrap">
                      {formatCurrency(item.price)}
                    </span>
                  </div>

                  <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed mb-3">
                    {item.description}
                  </p>

                  {/* Macro Badges */}
                  <div className="flex items-center space-x-2 text-[10px] font-mono text-slate-400 pt-2 border-t border-slate-800/60">
                    <span className="flex items-center text-amber-400">
                      <FireIcon className="w-3 h-3 mr-0.5" />
                      420 kcal
                    </span>
                    <span>•</span>
                    <span className="text-emerald-400">18g Protein</span>
                    <span>•</span>
                    <span className="text-sky-400">52g Carbs</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 pt-0 flex items-center justify-between border-t border-slate-800/60 mt-3 pt-3">
                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={() => handleToggleAvailability(item._id, item.isAvailable !== false)}
                    className={`px-2 py-1 rounded-lg text-[11px] font-medium transition ${
                      item.isAvailable !== false
                        ? 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20'
                        : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20'
                    }`}
                  >
                    {item.isAvailable !== false ? 'Tạm ngưng' : 'Mở bán'}
                  </button>

                  <Link
                    href="/admin/recipes"
                    className="px-2 py-1 rounded-lg text-[11px] font-medium text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 transition flex items-center space-x-1"
                    title="Xem định lượng nguyên liệu & giá vốn"
                  >
                    <BeakerIcon className="w-3 h-3" />
                    <span>BOM</span>
                  </Link>
                </div>

                <div className="flex gap-1.5">
                  <button
                    onClick={() => handleOpenEditModal(item)}
                    className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-emerald-300 hover:bg-slate-700 transition"
                    title="Chỉnh sửa món"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteItem(item._id)}
                    className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
                    title="Xóa món"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Data Table View */
        <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-800/80 overflow-hidden">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-xs divide-y divide-slate-800">
              <thead className="bg-slate-950/70 text-slate-400 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3.5 whitespace-nowrap">Món Ăn</th>
                  <th className="px-5 py-3.5 whitespace-nowrap">Danh Mục</th>
                  <th className="px-5 py-3.5 whitespace-nowrap">Đơn Giá Niêm Yết</th>
                  <th className="px-5 py-3.5 whitespace-nowrap">Chỉ Số Dinh Dưỡng</th>
                  <th className="px-5 py-3.5 whitespace-nowrap">Trạng Thái</th>
                  <th className="px-5 py-3.5 text-right whitespace-nowrap">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {paginatedItems.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-800/40 transition group">
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-slate-950 flex-shrink-0 border border-slate-800">
                          <Image src={item.image} alt={item.name} fill className="object-cover" />
                        </div>
                        <div>
                          <span className="font-semibold text-slate-100 block group-hover:text-emerald-400 transition-colors">
                            {item.name}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">#{item._id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-slate-300">
                      {typeof item.category === 'string' ? item.category : (item.category as { name?: string })?.name || 'Món chay'}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap font-mono font-bold text-emerald-400">
                      {formatCurrency(item.price)}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap font-mono text-[11px] text-slate-400">
                      <span className="text-amber-400">420 kcal</span> • <span className="text-emerald-400">18g Pro</span>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          item.isAvailable !== false
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                        }`}
                      >
                        {item.isAvailable !== false ? 'Sẵn sàng' : 'Tạm ngưng'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right space-x-1.5 whitespace-nowrap">
                      <Link
                        href="/admin/recipes"
                        className="inline-flex p-1.5 rounded-lg bg-slate-800 text-emerald-400 hover:bg-slate-700 transition"
                        title="Xem định lượng & giá vốn"
                      >
                        <BeakerIcon className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => handleOpenEditModal(item)}
                        className="inline-flex p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-emerald-300 hover:bg-slate-700 transition"
                        title="Chỉnh sửa món"
                      >
                        <PencilIcon className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item._id)}
                        className="inline-flex p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
                        title="Xóa món"
                      >
                        <TrashIcon className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3.5 bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-800/80 text-xs">
          <span className="text-slate-400">
            Hiển thị <strong className="font-mono text-slate-200">{(currentPage - 1) * itemsPerPage + 1}</strong> —{' '}
            <strong className="font-mono text-slate-200">
              {Math.min(currentPage * itemsPerPage, filteredAndSortedItems.length)}
            </strong>{' '}
            trong tổng số <strong className="font-mono text-slate-200">{filteredAndSortedItems.length}</strong> món ăn
          </span>

          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 rounded-lg border border-slate-700 transition font-medium"
            >
              Trước
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-7 h-7 rounded-lg text-xs font-mono font-semibold transition ${
                  currentPage === page
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 rounded-lg border border-slate-700 transition font-medium"
            >
              Sau
            </button>
          </div>
        </div>
      )}

      {/* Luxury 2-Column Create / Edit Modal Dialog */}
      {showItemModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 w-full max-w-4xl shadow-2xl overflow-y-auto max-h-[90vh] custom-scrollbar">
            <div className="flex justify-between items-center pb-4 mb-5 border-b border-slate-800">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">
                  <SparklesIcon className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-white">
                    {editingItem ? 'Chỉnh Sửa Món Ăn' : 'Thêm Món Chay Mới Vào Thực Đơn'}
                  </h2>
                  <p className="text-xs text-slate-400">
                    Cung cấp đầy đủ thông tin dinh dưỡng, định lượng và hình ảnh chân thực
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowItemModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleItemFormSubmit} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Column 1: Basic Dish Info (7 cols) */}
                <div className="lg:col-span-7 space-y-4 text-xs">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Tên món ăn <span className="text-emerald-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Ví dụ: Cơm Gạo Lứt Chả Nấm Đậu Hũ"
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-emerald-500 font-medium"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">
                        Danh mục dinh dưỡng <span className="text-emerald-400">*</span>
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-emerald-500 font-medium"
                        required
                      >
                        {categories.map((cat) => (
                          <option key={cat.id || cat._id} value={cat.name}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">
                        Đơn giá niêm yết (₫) <span className="text-emerald-400">*</span>
                      </label>
                      <input
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-emerald-500 font-mono font-bold text-emerald-400"
                        min="1000"
                        step="1000"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Thời gian chế biến tiêu chuẩn (phút)
                    </label>
                    <input
                      type="number"
                      value={formData.preparationTime}
                      onChange={(e) => setFormData({ ...formData, preparationTime: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-emerald-500 font-mono"
                      min="1"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Mô tả & Câu chuyện ẩm thực
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      placeholder="Mô tả hương vị, nguyên liệu thực vật tươi lành..."
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-emerald-500 leading-relaxed"
                      required
                    />
                  </div>

                  <div className="flex items-center space-x-2 pt-2">
                    <input
                      type="checkbox"
                      id="isAvailableInput"
                      checked={formData.isAvailable}
                      onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                      className="w-4 h-4 rounded text-emerald-500 bg-slate-950 border-slate-700 focus:ring-emerald-500"
                    />
                    <label htmlFor="isAvailableInput" className="text-slate-300 font-medium cursor-pointer">
                      Kích hoạt mở bán ngay trên Cửa Hàng
                    </label>
                  </div>
                </div>

                {/* Column 2: Visual Preview & Macro Metrics (5 cols) */}
                <div className="lg:col-span-5 space-y-4 text-xs bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">URL Hình ảnh món ăn</label>
                    <input
                      type="text"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-emerald-500"
                      required
                    />
                  </div>

                  {/* Image Live Preview */}
                  <div className="relative h-36 w-full rounded-xl overflow-hidden bg-slate-900 border border-slate-800">
                    <Image
                      src={formData.image || defaultFormData.image}
                      alt="Xem trước hình ảnh"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-slate-950/80 text-[10px] text-slate-300 font-mono">
                      Live Preview
                    </div>
                  </div>

                  {/* 4 Macro Inputs */}
                  <div className="pt-2">
                    <span className="block text-slate-300 font-semibold mb-2">Bộ 4 Chỉ Số Dinh Dưỡng Macro</span>
                    <div className="grid grid-cols-2 gap-2.5 font-mono">
                      <div>
                        <span className="text-[10px] text-slate-400 block mb-0.5">Năng Lượng (Calo)</span>
                        <input
                          type="number"
                          value={formData.calories}
                          onChange={(e) => setFormData({ ...formData, calories: Number(e.target.value) })}
                          className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-amber-400 font-bold text-xs"
                          placeholder="kcal"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block mb-0.5">Đạm Thực Vật (Protein)</span>
                        <input
                          type="number"
                          value={formData.protein}
                          onChange={(e) => setFormData({ ...formData, protein: Number(e.target.value) })}
                          className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-emerald-400 font-bold text-xs"
                          placeholder="g"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block mb-0.5">Tinh Bột Chậm (Carbs)</span>
                        <input
                          type="number"
                          value={formData.carbs}
                          onChange={(e) => setFormData({ ...formData, carbs: Number(e.target.value) })}
                          className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-sky-400 font-bold text-xs"
                          placeholder="g"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block mb-0.5">Chất Béo Tốt (Fat)</span>
                        <input
                          type="number"
                          value={formData.fat}
                          onChange={(e) => setFormData({ ...formData, fat: Number(e.target.value) })}
                          className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-indigo-400 font-bold text-xs"
                          placeholder="g"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Cảnh báo dị ứng (Allergens)</label>
                    <input
                      type="text"
                      value={formData.allergens}
                      onChange={(e) => setFormData({ ...formData, allergens: e.target.value })}
                      placeholder="Ví dụ: Đậu phộng, Hạt điều, Gluten..."
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Actions */}
              <div className="flex justify-end items-center space-x-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowItemModal(false)}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition shadow-sm"
                >
                  {isSubmitting ? 'Đang Lưu...' : editingItem ? 'Cập Nhật Món Ăn' : 'Thêm Vào Thực Đơn'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Category Management Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 w-full max-w-xl shadow-2xl">
            <div className="flex justify-between items-center pb-3 mb-4 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Quản Lý Danh Mục Dinh Dưỡng</h3>
              <button
                onClick={() => setShowCategoryModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 mb-5 max-h-60 overflow-y-auto custom-scrollbar pr-1">
              {categories.map((cat) => (
                <div
                  key={cat.id || cat._id}
                  className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex justify-between items-center text-xs"
                >
                  <div>
                    <span className="font-bold text-slate-100 block">{cat.name}</span>
                    <span className="text-[11px] text-slate-400">{cat.description}</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-semibold">
                    Hoạt động
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowCategoryModal(false)}
                className="px-5 py-2 bg-emerald-500 text-slate-950 font-bold rounded-xl text-xs hover:bg-emerald-400"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}