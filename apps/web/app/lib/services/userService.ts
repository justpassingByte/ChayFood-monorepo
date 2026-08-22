import apiClient from "./apiClient";
import type {
  UpdateProfileDto,
  AddressDto,
  UserPreferenceDto,
  ChangePasswordDto,
} from "@chayfood/shared-types";

export const userService = {
  // Profile
  async getProfile() {
    const res = await apiClient.get("/user/profile/full");
    return res.data;
  },
  async updateProfile(data: UpdateProfileDto | FormData) {
    const res = await apiClient.put("/user/profile", data);
    return res.data;
  },

  // Addresses
  async getAddresses() {
    const res = await apiClient.get("/user/addresses");
    return res.data;
  },
  async addAddress(data: AddressDto) {
    const res = await apiClient.post("/user/addresses", data);
    return res.data;
  },
  async updateAddress(addressId: string, data: AddressDto) {
    const res = await apiClient.put(`/user/addresses/${addressId}`, data);
    return res.data;
  },
  async deleteAddress(addressId: string) {
    const res = await apiClient.delete(`/user/addresses/${addressId}`);
    return res.data;
  },

  // Dietary Preferences & Macros
  async updatePreference(data: UserPreferenceDto) {
    const res = await apiClient.put("/user/preference", data);
    return res.data;
  },

  // Security
  async changePassword(data: ChangePasswordDto) {
    const res = await apiClient.put("/user/password", data);
    return res.data;
  },
}; 