// Label periode dalam bahasa Indonesia
export const periodLabels: Record<string, string> = {
  daily: "Harian",
  weekly: "Mingguan",
  monthly: "Bulanan",
  yearly: "Tahunan",
};

// Satuan periode
export const periodUnit: Record<string, string> = {
  daily: "hari",
  weekly: "minggu",
  monthly: "bulan",
  yearly: "tahun",
};

// Hitung tanggal selesai dari tanggal mulai + periode + jumlah
export function calcEndDate(startDate: string, period: string, quantity: number): string {
  if (!startDate) return "";
  const end = new Date(startDate);
  if (period === "daily") end.setDate(end.getDate() + quantity);
  else if (period === "weekly") end.setDate(end.getDate() + quantity * 7);
  else if (period === "monthly") end.setMonth(end.getMonth() + quantity);
  else if (period === "yearly") end.setFullYear(end.getFullYear() + quantity);
  return end.toISOString().split("T")[0];
}

// Format tanggal jadi "14 Jun 2026"
export function formatDate(dateStr: string): string {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

// Persentase masa sewa yang sudah berjalan (0 - 100)
export function calcProgress(startDate: string, endDate: string): number {
  if (!startDate || !endDate) return 0;
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  const now = Date.now();
  if (now <= start) return 0;
  if (now >= end) return 100;
  return Math.round(((now - start) / (end - start)) * 100);
}

// Sisa detik menuju deadline (untuk countdown pembayaran)
export function remainingSeconds(deadline: string): number {
  if (!deadline) return 0;
  const diff = new Date(deadline).getTime() - Date.now();
  return Math.max(0, Math.floor(diff / 1000));
}

// Format detik jadi "mm:ss"
export function formatCountdown(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}
