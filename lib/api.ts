// API Client for Lulu Artistry Backend
import type {
  RegisterRequest,
  LoginRequest,
  AuthResponse,
  User,
  UpdateProfileRequest,
  Category,
  CreateCategoryRequest,
  Product,
  CreateProductRequest,
  UpdateProductRequest,
  ProductQueryParams,
  ProductsResponse,
  Order,
  CreateOrderRequest,
  UpdateOrderStatusRequest,
  CancelOrderRequest,
  Booking,
  CreateBookingRequest,
  CancelBookingRequest,
  AvailabilityQueryParams,
  AvailabilityResponse,
  ApiError,
} from './types';

// Base API configuration
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'luluartistry-backend.onrender.com/';

// Helper function to get auth token
const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
};

// Helper function to set auth token
const setAuthToken = (token: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('token', token);
};

// Helper function to remove auth token
const removeAuthToken = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('token');
};

// Generic API request handler
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error: ApiError = await response.json().catch(() => ({
      message: response.statusText || 'An error occurred',
    }));
    throw error;
  }

  return response.json();
}

// ============================================
// AUTHENTICATION ENDPOINTS
// ============================================

export const authApi = {
  /**
   * Register a new user
   */
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await apiRequest<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    if (response.token) {
      setAuthToken(response.token);
    }
    
    return response;
  },

  /**
   * Login user
   */
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await apiRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    if (response.token) {
      setAuthToken(response.token);
    }
    
    return response;
  },

  /**
   * Get current authenticated user
   */
  async getCurrentUser(): Promise<User> {
    return apiRequest<User>('/auth/me', {
      method: 'GET',
    });
  },

  /**
   * Update user profile
   */
  async updateProfile(data: UpdateProfileRequest): Promise<User> {
    return apiRequest<User>('/auth/update-profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  /**
   * Request password reset
   */
  async forgotPassword(email: string): Promise<{ message: string }> {
    return apiRequest<{ message: string }>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  /**
   * Logout user
   */
  async logout(): Promise<{ message: string }> {
    const response = await apiRequest<{ message: string }>('/auth/logout', {
      method: 'GET',
    });
    
    removeAuthToken();
    
    return response;
  },

  /**
   * Social login - initiates OAuth flow
   * Note: This redirects to backend OAuth endpoint
   * Backend should handle the OAuth callback and redirect back with token
   */
  async socialLogin(provider: 'google' | 'facebook'): Promise<void> {
    // This will redirect to backend OAuth endpoint
    // Backend should redirect to OAuth provider, then handle callback
    window.location.href = `${BASE_URL}/auth/${provider}`;
  },
};

// ============================================
// CATEGORIES ENDPOINTS
// ============================================

export const categoriesApi = {
  /**
   * Get all categories
   */
  async getAll(): Promise<Category[]> {
    return apiRequest<Category[]>('/categories', {
      method: 'GET',
    });
  },

  /**
   * Get single category by ID
   */
  async getSingle(id: string): Promise<Category> {
    return apiRequest<Category>(`/categories/${id}`, {
      method: 'GET',
    });
  },

  /**
   * Create a new category (Admin only)
   */
  async create(data: CreateCategoryRequest): Promise<Category> {
    return apiRequest<Category>('/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Update category (Admin only)
   */
  async update(id: string, data: CreateCategoryRequest): Promise<Category> {
    return apiRequest<Category>(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
};

// ============================================
// PRODUCTS ENDPOINTS
// ============================================

export const productsApi = {
  /**
   * Get all products with optional filters
   */
  async getAll(params?: ProductQueryParams): Promise<ProductsResponse> {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.sort) queryParams.append('sort', params.sort);
    if (params?.category) queryParams.append('category', params.category);
    if (params?.search) queryParams.append('search', params.search);

    const queryString = queryParams.toString();
    const endpoint = `/products${queryString ? `?${queryString}` : ''}`;

    return apiRequest<ProductsResponse>(endpoint, {
      method: 'GET',
    });
  },

  /**
   * Get single product by ID
   */
  async getSingle(id: string): Promise<Product> {
    return apiRequest<Product>(`/products/${id}`, {
      method: 'GET',
    });
  },

  /**
   * Get all featured products
   */
  async getFeatured(): Promise<Product[]> {
    return apiRequest<Product[]>('/products/featured/all', {
      method: 'GET',
    });
  },

  /**
   * Get products by category
   */
  async getByCategory(categoryId: string): Promise<Product[]> {
    return apiRequest<Product[]>(`/products/category/${categoryId}`, {
      method: 'GET',
    });
  },

  /**
   * Create a new product (Admin only)
   */
  async create(data: CreateProductRequest): Promise<Product> {
    return apiRequest<Product>('/products', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Update product (Admin only)
   */
  async update(id: string, data: UpdateProductRequest): Promise<Product> {
    return apiRequest<Product>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  /**
   * Delete product (Admin only)
   */
  async delete(id: string): Promise<{ message: string }> {
    return apiRequest<{ message: string }>(`/products/${id}`, {
      method: 'DELETE',
    });
  },
};

// ============================================
// ORDERS ENDPOINTS
// ============================================

export const ordersApi = {
  /**
   * Create a new order
   */
  async create(data: CreateOrderRequest): Promise<Order> {
    return apiRequest<Order>('/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Get user's orders
   */
  async getUserOrders(): Promise<Order[]> {
    return apiRequest<Order[]>('/orders', {
      method: 'GET',
    });
  },

  /**
   * Get single order by ID
   */
  async getSingle(id: string): Promise<Order> {
    return apiRequest<Order>(`/orders/${id}`, {
      method: 'GET',
    });
  },

  /**
   * Cancel an order
   */
  async cancel(id: string, data: CancelOrderRequest): Promise<Order> {
    return apiRequest<Order>(`/orders/${id}/cancel`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  /**
   * Get all orders (Admin only)
   */
  async getAllAdmin(params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<ProductsResponse & { orders: Order[] }> {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.status) queryParams.append('status', params.status);

    const queryString = queryParams.toString();
    const endpoint = `/orders/admin/all${queryString ? `?${queryString}` : ''}`;

    return apiRequest<ProductsResponse & { orders: Order[] }>(endpoint, {
      method: 'GET',
    });
  },

  /**
   * Update order status (Admin only)
   */
  async updateStatus(
    id: string,
    data: UpdateOrderStatusRequest
  ): Promise<Order> {
    return apiRequest<Order>(`/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
};

// ============================================
// BOOKINGS ENDPOINTS
// ============================================

export const bookingsApi = {
  /**
   * Check booking availability
   */
  async checkAvailability(
    params: AvailabilityQueryParams
  ): Promise<AvailabilityResponse> {
    const queryParams = new URLSearchParams();
    queryParams.append('date', params.date);
    queryParams.append('location', params.location);
    queryParams.append('artistType', params.artistType);

    const endpoint = `/bookings/availability?${queryParams.toString()}`;

    return apiRequest<AvailabilityResponse>(endpoint, {
      method: 'GET',
    });
  },

  /**
   * Create a new booking
   */
  async create(data: CreateBookingRequest): Promise<Booking> {
    return apiRequest<Booking>('/bookings', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Get user's bookings
   */
  async getUserBookings(): Promise<Booking[]> {
    return apiRequest<Booking[]>('/bookings', {
      method: 'GET',
    });
  },

  /**
   * Get single booking by ID
   */
  async getSingle(id: string): Promise<Booking> {
    return apiRequest<Booking>(`/bookings/${id}`, {
      method: 'GET',
    });
  },

  /**
   * Cancel a booking
   */
  async cancel(id: string, data: CancelBookingRequest): Promise<Booking> {
    return apiRequest<Booking>(`/bookings/${id}/cancel`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
};

// ============================================
// HEALTH CHECK ENDPOINT
// ============================================

export const healthApi = {
  /**
   * Health check endpoint
   */
  async check(): Promise<{ status: string; message?: string }> {
    return apiRequest<{ status: string; message?: string }>('/health', {
      method: 'GET',
    });
  },
};

// Export all APIs as a single object for convenience
export const api = {
  auth: authApi,
  categories: categoriesApi,
  products: productsApi,
  orders: ordersApi,
  bookings: bookingsApi,
  health: healthApi,
};

// Export helper functions
export { getAuthToken, setAuthToken, removeAuthToken };

// Social Login Helper
export const socialLogin = {
	/**
	 * Initiate social login (Google/Facebook)
	 * This redirects to backend OAuth endpoint
	 */
	initiate(provider: 'google' | 'facebook'): void {
		const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
		const redirectUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback?provider=${provider}`;
		window.location.href = `${baseUrl}/auth/${provider}?redirect=${encodeURIComponent(redirectUrl)}`;
	}
};

