export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface Stats {
  users: number;
  items: number;
  activeTransactions: number;
  totalTransactions: number;
}

export interface ManagedUser {
  id: number;
  name: string;
  email: string;
  username: string;
  role: string;
  nrp?: string;
  department?: string;
  phone?: string;
  photo_ktm?: string;
  photo_ktp?: string;
  is_active: number;
  is_verified: number;
  created_at: string;
}

export interface ManagedItem {
  id: number;
  name: string;
  title: string;
  images: string[] | string | null;
  status: string;
  is_active: number;
  price_daily: number | null;
  category_name?: string;
  owner_name: string;
}

export interface ManagedTransaction {
  id: number;
  rental_period: "daily" | "weekly" | "monthly" | "yearly";
  start_date: string;
  end_date: string;
  total_price: number;
  status: string;
  item_name: string;
  borrower_name: string;
  owner_name: string;
}
