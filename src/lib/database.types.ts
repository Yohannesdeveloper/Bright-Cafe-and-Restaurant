export interface Database {
  public: {
    Tables: {
      menu_items: {
        Row: MenuItem;
        Insert: NewMenuItem;
        Update: Partial<NewMenuItem>;
        Relationships: [];
      };
      orders: {
        Row: Order;
        Insert: NewOrder;
        Update: Partial<NewOrder>;
        Relationships: [];
      };
      inventory: {
        Row: InventoryItem;
        Insert: NewInventoryItem;
        Update: Partial<NewInventoryItem>;
        Relationships: [];
      };
      restaurant_tables: {
        Row: RestaurantTable;
        Insert: NewRestaurantTable;
        Update: Partial<NewRestaurantTable>;
        Relationships: [];
      };
      staff: {
        Row: StaffMember;
        Insert: NewStaffMember;
        Update: Partial<NewStaffMember>;
        Relationships: [];
      };
      reviews: {
        Row: Review;
        Insert: NewReview;
        Update: Partial<NewReview>;
        Relationships: [];
      };
      restaurant_settings: {
        Row: RestaurantSettings;
        Insert: NewRestaurantSettings;
        Update: Partial<NewRestaurantSettings>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
}

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  available: boolean;
  rating: number;
  created_at: string;
  updated_at: string;
}

export type NewMenuItem = Omit<MenuItem, 'id' | 'created_at' | 'updated_at'>;

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  customizations: string[];
}

export interface Order {
  id: string;
  customer: string;
  table_number: string;
  items: OrderItem[];
  total: number;
  status: 'confirmed' | 'preparing' | 'ready' | 'served' | 'cancelled';
  notes: string;
  created_at: string;
  updated_at: string;
}

export type NewOrder = Omit<Order, 'created_at' | 'updated_at'>;

export interface InventoryItem {
  id: number;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  min_threshold: number;
  cost: number;
  last_restocked: string;
  created_at: string;
  updated_at: string;
}

export type NewInventoryItem = Omit<InventoryItem, 'id' | 'created_at' | 'updated_at'>;

export interface RestaurantTable {
  id: number;
  number: string;
  capacity: number;
  location: string;
  qr_code: string;
  status: 'available' | 'occupied' | 'reserved';
  created_at: string;
  updated_at: string;
}

export type NewRestaurantTable = Omit<RestaurantTable, 'id' | 'created_at' | 'updated_at'>;

export interface StaffMember {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'manager' | 'chef' | 'waiter' | 'host';
  status: 'active' | 'inactive';
  join_date: string;
  created_at: string;
  updated_at: string;
}

export type NewStaffMember = Omit<StaffMember, 'id' | 'created_at' | 'updated_at'>;

export interface Review {
  id: number;
  customer: string;
  rating: number;
  comment: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
  response: string;
  created_at: string;
  updated_at: string;
}

export type NewReview = Omit<Review, 'id' | 'created_at' | 'updated_at'>;

export interface RestaurantSettings {
  id: number;
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  opening_hours_weekdays: string;
  opening_hours_weekends: string;
  logo: string;
  cover_image: string;
  created_at: string;
  updated_at: string;
}

export type NewRestaurantSettings = Omit<RestaurantSettings, 'id' | 'created_at' | 'updated_at'>;
