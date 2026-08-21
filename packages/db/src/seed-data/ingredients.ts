import { IngredientUnit } from '@prisma/client';

export interface SeedIngredientData {
  name: string;
  code: string;
  unit: IngredientUnit;
  currentStock: number;
  minThreshold: number;
  costPerUnit: number;
  supplier: string;
  category: string;
}

export const seedIngredients: SeedIngredientData[] = [
  // Đạm thực vật
  { name: 'Đậu Hũ Non Hữu Cơ', code: 'ING_DAU_HU', unit: 'GRAM', currentStock: 25000, minThreshold: 5000, costPerUnit: 40, supplier: 'HTX Nông Trại Xanh', category: 'Đạm thực vật' },
  { name: 'Sườn Non Chay Lát Đậu Nành', code: 'ING_SUON_CHAY', unit: 'GRAM', currentStock: 15000, minThreshold: 3000, costPerUnit: 75, supplier: 'Cơ Sở Chay An Lạc', category: 'Đạm thực vật' },
  { name: 'Tàu Hũ Ky Lá Tươi', code: 'ING_TAU_HU_KY', unit: 'GRAM', currentStock: 12000, minThreshold: 2000, costPerUnit: 85, supplier: 'HTX Nông Trại Xanh', category: 'Đạm thực vật' },
  { name: 'Chả Lụa Chay Nấm', code: 'ING_CHA_LUA_CHAY', unit: 'GRAM', currentStock: 10000, minThreshold: 2000, costPerUnit: 90, supplier: 'Cơ Sở Chay An Lạc', category: 'Đạm thực vật' },
  { name: 'Bột Đạm Đậu Hà Lan Organic', code: 'ING_PROTEIN_PEA', unit: 'GRAM', currentStock: 5000, minThreshold: 1000, costPerUnit: 220, supplier: 'Dinh Dưỡng Xanh Bio', category: 'Đạm thực vật' },

  // Nấm tươi
  { name: 'Nấm Đùi Gà Tươi', code: 'ING_NAM_DUI_GA', unit: 'GRAM', currentStock: 14000, minThreshold: 3000, costPerUnit: 90, supplier: 'Nấm Sạch Đà Lạt', category: 'Nấm tươi' },
  { name: 'Nấm Đông Cô Tươi', code: 'ING_NAM_DONG_CO', unit: 'GRAM', currentStock: 12000, minThreshold: 2500, costPerUnit: 110, supplier: 'Nấm Sạch Đà Lạt', category: 'Nấm tươi' },
  { name: 'Nấm Mối Đen Tươi', code: 'ING_NAM_MOI_DEN', unit: 'GRAM', currentStock: 8000, minThreshold: 1500, costPerUnit: 140, supplier: 'Nấm Sạch Đà Lạt', category: 'Nấm tươi' },
  { name: 'Nấm Đông Trùng Hạ Thảo Tươi', code: 'ING_DONG_TRUNG', unit: 'GRAM', currentStock: 3000, minThreshold: 500, costPerUnit: 320, supplier: 'Viện Sinh Học Nông Nghiệp', category: 'Nấm tươi' },
  { name: 'Nấm Mèo (Mộc Nhĩ) Khô', code: 'ING_MOC_NHI', unit: 'GRAM', currentStock: 6000, minThreshold: 1000, costPerUnit: 80, supplier: 'Nấm Sạch Đà Lạt', category: 'Nấm khô' },

  // Ngũ cốc & Tinh bột
  { name: 'Gạo Tấm Nàng Thơm', code: 'ING_GAO_TAM', unit: 'GRAM', currentStock: 40000, minThreshold: 8000, costPerUnit: 28, supplier: 'Vựa Gạo Miền Tây', category: 'Ngũ cốc' },
  { name: 'Gạo Lứt Đỏ ST25 Huyết Rồng', code: 'ING_GAO_LUC', unit: 'GRAM', currentStock: 35000, minThreshold: 7000, costPerUnit: 38, supplier: 'Vựa Gạo Miền Tây', category: 'Ngũ cốc' },
  { name: 'Hạt Quinoa 3 Màu Organic', code: 'ING_QUINOA', unit: 'GRAM', currentStock: 8000, minThreshold: 1500, costPerUnit: 180, supplier: 'Nông Sản Hữu Cơ Nam Mỹ', category: 'Ngũ cốc' },
  { name: 'Bánh Phở Tươi Thủ Công', code: 'ING_BANH_PHO', unit: 'GRAM', currentStock: 20000, minThreshold: 4000, costPerUnit: 25, supplier: 'Lò Phở Gia Truyền', category: 'Tinh bột sợi' },
  { name: 'Bún Tươi Sợi Lớn Huế', code: 'ING_BUN_BOHUE', unit: 'GRAM', currentStock: 18000, minThreshold: 3500, costPerUnit: 24, supplier: 'Lò Bún Thủ Công', category: 'Tinh bột sợi' },
  { name: 'Hủ Tiếu Dai Sa Đéc', code: 'ING_HU_TIEU', unit: 'GRAM', currentStock: 15000, minThreshold: 3000, costPerUnit: 30, supplier: 'Đặc Sản Sa Đéc', category: 'Tinh bột sợi' },
  { name: 'Bánh Tráng Gạo Mè', code: 'ING_BANH_TRANG', unit: 'PIECE', currentStock: 2500, minThreshold: 500, costPerUnit: 1500, supplier: 'Làng Nghề Trảng Bàng', category: 'Bánh tráng' },

  // Rau củ quả tươi
  { name: 'Bơ Sáp 034 Bảo Lộc', code: 'ING_BO_SAP', unit: 'GRAM', currentStock: 12000, minThreshold: 2500, costPerUnit: 85, supplier: 'Nông Trại Bơ Bảo Lộc', category: 'Rau củ quả' },
  { name: 'Rau Xà Lách Thuỷ Canh', code: 'ING_XA_LACH', unit: 'GRAM', currentStock: 15000, minThreshold: 3000, costPerUnit: 45, supplier: 'Nông Trại Xanh Đà Lạt', category: 'Rau củ quả' },
  { name: 'Cải Xoăn Kale Hữu Cơ', code: 'ING_KALE', unit: 'GRAM', currentStock: 8000, minThreshold: 1500, costPerUnit: 70, supplier: 'Nông Trại Xanh Đà Lạt', category: 'Rau củ quả' },
  { name: 'Khoai Môn Sáp Cao Lãnh', code: 'ING_KHOAI_MON', unit: 'GRAM', currentStock: 12000, minThreshold: 2500, costPerUnit: 48, supplier: 'Nông Sản Đồng Tháp', category: 'Rau củ quả' },
  { name: 'Củ Cải Trắng & Cà Rốt', code: 'ING_CU_CAI', unit: 'GRAM', currentStock: 20000, minThreshold: 4000, costPerUnit: 22, supplier: 'Nông Sản Đà Lạt', category: 'Rau củ quả' },

  // Hạt dinh dưỡng & Thảo mộc
  { name: 'Hạt Sen Huế Tươi', code: 'ING_HAT_SEN', unit: 'GRAM', currentStock: 10000, minThreshold: 2000, costPerUnit: 160, supplier: 'Đặc Sản Huế An Nhiên', category: 'Hạt dinh dưỡng' },
  { name: 'Hạnh Nhân Hữu Cơ Tươi', code: 'ING_HANH_NHAN', unit: 'GRAM', currentStock: 6000, minThreshold: 1000, costPerUnit: 280, supplier: 'Hạt Nhập Khẩu Cali', category: 'Hạt dinh dưỡng' },
  { name: 'Hạt Dẻ Cười Rang Mộc', code: 'ING_DE_CUOI', unit: 'GRAM', currentStock: 5000, minThreshold: 800, costPerUnit: 310, supplier: 'Hạt Dinh Dưỡng Cao Cấp', category: 'Hạt dinh dưỡng' },
  { name: 'Hạt Chia Hữu Cơ', code: 'ING_HAT_CHIA', unit: 'GRAM', currentStock: 6000, minThreshold: 1000, costPerUnit: 190, supplier: 'Nông Sản Hữu Cơ Úc', category: 'Hạt dinh dưỡng' },
  { name: 'Hoa Cúc Chi Sấy Lạnh', code: 'ING_HOA_CUC', unit: 'GRAM', currentStock: 4000, minThreshold: 800, costPerUnit: 260, supplier: 'Thảo Mộc Vàng', category: 'Thảo mộc' },
  { name: 'Kỷ Tử Đỏ Ninh Hạ', code: 'ING_KY_TU', unit: 'GRAM', currentStock: 4000, minThreshold: 800, costPerUnit: 350, supplier: 'Dược Liệu Xanh', category: 'Thảo mộc' },
  { name: 'Táo Đỏ Tân Cương', code: 'ING_TAO_DO', unit: 'GRAM', currentStock: 6000, minThreshold: 1000, costPerUnit: 180, supplier: 'Dược Liệu Xanh', category: 'Thảo mộc' },
  { name: 'Hoa Đậu Biếc Sấy Khô', code: 'ING_HOA_DAU_BIEC', unit: 'GRAM', currentStock: 3000, minThreshold: 500, costPerUnit: 220, supplier: 'Thảo Mộc Vàng', category: 'Thảo mộc' },
  { name: 'Nước Cốt Dừa Tươi Ép Lạnh', code: 'ING_NUOC_COT_DUA', unit: 'MILLILITER', currentStock: 15000, minThreshold: 3000, costPerUnit: 60, supplier: 'Dừa Sạch Bến Tre', category: 'Gia vị sốt' },
  { name: 'Đường Thốt Nốt An Giang', code: 'ING_DUONG_THOT_NOT', unit: 'GRAM', currentStock: 10000, minThreshold: 2000, costPerUnit: 55, supplier: 'Đặc Sản Bảy Núi', category: 'Gia vị sốt' },
];
