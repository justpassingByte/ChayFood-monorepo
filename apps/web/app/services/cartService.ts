import api from '../lib/services/apiClient';

export const cartService = {
  // Lấy giỏ hàng
  getCart: async () => {
    const response = await api.get('/cart');
    return response.data;
  },

  // Thêm sản phẩm vào giỏ hàng
  addToCart: async (menuItemId: string, quantity: number, notes?: string) => {
    const response = await api.post('/cart/items', { menuItemId, quantity, notes });
    return response.data;
  },

  // Cập nhật sản phẩm trong giỏ hàng
  updateCartItem: async (cartItemId: string, quantity: number, notes?: string) => {
    const response = await api.put(`/cart/items/${cartItemId}`, { quantity, notes });
    return response.data;
  },

  // Xóa sản phẩm khỏi giỏ hàng
  removeFromCart: async (cartItemId: string) => {
    const response = await api.delete(`/cart/items/${cartItemId}`);
    return response.data;
  },

  // Xóa toàn bộ giỏ hàng
  clearCart: async () => {
    const response = await api.delete('/cart');
    return response.data;
  },
};