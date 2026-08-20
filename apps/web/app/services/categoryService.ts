import axios from 'axios'

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
  { _id: 'beverage', slug: 'beverage', name: 'Trà & Sữa Hạt', description: 'Trà hoa cúc, sữa hạt sen tươi' }
]

const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000') + '/category';

const getAuthHeader = () => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('authToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
  return {};
};

export const categoryService = {
  // Lấy tất cả danh mục
  getAll: async (): Promise<Category[]> => {
    try {
      const response = await axios.get(API_URL, { timeout: 3000 })
      if (Array.isArray(response.data) && response.data.length > 0) {
        return response.data
      }
    } catch {
      // Fallback to default categories
    }
    return defaultCategories
  },

  // Thêm danh mục mới
  create: async (category: Omit<Category, 'id' | '_id'>): Promise<Category> => {
    const response = await axios.post(API_URL, category, {
      headers: getAuthHeader()
    })
    return response.data
  },

  // Cập nhật danh mục
  update: async (id: string | number, category: Partial<Category>): Promise<Category> => {
    const response = await axios.put(`${API_URL}/${id}`, category, {
      headers: getAuthHeader()
    })
    return response.data
  },

  // Xóa danh mục
  delete: async (id: string | number): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`, {
      headers: getAuthHeader()
    })
  }
}