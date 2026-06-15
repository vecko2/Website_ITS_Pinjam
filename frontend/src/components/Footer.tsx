export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-slate-500">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="text-center sm:text-left">
            <p className="text-base font-bold text-[#1A3C6E]">ITSPinjam</p>
            <p className="mt-1">Platform sewa-menyewa barang mahasiswa ITS</p>
          </div>
          <div className="text-center sm:text-right">
            <p>Kontak: info@itspinjam.id</p>
            <p className="mt-1">&copy; 2026 ITSPinjam. Semua hak dilindungi.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
