import api from '../lib/services/apiClient';

export interface Review {
  _id: string;
  user: {
    _id: string;
    name: string;
    avatar?: string;
  };
  rating: number;
  comment: string;
  date: string;
}

export interface ReviewListResponse {
  reviews: Review[];
  totalReviews: number;
  averageRating: number;
}

export async function getReviewsByMenuItem(menuItemId: string): Promise<ReviewListResponse> {
  try {
    const res = await api.get(`/review/menuitem/${menuItemId}`);
    const data = res.data;
    if (data.success && data.data) {
      return {
        reviews: data.data.reviews || [],
        totalReviews: data.data.totalReviews || 0,
        averageRating: data.data.averageRating || 0,
      };
    }
    return { reviews: [], totalReviews: 0, averageRating: 0 };
  } catch {
    return { reviews: [], totalReviews: 0, averageRating: 0 };
  }
}

export async function getUserReviews(): Promise<Review[]> {
  try {
    const res = await api.get('/review/user');
    const data = res.data;
    if (data.success && data.data) {
      return data.data;
    }
    return [];
  } catch {
    return [];
  }
}

export async function createReview(
  menuItemId: string,
  rating: number,
  comment: string,
  _token?: string | null
): Promise<Review | null> {
  try {
    const res = await api.post(`/review/menuitem/${menuItemId}`, { rating, comment });
    const data = res.data;
    if (data.success && data.data) {
      return data.data;
    }
    return null;
  } catch {
    return null;
  }
}

export async function updateReview(
  reviewId: string,
  rating: number,
  comment: string
): Promise<Review | null> {
  try {
    const res = await api.put(`/review/${reviewId}`, { rating, comment });
    const data = res.data;
    if (data.success && data.data) {
      return data.data;
    }
    return null;
  } catch {
    return null;
  }
}

export async function deleteReview(reviewId: string): Promise<boolean> {
  try {
    const res = await api.delete(`/review/${reviewId}`);
    return res.data.success || false;
  } catch {
    return false;
  }
}