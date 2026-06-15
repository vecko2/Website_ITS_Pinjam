-- Jalankan di phpMyAdmin (pilih database itspinjam -> tab SQL -> tempel -> Go)
-- Menambah kolom batas waktu pembayaran QRIS

USE itspinjam;

ALTER TABLE transactions
  ADD COLUMN payment_deadline DATETIME NULL AFTER status;