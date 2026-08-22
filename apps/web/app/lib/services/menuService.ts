import api from './apiClient';
import type { MenuItem } from './types';

export const defaultFallbackMenu: MenuItem[] = [
  // --- Món chính (MAIN) ---
  {
    _id: 'f-1',
    id: 'f-1',
    name: 'Cơm Tấm Sườn Bì Chả Chay',
    description: 'Sườn non lát chiên giòn sốt nấm đông cô, bì miến trộn thính gạo rang, chả hấp đậu hũ bùi béo ăn kèm cơm tấm dẻo thơm và đồ chua giòn rụm.',
    price: 55000,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=700',
    category: 'main',
    calories: 480,
    protein: 18.5,
    carbs: 65.0,
    fat: 12.0,
    isAvailable: true,
    preparationTime: 15,
    ingredients: ['Gạo tấm', 'Sườn non chay', 'Đậu hũ', 'Nấm đông cô', 'Miến dong', 'Đồ chua'],
    isVegetarian: true,
    isPopular: true,
    tags: ['High-Protein', 'Đầu bếp khuyên dùng', 'Món ăn truyền thống'],
  },
  {
    _id: 'f-2',
    id: 'f-2',
    name: 'Phở Chay Thập Cẩm Rau Củ',
    description: 'Nước dùng phở ninh 8 tiếng từ mía lau, củ cải trắng và hoa hồi quế, phủ ngập nấm đùi gà xào thơm, chả lụa nấm và bánh phở tươi mềm mướt.',
    price: 52000,
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=700',
    category: 'main',
    calories: 410,
    protein: 16.0,
    carbs: 60.0,
    fat: 7.5,
    isAvailable: true,
    preparationTime: 15,
    ingredients: ['Bánh phở tươi', 'Nấm đùi gà', 'Tàu hũ ky', 'Chả lụa chay', 'Nước dùng củ quả'],
    isVegetarian: true,
    isPopular: true,
    tags: ['Thanh nhiệt', 'Ít béo', 'Đậm đà chuẩn vị'],
  },
  {
    _id: 'f-3',
    id: 'f-3',
    name: 'Bún Bò Huế Chay Chả Nấm & Sa Tế Sả',
    description: 'Nước dùng thơm lừng sả cây, ớt sa tế cay nồng nhẹ hòa cùng nấm mối tươi giòn, đậu hũ non rán vàng và bún sợi to chuẩn phong vị cố đô.',
    price: 55000,
    image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=700',
    category: 'main',
    calories: 450,
    protein: 17.0,
    carbs: 62.0,
    fat: 9.5,
    isAvailable: true,
    preparationTime: 15,
    ingredients: ['Bún sợi lớn', 'Nấm mối đen', 'Đậu hũ', 'Sa tế sả', 'Rau thơm'],
    isVegetarian: true,
    isPopular: true,
    tags: ['Đậm vị', 'Ấm bụng', 'Món chay xứ Huế'],
  },
  {
    _id: 'f-4',
    id: 'f-4',
    name: 'Cơm Gạo Lứt Nấm Mối Nướng Lá Chuối',
    description: 'Gạo lứt đỏ ST25 dẻo thơm ăn kèm chả nấm mối bọc lá chuối nướng thơm phức, bổ sung hạt sen tươi hấp chín bùi bùi giàu chất xơ.',
    price: 59000,
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=700',
    category: 'main',
    calories: 430,
    protein: 19.0,
    carbs: 58.0,
    fat: 8.0,
    isAvailable: true,
    preparationTime: 18,
    ingredients: ['Gạo lứt đỏ ST25', 'Nấm mối đen', 'Hạt sen', 'Lá chuối', 'Gia vị thảo mộc'],
    isVegetarian: true,
    tags: ['Gym & Fit', 'Low-GI', 'Tiểu đường'],
  },
  {
    _id: 'f-5',
    id: 'f-5',
    name: 'Hủ Tiếu Nam Vang Chay Thảo Mộc',
    description: 'Sợi hủ tiếu dai Sa Đéc trộn sốt tương đen đặc chế, topping nấm đông cô áp chảo, tàu hũ ky chiên giòn rụm và nước súp rau củ thanh ngọt.',
    price: 52000,
    image: 'https://images.unsplash.com/photo-1576577445504-6af96477db52?w=700',
    category: 'main',
    calories: 420,
    protein: 15.5,
    carbs: 64.0,
    fat: 7.0,
    isAvailable: true,
    preparationTime: 12,
    ingredients: ['Hủ tiếu dai', 'Nấm đông cô', 'Tàu hũ ky', 'Cần tây', 'Hẹ lá'],
    isVegetarian: true,
    tags: ['Hủ tiếu khô', 'Thanh đạm', 'Bán chạy nhất'],
  },
  {
    _id: 'f-6',
    id: 'f-6',
    name: 'Cà Ri Nấm Khoai Sọ Nước Cốt Dừa',
    description: 'Vị cà ri béo ngậy từ nước cốt dừa tươi Bến Tre, khoai môn sáp dẻo quánh cùng nấm đùi gà thấm vị, ăn kèm bánh mì hoặc cơm nóng.',
    price: 58000,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=700',
    category: 'main',
    calories: 520,
    protein: 16.5,
    carbs: 68.0,
    fat: 16.0,
    isAvailable: true,
    preparationTime: 20,
    ingredients: ['Khoai môn sáp', 'Nấm đùi gà', 'Nước cốt dừa', 'Bột cà ri', 'Sả cây'],
    isVegetarian: true,
    tags: ['Béo bùi', 'Hương vị nhiệt đới'],
  },

  // --- Món khai vị & Phụ (SIDE) ---
  {
    _id: 'f-7',
    id: 'f-7',
    name: 'Gỏi Cuốn Ngũ Sắc Sốt Tương Đậu Phộng',
    description: 'Bánh tráng dẻo cuộn bơ sáp Bảo Lộc, bún tươi, xà lách thủy canh và đậu hũ chiên giòn, chấm sốt bơ lạc nhà làm sánh mịn đậm đà.',
    price: 38000,
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=700',
    category: 'side',
    calories: 260,
    protein: 11.0,
    carbs: 38.0,
    fat: 7.0,
    isAvailable: true,
    preparationTime: 8,
    ingredients: ['Bánh tráng gạo mè', 'Bơ sáp', 'Đậu hũ', 'Bún tươi', 'Sốt tương đậu phộng'],
    isVegetarian: true,
    tags: ['Khai vị tươi giòn', 'Low-Calorie', 'Thuần thực vật'],
  },
  {
    _id: 'f-8',
    id: 'f-8',
    name: 'Salad Quinoa Bơ Sáp & Hạt Sen Sốt Chanh Dây',
    description: 'Hạt diêm mạch 3 màu hữu cơ kết hợp bơ sáp béo ngậy, hạt sen tươi hấp mềm và xà lách sạch hòa quyện sốt chanh leo chua ngọt dịu mát.',
    price: 62000,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=700',
    category: 'side',
    calories: 340,
    protein: 14.0,
    carbs: 42.0,
    fat: 11.5,
    isAvailable: true,
    preparationTime: 10,
    ingredients: ['Hạt Quinoa', 'Bơ sáp 034', 'Hạt sen Huế', 'Xà lách thủy canh', 'Sốt chanh dây'],
    isVegetarian: true,
    tags: ['Siêu thực phẩm', 'Giàu chất xơ', 'Giảm mỡ'],
  },
  {
    _id: 'f-9',
    id: 'f-9',
    name: 'Đậu Hũ Non Áp Chảo Sốt Hạt Dẻ Cười',
    description: 'Đậu hũ non làng Mơ áp chảo xém vàng cạnh ngoài mướt mềm bên trong, rưới sốt bơ hạt dẻ cười thơm lừng và mè rang nguyên chất.',
    price: 45000,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=700',
    category: 'side',
    calories: 320,
    protein: 19.5,
    carbs: 18.0,
    fat: 14.0,
    isAvailable: true,
    preparationTime: 12,
    ingredients: ['Đậu hũ non', 'Hạt dẻ cười', 'Mè rang', 'Dầu mè', 'Xì dầu ủ tự nhiên'],
    isVegetarian: true,
    tags: ['High-Protein', 'Ăn nhẹ dinh dưỡng'],
  },
  {
    _id: 'f-10',
    id: 'f-10',
    name: 'Canh Dưỡng Sinh Nấm Đông Trùng & Táo Đỏ',
    description: 'Bát canh bồi bổ nguyên khí ninh từ nấm đông trùng hạ thảo, táo đỏ Tân Cương, hạt sen và kỷ tử, hỗ trợ an thần và dưỡng nhan.',
    price: 48000,
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=700',
    category: 'side',
    calories: 180,
    protein: 8.5,
    carbs: 28.0,
    fat: 3.0,
    isAvailable: true,
    preparationTime: 15,
    ingredients: ['Nấm đông trùng', 'Táo đỏ', 'Hạt sen', 'Kỷ tử', 'Nước dùng củ quả'],
    isVegetarian: true,
    tags: ['Dưỡng nhan', 'Bổ khí huyết', 'Người cao tuổi'],
  },
  {
    _id: 'f-11',
    id: 'f-11',
    name: 'Chả Giò Nấm Rong Biển Tươi Giòn',
    description: 'Vỏ ram gạo lứt giòn tan bọc nhân nấm đông cô, mộc nhĩ, khoai môn sáp và rong biển tươi, chấm nước mắm chay chua ngọt vừa miệng.',
    price: 45000,
    image: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=700',
    category: 'side',
    calories: 290,
    protein: 9.0,
    carbs: 36.0,
    fat: 10.5,
    isAvailable: true,
    preparationTime: 15,
    ingredients: ['Bánh tráng ram', 'Nấm đông cô', 'Mộc nhĩ', 'Khoai môn', 'Rong biển'],
    isVegetarian: true,
    tags: ['Giòn rụm', 'Món ăn kèm hoàn hảo'],
  },

  // --- Tráng miệng (DESSERT) ---
  {
    _id: 'f-12',
    id: 'f-12',
    name: 'Chè Hạt Sen Long Nhãn Táo Đỏ',
    description: 'Chè hạt sen tươi xứ Huế nấu cùng long nhãn ngọt thanh và táo đỏ bổ dưỡng, vị ngọt dịu từ đường thốt nốt nguyên chất.',
    price: 32000,
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=700',
    category: 'dessert',
    calories: 190,
    protein: 4.5,
    carbs: 39.0,
    fat: 1.5,
    isAvailable: true,
    preparationTime: 10,
    ingredients: ['Hạt sen Huế', 'Táo đỏ', 'Kỷ tử', 'Đường thốt nốt'],
    isVegetarian: true,
    tags: ['Thanh nhiệt', 'Ngọt thanh', 'Tráng miệng lành tính'],
  },
  {
    _id: 'f-13',
    id: 'f-13',
    name: 'Bánh Flan Sữa Đậu Nành Đường Thốt Nốt',
    description: 'Bánh flan mềm mịn không trứng chế biến từ sữa đậu nành tươi và bột rong biển tự nhiên, hòa quyện caramel thốt nốt thơm ngậy.',
    price: 28000,
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0a36077?w=700',
    category: 'dessert',
    calories: 175,
    protein: 5.5,
    carbs: 24.0,
    fat: 6.0,
    isAvailable: true,
    preparationTime: 10,
    ingredients: ['Sữa đậu nành', 'Đường thốt nốt', 'Bột rau câu rong biển', 'Vani tự nhiên'],
    isVegetarian: true,
    tags: ['Mềm mịn', 'Ít đường', 'Trẻ nhỏ yêu thích'],
  },
  {
    _id: 'f-14',
    id: 'f-14',
    name: 'Panna Cotta Sữa Hạnh Nhân Sốt Dâu Tằm',
    description: 'Tráng miệng thanh tao từ sữa hạnh nhân nấu tươi đông nhẹ mịn màng, phủ lớp sốt dâu tằm Đà Lạt chua ngọt tự nhiên.',
    price: 35000,
    image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=700',
    category: 'dessert',
    calories: 185,
    protein: 6.0,
    carbs: 22.0,
    fat: 7.5,
    isAvailable: true,
    preparationTime: 10,
    ingredients: ['Hạnh nhân hữu cơ', 'Sốt dâu tằm', 'Nước cốt dừa', 'Bột rau câu rong biển'],
    isVegetarian: true,
    tags: ['Cao cấp', 'Giàu Vitamin E'],
  },

  // --- Đồ uống dưỡng sinh (BEVERAGE) ---
  {
    _id: 'f-15',
    id: 'f-15',
    name: 'Trà Hoa Cúc Thảo Mộc Thanh Nhiệt',
    description: 'Trà hoa cúc chi sấy lạnh kết hợp kỷ tử đỏ ngọt dịu, táo đỏ và hạt chia organic, mang lại cảm giác an thần và thanh mát cơ thể.',
    price: 29000,
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=700',
    category: 'beverage',
    calories: 55,
    protein: 1.5,
    carbs: 11.0,
    fat: 0.5,
    isAvailable: true,
    preparationTime: 5,
    ingredients: ['Hoa cúc chi', 'Kỷ tử đỏ', 'Táo đỏ', 'Hạt chia'],
    isVegetarian: true,
    tags: ['Thanh nhiệt', 'Không cafein', 'An thần'],
  },
  {
    _id: 'f-16',
    id: 'f-16',
    name: 'Sữa Hạt Sen Đậu Biếc Hạnh Nhân Tươi',
    description: 'Sữa hạt tươi nấu mới mỗi sáng từ hạt sen tươi và hạnh nhân nguyên chất, tạo sắc xanh lam tự nhiên quyến rũ từ hoa đậu biếc.',
    price: 35000,
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=700',
    category: 'beverage',
    calories: 135,
    protein: 6.5,
    carbs: 15.0,
    fat: 4.8,
    isAvailable: true,
    preparationTime: 5,
    ingredients: ['Hạt sen tươi', 'Hạnh nhân', 'Hoa đậu biếc', 'Nước dừa tươi'],
    isVegetarian: true,
    tags: ['Sữa hạt tươi', 'Bổ não', 'Đẹp da'],
  },
  {
    _id: 'f-17',
    id: 'f-17',
    name: 'Sinh Tố Bơ Sáp Cải Xoăn Đạm Thực Vật',
    description: 'Ly sinh tố bổ dưỡng với bơ sáp 034, cải xoăn kale hữu cơ và bột đạm đậu Hà Lan, cung cấp nguồn năng lượng sạch bền vững sau vận động.',
    price: 45000,
    image: 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=700',
    category: 'beverage',
    calories: 220,
    protein: 15.0,
    carbs: 18.0,
    fat: 9.0,
    isAvailable: true,
    preparationTime: 8,
    ingredients: ['Bơ sáp', 'Cải xoăn kale', 'Bột đạm đậu Hà Lan', 'Sữa đậu nành'],
    isVegetarian: true,
    tags: ['Tăng cơ', 'Giàu chất chống oxy hóa', 'Gym & Fit'],
  },
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