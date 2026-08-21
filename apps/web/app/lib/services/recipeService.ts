import api from './apiClient';

export interface RecipeStep {
  stepNumber: number;
  title: string;
  description: string;
  timeInMinutes?: number;
}

export interface RecipeItem {
  id?: string;
  ingredientId?: string;
  ingredient?: {
    name?: string;
    unit?: string;
    category?: string;
  };
  quantity: number;
  unit: string;
  notes?: string | null;
}

export interface Recipe {
  id?: string;
  menuItemId?: string;
  name: string;
  description?: string | null;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servingSize: number;
  instructions: RecipeStep[];
  notes?: string | null;
  items?: RecipeItem[];
}

export const fallbackRecipes: Record<string, Recipe> = {
  'default': {
    name: 'Công Thức Chuẩn Hóa Bếp Chay',
    description: 'Quy trình định lượng và chế biến món chay tươi lành theo tiêu chuẩn ẩm thực thanh đạm',
    prepTimeMinutes: 15,
    cookTimeMinutes: 15,
    servingSize: 1,
    notes: 'Nguyên liệu thu hoạch tươi trong ngày, giữ trọn vẹn vitamin và khoáng chất tự nhiên.',
    items: [
      { quantity: 150, unit: 'g', notes: 'Nguyên liệu đạm thực vật sạch' },
      { quantity: 100, unit: 'g', notes: 'Rau củ hữu cơ tươi giòn' },
      { quantity: 30, unit: 'ml', notes: 'Nước sốt thảo mộc tự nhiên' },
    ],
    instructions: [
      { stepNumber: 1, title: 'Sơ chế nguyên liệu', description: 'Rửa sạch rau củ bằng nước muối loãng, cắt miếng vừa ăn và để ráo nước.', timeInMinutes: 5 },
      { stepNumber: 2, title: 'Chế biến nhiệt', description: 'Áp chảo hoặc ninh hầm với nhiệt độ thích hợp để giữ tối đa dưỡng chất.', timeInMinutes: 8 },
      { stepNumber: 3, title: 'Hoàn thiện khẩu phần', description: 'Bày trí đĩa ăn cân đối, rưới nước sốt đặc chế và thưởng thức khi còn nóng.', timeInMinutes: 2 },
    ],
  },
};

export const recipeService = {
  getByMenuItemId: async (menuItemId: string): Promise<{ data: Recipe | null; status: number }> => {
    try {
      const response = await api.get(`/recipes/by-menu-item/${menuItemId}`, { timeout: 3000 });
      if (response.data) {
        return {
          data: response.data,
          status: response.status,
        };
      }
    } catch {
      // Fallback
    }

    return {
      data: fallbackRecipes[menuItemId] || fallbackRecipes['default'],
      status: 200,
    };
  },
};
