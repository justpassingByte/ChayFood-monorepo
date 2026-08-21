import { IngredientUnit } from '@prisma/client';

export interface SeedRecipeInstruction {
  stepNumber: number;
  title: string;
  description: string;
  timeInMinutes: number;
}

export interface SeedRecipeItem {
  ingredientCode: string;
  quantity: number;
  unit: IngredientUnit;
  notes?: string;
}

export interface SeedRecipeData {
  dishName: string;
  name: string;
  description: string;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servingSize: number;
  notes: string;
  instructions: SeedRecipeInstruction[];
  items: SeedRecipeItem[];
}

export const seedRecipes: SeedRecipeData[] = [
  // 1. Cơm Tấm Sườn Bì Chả Chay
  {
    dishName: 'Cơm Tấm Sườn Bì Chả Chay',
    name: 'Công Thức Chuẩn: Cơm Tấm Sườn Bì Chả Chay',
    description: 'Quy trình định lượng chuẩn hóa nhà bếp và kỹ thuật chế biến đĩa cơm tấm chay thơm ngon đậm đà',
    prepTimeMinutes: 15,
    cookTimeMinutes: 20,
    servingSize: 1,
    notes: 'Sườn chiên vàng giòn ráo dầu, chả hấp chín mềm giữ được độ bùi của đậu hũ non.',
    items: [
      { ingredientCode: 'ING_GAO_TAM', quantity: 150, unit: 'GRAM', notes: 'Gạo tấm thơm dẻo' },
      { ingredientCode: 'ING_SUON_CHAY', quantity: 60, unit: 'GRAM', notes: 'Sườn non ngâm mềm, vắt ráo' },
      { ingredientCode: 'ING_DAU_HU', quantity: 80, unit: 'GRAM', notes: 'Đậu hũ làm chả hấp' },
      { ingredientCode: 'ING_NAM_DONG_CO', quantity: 30, unit: 'GRAM', notes: 'Nấm sốt mặn ngọt' },
      { ingredientCode: 'ING_MOC_NHI', quantity: 15, unit: 'GRAM', notes: 'Mộc nhĩ thái sợi làm bì' },
    ],
    instructions: [
      { stepNumber: 1, title: 'Nấu cơm tấm', description: 'Vo gạo tấm sạch, nấu trong nồi hấp với lượng nước vừa phải để hạt cơm ráo và tơi xốp.', timeInMinutes: 20 },
      { stepNumber: 2, title: 'Làm sườn rim sốt nấm', description: 'Chiên vàng sườn non lát, phi thơm nấm đông cô với nước tương tamari và mật mía, cho sườn vào rim lửa nhỏ 5 phút.', timeInMinutes: 8 },
      { stepNumber: 3, title: 'Hấp chả đậu hũ', description: 'Nghiền nhuyễn đậu hũ non cùng mộc nhĩ băm, nêm hạt nêm nấm và tiêu sọ, hấp cách thủy trong 12 phút.', timeInMinutes: 12 },
      { stepNumber: 4, title: 'Bày trí đĩa cơm', description: 'Xới cơm tấm vào đĩa, xếp miếng sườn rim, lát chả hấp, rắc thính bì miến và mỡ hành boa-rô lên trên.', timeInMinutes: 3 },
    ],
  },

  // 2. Phở Chay Thập Cẩm Rau Củ
  {
    dishName: 'Phở Chay Thập Cẩm Rau Củ',
    name: 'Công Thức Chuẩn: Phở Chay Thập Cẩm Rau Củ',
    description: 'Bí quyết nước dùng phở chay ngọt thanh từ rau củ tự nhiên và thảo mộc gia truyền',
    prepTimeMinutes: 15,
    cookTimeMinutes: 25,
    servingSize: 1,
    notes: 'Nước dùng trong veo, thơm nức mùi quế hồi thảo quả tự nhiên.',
    items: [
      { ingredientCode: 'ING_BANH_PHO', quantity: 180, unit: 'GRAM', notes: 'Bánh phở tươi mềm' },
      { ingredientCode: 'ING_NAM_DUI_GA', quantity: 60, unit: 'GRAM', notes: 'Nấm đùi gà thái lát' },
      { ingredientCode: 'ING_TAU_HU_KY', quantity: 30, unit: 'GRAM', notes: 'Tàu hũ ky chiên phồng' },
      { ingredientCode: 'ING_CHA_LUA_CHAY', quantity: 40, unit: 'GRAM', notes: 'Chả lụa nấm thái mỏng' },
      { ingredientCode: 'ING_CU_CAI', quantity: 100, unit: 'GRAM', notes: 'Củ cải trắng hầm nước dùng' },
    ],
    instructions: [
      { stepNumber: 1, title: 'Ninh nước dùng phở', description: 'Nướng thơm hành boa-rô, gừng và hoa hồi, quế. Cho vào nồi hầm cùng củ cải trắng và mía trong 30 phút.', timeInMinutes: 30 },
      { stepNumber: 2, title: 'Xào nấm đùi gà', description: 'Áp chảo nấm đùi gà với chút xì dầu và tiêu để nấm dậy mùi thơm và giòn sần sật.', timeInMinutes: 5 },
      { stepNumber: 3, title: 'Trần bánh phở', description: 'Trần bánh phở tươi qua nước sôi trong 10 giây rồi cho ngay vào tô sành giữ nhiệt.', timeInMinutes: 2 },
      { stepNumber: 4, title: 'Chan nước dùng hoàn thiện', description: 'Xếp nấm đùi gà, chả lụa chay, tàu hũ ky lên mặt tô phở, rắc ngò gai, chan nước dùng sôi sùng sục.', timeInMinutes: 3 },
    ],
  },

  // 3. Bún Bò Huế Chay Chả Nấm & Sa Tế Sả
  {
    dishName: 'Bún Bò Huế Chay Chả Nấm & Sa Tế Sả',
    name: 'Công Thức Chuẩn: Bún Bò Huế Chay Chả Nấm',
    description: 'Quy trình nấu nước dùng bún bò chay cay nồng sa tế sả và chả nấm mối đậm đà xứ Huế',
    prepTimeMinutes: 15,
    cookTimeMinutes: 25,
    servingSize: 1,
    notes: 'Phi sả ớt thật vàng để tạo màu đỏ cam bắt mắt và hương thơm đặc trưng.',
    items: [
      { ingredientCode: 'ING_BUN_BOHUE', quantity: 180, unit: 'GRAM', notes: 'Bún sợi to xứ Huế' },
      { ingredientCode: 'ING_NAM_MOI_DEN', quantity: 50, unit: 'GRAM', notes: 'Nấm mối xào sa tế' },
      { ingredientCode: 'ING_DAU_HU', quantity: 60, unit: 'GRAM', notes: 'Đậu hũ non chiên phồng' },
      { ingredientCode: 'ING_CHA_LUA_CHAY', quantity: 40, unit: 'GRAM', notes: 'Chả lụa nấm thái khoanh' },
      { ingredientCode: 'ING_CU_CAI', quantity: 80, unit: 'GRAM', notes: 'Hầm lấy nước ngọt tự nhiên' },
    ],
    instructions: [
      { stepNumber: 1, title: 'Nấu nước dùng sả gừng', description: 'Đập dập 4 cây sả, ninh cùng củ cải và dứa lấy nước dùng thơm ngát, nêm mắm ruốc chay.', timeInMinutes: 25 },
      { stepNumber: 2, title: 'Chế biến sa tế nấm mối', description: 'Xào nấm mối đen cùng ớt sa tế sả phi thơm đến khi săn lại và thấm đẫm vị cay dịu.', timeInMinutes: 6 },
      { stepNumber: 3, title: 'Trần bún và xếp tô', description: 'Trần bún sợi lớn, xếp đậu hũ chiên vàng, chả lụa nấm và nấm mối sa tế lên trên.', timeInMinutes: 3 },
      { stepNumber: 4, title: 'Chan nước dùng cay nóng', description: 'Múc nước dùng sả sùng sục chan ngập tô, thêm hoa chuối bào và rau húng quế tươi.', timeInMinutes: 2 },
    ],
  },

  // 4. Cơm Gạo Lứt Nấm Mối Nướng Lá Chuối
  {
    dishName: 'Cơm Gạo Lứt Nấm Mối Nướng Lá Chuối',
    name: 'Công Thức Chuẩn: Cơm Gạo Lứt Nấm Mối Nướng Lá Chuối',
    description: 'Nướng chậm nấm mối bọc lá chuối cùng cơm gạo lứt hạt sen giữ trọn hương thảo mộc',
    prepTimeMinutes: 20,
    cookTimeMinutes: 25,
    servingSize: 1,
    notes: 'Lá chuối hơ lửa cho mềm trước khi gói để không bị rách.',
    items: [
      { ingredientCode: 'ING_GAO_LUC', quantity: 140, unit: 'GRAM', notes: 'Gạo lứt đỏ ST25 ngâm 4 tiếng' },
      { ingredientCode: 'ING_NAM_MOI_DEN', quantity: 70, unit: 'GRAM', notes: 'Nấm mối ướp sả ớt' },
      { ingredientCode: 'ING_HAT_SEN', quantity: 40, unit: 'GRAM', notes: 'Hạt sen tươi hấp bùi' },
      { ingredientCode: 'ING_DAU_HU', quantity: 50, unit: 'GRAM', notes: 'Nghiền mịn trộn chả' },
    ],
    instructions: [
      { stepNumber: 1, title: 'Hấp gạo lứt & hạt sen', description: 'Nấu gạo lứt ST25 cùng hạt sen tươi nguyên hạt đến khi cơm dẻo và hạt sen mềm bùi.', timeInMinutes: 25 },
      { stepNumber: 2, title: 'Ướp nấm mối nướng', description: 'Trộn nấm mối cùng đậu hũ non nghiền, sả băm, dầu màu điều và tiêu đen Phú Quốc.', timeInMinutes: 8 },
      { stepNumber: 3, title: 'Gói lá chuối nướng', description: 'Bọc nhân nấm vào lá chuối bánh tẻ, nướng trên vỉ than hoa hoặc áp chảo 10 phút đến khi lá dậy mùi thơm.', timeInMinutes: 10 },
      { stepNumber: 4, title: 'Hoàn thiện khẩu phần', description: 'Mở gói lá chuối thơm nức, ăn kèm chén cơm gạo lứt hạt sen nóng hổi và dưa leo non.', timeInMinutes: 2 },
    ],
  },

  // 5. Hủ Tiếu Nam Vang Chay Thảo Mộc
  {
    dishName: 'Hủ Tiếu Nam Vang Chay Thảo Mộc',
    name: 'Công Thức Chuẩn: Hủ Tiếu Nam Vang Chay',
    description: 'Kỹ thuật trộn hủ tiếu khô sốt đậm đà và nấu nước súp ngọt thanh thơm mùi cần tây',
    prepTimeMinutes: 15,
    cookTimeMinutes: 18,
    servingSize: 1,
    notes: 'Sợi hủ tiếu trần vừa chín tới để giữ độ dai giòn, không bị nát.',
    items: [
      { ingredientCode: 'ING_HU_TIEU', quantity: 160, unit: 'GRAM', notes: 'Hủ tiếu dai Sa Đéc' },
      { ingredientCode: 'ING_NAM_DONG_CO', quantity: 50, unit: 'GRAM', notes: 'Nấm đông cô khía hoa' },
      { ingredientCode: 'ING_TAU_HU_KY', quantity: 30, unit: 'GRAM', notes: 'Chiên vàng giòn rụm' },
      { ingredientCode: 'ING_CU_CAI', quantity: 80, unit: 'GRAM', notes: 'Nấu nước súp củ quả' },
    ],
    instructions: [
      { stepNumber: 1, title: 'Pha sốt trộn hủ tiếu', description: 'Khuấy đều sốt tương ngọt, xì dầu, dầu hào chay, dầu boa-rô phi và tiêu hạt.', timeInMinutes: 5 },
      { stepNumber: 2, title: 'Trần hủ tiếu và xóc sốt', description: 'Trần hủ tiếu qua nước sôi 15 giây, xóc đều cùng sốt đặc chế trong tô sâu lòng.', timeInMinutes: 3 },
      { stepNumber: 3, title: 'Xào nấm và chuẩn bị topping', description: 'Xào nấm đông cô với tỏi tây phi, chuẩn bị sẵn tàu hũ ky chiên giòn và giá hẹ.', timeInMinutes: 6 },
      { stepNumber: 4, title: 'Bày trí kèm chén súp', description: 'Xếp nấm, tàu hũ ky lên đĩa hủ tiếu, múc bát nước súp củ quả rắc ngò rí bên cạnh.', timeInMinutes: 2 },
    ],
  },

  // 6. Cà Ri Nấm Khoai Sọ Nước Cốt Dừa
  {
    dishName: 'Cà Ri Nấm Khoai Sọ Nước Cốt Dừa',
    name: 'Công Thức Chuẩn: Cà Ri Nấm Khoai Sọ Nước Cốt Dừa',
    description: 'Nấu cà ri chay béo ngậy từ nước cốt dừa tươi Bến Tre và khoai môn dẻo mềm',
    prepTimeMinutes: 18,
    cookTimeMinutes: 22,
    servingSize: 1,
    notes: 'Cho nước cốt dừa vào sau cùng để giữ trọn vị béo ngậy và không bị tách dầu.',
    items: [
      { ingredientCode: 'ING_KHOAI_MON', quantity: 120, unit: 'GRAM', notes: 'Khoai môn cắt khối chiên sơ' },
      { ingredientCode: 'ING_NAM_DUI_GA', quantity: 70, unit: 'GRAM', notes: 'Nấm đùi gà thái quân cờ' },
      { ingredientCode: 'ING_NUOC_COT_DUA', quantity: 100, unit: 'MILLILITER', notes: 'Nước cốt dừa tươi Bến Tre' },
      { ingredientCode: 'ING_DAU_HU', quantity: 60, unit: 'GRAM', notes: 'Đậu hũ chiên vàng' },
    ],
    instructions: [
      { stepNumber: 1, title: 'Chiên sơ khoai môn & đậu hũ', description: 'Cắt khoai môn và đậu hũ khối vuông 3cm, chiên vàng mặt ngoài để khi nấu không bị nát.', timeInMinutes: 8 },
      { stepNumber: 2, title: 'Xào bột cà ri và sả', description: 'Phi thơm sả cây đập dập cùng bột cà ri Ấn Độ hữu cơ trong dầu dừa.', timeInMinutes: 4 },
      { stepNumber: 3, title: 'Nấu khoai và nấm', description: 'Cho khoai môn, nấm đùi gà và nước dùng dừa vào nấu sôi nhẹ trong 12 phút đến khi khoai mềm dẻo.', timeInMinutes: 12 },
      { stepNumber: 4, title: 'Thêm nước cốt dừa', description: 'Rót nước cốt dừa tươi đặc sánh vào khuấy nhẹ, nêm muối hồng và lá quế tươi rồi tắt bếp.', timeInMinutes: 3 },
    ],
  },

  // 7. Gỏi Cuốn Ngũ Sắc Sốt Tương Đậu Phộng
  {
    dishName: 'Gỏi Cuốn Ngũ Sắc Sốt Tương Đậu Phộng',
    name: 'Công Thức Chuẩn: Gỏi Cuốn Ngũ Sắc Sốt Tương Đậu',
    description: 'Cuộn gỏi cuốn thanh mát với bơ sáp béo bùi và sốt tương bơ lạc thơm nức',
    prepTimeMinutes: 15,
    cookTimeMinutes: 5,
    servingSize: 1,
    notes: 'Nhúng bánh tráng nhanh tay trong nước ấm để bánh mềm dẻo không bị dính rách.',
    items: [
      { ingredientCode: 'ING_BANH_TRANG', quantity: 4, unit: 'PIECE', notes: 'Bánh tráng gạo mè dẻo' },
      { ingredientCode: 'ING_BO_SAP', quantity: 80, unit: 'GRAM', notes: 'Bơ sáp thái lát mỏng' },
      { ingredientCode: 'ING_DAU_HU', quantity: 80, unit: 'GRAM', notes: 'Đậu hũ chiên giòn thái sợi' },
      { ingredientCode: 'ING_XA_LACH', quantity: 50, unit: 'GRAM', notes: 'Rau xà lách thủy canh giòn' },
    ],
    instructions: [
      { stepNumber: 1, title: 'Sơ chế rau củ & bơ sáp', description: 'Bơ sáp thái lát dày 0.5cm, đậu hũ chiên giòn thái que dài, xà lách rửa sạch vẩy ráo nước.', timeInMinutes: 6 },
      { stepNumber: 2, title: 'Pha sốt bơ đậu phộng', description: 'Xay nhuyễn bơ đậu phộng rang cùng tương ngọt, nước cốt dừa và vài lát ớt tươi.', timeInMinutes: 4 },
      { stepNumber: 3, title: 'Cuộn gỏi cuốn', description: 'Trải bánh tráng mè, xếp lớp xà lách, bún tươi, sợi đậu hũ và lát bơ sáp, cuộn chặt tay đều đặn.', timeInMinutes: 6 },
      { stepNumber: 4, title: 'Bày đĩa hoàn thiện', description: 'Cắt đôi cuốn gỏi xếp lên đĩa, rắc đậu phộng rang giã dập lên chén sốt tương chấm.', timeInMinutes: 2 },
    ],
  },

  // 8. Salad Quinoa Bơ Sáp & Hạt Sen Sốt Chanh Dây
  {
    dishName: 'Salad Quinoa Bơ Sáp & Hạt Sen Sốt Chanh Dây',
    name: 'Công Thức Chuẩn: Salad Quinoa Bơ Sáp Hạt Sen',
    description: 'Món salad giàu vi chất và chất xơ với sốt chanh leo tươi chua ngọt thanh tao',
    prepTimeMinutes: 12,
    cookTimeMinutes: 15,
    servingSize: 1,
    notes: 'Quinoa luộc chín tới để hạt nở bung tròn và giữ độ giòn sần sật đặc trưng.',
    items: [
      { ingredientCode: 'ING_QUINOA', quantity: 50, unit: 'GRAM', notes: 'Quinoa 3 màu hữu cơ' },
      { ingredientCode: 'ING_BO_SAP', quantity: 70, unit: 'GRAM', notes: 'Bơ sáp cắt hạt lựu' },
      { ingredientCode: 'ING_HAT_SEN', quantity: 40, unit: 'GRAM', notes: 'Hạt sen tươi hấp mềm' },
      { ingredientCode: 'ING_XA_LACH', quantity: 60, unit: 'GRAM', notes: 'Xà lách thủy canh xé nhỏ' },
    ],
    instructions: [
      { stepNumber: 1, title: 'Luộc hạt Quinoa', description: 'Rửa sạch Quinoa, luộc với tỷ lệ 1:2 trong 12 phút đến khi hạt nở trong, vớt ra để nguội.', timeInMinutes: 12 },
      { stepNumber: 2, title: 'Hấp hạt sen Huế', description: 'Hấp hạt sen tươi trong 15 phút đến khi chín bở tơi nhưng không bị nát.', timeInMinutes: 15 },
      { stepNumber: 3, title: 'Đánh sốt chanh dây', description: 'Lấy cốt chanh leo, khuấy đều cùng dầu olive nguyên chất, mật mía hữu cơ và xíu muối hồng.', timeInMinutes: 4 },
      { stepNumber: 4, title: 'Trộn salad nhẹ tay', description: 'Cho xà lách, Quinoa, bơ sáp và hạt sen vào âu, rưới sốt chanh dây và xới nhẹ tay.', timeInMinutes: 3 },
    ],
  },

  // 9. Đậu Hũ Non Áp Chảo Sốt Hạt Dẻ Cười
  {
    dishName: 'Đậu Hũ Non Áp Chảo Sốt Hạt Dẻ Cười',
    name: 'Công Thức Chuẩn: Đậu Hũ Non Sốt Hạt Dẻ Cười',
    description: 'Chế biến đậu hũ non giòn vỏ mềm mọng sốt bơ hạt dẻ cười giàu đạm thực vật',
    prepTimeMinutes: 10,
    cookTimeMinutes: 12,
    servingSize: 1,
    notes: 'Áp chảo lửa vừa với chút dầu mè để đậu hũ có màu vàng ươm hấp dẫn.',
    items: [
      { ingredientCode: 'ING_DAU_HU', quantity: 180, unit: 'GRAM', notes: 'Đậu hũ non hữu cơ cắt khối' },
      { ingredientCode: 'ING_DE_CUOI', quantity: 30, unit: 'GRAM', notes: 'Hạt dẻ cười rang giã mịn' },
    ],
    instructions: [
      { stepNumber: 1, title: 'Cắt và thấm khô đậu hũ', description: 'Cắt đậu hũ non thành các khối chữ nhật 4x6cm, dùng khăn giấy chuyên dụng thấm khô bề mặt.', timeInMinutes: 4 },
      { stepNumber: 2, title: 'Làm sốt hạt dẻ cười', description: 'Nghiền mịn hạt dẻ cười cùng xì dầu ủ tự nhiên, dầu mè nguyên chất và nước tương ngọt.', timeInMinutes: 5 },
      { stepNumber: 3, title: 'Áp chảo đậu hũ', description: 'Cho đậu hũ vào chảo chống dính với lửa vừa, áp chảo vàng 4 mặt trong 8 phút.', timeInMinutes: 8 },
      { stepNumber: 4, title: 'Rưới sốt và rắc mè', description: 'Bày đậu hũ ra đĩa sứ, rưới nước sốt bơ hạt dẻ sánh thơm và rắc mè rang thơm lừng.', timeInMinutes: 2 },
    ],
  },

  // 10. Canh Dưỡng Sinh Nấm Đông Trùng & Táo Đỏ
  {
    dishName: 'Canh Dưỡng Sinh Nấm Đông Trùng & Táo Đỏ',
    name: 'Công Thức Chuẩn: Canh Dưỡng Sinh Đông Trùng Táo Đỏ',
    description: 'Quy trình tiềm dưỡng sinh thanh nhiệt bổ khí huyết với các vị thuốc quý tự nhiên',
    prepTimeMinutes: 10,
    cookTimeMinutes: 25,
    servingSize: 1,
    notes: 'Tiềm cách thủy lửa nhỏ để dược tính trong thảo mộc tiết ra trọn vẹn.',
    items: [
      { ingredientCode: 'ING_DONG_TRUNG', quantity: 20, unit: 'GRAM', notes: 'Nấm đông trùng hạ thảo tươi' },
      { ingredientCode: 'ING_TAO_DO', quantity: 20, unit: 'GRAM', notes: 'Táo đỏ Tân Cương khía nhẹ' },
      { ingredientCode: 'ING_HAT_SEN', quantity: 30, unit: 'GRAM', notes: 'Hạt sen tươi thông tâm' },
      { ingredientCode: 'ING_KY_TU', quantity: 10, unit: 'GRAM', notes: 'Kỷ tử đỏ Ninh Hạ' },
    ],
    instructions: [
      { stepNumber: 1, title: 'Sơ chế thảo mộc', description: 'Rửa sạch kỷ tử và nấm đông trùng, táo đỏ khía dọc thân để dễ tiết vị ngọt tự nhiên.', timeInMinutes: 4 },
      { stepNumber: 2, title: 'Nấu hạt sen & táo đỏ', description: 'Cho hạt sen và táo đỏ vào thố sứ cùng 400ml nước lọc, tiềm cách thủy trong 20 phút.', timeInMinutes: 20 },
      { stepNumber: 3, title: 'Cho đông trùng & kỷ tử', description: 'Thêm nấm đông trùng hạ thảo và kỷ tử vào thố, nêm xíu muối hồng, nấu thêm 7 phút.', timeInMinutes: 7 },
      { stepNumber: 4, title: 'Thưởng thức khi còn ấm', description: 'Múc canh dưỡng sinh ra thố giữ nhiệt, dùng khi còn ấm nóng để phát huy công dụng an thần tốt nhất.', timeInMinutes: 2 },
    ],
  },

  // 11. Chả Giò Nấm Rong Biển Tươi Giòn
  {
    dishName: 'Chả Giò Nấm Rong Biển Tươi Giòn',
    name: 'Công Thức Chuẩn: Chả Giò Nấm Rong Biển',
    description: 'Cuộn chả giò vỏ ram giòn rụm với nhân nấm thơm lừng kết hợp rong biển bổ dưỡng',
    prepTimeMinutes: 20,
    cookTimeMinutes: 15,
    servingSize: 1,
    notes: 'Chiên ngập dầu ở nhiệt độ 160 độ C để vỏ giòn lâu và nhân chín mọng ngọt.',
    items: [
      { ingredientCode: 'ING_BANH_TRANG', quantity: 5, unit: 'PIECE', notes: 'Vỏ ram gạo lứt giòn' },
      { ingredientCode: 'ING_NAM_DONG_CO', quantity: 50, unit: 'GRAM', notes: 'Nấm đông cô băm hạt lựu' },
      { ingredientCode: 'ING_MOC_NHI', quantity: 20, unit: 'GRAM', notes: 'Mộc nhĩ ngâm nở thái sợi' },
      { ingredientCode: 'ING_KHOAI_MON', quantity: 50, unit: 'GRAM', notes: 'Khoai môn bào sợi' },
    ],
    instructions: [
      { stepNumber: 1, title: 'Trộn nhân chả giò', description: 'Trộn đều nấm đông cô, mộc nhĩ, khoai môn bào sợi cùng tiêu sọ, hạt nêm nấm và rong biển băm nhỏ.', timeInMinutes: 8 },
      { stepNumber: 2, title: 'Cuộn chả giò', description: 'Đặt nhân vào vỏ ram, cuốn tròn đều tay vừa vặn để khi chiên chả không bị nứt vỡ.', timeInMinutes: 10 },
      { stepNumber: 3, title: 'Chiên vàng giòn', description: 'Đun nóng dầu thực vật, thả chả giò vào chiên ngập dầu đến khi vàng ruộm, vớt ra để ráo dầu.', timeInMinutes: 10 },
      { stepNumber: 4, title: 'Trình bày món ăn', description: 'Xếp chả giò ra đĩa kèm rau xà lách, dưa leo và chén nước chấm chua ngọt thuần chay.', timeInMinutes: 2 },
    ],
  },

  // 12. Chè Hạt Sen Long Nhãn Táo Đỏ
  {
    dishName: 'Chè Hạt Sen Long Nhãn Táo Đỏ',
    name: 'Công Thức Chuẩn: Chè Hạt Sen Long Nhãn Táo Đỏ',
    description: 'Nấu chè hạt sen Huế thanh mát ngọt dịu bọc long nhãn và táo đỏ bùi ngọt',
    prepTimeMinutes: 15,
    cookTimeMinutes: 20,
    servingSize: 1,
    notes: 'Nấu bằng đường thốt nốt lửa nhỏ để nước chè có màu hổ phách trong veo thanh khiết.',
    items: [
      { ingredientCode: 'ING_HAT_SEN', quantity: 60, unit: 'GRAM', notes: 'Hạt sen tươi xứ Huế' },
      { ingredientCode: 'ING_TAO_DO', quantity: 25, unit: 'GRAM', notes: 'Táo đỏ Tân Cương' },
      { ingredientCode: 'ING_KY_TU', quantity: 10, unit: 'GRAM', notes: 'Kỷ tử đỏ ngọt dịu' },
      { ingredientCode: 'ING_DUONG_THOT_NOT', quantity: 30, unit: 'GRAM', notes: 'Đường thốt nốt nguyên chất' },
    ],
    instructions: [
      { stepNumber: 1, title: 'Nấu mềm hạt sen', description: 'Ninh hạt sen tươi cùng 400ml nước trong 15 phút đến khi hạt sen chín mềm bở.', timeInMinutes: 15 },
      { stepNumber: 2, title: 'Ướp đường thốt nốt', description: 'Cho đường thốt nốt vào nồi đun tan nhẹ để từng hạt sen thấm đẫm vị ngọt thanh dịu mát.', timeInMinutes: 5 },
      { stepNumber: 3, title: 'Thêm táo đỏ & kỷ tử', description: 'Thả táo đỏ và kỷ tử vào nấu sôi thêm 5 phút cho tinh chất hòa quyện.', timeInMinutes: 5 },
      { stepNumber: 4, title: 'Múc chén tráng miệng', description: 'Múc chè ra chén sành, dùng nóng hoặc thêm vài viên đá hoa cúc mát lạnh.', timeInMinutes: 2 },
    ],
  },

  // 13. Bánh Flan Sữa Đậu Nành Đường Thốt Nốt
  {
    dishName: 'Bánh Flan Sữa Đậu Nành Đường Thốt Nốt',
    name: 'Công Thức Chuẩn: Bánh Flan Sữa Đậu Nành Thuần Chay',
    description: 'Kỹ thuật đổ bánh flan mềm mịn không dùng trứng từ sữa đậu nành và caramel thốt nốt',
    prepTimeMinutes: 15,
    cookTimeMinutes: 15,
    servingSize: 1,
    notes: 'Hấp hoặc đun lửa thật nhỏ để mặt bánh mịn mượt không bị rỗ bọt khí.',
    items: [
      { ingredientCode: 'ING_DAU_HU', quantity: 60, unit: 'GRAM', notes: 'Đậu nành hữu cơ nấu sữa tươi' },
      { ingredientCode: 'ING_DUONG_THOT_NOT', quantity: 25, unit: 'GRAM', notes: 'Thắng caramel thơm lừng' },
      { ingredientCode: 'ING_NUOC_COT_DUA', quantity: 30, unit: 'MILLILITER', notes: 'Tạo độ béo ngậy tự nhiên' },
    ],
    instructions: [
      { stepNumber: 1, title: 'Thắng caramel thốt nốt', description: 'Đun tan đường thốt nốt cùng chút nước đến khi chuyển màu cánh gián đậm, rót vào đáy hũ.', timeInMinutes: 5 },
      { stepNumber: 2, title: 'Nấu sữa đậu nành & rau câu', description: 'Khuấy đều sữa đậu nành tươi, nước cốt dừa và bột rong biển tự nhiên, đun sôi nhẹ lăn tăn.', timeInMinutes: 8 },
      { stepNumber: 3, title: 'Lọc và rót khuôn', description: 'Lọc hỗn hợp sữa qua rây mịn, rót nhẹ nhàng vào từng hũ caramel đã nguội.', timeInMinutes: 4 },
      { stepNumber: 4, title: 'Làm lạnh đông bánh', description: 'Để bánh nguội tự nhiên rồi bảo quản ngăn mát tủ lạnh trong 2 tiếng trước khi dùng.', timeInMinutes: 5 },
    ],
  },

  // 14. Panna Cotta Sữa Hạnh Nhân Sốt Dâu Tằm
  {
    dishName: 'Panna Cotta Sữa Hạnh Nhân Sốt Dâu Tằm',
    name: 'Công Thức Chuẩn: Panna Cotta Sữa Hạnh Nhân',
    description: 'Tráng miệng phong cách Ý thuần chay từ sữa hạnh nhân nấu tươi và dâu tằm Đà Lạt',
    prepTimeMinutes: 15,
    cookTimeMinutes: 10,
    servingSize: 1,
    notes: 'Dùng hạnh nhân tươi xay nguyên chất để bánh có mùi thơm bùi thanh lịch.',
    items: [
      { ingredientCode: 'ING_HANH_NHAN', quantity: 40, unit: 'GRAM', notes: 'Hạnh nhân ngâm xay sữa tươi' },
      { ingredientCode: 'ING_NUOC_COT_DUA', quantity: 40, unit: 'MILLILITER', notes: 'Tạo cấu trúc mềm mướt' },
      { ingredientCode: 'ING_DUONG_THOT_NOT', quantity: 20, unit: 'GRAM', notes: 'Tạo ngọt dịu nhẹ' },
    ],
    instructions: [
      { stepNumber: 1, title: 'Nấu sữa hạnh nhân', description: 'Nấu sữa hạnh nhân tươi cùng nước cốt dừa và đường thốt nốt đến nhiệt độ 80 độ C.', timeInMinutes: 6 },
      { stepNumber: 2, title: 'Hòa bột đông tự nhiên', description: 'Hòa bột rau câu rong biển vào sữa hạnh nhân, khuấy đều tay trong 3 phút rồi lọc qua rây.', timeInMinutes: 4 },
      { stepNumber: 3, title: 'Đổ khuôn ly thủy tinh', description: 'Rót panna cotta vào các ly thủy tinh nhỏ, để đông trong ngăn mát 3 tiếng.', timeInMinutes: 3 },
      { stepNumber: 4, title: 'Phủ sốt dâu tằm', description: 'Khi bánh đông mềm mượt, rưới lớp sốt dâu tằm tím biếc và trang trí nhánh bạc hà.', timeInMinutes: 2 },
    ],
  },

  // 15. Trà Hoa Cúc Thảo Mộc Thanh Nhiệt
  {
    dishName: 'Trà Hoa Cúc Thảo Mộc Thanh Nhiệt',
    name: 'Công Thức Chuẩn: Trà Hoa Cúc Thảo Mộc Thanh Nhiệt',
    description: 'Pha chế ấm trà thảo mộc tinh túy với hoa cúc chi, kỷ tử đỏ và hạt chia an thần bổ dưỡng',
    prepTimeMinutes: 5,
    cookTimeMinutes: 7,
    servingSize: 1,
    notes: 'Tráng trà bằng nước sôi 90 độ C trước khi hãm để loại bỏ bụi phấn và đánh thức hương hoa.',
    items: [
      { ingredientCode: 'ING_HOA_CUC', quantity: 6, unit: 'GRAM', notes: 'Hoa cúc chi sấy lạnh' },
      { ingredientCode: 'ING_KY_TU', quantity: 8, unit: 'GRAM', notes: 'Kỷ tử đỏ Ninh Hạ' },
      { ingredientCode: 'ING_TAO_DO', quantity: 15, unit: 'GRAM', notes: 'Táo đỏ thái lát mỏng' },
      { ingredientCode: 'ING_HAT_CHIA', quantity: 5, unit: 'GRAM', notes: 'Hạt chia organic ngậm nước' },
    ],
    instructions: [
      { stepNumber: 1, title: 'Tráng hoa cúc & thảo mộc', description: 'Cho hoa cúc, kỷ tử và táo đỏ vào bình thủy tinh, rót 50ml nước sôi 90 độ tráng nhanh rồi đổ đi.', timeInMinutes: 1 },
      { stepNumber: 2, title: 'Hãm trà thảo mộc', description: 'Rót 450ml nước sôi 95 độ C vào bình, đậy nắp hãm kín trong 7 phút để tinh chất hòa quyện.', timeInMinutes: 7 },
      { stepNumber: 3, title: 'Thêm hạt chia hữu cơ', description: 'Cho hạt chia vào bình khuấy nhẹ để hạt chia nở đều tạo cảm giác thanh mát vui miệng.', timeInMinutes: 2 },
      { stepNumber: 4, title: 'Rót ly phục vụ', description: 'Rót trà ra ly giữ nhiệt hoặc ly thủy tinh, có thể dùng nóng thư giãn hoặc thêm đá thanh mát.', timeInMinutes: 1 },
    ],
  },

  // 16. Sữa Hạt Sen Đậu Biếc Hạnh Nhân Tươi
  {
    dishName: 'Sữa Hạt Sen Đậu Biếc Hạnh Nhân Tươi',
    name: 'Công Thức Chuẩn: Sữa Hạt Sen Đậu Biếc Hạnh Nhân',
    description: 'Quy trình nấu sữa hạt tươi bổ não đẹp da với sắc xanh lam hoa đậu biếc tự nhiên',
    prepTimeMinutes: 10,
    cookTimeMinutes: 15,
    servingSize: 1,
    notes: 'Xay lọc kỹ để sữa mịn mượt không còn lợn cợn bã hạt.',
    items: [
      { ingredientCode: 'ING_HAT_SEN', quantity: 50, unit: 'GRAM', notes: 'Hạt sen tươi hấp chín' },
      { ingredientCode: 'ING_HANH_NHAN', quantity: 30, unit: 'GRAM', notes: 'Hạnh nhân ngâm lột vỏ lụa' },
      { ingredientCode: 'ING_HOA_DAU_BIEC', quantity: 4, unit: 'GRAM', notes: 'Hãm lấy nước cốt xanh lam' },
      { ingredientCode: 'ING_DUONG_THOT_NOT', quantity: 15, unit: 'GRAM', notes: 'Đường thốt nốt tạo ngọt nhẹ' },
    ],
    instructions: [
      { stepNumber: 1, title: 'Chiết xuất màu hoa đậu biếc', description: 'Hãm 4g hoa đậu biếc với 100ml nước sôi 90 độ C trong 5 phút để lấy nước cốt màu xanh lam tự nhiên.', timeInMinutes: 5 },
      { stepNumber: 2, title: 'Xay nhuyễn hạt sen & hạnh nhân', description: 'Cho hạt sen hấp mềm và hạnh nhân vào máy xay cùng 350ml nước dừa ấm, xay nhuyễn mịn.', timeInMinutes: 5 },
      { stepNumber: 3, title: 'Lọc và nấu chín sữa', description: 'Lọc qua túi vải mịn, đun nhỏ lửa cùng nước cốt hoa đậu biếc và chút đường thốt nốt trong 5 phút.', timeInMinutes: 5 },
      { stepNumber: 4, title: 'Đóng chai thanh trùng', description: 'Rót sữa hạt vào chai thủy tinh giữ nhiệt, uống ấm buổi sáng hoặc bảo quản mát dùng trong 48 giờ.', timeInMinutes: 2 },
    ],
  },

  // 17. Sinh Tố Bơ Sáp Cải Xoăn Đạm Thực Vật
  {
    dishName: 'Sinh Tố Bơ Sáp Cải Xoăn Đạm Thực Vật',
    name: 'Công Thức Chuẩn: Sinh Tố Bơ Sáp Cải Xoăn Đạm Thực Vật',
    description: 'Công thức sinh tố thể thao giàu đạm xanh và chất chống oxy hóa từ bơ sáp và cải kale',
    prepTimeMinutes: 8,
    cookTimeMinutes: 2,
    servingSize: 1,
    notes: 'Dùng đá viên tinh khiết và uống ngay sau khi xay để giữ trọn vẹn vi chất chống oxy hóa.',
    items: [
      { ingredientCode: 'ING_BO_SAP', quantity: 100, unit: 'GRAM', notes: 'Bơ sáp 034 chín béo dẻo' },
      { ingredientCode: 'ING_KALE', quantity: 40, unit: 'GRAM', notes: 'Cải xoăn kale hữu cơ tươi' },
      { ingredientCode: 'ING_PROTEIN_PEA', quantity: 25, unit: 'GRAM', notes: 'Bột đạm đậu Hà Lan organic' },
      { ingredientCode: 'ING_HAT_CHIA', quantity: 5, unit: 'GRAM', notes: 'Hạt chia rắc mặt ly' },
    ],
    instructions: [
      { stepNumber: 1, title: 'Sơ chế rau củ sạch', description: 'Bơ sáp nạo lấy thịt, cải xoăn kale bỏ cọng cứng ngâm nước muối loãng vẩy ráo.', timeInMinutes: 4 },
      { stepNumber: 2, title: 'Cho vào cối xay sinh tố', description: 'Cho bơ, cải kale, 25g bột đạm đậu Hà Lan, 150ml sữa đậu nành và vài viên đá nhỏ vào cối.', timeInMinutes: 2 },
      { stepNumber: 3, title: 'Xay nhuyễn mịn tốc độ cao', description: 'Xay ở tốc độ cao trong 60 giây đến khi hỗn hợp sinh tố sánh mịn màu xanh ngọc bích.', timeInMinutes: 1 },
      { stepNumber: 4, title: 'Rót ly và rắc hạt chia', description: 'Rót ra ly thủy tinh cao, rắc hạt chia hữu cơ lên trên mặt và thưởng thức ngay.', timeInMinutes: 1 },
    ],
  },
];
