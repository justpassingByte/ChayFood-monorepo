import api from '../lib/services/apiClient';

// Types
export interface OrderStats {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  completedOrders: number;
  cancelledOrders: number;
  percentChange: {
    orders: number;
    revenue: number;
    aov: number;
  };
}

export interface CustomerStats {
  totalCustomers: number;
  newCustomers: number;
  repeatCustomers: number;
  percentChange: {
    total: number;
    new: number;
    repeat: number;
  };
}

export interface PopularDish {
  id: string;
  name: string;
  count: number;
  revenue: number;
}

export interface OrderTrend {
  date: string;
  orders: number;
  revenue: number;
}

export interface RegionalOrder {
  region: string;
  count: number;
  revenue: number;
}

interface FilterParams {
  timeRange?: string;
  region?: string;
  category?: string;
  startDate?: string;
  endDate?: string;
}

const prepareParams = (
  timeRange?: string,
  region?: string,
  category?: string,
  startDate?: string | null,
  endDate?: string | null
): FilterParams => {
  const params: FilterParams = {};
  if (timeRange) params.timeRange = timeRange;
  if (region && region !== 'all') params.region = region;
  if (category && category !== 'all') params.category = category;
  if (timeRange === 'custom' && startDate && endDate) {
    params.startDate = startDate;
    params.endDate = endDate;
  }
  return params;
};

export const analyticsService = {
  // Get order statistics
  getOrderStats: async (
    timeRange?: string,
    region?: string,
    category?: string,
    startDate?: string | null,
    endDate?: string | null
  ): Promise<OrderStats> => {
    const params = prepareParams(timeRange, region, category, startDate, endDate);
    try {
      const response = await api.get('/analytics/orders/stats', { params });
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching order statistics:', error);
      throw error;
    }
  },

  // Get customer statistics
  getCustomerStats: async (
    timeRange?: string,
    region?: string,
    startDate?: string | null,
    endDate?: string | null
  ): Promise<CustomerStats> => {
    const params = prepareParams(timeRange, region, undefined, startDate, endDate);
    try {
      const response = await api.get('/analytics/customers/stats', { params });
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching customer statistics:', error);
      throw error;
    }
  },

  // Get popular dishes
  getPopularDishes: async (
    timeRange?: string,
    region?: string,
    category?: string,
    startDateOrLimit?: string | null | number,
    endDate?: string | null
  ): Promise<PopularDish[]> => {
    const limit = typeof startDateOrLimit === 'number' ? startDateOrLimit : 5;
    const startDate = typeof startDateOrLimit === 'string' ? startDateOrLimit : undefined;
    const params: Record<string, string | number> = { limit };
    if (timeRange) params.timeRange = timeRange;
    if (region && region !== 'all') params.region = region;
    if (category && category !== 'all') params.category = category;
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    try {
      const response = await api.get('/analytics/dishes/popular', { params });
      return response.data.data || response.data || [];
    } catch (error) {
      console.error('Error fetching popular dishes:', error);
      return [];
    }
  },

  // Get order trends
  getOrderTrends: async (
    timeRange?: string,
    region?: string,
    category?: string,
    startDate?: string | null,
    endDate?: string | null
  ): Promise<OrderTrend[]> => {
    const params = prepareParams(timeRange, region, category, startDate, endDate);
    try {
      const response = await api.get('/analytics/orders/trends', { params });
      return response.data.data || response.data || [];
    } catch (error) {
      console.error('Error fetching order trends:', error);
      return [];
    }
  },

  // Get regional distribution / orders
  getRegionalDistribution: async (
    timeRange?: string,
    category?: string,
    startDate?: string | null,
    endDate?: string | null
  ): Promise<RegionalOrder[]> => {
    const params = prepareParams(timeRange, undefined, category, startDate, endDate);
    try {
      const response = await api.get('/analytics/orders/regions', { params });
      return response.data.data || response.data || [];
    } catch (error) {
      console.error('Error fetching regional distribution:', error);
      return [];
    }
  },

  getRegionalOrders: async (
    timeRange?: string,
    category?: string,
    startDate?: string | null,
    endDate?: string | null
  ): Promise<RegionalOrder[]> => {
    return analyticsService.getRegionalDistribution(timeRange, category, startDate, endDate);
  },

  isDebugMode: (): boolean => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('analyticsDebugMode') === 'true';
    }
    return false;
  },

  setDebugMode: (enabled: boolean): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('analyticsDebugMode', enabled ? 'true' : 'false');
    }
  },
};