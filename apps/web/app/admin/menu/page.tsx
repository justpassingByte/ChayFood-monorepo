'use client';

import { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, XMarkIcon, SparklesIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { categoryService, Category } from '../../services/categoryService';
import { menuService } from '@/lib/services';
import { MenuItem } from '@/lib/services/types';
import { toast } from 'react-hot-toast';

interface ExtendedCategory extends Category {
  id?: number;
  _id?: string;
}

export default function MenuPage() {
  const [categories, setCategories] = useState<ExtendedCategory[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ExtendedCategory | null>(null);
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null);
  const [menuItemFormData, setMenuItemFormData] = useState({
    name: '',
    category: '',
    price: 0,
    description: '',
    image: '',
    isAvailable: true,
  });
  const [categoryFormData, setCategoryFormData] = useState({
    name: '',
    description: '',
    slug: '',
    image: '',
    isActive: true,
    displayOrder: 0,
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
    fetchMenuItems();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await categoryService.getAll();
      setCategories(data);
    } catch {
      toast.error('Không thể tải danh mục thực đơn');
    }
  };

  const fetchMenuItems = async () => {
    try {
      const response = await menuService.getAll();
      setMenuItems(response.data);
    } catch {
      toast.error('Không thể tải danh sách món ăn');
    }
  };

  const handleDeleteMenuItem = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa món này?')) return;

    try {
      await menuService.delete(id);
      toast.success('Xóa món ăn thành công');
      fetchMenuItems();
    } catch {
      toast.error('Lỗi khi xóa món ăn');
    }
  };

  const handleToggleAvailability = async (id: string, currentStatus: boolean) => {
    try {
      await menuService.updateAvailability(id, !currentStatus);
      toast.success('Cập nhật trạng thái món ăn thành công');
      fetchMenuItems();
    } catch {
      toast.error('Lỗi khi cập nhật trạng thái món ăn');
    }
  };

  const handleDeleteCategory = async (id: string | number) => {
    if (!confirm('Bạn có chắc muốn xóa danh mục này?')) return;

    try {
      await categoryService.delete(id);
      toast.success('Xóa danh mục thành công');
      fetchCategories();
    } catch {
      toast.error('Lỗi khi xóa danh mục');
    }
  };

  const handleEditCategory = (category: ExtendedCategory) => {
    setEditingCategory(category);
    setCategoryFormData({
      name: category.name,
      description: category.description,
      slug: category.slug || '',
      image: category.image || '',
      isActive: category.isActive !== undefined ? category.isActive : true,
      displayOrder: category.displayOrder || 0,
    });
    setShowCategoryForm(true);
  };

  const handleEditMenuItem = (item: MenuItem) => {
    setEditingMenuItem(item);
    setMenuItemFormData({
      name: item.name,
      category: typeof item.category === 'string' ? item.category : (item.category as { _id?: string })?._id || '',
      price: item.price,
      description: item.description || '',
      image: item.image,
      isAvailable: item.isAvailable ?? true,
    });
    setShowAddForm(true);
  };

  const resetCategoryForm = () => {
    setShowCategoryForm(false);
    setEditingCategory(null);
    setCategoryFormData({
      name: '',
      description: '',
      slug: '',
      image: '',
      isActive: true,
      displayOrder: 0,
    });
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (editingCategory) {
        await categoryService.update(editingCategory._id || editingCategory.id || '', categoryFormData);
        toast.success('Cập nhật danh mục thành công');
      } else {
        await categoryService.create(categoryFormData);
        toast.success('Thêm danh mục mới thành công');
      }
      fetchCategories();
      resetCategoryForm();
    } catch {
      toast.error(editingCategory ? 'Lỗi khi cập nhật danh mục' : 'Lỗi khi thêm danh mục');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMenuItemSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (editingMenuItem) {
        const updatedMenuItem = {
          ...menuItemFormData,
          category: menuItemFormData.category as 'main' | 'side' | 'dessert' | 'beverage',
        };
        await menuService.update(editingMenuItem._id, updatedMenuItem);
        toast.success('Cập nhật món ăn thành công');
      } else {
        const newMenuItem = {
          ...menuItemFormData,
          category: menuItemFormData.category as 'main' | 'side' | 'dessert' | 'beverage',
        };
        await menuService.create(newMenuItem as Omit<MenuItem, '_id'>);
        toast.success('Thêm món ăn mới thành công');
      }
      fetchMenuItems();
      setShowAddForm(false);
      setEditingMenuItem(null);
      setMenuItemFormData({
        name: '',
        category: '',
        price: 0,
        description: '',
        image: '',
        isAvailable: true,
      });
    } catch {
      toast.error(editingMenuItem ? 'Lỗi cập nhật món ăn' : 'Lỗi thêm món ăn mới');
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(val);

  const filteredItems =
    selectedCategory === 'all'
      ? menuItems
      : menuItems.filter((item) => {
          if (typeof item.category === 'string') {
            return item.category === selectedCategory;
          } else if (typeof item.category === 'object' && item.category && '_id' in (item.category as { _id?: string })) {
            return (item.category as { _id?: string })._id === selectedCategory;
          }
          return false;
        });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center space-x-2.5">
            <SparklesIcon className="w-6 h-6 text-emerald-400" />
            <span>Quản Lý Thực Đơn & Món Ăn</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Tùy biến danh mục dinh dưỡng, định lượng món chay và thiết lập tình trạng phục vụ
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(true)}
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center space-x-2 transition shadow-sm self-start sm:self-auto"
        >
          <PlusIcon className="h-4 w-4 stroke-[2.5]" />
          <span>Thêm Món Mới</span>
        </button>
      </div>

      {/* Category Management */}
      <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-800/80 p-5 space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-base font-semibold text-white">Danh Mục Dinh Dưỡng</h2>
            <p className="text-xs text-slate-400">Phân nhóm thực đơn theo chế độ ăn và khẩu phần</p>
          </div>
          <button
            onClick={() => {
              setEditingCategory(null);
              setCategoryFormData({ name: '', description: '', slug: '', image: '', isActive: true, displayOrder: 0 });
              setShowCategoryForm(true);
            }}
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition"
          >
            <PlusIcon className="h-4 w-4" />
            <span>Thêm Danh Mục</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {categories.map((category) => (
            <div
              key={category._id || category.id}
              className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800 flex justify-between items-start hover:border-slate-700 transition group"
            >
              <div className="min-w-0 pr-2">
                <h3 className="text-xs font-semibold text-slate-200 group-hover:text-emerald-400 transition-colors truncate">
                  {category.name}
                </h3>
                <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">{category.description}</p>
              </div>
              <div className="flex gap-1 flex-shrink-0">
                <button
                  onClick={() => handleEditCategory(category)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition"
                  title="Chỉnh sửa"
                >
                  <PencilIcon className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => handleDeleteCategory(category._id || category.id || '')}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
                  title="Xóa danh mục"
                >
                  <TrashIcon className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Menu Items Filter */}
      <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar text-xs">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3.5 py-1.5 rounded-xl font-medium whitespace-nowrap transition ${
            selectedCategory === 'all'
              ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          Tất cả món ({menuItems.length})
        </button>
        {categories.map((category) => (
          <button
            key={category._id || category.id}
            onClick={() => setSelectedCategory(String(category._id || category.id))}
            className={`px-3.5 py-1.5 rounded-xl font-medium whitespace-nowrap transition ${
              selectedCategory === String(category._id || category.id)
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredItems.map((item) => (
          <div
            key={item._id}
            className="bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-800/80 overflow-hidden flex flex-col justify-between hover:border-emerald-500/30 transition-all duration-200 group"
          >
            <div>
              <div className="relative h-44 w-full bg-slate-950">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-600 text-xs font-mono">
                    Ảnh Món Ăn
                  </div>
                )}
                <div className="absolute top-2.5 right-2.5">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      item.isAvailable ?? true
                        ? 'bg-emerald-500/90 text-slate-950 border-emerald-400 shadow-sm'
                        : 'bg-rose-500/90 text-white border-rose-400 shadow-sm'
                    }`}
                  >
                    {item.isAvailable ?? true ? 'Sẵn sàng' : 'Tạm hết'}
                  </span>
                </div>
              </div>

              <div className="p-4">
                <div className="flex justify-between items-start gap-2 mb-1.5">
                  <h3 className="font-semibold text-sm text-white group-hover:text-emerald-400 transition-colors line-clamp-1">
                    {item.name}
                  </h3>
                  <span className="font-mono font-bold text-emerald-400 text-sm whitespace-nowrap">
                    {formatCurrency(item.price)}
                  </span>
                </div>
                <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>

            <div className="p-4 pt-0 flex items-center justify-between border-t border-slate-800/60 mt-3 pt-3">
              <button
                onClick={() => handleToggleAvailability(item._id, item.isAvailable ?? true)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition ${
                  item.isAvailable ?? true
                    ? 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20'
                    : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20'
                }`}
              >
                {item.isAvailable ?? true ? 'Tạm ngưng' : 'Mở bán'}
              </button>
              <div className="flex gap-1.5">
                <button
                  onClick={() => handleEditMenuItem(item)}
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-emerald-300 hover:bg-slate-700 transition"
                  title="Chỉnh sửa món"
                >
                  <PencilIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDeleteMenuItem(item._id)}
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

      {/* Category Modal */}
      {showCategoryForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">
                {editingCategory ? 'Chỉnh Sửa Danh Mục' : 'Thêm Danh Mục Mới'}
              </h3>
              <button onClick={resetCategoryForm} className="text-slate-400 hover:text-white">
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleCategorySubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Tên danh mục</label>
                <input
                  type="text"
                  value={categoryFormData.name}
                  onChange={(e) => setCategoryFormData({ ...categoryFormData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-emerald-500"
                  placeholder="Ví dụ: Gói Chuẩn Macro"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">Mô tả</label>
                <textarea
                  value={categoryFormData.description}
                  onChange={(e) => setCategoryFormData({ ...categoryFormData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-emerald-500"
                  rows={3}
                  placeholder="Mô tả danh mục khẩu phần..."
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={resetCategoryForm}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 bg-emerald-500 text-slate-950 font-bold rounded-xl hover:bg-emerald-400"
                >
                  {isLoading ? 'Đang lưu...' : editingCategory ? 'Cập Nhật' : 'Thêm Danh Mục'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Menu Item Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-lg shadow-2xl">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">
                {editingMenuItem ? 'Chỉnh Sửa Món Ăn' : 'Thêm Món Chay Mới'}
              </h3>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setEditingMenuItem(null);
                }}
                className="text-slate-400 hover:text-white"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleMenuItemSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Tên món ăn</label>
                <input
                  type="text"
                  value={menuItemFormData.name}
                  onChange={(e) => setMenuItemFormData({ ...menuItemFormData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-emerald-500"
                  placeholder="Ví dụ: Cơm Gạo Lứt Chả Nấm"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Danh mục</label>
                  <select
                    value={menuItemFormData.category}
                    onChange={(e) => setMenuItemFormData({ ...menuItemFormData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-emerald-500"
                    required
                  >
                    <option value="">Chọn danh mục</option>
                    {categories.map((cat) => (
                      <option key={cat._id || cat.id} value={cat._id || cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Đơn giá (₫)</label>
                  <input
                    type="number"
                    value={menuItemFormData.price}
                    onChange={(e) => setMenuItemFormData({ ...menuItemFormData, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-emerald-500 font-mono"
                    min="0"
                    step="1000"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">Mô tả thành phần dinh dưỡng</label>
                <textarea
                  value={menuItemFormData.description}
                  onChange={(e) => setMenuItemFormData({ ...menuItemFormData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-emerald-500"
                  rows={2}
                  placeholder="Mô tả hương vị, nguyên liệu thực vật..."
                  required
                />
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">URL Hình ảnh</label>
                <input
                  type="text"
                  value={menuItemFormData.image}
                  onChange={(e) => setMenuItemFormData({ ...menuItemFormData, image: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-emerald-500"
                  placeholder="https://images.unsplash.com/..."
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingMenuItem(null);
                  }}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 bg-emerald-500 text-slate-950 font-bold rounded-xl hover:bg-emerald-400"
                >
                  {isLoading ? 'Đang lưu...' : editingMenuItem ? 'Cập Nhật Món' : 'Thêm Món Ăn'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}