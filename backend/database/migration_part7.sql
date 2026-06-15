-- Jalankan di phpMyAdmin (pilih database itspinjam -> tab SQL -> tempel -> Go)
-- Menambah kolom status verifikasi user

USE itspinjam;

ALTER TABLE users
  ADD COLUMN is_verified BOOLEAN DEFAULT FALSE AFTER is_active;
