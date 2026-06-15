// Format angka jadi Rupiah
export function formatRupiah(value: number | null | undefined): string {
  if (value === null || value === undefined) return "-";
  return "Rp " + Number(value).toLocaleString("id-ID");
}

// URL gambar (dukung URL penuh atau file dari folder uploads backend)
export function getImageUrl(path: string): string {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${process.env.NEXT_PUBLIC_API_URL}/uploads/${path}`;
}

// Samakan kolom images jadi array
export function parseImages(images: unknown): string[] {
  if (!images) return [];
  if (Array.isArray(images)) return images as string[];
  if (typeof images === "string") {
    try {
      const parsed = JSON.parse(images);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

// Format tanggal "14 Jun 2026"
export function formatDate(dateStr: string): string {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

// Label periode
export const periodLabels: Record<string, string> = {
  daily: "Harian",
  weekly: "Mingguan",
  monthly: "Bulanan",
  yearly: "Tahunan",
};
