import api from './apiClient';
import type { MenuItem } from './types';

export const defaultFallbackMenu: MenuItem[] = [
  {
    _id: 'f-1',
    id: 'f-1',
    name: 'Cơm Tấm Sườn Chay Sốt Nấm Đông Cô',
    description: 'Sườn non làm từ đạm đậu nành hữu cơ ủ sốt nấm đông cô cô đặc, ăn kèm chả nấm mối, bì thính gạo lứt và đồ chua nhà làm tươi giòn.',
    price: 55000,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600',
    category: 'main',
    calories: 480,
    protein: 18.5,
    carbs: 65.0,
    fat: 12.0,
    isAvailable: true,
    preparationTime: 15,
    ingredients: ['Đạm đậu nành', 'Nấm đông cô', 'Gạo tấm', 'Thính gạo lứt', 'Đồ chua'],
    isVegetarian: true,
    isPopular: true,
    tags: ['High-Protein', 'Đầu bếp khuyên dùng']
  },
  {
    _id: 'f-2',
    id: 'f-2',
    name: 'Bún Bò Huế Chay Chả Nấm & Nước Dùng Thảo Mộc',
    description: 'Nước dùng ninh 8 tiếng từ củ quả và mía lau, thơm ngát sả gừng, topping chả nấm mối, tàu hũ ky và đậu hũ non chiên giòn.',
    price: 49000,
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600',
    category: 'main',
    calories: 410,
    protein: 16.0,
    carbs: 58.0,
    fat: 9.0,
    isAvailable: true,
    preparationTime: 12,
    ingredients: ['Bún tươi', 'Nấm mối', 'Tàu hũ ky', 'Nước dùng củ quả', 'Rau thơm'],
    isVegetarian: true,
    isPopular: true,
    tags: ['Đậm đà chuẩn vị', 'Thanh nhiệt']
  },
  {
    _id: 'f-3',
    id: 'f-3',
    name: 'Salad Quinoa Bơ Sáp & Hạt Sen Sốt Chanh Dây',
    description: 'Hạt diêm mạch 3 màu kết hợp bơ sáp Đắk Lắk, hạt sen tươi hấp mềm và xà lách hữu cơ hòa quyện sốt chanh dây thanh mát.',
    price: 62000,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600',
    category: 'side',
    calories: 340,
    protein: 14.0,
    carbs: 42.0,
    fat: 11.5,
    isAvailable: true,
    preparationTime: 10,
    ingredients: ['Hạt Quinoa', 'Bơ sáp', 'Hạt sen Huế', 'Xà lách hữu cơ', 'Sốt chanh dây'],
    isVegetarian: true,
    isPopular: true,
    tags: ['Low-Calorie', 'Giảm mỡ', 'Thuần chay']
  },
  {
    _id: 'f-4',
    id: 'f-4',
    name: 'Đậu Hũ Non Áp Chảo Sốt Hạt Dẻ Cười & Mè Rang',
    description: 'Đậu hũ non làng Mơ áp chảo xém cạnh, rưới sốt bơ hạt dẻ cười thơm bùi và hạt mè rang, giàu đạm thực vật nguyên chất.',
    price: 45000,
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600',
    category: 'side',
    calories: 320,
    protein: 19.5,
    carbs: 18.0,
    fat: 14.0,
    isAvailable: true,
    preparationTime: 12,
    ingredients: ['Đậu hũ non', 'Hạt dẻ cười', 'Mè rang', 'Dầu mè', 'Xì dầu ủ truyền thống'],
    isVegetarian: true,
    tags: ['High-Protein', 'Low-GI', 'Tiểu đường']
  },
  {
    _id: 'f-5',
    id: 'f-5',
    name: 'Cơm Gạo Lứt Chả Nấm Mối Nướng Lá Chuối',
    description: 'Gạo lứt đỏ Điện Biên dẻo thơm ăn kèm chả nấm mối bọc lá chuối nướng than hoa, giữ trọn vẹn hương vị tự nhiên và vi chất.',
    price: 59000,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600',
    category: 'main',
    calories: 430,
    protein: 17.5,
    carbs: 62.0,
    fat: 10.0,
    isAvailable: true,
    preparationTime: 15,
    ingredients: ['Gạo lứt đỏ', 'Nấm mối', 'Lá chuối', 'Gia vị thảo mộc'],
    isVegetarian: true,
    tags: ['Macro Balance', 'Gym & Fit']
  },
  {
    _id: 'f-6',
    id: 'f-6',
    name: 'Phở Chay Nấm Hương Nước Dùng Rau Củ',
    description: 'Bánh phở tươi mềm mướt, nước dùng ninh từ lê đường, củ cải trắng và quế hồi, phủ ngập nấm hương tươi và chả lụa chay.',
    price: 52000,
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600',
    category: 'main',
    calories: 380,
    protein: 15.0,
    carbs: 55.0,
    fat: 8.5,
    isAvailable: true,
    preparationTime: 10,
    ingredients: ['Bánh phở', 'Nấm hương', 'Củ cải', 'Quế hồi', 'Rau mùi tàu'],
    isVegetarian: true,
    tags: ['Thanh vị', 'Tiêu hóa tốt']
  },
  {
    _id: 'f-7',
    id: 'f-7',
    name: 'Gỏi Cuốn Ngũ Sắc Sốt Tương Bơ Đậu Phộng',
    description: 'Bánh tráng gạo dẻo cuộn rau củ giòn ngọt, bún tươi, đậu hũ áp chảo và chả nấm, chấm sốt bơ lạc nhà làm sánh mịn đậm đà.',
    price: 38000,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600',
    category: 'appetizer',
    calories: 260,
    protein: 11.0,
    carbs: 38.0,
    fat: 7.0,
    isAvailable: true,
    preparationTime: 8,
    ingredients: ['Bánh tráng gạo', 'Xà lách', 'Cà rốt', 'Dưa leo', 'Đậu phộng'],
    isVegetarian: true,
    tags: ['Khai vị', 'Tươi giòn']
  },
  {
    _id: 'f-8',
    id: 'f-8',
    name: 'Canh Dưỡng Sinh Nấm Đông Trùng & Táo Đỏ',
    description: 'Món canh bồi bổ sức khỏe ninh từ nấm đông trùng hạ thảo, táo đỏ Tân Cương, hạt sen và kỷ tử, giúp an thần bổ khí.',
    price: 45000,
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600',
    category: 'soup',
    calories: 180,
    protein: 8.5,
    carbs: 28.0,
    fat: 3.0,
    isAvailable: true,
    preparationTime: 15,
    ingredients: ['Đông trùng hạ thảo', 'Táo đỏ', 'Hạt sen', 'Kỷ tử', 'Nấm linh chi'],
    isVegetarian: true,
    tags: ['Dưỡng nhan', 'Bổ khí']
  },
  {
    _id: 'f-9',
    id: 'f-9',
    name: 'Trà Thảo Mộc Hoa Cúc Kỷ Tử Hạt Chia',
    description: 'Trà hoa cúc sấy lạnh kết hợp kỷ tử đỏ ngọt dịu và hạt chia organic ngậm nước, mang lại cảm giác thư thái và thanh mát.',
    price: 29000,
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600',
    category: 'beverage',
    calories: 45,
    protein: 1.2,
    carbs: 9.0,
    fat: 0.5,
    isAvailable: true,
    preparationTime: 5,
    ingredients: ['Hoa cúc vàng', 'Kỷ tử', 'Hạt chia', 'Mật mía thanh'],
    isVegetarian: true,
    tags: ['Thảo mộc', 'Không đường tinh luyện']
  },
  {
    _id: 'f-10',
    id: 'f-10',
    name: 'Sữa Hạt Sen Đậu Biếc Hạnh Nhân Tươi',
    description: 'Sữa nấu tươi nguyên chất mỗi sáng từ hạt sen Đồng Tháp và bột hạnh nhân Mỹ, tạo màu xanh lam tự nhiên từ hoa đậu biếc.',
    price: 35000,
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600',
    category: 'beverage',
    calories: 120,
    protein: 6.0,
    carbs: 14.0,
    fat: 4.5,
    isAvailable: true,
    preparationTime: 5,
    ingredients: ['Hạt sen tươi', 'Hạnh nhân', 'Hoa đậu biếc', 'Nước dừa tươi'],
    isVegetarian: true,
    tags: ['Sữa hạt tươi', 'Bổ não']
  }
];

export const menuService = {
  // Get all menu items with optional filters
  getAll: async (params?: {
    category?: string;
    minCalories?: number;
    maxCalories?: number;
    minProtein?: number;
    maxProtein?: number;
    spicyLevel?: number;
    limit?: number;
  }) => {
    try {
      const paramsWithDefaults = {
        limit: 100,
        ...params
      };

      const cleanParams = Object.fromEntries(
        Object.entries(paramsWithDefaults)
          .filter(([_, value]) => value !== undefined)
          .map(([key, value]) => {
            if (key === 'spicyLevel' && value !== undefined) {
              return [key, Number(value)];
            }
            return [key, value];
          })
      );

      const response = await api.get('/menu', { 
        params: cleanParams,
        timeout: 3000
      });
      
      let items: MenuItem[] = [];
      if (Array.isArray(response.data)) {
        items = response.data;
      } else if (response.data?.data) {
        items = response.data.data;
      } else if (response.data?.items) {
        items = response.data.items;
      }
      
      if (items.length > 0) {
        return {
          data: items,
          status: response.status
        };
      }
    } catch {
      // Graceful fallback to rich local dataset
    }

    // Return fallback menu items if backend is offline or empty
    let fallbackResult = [...defaultFallbackMenu];
    if (params?.category) {
      fallbackResult = fallbackResult.filter(item => item.category === params.category);
    }
    return {
      data: fallbackResult,
      status: 200
    };
  },
  
  // Search menu items
  search: async (params: {
    query: string;
    category?: string;
    minCalories?: number;
    maxCalories?: number;
    minProtein?: number;
    maxProtein?: number;
  }) => {
    try {
      const response = await api.get('/menu/search', { params, timeout: 3000 });
      if (response.data?.data && response.data.data.length > 0) {
        return {
          data: response.data.data,
          status: response.status
        };
      }
    } catch {
      // Fallback
    }

    const q = params.query.toLowerCase();
    const filtered = defaultFallbackMenu.filter(item => 
      item.name.toLowerCase().includes(q) ||
      (item.description && item.description.toLowerCase().includes(q))
    );
    return {
      data: filtered,
      status: 200
    };
  },
  
  // Get menu items by nutritional content
  getByNutrition: async (params: {
    minCalories?: number;
    maxCalories?: number;
    minProtein?: number;
    maxProtein?: number;
  }) => {
    try {
      const response = await api.get('/menu/nutrition', { params, timeout: 3000 });
      if (response.data?.data && response.data.data.length > 0) {
        return {
          data: response.data.data,
          status: response.status
        };
      }
    } catch {
      // Fallback
    }

    return {
      data: defaultFallbackMenu,
      status: 200
    };
  },
  
  // Get menu item by ID
  getById: async (id: string) => {
    try {
      const response = await api.get(`/menu/${id}`, { timeout: 3000 });
      if (response.data?.data || response.data) {
        return {
          data: response.data.data || response.data,
          status: response.status
        };
      }
    } catch {
      // Fallback
    }

    const found = defaultFallbackMenu.find(item => item._id === id || item.id === id) || defaultFallbackMenu[0];
    return {
      data: found,
      status: 200
    };
  },
  
  // Create menu item (admin only)
  create: async (menuItem: Omit<MenuItem, '_id'>) => {
    const response = await api.post('/menu', menuItem);
    return {
      data: response.data.data || response.data,
      status: response.status
    };
  },
  
  // Update menu item (admin only)
  update: async (id: string, menuItem: Partial<MenuItem>) => {
    const response = await api.put(`/menu/${id}`, menuItem);
    return {
      data: response.data.data || response.data,
      status: response.status
    };
  },
  
  // Delete menu item (admin only)
  delete: async (id: string) => {
    const response = await api.delete(`/menu/${id}`);
    return {
      data: response.data,
      status: response.status
    };
  },
  
  // Update menu item availability (admin only)
  updateAvailability: async (id: string, isAvailable: boolean) => {
    const response = await api.patch(`/menu/${id}/availability`, { isAvailable });
    return {
      data: response.data,
      status: response.status
    };
  }
};