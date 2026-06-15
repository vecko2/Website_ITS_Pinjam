export type Role = "peminjam" | "pemilik" | "admin";

export interface User {
  id: number;
  name: string;
  email: string;
  username: string;
  role: Role;
  nrp?: string;
  department?: string;
  phone?: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface Item {
  id: number;
  title: string;
  name: string;
  description: string | null;
  category_id?: number | null;
  price_daily: number | null;
  price_weekly: number | null;
  price_monthly: number | null;
  price_yearly: number | null;
  images: string[] | string | null;
  qris_code?: string | null;
  status: "available" | "rented" | "unavailable";
  category_name?: string;
  category_slug?: string;
  owner_name?: string;
  owner_department?: string;
  owner_phone?: string;
  // tanggal sewa aktif (untuk progress bar di halaman detail)
  active_start?: string | null;
  active_end?: string | null;
}

export interface CartItem {
  cart_id: number;
  id: number;
  title: string;
  name: string;
  images: string[] | string | null;
  status: string;
  price_daily: number | null;
  price_weekly: number | null;
  price_monthly: number | null;
  price_yearly: number | null;
}

export type TransactionStatus =
  | "pending"
  | "confirmed"
  | "active"
  | "completed"
  | "cancelled";

export interface Transaction {
  id: number;
  borrower_id: number;
  item_id: number;
  rental_period: "daily" | "weekly" | "monthly" | "yearly";
  start_date: string;
  end_date: string;
  total_price: number;
  status: TransactionStatus;
  payment_deadline?: string | null;
  borrower_confirmed: number | boolean;
  owner_confirmed: number | boolean;
  item_name?: string;
  item_images?: string[] | string | null;
  qris_code?: string | null;
  owner_name?: string;
  owner_phone?: string;
  borrower_name?: string;
  borrower_phone?: string;
}

export interface Notification {
  id: number;
  user_id: number;
  title: string;
  message: string;
  type: "transaction" | "reminder" | "system";
  is_read: number | boolean;
  related_id?: number | null;
  created_at: string;
}
