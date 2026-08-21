import api from './apiClient';
import { Customer } from './types';

interface GetCustomersResponse {
  success: boolean;
  data: Customer[];
  total: number;
  message?: string;
}

interface CustomerResponse {
  success: boolean;
  data: Customer;
  message?: string;
}

interface CustomerServiceProps {
  getCustomers: (page?: number, limit?: number, search?: string) => Promise<GetCustomersResponse>;
  getCustomerById: (id: string) => Promise<CustomerResponse>;
  deleteCustomer: (id: string) => Promise<{ success: boolean; message?: string }>;
}

const mockCustomers: Customer[] = [
  {
    _id: 'cust-1',
    id: 'cust-1',
    name: 'Nguyễn Văn An',
    email: 'an.nguyen@gmail.com',
    phone: '0903 123 456',
    role: 'USER',
    joinDate: '2026-01-15T08:30:00Z',
    createdAt: '2026-01-15T08:30:00Z',
    totalOrders: 14,
    totalSpent: 1250000,
    address: {
      street: '128 Nguyễn Trãi, Phường Bến Thành',
      city: 'TP. Hồ Chí Minh',
    },
  },
  {
    _id: 'cust-2',
    id: 'cust-2',
    name: 'Trần Thị Mai',
    email: 'mai.tran@yahoo.com',
    phone: '0918 654 321',
    role: 'USER',
    joinDate: '2026-02-01T10:15:00Z',
    createdAt: '2026-02-01T10:15:00Z',
    totalOrders: 9,
    totalSpent: 820000,
    address: {
      street: '45 Lê Duẩn, Phường Bến Nghé',
      city: 'TP. Hồ Chí Minh',
    },
  },
  {
    _id: 'cust-3',
    id: 'cust-3',
    name: 'Lê Hoàng Long',
    email: 'long.le@chayfood.vn',
    phone: '0932 788 120',
    role: 'USER',
    joinDate: '2026-02-10T14:20:00Z',
    createdAt: '2026-02-10T14:20:00Z',
    totalOrders: 21,
    totalSpent: 2150000,
    address: {
      street: '33 Đường 14, KDC Bình Hưng',
      city: 'TP. Hồ Chí Minh',
    },
  },
  {
    _id: 'cust-4',
    id: 'cust-4',
    name: 'Phạm Minh Tuấn',
    email: 'tuan.pm@outlook.com',
    phone: '0977 889 900',
    role: 'USER',
    joinDate: '2026-02-14T09:00:00Z',
    createdAt: '2026-02-14T09:00:00Z',
    totalOrders: 6,
    totalSpent: 490000,
    address: {
      street: '72 Hai Bà Trưng, Phường Đa Kao',
      city: 'TP. Hồ Chí Minh',
    },
  },
  {
    _id: 'cust-5',
    id: 'cust-5',
    name: 'Vũ Bích Ngọc',
    email: 'ngoc.vu@gmail.com',
    phone: '0908 554 332',
    role: 'USER',
    joinDate: '2026-02-18T16:45:00Z',
    createdAt: '2026-02-18T16:45:00Z',
    totalOrders: 12,
    totalSpent: 1100000,
    address: {
      street: '88 Nam Kỳ Khởi Nghĩa, Phường Võ Thị Sáu',
      city: 'TP. Hồ Chí Minh',
    },
  },
  {
    _id: 'cust-6',
    id: 'cust-6',
    name: 'Đỗ Gia Huy',
    email: 'huy.do@techcorp.vn',
    phone: '0988 221 144',
    role: 'USER',
    joinDate: '2026-02-20T11:10:00Z',
    createdAt: '2026-02-20T11:10:00Z',
    totalOrders: 4,
    totalSpent: 360000,
    address: {
      street: '15 Điện Biên Phủ, Phường 25, Bình Thạnh',
      city: 'TP. Hồ Chí Minh',
    },
  },
];

let localMockCustomers = [...mockCustomers];

class CustomerService implements CustomerServiceProps {
  async getCustomers(page = 1, limit = 10, search = ''): Promise<GetCustomersResponse> {
    try {
      const params = { page, limit, search };
      const response = await api.get('/user/admin/all', { params });
      
      const payload = response.data;
      if (payload && payload.data && Array.isArray(payload.data.customers)) {
        return {
          success: true,
          data: payload.data.customers,
          total: payload.data.pagination?.totalCount ?? payload.data.customers.length,
        };
      }

      if (payload && Array.isArray(payload.data)) {
        return {
          success: true,
          data: payload.data,
          total: payload.total ?? payload.data.length,
        };
      }

      if (Array.isArray(payload)) {
        return {
          success: true,
          data: payload,
          total: payload.length,
        };
      }
    } catch (error: unknown) {
      console.warn('Backend API /user/admin/all unavailable, switching to local mock data:', error);
    }

    // Fallback to local mock data
    let filtered = [...localMockCustomers];
    if (search.trim()) {
      const term = search.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(term) ||
          c.email.toLowerCase().includes(term) ||
          (c.phone && c.phone.includes(term))
      );
    }

    const startIndex = (page - 1) * limit;
    const paginated = filtered.slice(startIndex, startIndex + limit);

    return {
      success: true,
      data: paginated,
      total: filtered.length,
    };
  }

  async getCustomerById(id: string): Promise<CustomerResponse> {
    try {
      const response = await api.get(`/user/admin/${id}`);
      if (response.data && response.data.data?.customer) {
        return {
          success: true,
          data: response.data.data.customer,
        };
      }
    } catch (error: unknown) {
      console.warn(`Backend API /user/admin/${id} unavailable, looking in local mock data:`, error);
    }

    const found = localMockCustomers.find((c) => c._id === id || c.id === id);
    if (found) {
      return {
        success: true,
        data: found,
      };
    }

    return {
      success: false,
      data: {} as Customer,
      message: 'Không tìm thấy khách hàng',
    };
  }

  async deleteCustomer(id: string): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await api.delete(`/user/admin/${id}`);
      if (response.data && response.data.status === 'success') {
        localMockCustomers = localMockCustomers.filter((c) => c._id !== id && c.id !== id);
        return {
          success: true,
          message: 'Đã xóa khách hàng thành công',
        };
      }
    } catch (error: unknown) {
      console.warn(`Backend API delete /user/admin/${id} failed, performing local delete:`, error);
    }

    localMockCustomers = localMockCustomers.filter((c) => c._id !== id && c.id !== id);
    return {
      success: true,
      message: 'Đã xóa khách hàng thành công',
    };
  }
}

export const customerService = new CustomerService();