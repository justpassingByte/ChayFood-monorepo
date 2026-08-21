import api from '../lib/services/apiClient';

export interface MenuItem {
  id: number | string;
  _id?: string;
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
  isAvailable: boolean;
}

export const menuService = {
  // Lấy tất cả món ăn
  getAll: async (): Promise<MenuItem[]> => {
    const response = await api.get('/menu');
    return response.data.items || response.data.data || response.data || [];
  },

  // Lấy món ăn theo danh mục
  getByCategory: async (category: string): Promise<MenuItem[]> => {
    const response = await api.get('/menu', { params: { category } });
    return response.data.items || response.data.data || response.data || [];
  },

  // Thêm món ăn mới
  create: async (menuItem: Omit<MenuItem, 'id' | '_id'>): Promise<MenuItem> => {
    const response = await api.post('/menu', menuItem);
    return response.data.data || response.data;
  },

  // Cập nhật món ăn
  update: async (id: number | string, menuItem: Partial<MenuItem>): Promise<MenuItem> => {
    const response = await api.put(`/menu/${id}`, menuItem);
    return response.data.data || response.data;
  },

  // Xóa món ăn
  delete: async (id: number | string): Promise<void> => {
    await api.delete(`/menu/${id}`);
  },

  // Cập nhật trạng thái món ăn
  updateAvailability: async (id: number | string, isAvailable: boolean): Promise<MenuItem> => {
    const response = await api.patch(`/menu/${id}/availability`, { isAvailable });
    return response.data.data || response.data;
  },
};