-- =====================================================
-- DATABASE ITSPinjam
-- Jalankan file ini lewat phpMyAdmin (Import) atau MySQL Workbench
-- =====================================================

CREATE DATABASE IF NOT EXISTS itspinjam
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE itspinjam;

-- =====================================================
-- TABEL categories
-- =====================================================
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- =====================================================
-- TABEL users
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  username VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('peminjam', 'pemilik', 'admin') NOT NULL,
  nrp VARCHAR(20) NULL,
  department VARCHAR(100) NULL,
  angkatan VARCHAR(10) NULL,
  phone VARCHAR(20) NULL,
  address TEXT NULL,
  photo_ktm VARCHAR(255) NULL,
  photo_ktp VARCHAR(255) NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- =====================================================
-- TABEL items
-- =====================================================
CREATE TABLE IF NOT EXISTS items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  owner_id INT NOT NULL,
  category_id INT NULL,
  title VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT NULL,
  price_daily DECIMAL(10,2) NULL,
  price_weekly DECIMAL(10,2) NULL,
  price_monthly DECIMAL(10,2) NULL,
  price_yearly DECIMAL(10,2) NULL,
  images JSON NULL,
  qris_code VARCHAR(255) NULL,
  status ENUM('available', 'rented', 'unavailable') DEFAULT 'available',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- =====================================================
-- TABEL transactions
-- =====================================================
CREATE TABLE IF NOT EXISTS transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  borrower_id INT NOT NULL,
  item_id INT NOT NULL,
  rental_period ENUM('daily', 'weekly', 'monthly', 'yearly') NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  status ENUM('pending', 'confirmed', 'active', 'completed', 'cancelled') DEFAULT 'pending',
  borrower_confirmed BOOLEAN DEFAULT FALSE,
  owner_confirmed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (borrower_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- =====================================================
-- TABEL cart
-- =====================================================
CREATE TABLE IF NOT EXISTS cart (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  item_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- =====================================================
-- TABEL notifications
-- =====================================================
CREATE TABLE IF NOT EXISTS notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type ENUM('transaction', 'reminder', 'system') NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  related_id INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- =====================================================
-- DATA AWAL: kategori barang
-- =====================================================
INSERT INTO categories (name, slug) VALUES
  ('Kendaraan', 'kendaraan'),
  ('Elektronik', 'elektronik'),
  ('Rumah Tangga', 'rumah-tangga'),
  ('Alat Teknik', 'alat-teknik'),
  ('Lainnya', 'lainnya');
