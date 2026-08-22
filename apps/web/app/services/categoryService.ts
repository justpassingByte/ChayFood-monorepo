import api from '../lib/services/apiClient';

export interface Category {
  id?: number;
  _id?: string;
  name: string;
  description: string;
  slug?: string;
  image?: string;
  isActive?: boolean;
  displayOrder?: number;
}

export const defaultCategories: Category[] = [
  { _id: 'main', slug: 'main', name: 'Món Chính Giàu Đạm', description: 'Cơm, bún, phở chay giàu protein' },
  { _id: 'side', slug: 'side', name: 'Món Phụ & Salad', description: 'Salad quinoa, đậu hũ áp chảo' },
  { _id: 'appetizer', slug: 'appetizer', name: 'Khai Vị & Gỏi', description: 'Gỏi cuốn ngũ sắc, chả giò' },
  { _id: 'soup', slug: 'soup', name: 'Canh Dưỡng Sinh', description: 'Canh tiềm đông trùng, nấm tuyết' },
  { _id: 'beverage', slug: 'beverage', name: 'Trà & Sữa Hạt', description: 'Trà hoa cúc, sữa hạt sen tươi' },
];

export const categoryService = {
  // Lấy tất cả danh mục
  getAll: async (): Promise<Category[]> => {
    try {
      const response = await api.get('/category', { timeout: 3000 });
      if (Array.isArray(response.data) && response.data.length > 0) {
        return response.data;
      }
      if (response.data && Array.isArray(response.data.data) && response.data.data.length > 0) {
        return response.data.data;
      }
    } catch {
      // Fallback to default categories
    }
    return defaultCategories;
  },

  // Thêm danh mục mới
  create: async (category: Omit<Category, 'id' | '_id'>): Promise<Category> => {
    const response = await api.post('/category', category);
    return response.data;
  },

  // Cập nhật danh mục
  update: async (id: string | number, category: Partial<Category>): Promise<Category> => {
    const response = await api.put(`/category/${id}`, category);
    return response.data;
  },

  // Xóa danh mục
  delete: async (id: string | number): Promise<void> => {
    await api.delete(`/category/${id}`);
  },
};