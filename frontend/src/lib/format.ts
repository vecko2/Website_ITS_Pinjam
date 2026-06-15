// Ubah angka jadi format Rupiah
export function formatRupiah(value: number | null | undefined): string {
  if (value === null || value === undefined) return "-";
  return "Rp " + Number(value).toLocaleString("id-ID");
}

// Ambil URL gambar (dukung URL penuh maupun file dari folder uploads backend)
export function getImageUrl(path: string): string {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${process.env.NEXT_PUBLIC_API_URL}/uploads/${path}`;
}

// Kolom images bisa berupa array atau string JSON, samakan jadi array
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
