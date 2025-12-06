// API Types and Interfaces

// Authentication Types
export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role?: string;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
}

// Category Types
export interface Category {
  id: string;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
}

// Product Types
export interface ProductImage {
  url: string;
  alt?: string;
}

export interface ProductVariant {
  name: string;
  value: string;
  stock: number;
  sku: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  comparePrice?: number;
  category: string | Category;
  images: ProductImage[];
  variants?: ProductVariant[];
  stock: number;
  tags?: string[];
  isFeatured?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  comparePrice?: number;
  category: string;
  images: ProductImage[];
  variants?: ProductVariant[];
  stock: number;
  tags?: string[];
  isFeatured?: boolean;
}

export interface UpdateProductRequest {
  name?: string;
  description?: string;
  price?: number;
  comparePrice?: number;
  stock?: number;
  isFeatured?: boolean;
}

export interface ProductQueryParams {
  page?: number;
  limit?: number;
  sort?: string;
  category?: string;
  search?: string;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Order Types
export interface OrderItem {
  product: string;
  quantity: number;
  price: number;
  variant?: {
    name: string;
    value: string;
  };
}

export interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  landmark?: string;
}

export interface DeliveryZone {
  zone: string;
  cost: number;
}

export interface CreateOrderRequest {
  items: OrderItem[];
  customerInfo: CustomerInfo;
  shippingAddress: ShippingAddress;
  deliveryZone: DeliveryZone;
  paymentMethod: string;
  notes?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  items: OrderItem[];
  customerInfo: CustomerInfo;
  shippingAddress: ShippingAddress;
  deliveryZone: DeliveryZone;
  paymentMethod: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateOrderStatusRequest {
  status: Order['status'];
  note?: string;
}

export interface CancelOrderRequest {
  reason: string;
}

// Booking Types
export interface TimeSlot {
  start: string;
  end: string;
}

export interface Artist {
  type: string;
  name: string;
}

export interface CreateBookingRequest {
  service: string;
  artist: Artist;
  location: string;
  appointmentDate: string;
  timeSlot: TimeSlot;
  notes?: string;
}

export interface Booking {
  id: string;
  service: string;
  artist: Artist;
  location: string;
  appointmentDate: string;
  timeSlot: TimeSlot;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CancelBookingRequest {
  reason: string;
}

export interface AvailabilityQueryParams {
  date: string;
  location: string;
  artistType: string;
}

export interface AvailabilityResponse {
  available: boolean;
  availableSlots?: TimeSlot[];
}

// API Error Response
export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}



