import apiClient from "./apiClient";

export const userService = {
  // Profile
  async getProfile() {
    const res = await apiClient.get("/user/profile/full");
    return res.data;
  },
  async updateProfile(data: Record<string, unknown> | FormData) {
    const res = await apiClient.put("/user/profile", data);
    return res.data;
  },

  // Addresses
  async getAddresses() {
    const res = await apiClient.get("/user/addresses");
    return res.data;
  },
  async addAddress(data: Record<string, unknown>) {
    const res = await apiClient.post("/user/addresses", data);
    return res.data;
  },
  async updateAddress(addressId: string, data: Record<string, unknown>) {
    const res = await apiClient.put(`/user/addresses/${addressId}`, data);
    return res.data;
  },
  async deleteAddress(addressId: string) {
    const res = await apiClient.delete(`/user/addresses/${addressId}`);
    return res.data;
  },
  // Dietary Preferences & Macros
  async updatePreference(data: {
    maxCalories?: number;
    minProtein?: number;
    dislikedIngredients?: string[];
    favoriteCategories?: string[];
    dietaryRestrictions?: string[];
  }) {
    const res = await apiClient.put("/user/preference", data);
    return res.data;
  },

  // Security
  async changePassword(data: { currentPassword: string; newPassword: string }) {
    const res = await apiClient.put("/user/password", data);
    return res.data;
  },
}; 