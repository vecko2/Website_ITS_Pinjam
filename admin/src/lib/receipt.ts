import { ManagedTransaction } from "@/types";
import { formatRupiah, formatDate, periodLabels } from "@/lib/format";

const sewaStatus: Record<string, string> = {
  active: "Sedang Disewa",
  completed: "Selesai",
};

export async function generateReceipt(trx: ManagedTransaction) {
  // Import saat dipakai saja (aman untuk Next.js)
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF();

  const today = new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Header
  doc.setFontSize(20);
  doc.setTextColor(26, 60, 110);
  doc.text("ITSPinjam", 20, 22);

  doc.setFontSize(11);
  doc.setTextColor(100, 116, 139);
  doc.text("Bukti Pembayaran Transaksi", 20, 29);

  doc.setDrawColor(226, 232, 240);
  doc.line(20, 34, 190, 34);

  // Info atas
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text(`No. Transaksi: #${trx.id}`, 20, 44);
  doc.text(`Tanggal Cetak: ${today}`, 20, 50);

  doc.setFontSize(12);
  doc.setTextColor(16, 185, 129);
  doc.text("LUNAS", 190, 44, { align: "right" });

  // Detail
  const rows: [string, string][] = [
    ["Penyewa", trx.borrower_name],
    ["Pemilik Barang", trx.owner_name],
    ["Barang", trx.item_name],
    ["Periode Sewa", periodLabels[trx.rental_period] || trx.rental_period],
    ["Tanggal Mulai", formatDate(trx.start_date)],
    ["Tanggal Selesai", formatDate(trx.end_date)],
    ["Status Sewa", sewaStatus[trx.status] || trx.status],
  ];

  let y = 64;
  doc.setFontSize(11);
  rows.forEach(([label, value]) => {
    doc.setTextColor(100, 116, 139);
    doc.text(label, 20, y);
    doc.setTextColor(30, 41, 59);
    doc.text(String(value), 190, y, { align: "right" });
    y += 9;
  });

  // Total
  y += 2;
  doc.setDrawColor(226, 232, 240);
  doc.line(20, y, 190, y);
  y += 10;

  doc.setFontSize(13);
  doc.setTextColor(30, 41, 59);
  doc.text("Total Dibayar", 20, y);
  doc.setTextColor(26, 60, 110);
  doc.setFont("helvetica", "bold");
  doc.text(formatRupiah(trx.total_price), 190, y, { align: "right" });
  doc.setFont("helvetica", "normal");

  // Footer
  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184);
  doc.text(
    "Dokumen ini dicetak otomatis dari panel admin ITSPinjam sebagai bukti pembayaran.",
    20,
    285
  );

  doc.save(`bukti-transaksi-${trx.id}.pdf`);
}