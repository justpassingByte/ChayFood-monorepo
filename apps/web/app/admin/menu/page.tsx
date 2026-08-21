'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  SparklesIcon,
  BeakerIcon,
  Squares2X2Icon,
  ListBulletIcon,
  FireIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  FolderPlusIcon,
  EyeIcon,
  TagIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import { categoryService, Category } from '../../services/categoryService';
import { menuService } from '@/lib/services';
import { MenuItem } from '@/lib/services/types';

import AdminMetricCard from '@/components/admin/ui/AdminMetricCard';
import AdminFilterBar from '@/components/admin/ui/AdminFilterBar';
import AdminPagination from '@/components/admin/ui/AdminPagination';
import AdminModalDialog from '@/components/admin/ui/AdminModalDialog';
import AdminDrawer from '@/components/admin/ui/AdminDrawer';

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
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priceFilter, setPriceFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('default');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Modals and Drawer state
  const [showItemModal, setShowItemModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showDetailDrawer, setShowDetailDrawer] = useState(false);
  const [viewingItem, setViewingItem] = useState<MenuItem | null>(null);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [formData, setFormData] = useState<MenuItemFormState>(defaultFormData);
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
      // keep fallback
    }
  };

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(val);

  // Multi-dimensional filtering
  const filteredAndSortedItems = useMemo(() => {
    return menuItems
      .filter((item) => {
        if (selectedCategory !== 'all') {
          const itemCat = typeof item.category === 'string' ? item.category : (item.category as { name?: string })?.name || '';
          if (itemCat !== selectedCategory) return false;
        }

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = item.name.toLowerCase().includes(q);
          const matchDesc = item.description?.toLowerCase().includes(q);
          if (!matchName && !matchDesc) return false;
        }

        if (statusFilter === 'available' && item.isAvailable === false) return false;
        if (statusFilter === 'unavailable' && item.isAvailable !== false) return false;

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
    toast.success('Đã cập nhật trạng thái phục vụ');
  };

  const handleDeleteItem = (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa món ăn này khỏi thực đơn?')) return;
    setMenuItems((prev) => prev.filter((item) => item._id !== id));
    toast.success('Đã xóa món ăn thành công');
  };

  const handleOpenDetailDrawer = (item: MenuItem) => {
    setViewingItem(item);
    setShowDetailDrawer(true);
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
      toast.success('Đã thêm món mới vào thực đơn');
    }

    setIsSubmitting(false);
    setShowItemModal(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/80">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center space-x-2.5">
            <SparklesIcon className="w-6 h-6 text-emerald-600" />
            <span>Quản Lý Thực Đơn & Danh Mục Món Ăn</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Tùy biến danh mục dinh dưỡng, thiết lập giá niêm yết và liên kết định lượng nguyên liệu
          </p>
        </div>

        <div className="flex items-center space-x-2.5 self-start sm:self-auto">
          <button
            onClick={() => setShowCategoryModal(true)}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-200 shadow-xs transition flex items-center space-x-1.5"
          >
            <FolderPlusIcon className="w-4 h-4 text-emerald-600" />
            <span>Quản Lý Danh Mục</span>
          </button>

          <button
            onClick={handleOpenCreateModal}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center space-x-1.5 transition shadow-xs"
          >
            <PlusIcon className="h-4 w-4 stroke-[2.5]" />
            <span>Thêm Món Mới</span>
          </button>
        </div>
      </div>

      {/* 4 Quick Stat KPI Cards using Unified AdminMetricCard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AdminMetricCard
          title="Tổng Món Ăn"
          value={String(menuItems.length)}
          subtitle="Toàn bộ thực đơn bán lẻ & gói"
          icon={SparklesIcon}
          accentColor="emerald"
          sparklineData={[18, 20, 22, 21, 24, 24, 24]}
        />
        <AdminMetricCard
          title="Đang Phục Vụ"
          value={String(availableCount)}
          subtitle="Sẵn sàng nhận đơn trực tiếp"
          icon={CheckCircleIcon}
          accentColor="sky"
          sparklineData={[16, 18, 19, 20, 21, 21, 21]}
        />
        <AdminMetricCard
          title="Tạm Ngưng / Hết Món"
          value={String(unavailableCount)}
          subtitle="Cần nhập bổ sung nguyên liệu"
          icon={ExclamationCircleIcon}
          accentColor="rose"
          sparklineData={[4, 3, 2, 3, 4, 3, 3]}
        />
        <AdminMetricCard
          title="Danh Mục Hoạt Động"
          value={String(categories.length)}
          subtitle="Nhóm khẩu phần chuẩn y khoa"
          icon={TagIcon}
          accentColor="indigo"
          sparklineData={[3, 4, 4, 4, 4, 4, 4]}
        />
      </div>

      {/* Category Matrix Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar text-xs">
        <button
          onClick={() => {
            setSelectedCategory('all');
            setCurrentPage(1);
          }}
          className={`px-4 py-2 rounded-xl font-bold whitespace-nowrap transition-all shadow-xs ${
            selectedCategory === 'all'
              ? 'bg-emerald-600 text-white shadow-emerald-700/20'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
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
              className={`px-4 py-2 rounded-xl font-bold whitespace-nowrap transition-all shadow-xs ${
                selectedCategory === cat.name
                  ? 'bg-emerald-600 text-white shadow-emerald-700/20'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
              }`}
            >
              {cat.name} ({count})
            </button>
          );
        })}
      </div>

      {/* Unified AdminFilterBar */}
      <AdminFilterBar
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          setCurrentPage(1);
        }}
        searchPlaceholder="Tìm kiếm theo tên món ăn, mô tả hương vị..."
        filters={[
          {
            id: 'status',
            value: statusFilter,
            onChange: (v) => {
              setStatusFilter(v);
              setCurrentPage(1);
            },
            options: [
              { label: 'Trạng thái: Tất cả', value: 'all' },
              { label: 'Sẵn sàng phục vụ', value: 'available' },
              { label: 'Tạm ngưng mở bán', value: 'unavailable' },
            ],
          },
          {
            id: 'price',
            value: priceFilter,
            onChange: (v) => {
              setPriceFilter(v);
              setCurrentPage(1);
            },
            options: [
              { label: 'Khoảng giá: Tất cả', value: 'all' },
              { label: 'Dưới 75,000 ₫', value: 'under75' },
              { label: '75,000 ₫ — 90,000 ₫', value: '75to90' },
              { label: 'Trên 90,000 ₫', value: 'above90' },
            ],
          },
        ]}
        sortBy={sortBy}
        onSortChange={(s) => setSortBy(s)}
        sortOptions={[
          { label: 'Mặc định', value: 'default' },
          { label: 'Giá: Thấp đến Cao', value: 'price-asc' },
          { label: 'Giá: Cao đến Thấp', value: 'price-desc' },
          { label: 'Tên món (A - Z)', value: 'name-asc' },
        ]}
        totalResults={filteredAndSortedItems.length}
        onReset={() => {
          setSearchQuery('');
          setStatusFilter('all');
          setPriceFilter('all');
          setSelectedCategory('all');
          setSortBy('default');
          setCurrentPage(1);
        }}
        extraActions={
          <div className="flex items-center space-x-1 border-l border-slate-200 pl-2.5">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-xl border transition ${
                viewMode === 'grid'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                  : 'bg-white text-slate-500 border-slate-200 hover:text-slate-800'
              }`}
              title="Chế độ Lưới Thẻ Ẩm Thực"
            >
              <Squares2X2Icon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-xl border transition ${
                viewMode === 'table'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                  : 'bg-white text-slate-500 border-slate-200 hover:text-slate-800'
              }`}
              title="Chế độ Bảng Danh Sách"
            >
              <ListBulletIcon className="w-4 h-4" />
            </button>
          </div>
        }
      />

      {/* Main Content: Grid vs Table */}
      {filteredAndSortedItems.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center text-slate-500 space-y-2 shadow-xs">
          <SparklesIcon className="w-8 h-8 mx-auto text-slate-300" />
          <p className="text-sm font-bold text-slate-800">Không tìm thấy món ăn nào phù hợp</p>
          <p className="text-xs">Hãy thử thay đổi danh mục hoặc từ khóa tìm kiếm</p>
        </div>
      ) : viewMode === 'grid' ? (
        /* Grid Cards View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {paginatedItems.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden flex flex-col justify-between hover:border-emerald-500/50 hover:shadow-md transition-all duration-200 group shadow-xs"
            >
              <div>
                {/* Image Container */}
                <div className="relative h-44 w-full bg-slate-100 overflow-hidden cursor-pointer" onClick={() => handleOpenDetailDrawer(item)}>
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
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-300 shadow-xs'
                          : 'bg-rose-50 text-rose-700 border-rose-300 shadow-xs'
                      }`}
                    >
                      {item.isAvailable !== false ? 'Sẵn sàng' : 'Tạm ngưng'}
                    </span>
                  </div>
                  <div className="absolute bottom-2.5 left-2.5">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white/90 text-emerald-800 border border-slate-200 backdrop-blur-sm shadow-xs">
                      {typeof item.category === 'string' ? item.category : (item.category as { name?: string })?.name || 'Món chay'}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex justify-between items-start gap-2 mb-1.5">
                    <h3
                      onClick={() => handleOpenDetailDrawer(item)}
                      className="font-bold text-sm text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1 cursor-pointer"
                    >
                      {item.name}
                    </h3>
                    <span className="font-mono font-bold text-emerald-700 text-sm whitespace-nowrap">
                      {formatCurrency(item.price)}
                    </span>
                  </div>

                  <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed mb-3">
                    {item.description}
                  </p>

                  {/* Macro Badges */}
                  <div className="flex items-center space-x-2 text-[10px] font-mono text-slate-500 pt-2 border-t border-slate-100">
                    <span className="flex items-center text-amber-600 font-semibold">
                      <FireIcon className="w-3 h-3 mr-0.5" />
                      420 kcal
                    </span>
                    <span>•</span>
                    <span className="text-emerald-700 font-semibold">18g Protein</span>
                    <span>•</span>
                    <span className="text-sky-700 font-semibold">52g Carbs</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 pt-0 flex items-center justify-between border-t border-slate-100 mt-3 pt-3 bg-slate-50/50">
                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={() => handleToggleAvailability(item._id, item.isAvailable !== false)}
                    className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition ${
                      item.isAvailable !== false
                        ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                        : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                    }`}
                  >
                    {item.isAvailable !== false ? 'Tạm ngưng' : 'Mở bán'}
                  </button>

                  <Link
                    href="/admin/recipes"
                    className="px-2 py-1 rounded-lg text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 transition flex items-center space-x-1"
                    title="Xem định lượng nguyên liệu & giá vốn"
                  >
                    <BeakerIcon className="w-3 h-3" />
                    <span>BOM</span>
                  </Link>
                </div>

                <div className="flex gap-1.5">
                  <button
                    onClick={() => handleOpenDetailDrawer(item)}
                    className="p-1.5 rounded-lg bg-white text-slate-600 hover:text-emerald-700 hover:bg-slate-100 border border-slate-200 transition"
                    title="Xem nhanh chi tiết món"
                  >
                    <EyeIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleOpenEditModal(item)}
                    className="p-1.5 rounded-lg bg-white text-slate-600 hover:text-emerald-700 hover:bg-slate-100 border border-slate-200 transition"
                    title="Chỉnh sửa món"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteItem(item._id)}
                    className="p-1.5 rounded-lg bg-white text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition"
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
        <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-xs divide-y divide-slate-200">
              <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3.5 whitespace-nowrap">Món Ăn</th>
                  <th className="px-5 py-3.5 whitespace-nowrap">Danh Mục</th>
                  <th className="px-5 py-3.5 whitespace-nowrap">Đơn Giá Niêm Yết</th>
                  <th className="px-5 py-3.5 whitespace-nowrap">Chỉ Số Dinh Dưỡng</th>
                  <th className="px-5 py-3.5 whitespace-nowrap">Trạng Thái</th>
                  <th className="px-5 py-3.5 text-right whitespace-nowrap">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedItems.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50/80 transition group">
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200">
                          <Image src={item.image} alt={item.name} fill className="object-cover" />
                        </div>
                        <div>
                          <span
                            onClick={() => handleOpenDetailDrawer(item)}
                            className="font-bold text-slate-900 block group-hover:text-emerald-700 transition-colors cursor-pointer"
                          >
                            {item.name}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">#{item._id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-slate-600 font-medium">
                      {typeof item.category === 'string' ? item.category : (item.category as { name?: string })?.name || 'Món chay'}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap font-mono font-bold text-emerald-700">
                      {formatCurrency(item.price)}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap font-mono text-[11px] text-slate-600">
                      <span className="text-amber-600 font-semibold">420 kcal</span> • <span className="text-emerald-700 font-semibold">18g Pro</span>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          item.isAvailable !== false
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}
                      >
                        {item.isAvailable !== false ? 'Sẵn sàng' : 'Tạm ngưng'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => handleOpenDetailDrawer(item)}
                        className="inline-flex p-1.5 rounded-lg bg-slate-50 text-slate-600 hover:text-emerald-700 hover:bg-slate-100 border border-slate-200 transition"
                        title="Xem chi tiết món"
                      >
                        <EyeIcon className="w-3.5 h-3.5" />
                      </button>
                      <Link
                        href="/admin/recipes"
                        className="inline-flex p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition"
                        title="Xem định lượng & giá vốn"
                      >
                        <BeakerIcon className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => handleOpenEditModal(item)}
                        className="inline-flex p-1.5 rounded-lg bg-slate-50 text-slate-600 hover:text-emerald-700 hover:bg-slate-100 border border-slate-200 transition"
                        title="Chỉnh sửa món"
                      >
                        <PencilIcon className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item._id)}
                        className="inline-flex p-1.5 rounded-lg bg-slate-50 text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition"
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

      {/* Unified AdminPagination */}
      <AdminPagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredAndSortedItems.length}
        itemsPerPage={itemsPerPage}
        onPageChange={(page) => setCurrentPage(page)}
      />

      {/* Slide-over Detail Drawer */}
      <AdminDrawer
        isOpen={showDetailDrawer}
        onClose={() => setShowDetailDrawer(false)}
        title={viewingItem?.name || 'Chi Tiết Món Ăn'}
        subtitle="Hồ sơ dinh dưỡng và câu chuyện ẩm thực thuần thực vật"
        icon={SparklesIcon}
        width="lg"
        footerActions={
          <div className="flex items-center space-x-2 w-full justify-between">
            <Link
              href="/admin/recipes"
              className="px-3.5 py-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 font-bold text-xs flex items-center space-x-1.5"
            >
              <BeakerIcon className="w-4 h-4" />
              <span>Xem Định Lượng BOM</span>
            </Link>
            <button
              onClick={() => {
                setShowDetailDrawer(false);
                if (viewingItem) handleOpenEditModal(viewingItem);
              }}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shadow-xs"
            >
              Chỉnh Sửa Món
            </button>
          </div>
        }
      >
        {viewingItem && (
          <div className="space-y-5">
            {/* Dish Photo */}
            <div className="relative h-56 w-full rounded-2xl overflow-hidden border border-slate-200 shadow-xs">
              <Image src={viewingItem.image} alt={viewingItem.name} fill className="object-cover" />
              <div className="absolute top-3 right-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold border ${
                    viewingItem.isAvailable !== false
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                      : 'bg-rose-50 text-rose-700 border-rose-300'
                  }`}
                >
                  {viewingItem.isAvailable !== false ? 'Đang Mở Bán' : 'Tạm Ngưng Phục Vụ'}
                </span>
              </div>
            </div>

            {/* Price & Category Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">Giá Niêm Yết</span>
                <span className="text-base font-bold font-mono text-emerald-700">
                  {formatCurrency(viewingItem.price)}
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">Danh Mục</span>
                <span className="text-xs font-bold text-slate-800">
                  {typeof viewingItem.category === 'string' ? viewingItem.category : (viewingItem.category as { name?: string })?.name || 'Món chay'}
                </span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-1.5">
                Mô Tả & Hương Vị
              </h4>
              <p className="text-slate-600 leading-relaxed text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                {viewingItem.description}
              </p>
            </div>

            {/* 4 Macro Breakdown */}
            <div>
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2">
                Hàm Lượng Dinh Dưỡng Khẩu Phần
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono">
                <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-center">
                  <span className="text-[10px] text-amber-700 block font-sans">Năng Lượng</span>
                  <span className="text-sm font-bold text-amber-900">420 kcal</span>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
                  <span className="text-[10px] text-emerald-700 block font-sans">Protein</span>
                  <span className="text-sm font-bold text-emerald-900">18g</span>
                </div>
                <div className="p-2.5 rounded-xl bg-sky-50 border border-sky-200 text-center">
                  <span className="text-[10px] text-sky-700 block font-sans">Carbs</span>
                  <span className="text-sm font-bold text-sky-900">52g</span>
                </div>
                <div className="p-2.5 rounded-xl bg-indigo-50 border border-indigo-200 text-center">
                  <span className="text-[10px] text-indigo-700 block font-sans">Chất Béo</span>
                  <span className="text-sm font-bold text-indigo-900">8g</span>
                </div>
              </div>
            </div>

            {/* Preparation time & Allergens */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 flex items-center space-x-1">
                  <ClockIcon className="w-3.5 h-3.5" />
                  <span>Thời gian chế biến:</span>
                </span>
                <span className="font-bold font-mono text-slate-800">15 phút</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Cảnh báo dị ứng:</span>
                <span className="font-semibold text-rose-600">Đậu phộng, Hạt điều</span>
              </div>
            </div>
          </div>
        )}
      </AdminDrawer>

      {/* Standardized 2-Column Create / Edit Modal Dialog */}
      <AdminModalDialog
        isOpen={showItemModal}
        onClose={() => setShowItemModal(false)}
        title={editingItem ? 'Chỉnh Sửa Món Ăn' : 'Thêm Món Chay Mới Vào Thực Đơn'}
        subtitle="Cung cấp đầy đủ thông tin dinh dưỡng, định lượng và hình ảnh chân thực"
        icon={SparklesIcon}
        maxWidth="3xl"
        footerActions={
          <>
            <button
              type="button"
              onClick={() => setShowItemModal(false)}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition"
            >
              Hủy Bỏ
            </button>
            <button
              onClick={handleItemFormSubmit}
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition shadow-xs"
            >
              {isSubmitting ? 'Đang Lưu...' : editingItem ? 'Cập Nhật Món Ăn' : 'Thêm Vào Thực Đơn'}
            </button>
          </>
        }
      >
        <form onSubmit={handleItemFormSubmit} className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Column 1: Basic Dish Info (7 cols) */}
            <div className="lg:col-span-7 space-y-3.5">
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Tên món ăn <span className="text-emerald-600">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ví dụ: Cơm Gạo Lứt Chả Nấm Đậu Hũ"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Danh mục dinh dưỡng <span className="text-emerald-600">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white font-medium"
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
                  <label className="block text-slate-700 font-bold mb-1">
                    Đơn giá niêm yết (₫) <span className="text-emerald-600">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-emerald-700 focus:outline-none focus:border-emerald-500 focus:bg-white font-mono font-bold"
                    min="1000"
                    step="1000"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Thời gian chế biến tiêu chuẩn (phút)
                </label>
                <input
                  type="number"
                  value={formData.preparationTime}
                  onChange={(e) => setFormData({ ...formData, preparationTime: Number(e.target.value) })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-emerald-500 focus:bg-white font-mono"
                  min="1"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Mô tả & Câu chuyện ẩm thực
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  placeholder="Mô tả hương vị, nguyên liệu thực vật tươi lành..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white leading-relaxed"
                  required
                />
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="isAvailableInput"
                  checked={formData.isAvailable}
                  onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                  className="w-4 h-4 rounded text-emerald-600 bg-slate-50 border-slate-300 focus:ring-emerald-500"
                />
                <label htmlFor="isAvailableInput" className="text-slate-700 font-semibold cursor-pointer">
                  Kích hoạt mở bán ngay trên Cửa Hàng
                </label>
              </div>
            </div>

            {/* Column 2: Visual Preview & Macro Metrics (5 cols) */}
            <div className="lg:col-span-5 space-y-3.5 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div>
                <label className="block text-slate-700 font-bold mb-1">URL Hình ảnh món ăn</label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              {/* Image Live Preview */}
              <div className="relative h-32 w-full rounded-xl overflow-hidden bg-slate-200 border border-slate-200 shadow-xs">
                <Image
                  src={formData.image || defaultFormData.image}
                  alt="Xem trước hình ảnh"
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-white/90 text-[10px] text-slate-700 font-mono font-bold shadow-xs">
                  Live Preview
                </div>
              </div>

              {/* 4 Macro Inputs */}
              <div>
                <span className="block text-slate-700 font-bold mb-1.5">Bộ 4 Chỉ Số Dinh Dưỡng Macro</span>
                <div className="grid grid-cols-2 gap-2 font-mono">
                  <div>
                    <span className="text-[10px] text-slate-500 block mb-0.5 font-sans">Năng Lượng</span>
                    <input
                      type="number"
                      value={formData.calories}
                      onChange={(e) => setFormData({ ...formData, calories: Number(e.target.value) })}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-amber-700 font-bold text-xs"
                      placeholder="kcal"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block mb-0.5 font-sans">Protein (g)</span>
                    <input
                      type="number"
                      value={formData.protein}
                      onChange={(e) => setFormData({ ...formData, protein: Number(e.target.value) })}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-emerald-700 font-bold text-xs"
                      placeholder="g"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block mb-0.5 font-sans">Carbs (g)</span>
                    <input
                      type="number"
                      value={formData.carbs}
                      onChange={(e) => setFormData({ ...formData, carbs: Number(e.target.value) })}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-sky-700 font-bold text-xs"
                      placeholder="g"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block mb-0.5 font-sans">Fat (g)</span>
                    <input
                      type="number"
                      value={formData.fat}
                      onChange={(e) => setFormData({ ...formData, fat: Number(e.target.value) })}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-indigo-700 font-bold text-xs"
                      placeholder="g"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Cảnh báo dị ứng (Allergens)</label>
                <input
                  type="text"
                  value={formData.allergens}
                  onChange={(e) => setFormData({ ...formData, allergens: e.target.value })}
                  placeholder="Ví dụ: Đậu phộng, Hạt điều, Gluten..."
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>
        </form>
      </AdminModalDialog>

      {/* Category Management Modal Dialog */}
      <AdminModalDialog
        isOpen={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        title="Quản Lý Danh Mục Dinh Dưỡng"
        subtitle="Danh sách các nhóm khẩu phần và chế độ ăn thuần thực vật"
        icon={FolderPlusIcon}
        maxWidth="lg"
        footerActions={
          <button
            onClick={() => setShowCategoryModal(false)}
            className="px-5 py-2 bg-emerald-600 text-white font-bold rounded-xl text-xs hover:bg-emerald-500 shadow-xs"
          >
            Hoàn Tất
          </button>
        }
      >
        <div className="space-y-2.5 max-h-72 overflow-y-auto custom-scrollbar pr-1">
          {categories.map((cat) => (
            <div
              key={cat.id || cat._id}
              className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center text-xs"
            >
              <div>
                <span className="font-bold text-slate-900 block">{cat.name}</span>
                <span className="text-[11px] text-slate-500">{cat.description}</span>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                Đang Hoạt Động
              </span>
            </div>
          ))}
        </div>
      </AdminModalDialog>
    </div>
  );
}