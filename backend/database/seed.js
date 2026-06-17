const bcrypt = require("bcryptjs");
const db = require("./db");

async function seed() {
  try {
    // ============================
    // 1. Akun Admin
    // ============================
    const adminPass = await bcrypt.hash("admin123", 10);
    await db.query(
      `INSERT INTO users (name, email, username, password, role, is_active)
       VALUES (?, ?, ?, ?, 'admin', TRUE)
       ON DUPLICATE KEY UPDATE name = VALUES(name)`,
      ["Admin ITSPinjam", "admin@its.ac.id", "admin", adminPass]
    );

    // ============================
    // 2. Akun Pemilik contoh
    // ============================
    const ownerPass = await bcrypt.hash("owner123", 10);
    await db.query(
      `INSERT INTO users (name, email, username, password, role, nrp, department, angkatan, phone, address, is_active)
       VALUES (?, ?, ?, ?, 'pemilik', ?, ?, ?, ?, ?, TRUE)
       ON DUPLICATE KEY UPDATE name = VALUES(name)`,
      ["Budi Santoso", "budi@its.ac.id", "budi", ownerPass,
       "5025211001", "Teknik Informatika", "2021", "6281234567890", "Keputih, Surabaya"]
    );

    // Ambil id pemilik
    const [ownerRows] = await db.query("SELECT id FROM users WHERE username = 'budi'");
    const ownerId = ownerRows[0].id;

    // ============================
    // 2b. 10 Akun Pemilik tambahan (data lengkap + KTM & KTP)
    // ============================
    const extraOwnerPass = await bcrypt.hash("owner123", 10);

    const extraOwners = [
      { name: "Rizki Hidayat", email: "rizki@its.ac.id", username: "rizki", nrp: "5025211003", department: "Teknik Informatika", angkatan: "2021", phone: "6281111111101", address: "Gebang, Surabaya" },
      { name: "Dewi Lestari", email: "dewi@its.ac.id", username: "dewi", nrp: "5025211004", department: "Sistem Informasi", angkatan: "2022", phone: "6281111111102", address: "Keputih, Surabaya" },
      { name: "Fajar Nugroho", email: "fajar@its.ac.id", username: "fajar", nrp: "5025211005", department: "Teknik Elektro", angkatan: "2021", phone: "6281111111103", address: "Sukolilo, Surabaya" },
      { name: "Citra Permata", email: "citra@its.ac.id", username: "citra", nrp: "5025211006", department: "Teknik Mesin", angkatan: "2022", phone: "6281111111104", address: "Mulyorejo, Surabaya" },
      { name: "Bayu Setiawan", email: "bayu@its.ac.id", username: "bayu", nrp: "5025211007", department: "Teknik Industri", angkatan: "2021", phone: "6281111111105", address: "Klampis, Surabaya" },
      { name: "Putri Anjani", email: "putri@its.ac.id", username: "putri", nrp: "5025211008", department: "Teknik Informatika", angkatan: "2023", phone: "6281111111106", address: "Manyar, Surabaya" },
      { name: "Eko Wibowo", email: "eko@its.ac.id", username: "eko", nrp: "5025211009", department: "Desain Produk", angkatan: "2022", phone: "6281111111107", address: "Nginden, Surabaya" },
      { name: "Sari Wulandari", email: "sari@its.ac.id", username: "sari", nrp: "5025211010", department: "Statistika", angkatan: "2021", phone: "6281111111108", address: "Gunung Anyar, Surabaya" },
      { name: "Hendra Saputra", email: "hendra@its.ac.id", username: "hendra", nrp: "5025211011", department: "Teknik Sipil", angkatan: "2022", phone: "6281111111109", address: "Tambak Sumur, Surabaya" },
      { name: "Maya Anggraini", email: "maya@its.ac.id", username: "maya", nrp: "5025211012", department: "Sistem Informasi", angkatan: "2023", phone: "6281111111110", address: "Gebang Lor, Surabaya" },
    ];

    const extraOwnerIds = [];
    for (const [i, o] of extraOwners.entries()) {
      await db.query(
        `INSERT INTO users (name, email, username, password, role, nrp, department, angkatan, phone, address, photo_ktm, photo_ktp, is_active)
        VALUES (?, ?, ?, ?, 'pemilik', ?, ?, ?, ?, ?, ?, ?, TRUE)
        ON DUPLICATE KEY UPDATE name = VALUES(name)`,
        [
          o.name, o.email, o.username, extraOwnerPass,
          o.nrp, o.department, o.angkatan, o.phone, o.address,
          `https://picsum.photos/seed/ktm${i + 1}/400/250`,
          `https://picsum.photos/seed/ktp${i + 1}/400/250`,
        ]
      );
      const [rows] = await db.query("SELECT id FROM users WHERE username = ?", [o.username]);
      extraOwnerIds.push(rows[0].id);
    }

    // ============================
    // 3. Akun peminjam contoh
    // ============================
    const peminjamPass = await bcrypt.hash("peminjam123", 10);
    await db.query(
      `INSERT INTO users (name, email, username, password, role, nrp, department, angkatan, phone, address, is_active)
      VALUES (?, ?, ?, ?, 'peminjam', ?, ?, ?, ?, ?, TRUE)
      ON DUPLICATE KEY UPDATE name = VALUES(name)`,
      ["Andi Pratama", "andi@its.ac.id", "andi", peminjamPass,
      "5025211002", "Sistem Informasi", "2022", "6289876543210", "Mulyosari, Surabaya"]
    );

    // Ambil id peminjam
    const [peminjamRows] = await db.query("SELECT id FROM users WHERE username = 'andi'");
    const peminjamId = peminjamRows[0].id;

    // ============================
    // 3b. 5 Akun Peminjam tambahan (data lengkap + KTM & KTP)
    // ============================
    const extraPeminjamPass = await bcrypt.hash("peminjam123", 10);

    const extraPeminjams = [
      { name: "Galih Pratama", email: "galih@its.ac.id", username: "galih", nrp: "5025211013", department: "Teknik Informatika", angkatan: "2022", phone: "6282222222201", address: "Keputih, Surabaya" },
      { name: "Nadia Safitri", email: "nadia@its.ac.id", username: "nadia", nrp: "5025211014", department: "Sistem Informasi", angkatan: "2023", phone: "6282222222202", address: "Gebang, Surabaya" },
      { name: "Yusuf Maulana", email: "yusuf@its.ac.id", username: "yusuf", nrp: "5025211015", department: "Teknik Elektro", angkatan: "2021", phone: "6282222222203", address: "Sukolilo, Surabaya" },
      { name: "Intan Permatasari", email: "intan@its.ac.id", username: "intan", nrp: "5025211016", department: "Teknik Mesin", angkatan: "2022", phone: "6282222222204", address: "Mulyorejo, Surabaya" },
      { name: "Doni Firmansyah", email: "doni@its.ac.id", username: "doni", nrp: "5025211017", department: "Teknik Industri", angkatan: "2023", phone: "6282222222205", address: "Manyar, Surabaya" },
    ];

    const extraPeminjamIds = [];
    for (const [i, p] of extraPeminjams.entries()) {
      await db.query(
        `INSERT INTO users (name, email, username, password, role, nrp, department, angkatan, phone, address, photo_ktm, photo_ktp, is_active)
        VALUES (?, ?, ?, ?, 'peminjam', ?, ?, ?, ?, ?, ?, ?, TRUE)
        ON DUPLICATE KEY UPDATE name = VALUES(name)`,
        [
          p.name, p.email, p.username, extraPeminjamPass,
          p.nrp, p.department, p.angkatan, p.phone, p.address,
          `https://picsum.photos/seed/ktm-peminjam${i + 1}/400/250`,
          `https://picsum.photos/seed/ktp-peminjam${i + 1}/400/250`,
        ]
      );
      const [rows] = await db.query("SELECT id FROM users WHERE username = ?", [p.username]);
      extraPeminjamIds.push(rows[0].id);
    }

    // ============================
    // 4. Ambil id kategori
    // ============================
    const [cats] = await db.query("SELECT id, slug FROM categories");
    const catId = (slug) => cats.find((c) => c.slug === slug)?.id || null;

    // ============================
    // 5. Barang contoh
    // Hapus dulu barang lama milik pemilik contoh agar tidak dobel saat seed diulang
    // ============================
    await db.query("DELETE FROM items WHERE owner_id = ?", [ownerId]);

    const items = [
      // ===== Kendaraan =====
      {
        title: "Sewa Sepeda Lipat Element",
        name: "Sepeda Lipat Element",
        description: "Sepeda lipat praktis dibawa kemana-mana, cocok untuk mobilitas di area kos.",
        category: "kendaraan",
        prices: [20000, 120000, 400000, null],
        images: [
          `https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcTAjZ3HGApfQLFCc4Vd_W_4B6U1iRVZfqc0mPKpn6s47vta7crM_ur4XdfCEfPW`,
        ],
        status: "available",
      },
      {
        title: "Sewa Sepeda Listrik Pacific",
        name: "Sepeda Listrik Pacific",
        description: "Sepeda listrik hemat tenaga, jarak tempuh hingga 40km, cocok untuk mobilitas kampus.",
        category: "kendaraan",
        prices: [35000, 200000, 700000, null],
        images: [
          `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYpWsPDU-QfayHoX0AjhInPxLyiKlC-IkTE2g4qmmP-nCuww6xfwEAaHzlfyPC`,
        ],
        status: "rented",
      },
      {
        title: "Sewa Skuter Listrik Xiaomi",
        name: "Skuter Listrik Xiaomi Mi Pro 2",
        description: "Skuter listrik lipat, ringan dan cocok untuk mobilitas dalam kampus.",
        category: "kendaraan",
        prices: [30000, 180000, 600000, null],
        images: [
          `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmbvIjcIPpFtgVo5zFykCmCqwodgaGq-XOK8FZzPP17voWS41c_llYZWWRQLNp`,
        ],
        status: "available",
      },
      {
        title: "Sewa Motor Matic Honda Beat",
        name: "Motor Matic Honda Beat",
        description: "Motor matic irit BBM, surat lengkap, cocok untuk kebutuhan harian.",
        category: "kendaraan",
        prices: [50000, 300000, 1000000, null],
        images: [
          `https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcR2iSwqKv6NYzyx9xg_I2eDtwoPq1OfY6xGhGyWMtx55MI1_dIXgG5ZE5oZOM9L`,
        ],
        status: "available",
      },
      {
        title: "Sewa Gokart Mini Anak",
        name: "Gokart Mini Anak",
        description: "Gokart mini untuk acara ulang tahun, bazar, atau acara anak-anak.",
        category: "kendaraan",
        prices: [40000, 250000, 800000, null],
        images: [
          `https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcTG19_AMy9O-2hh3eSYshpZ_-LmScmOGZhAig6_DHlXgAHPobHIDmwcB_HNJ5jR`,
        ],
        status: "available",
      },
      {
        title: "Sewa Sepeda Balap Road Bike",
        name: "Sepeda Balap Road Bike United",
        description: "Sepeda balap ringan untuk latihan road bike atau gowes jarak jauh.",
        category: "kendaraan",
        prices: [30000, 180000, 600000, null],
        images: [
          `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNo9kv3ZPPUjK6fti1bBlSFxkUlqLXvmRI8o-9Dx6KrccCiSBCQnP8UzyiPZb1`,
        ],
        status: "available",
      },
      {
        title: "Sewa Skateboard Listrik",
        name: "Skateboard Listrik Boosted Board",
        description: "Skateboard listrik untuk mobilitas santai di area kampus.",
        category: "kendaraan",
        prices: [25000, 150000, 500000, null],
        images: [
          `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3W8Ccg_2Q0OONzjkrX4NifSJXEV88KSkfXGgwi2BX07egUKDP8bVxgKu_WN_s`,
        ],
        status: "available",
      },

      // ===== Elektronik =====
      {
        title: "Sewa Proyektor Epson EB-X05",
        name: "Proyektor Epson EB-X05",
        description: "Proyektor terang 3300 lumens untuk presentasi, nobar, atau acara himpunan. Termasuk kabel HDMI dan VGA.",
        category: "elektronik",
        prices: [50000, 300000, 1000000, null],
        images: [
          `https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcRE3LujdA0Q3Yvt3VuV3s3gzi9XNGyQ_jgYxmby7UIvyI0HR59lRQ7ltHmFI_18`,
        ],
        status: "available",
      },
      {
        title: "Sewa Laptop ASUS Vivobook",
        name: "ASUS Vivobook 14",
        description: "Laptop untuk coding, desain ringan, dan tugas kuliah. RAM 8GB SSD 512GB.",
        category: "elektronik",
        prices: [50000, 300000, 1000000, null],
        images: [
          `https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcSOgoSXgUwfqWE5XSBiWfXDTKkDxL8f7uLXyLhXLLVhTZOJH2OvmwaOYHSIRvO9`,
        ],
        status: "available",
      },
      {
        title: "Sewa Kamera Canon EOS M50",
        name: "Canon EOS M50",
        description: "Kamera mirrorless cocok untuk fotografi dan videografi. Sudah termasuk baterai dan charger.",
        category: "elektronik",
        prices: [75000, 450000, 1500000, null],
        images: [
          `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSpeo1wJXEMWM5cvuNZkifHoSye_v5ouwcKO0PqZ7-t-n3e6FkfUmXv_txbnIvu`,
        ],
        status: "available",
      },
      {
        title: "Sewa Drone DJI Mini 3",
        name: "DJI Mini 3",
        description: "Drone ringan dengan kamera 4K untuk kebutuhan foto dan video udara.",
        category: "elektronik",
        prices: [150000, 900000, 3000000, null],
        images: [
          `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSG6rci8tmz2zrnVzlE8z1ks7MpSdmJt58j1rBLxE2TqCe8RNokkWwqIiYSza4Z`,
        ],
        status: "available",
      },
      {
        title: "Sewa Speaker Bluetooth JBL",
        name: "JBL Charge 5",
        description: "Speaker portable dengan suara jernih dan baterai tahan lama.",
        category: "elektronik",
        prices: [30000, 180000, 600000, null],
        images: [
          `https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcRAyHZDbcVjJAVZwWxmYDQVbz5mqPGvdFJuALeGHOr1O5hnm0DBNH_UdXKaqTqR`,
        ],
        status: "available",
      },
      {
        title: "Sewa Speaker Bluetooth Sony",
        name: "Sony SRS-XB43",
        description: "Speaker bass kuat cocok untuk acara outdoor kampus.",
        category: "elektronik",
        prices: [35000, 200000, 700000, null],
        images: [
          `https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcTxCmLdLEgROp7ySuyJm-gsa2PjbM9wAJjglFx4MdDLZ81ebL5XnjmFb3wsjcLR`,
        ],
        status: "available",
      },
      {
        title: "Sewa PlayStation 5",
        name: "Sony PlayStation 5",
        description: "PS5 lengkap dengan 2 stik dan beberapa game populer.",
        category: "elektronik",
        prices: [80000, 500000, 1800000, null],
        images: [
          `https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQAs6YrLs1KoYZTa-beMA0yKvU1lknabDVo0dpr5YRDB0onbJdMR9sexfWQU70A`,
        ],
        status: "rented",
      },
      {
        title: "Sewa Nintendo Switch OLED",
        name: "Nintendo Switch OLED",
        description: "Konsol portable cocok untuk hiburan bersama teman kos.",
        category: "elektronik",
        prices: [60000, 350000, 1200000, null],
        images: [
          `https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQFvrL131A_FlGqq2eULUciCdHLH6pBuTrTe47fYw8SKUGrbM2Ai3vWk0jyJv54`,
        ],
        status: "available",
      },
      {
        title: "Sewa Smartphone Samsung A54",
        name: "Samsung Galaxy A54",
        description: "HP untuk kebutuhan dokumentasi acara atau backup device.",
        category: "elektronik",
        prices: [40000, 250000, 800000, null],
        images: [
          `https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcTv8Jwl4cglcqVsWLLgP9enPciiOwsldqnxfD0sl1taQ1om4AkBAP8FbdY_SzwN`,
        ],
        status: "available",
      },
      {
        title: "Sewa Tablet iPad 9th Gen",
        name: "iPad 9th Generation",
        description: "Tablet untuk presentasi, desain digital, atau catatan kuliah.",
        category: "elektronik",
        prices: [45000, 270000, 900000, null],
        images: [
          `https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcSfDfF92haxXYMsUuAsvwUqqoJT_UNvouAcWfxGnUOCVz8OiCYmnNrQ06CGonmw`,
        ],
        status: "available",
      },
      {
        title: "Sewa Printer Epson L3110",
        name: "Printer Epson L3110",
        description: "Printer untuk cetak tugas, skripsi, dan dokumen kuliah.",
        category: "elektronik",
        prices: [25000, 150000, 500000, null],
        images: [
          `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_jkStvye1w7YYYdnwNA4zooAwKCAWtmyLhAAz5dRfIuMoyLpQkvB2_B-CJNV6`,
        ],
        status: "available",
      },
      {
        title: "Sewa Mic Kondensor BM800",
        name: "Mic Kondensor BM800",
        description: "Microphone untuk rekaman vokal, podcast, atau presentasi online.",
        category: "elektronik",
        prices: [20000, 120000, 400000, null],
        images: [
          `https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQ-XYs1RuF5XDymlk16IW5zMxQdasKYuIozo8wIXLie0wOE2xFJs-2r5Jvbvt6S`,
        ],
        status: "available",
      },
      {
        title: "Sewa Lampu Studio Softbox",
        name: "Lampu Studio Softbox",
        description: "Lighting kit untuk foto produk, video, atau live streaming.",
        category: "elektronik",
        prices: [25000, 150000, 500000, null],
        images: [
          `https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcS_mOtZImfav_X46G6Jv3FmRAtLaAL_QF7YBOWfaMLUIx13orGqfc_AL-2gbEQp`,
        ],
        status: "available",
      },
      {
        title: "Sewa Mixer Audio Behringer",
        name: "Mixer Audio Behringer Xenyx",
        description: "Mixer audio untuk acara himpunan atau live music kecil.",
        category: "elektronik",
        prices: [40000, 240000, 800000, null],
        images: [
          `https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcS7lm1OuU65tO4_Dcpul65n7NZshvQ6chN5Wc6PvYGk-pzBmW5Hm-G24-_U5Mzd`,
        ],
        status: "available",
      },
      {
        title: "Sewa Monitor LED LG 24 Inch",
        name: "Monitor LED LG 24 Inch",
        description: "Monitor tambahan untuk kerja multitasking atau gaming.",
        category: "elektronik",
        prices: [25000, 150000, 500000, null],
        images: [
          `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcStsF0sVNGnZ0FHSaWQMImGOAWw077QK2OeR2hETMSN0J7uGXQnq-oTnofpHgRz`,
        ],
        status: "available",
      },
      {
        title: "Sewa Headset Gaming HyperX",
        name: "HyperX Cloud",
        description: "Headset untuk gaming atau meeting online dengan suara jernih.",
        category: "elektronik",
        prices: [15000, 90000, 300000, null],
        images: [
          `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpjcRkaPq797jHJSmb84sDzPufTOeYOspm1-vohGgzz4JOGXHh6molh7RgLOfS`,
        ],
        status: "available",
      },

      // ===== Rumah Tangga =====
      {
        title: "Sewa Setrika Philips",
        name: "Setrika Philips",
        description: "Setrika uap kondisi bagus untuk keperluan kos. Hemat dan praktis.",
        category: "rumah-tangga",
        prices: [10000, 50000, 150000, null],
        images: [
          `https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcSMwkOiborDP99TCtKFdVOy1Lz_KLMiFuoFfG987BIobQ7x2MYAZILdffrhcrOU`,
        ],
        status: "available",
      },
      {
        title: "Sewa Rice Cooker Miyako",
        name: "Rice Cooker Miyako",
        description: "Rice cooker untuk masak nasi harian di kos.",
        category: "rumah-tangga",
        prices: [12000, 60000, 180000, null],
        images: [
          `https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcSCNn2q6Nd-lkRwRDb0j-Q6IEwkbO1yW0jAY3Dg05oCc7Altjzwl4ZjDY_zP_sM`,
        ],
        status: "available",
      },
      {
        title: "Sewa Vacuum Cleaner Electrolux",
        name: "Vacuum Cleaner Electrolux",
        description: "Vacuum cleaner untuk bersih-bersih kos atau kontrakan.",
        category: "rumah-tangga",
        prices: [20000, 100000, 350000, null],
        images: [
          `https://images.openai.com/static-rsc-4/3vstQ25kT85zkFkJQ6M-2gK8K78Eb5DcSH52-97gt86sTFWO51_P6SSfIlqwxHGarD1TEMb7NZUzR7xGzWRX6omwSsIEOC0pSGFxJVaVB06TPfnbYdH0Vc9FQFo6iCOO6Abz-FkIN3quu-pr-16AeyKbEnC1G9ILfNseH1q96MwSJcybMPaLySt66WFY7dda?purpose=fullsize`,
        ],
        status: "available",
      },
      {
        title: "Sewa Dispenser Air Sanken",
        name: "Dispenser Air Sanken",
        description: "Dispenser panas dingin untuk kebutuhan air minum harian.",
        category: "rumah-tangga",
        prices: [15000, 80000, 250000, null],
        images: [
          `https://images.openai.com/static-rsc-4/xWbGy3LS3J8W1hrGgrsYJJm6ZjoCiyiQfPWbz9im_IcUGJccOfj0obZmx1WHh2xFkmEreuJFkfE7tmrNW_NTyNFIM9gHNDLH-Zdp-RvHTlRgdYEChDs6WWgboJT7mjtkHOB6RAbNinvwevvY9e5voq6HRklekC8dbxw5ZxVTOUi2z4J6rtqy0WBCkiM-uiE1?purpose=fullsize`,
        ],
        status: "available",
      },
      {
        title: "Sewa Kompor Gas Portable",
        name: "Kompor Gas Portable Rinnai",
        description: "Kompor portable untuk masak praktis di kos.",
        category: "rumah-tangga",
        prices: [12000, 60000, 200000, null],
        images: [
          `https://images.openai.com/static-rsc-4/xqq1_1PwRGV-uYGaZScDzni1xj2P4EMBhL5GjmP7rWmAeCvKGT-g1WsbUl_W9WpsVucIGR_MOqfDDeLpZZk160CNzuq6A20lulUrct9Ynozcu5e3mY5-QeUHRICMGPXc7z5payruHdo4cJP5QJIBriLXU1coAPWjDPpDB17hNn69VrOqlYdOVb5_rbDY4qvA?purpose=fullsize`,
        ],
        status: "available",
      },
      {
        title: "Sewa Blender Philips",
        name: "Blender Philips",
        description: "Blender untuk membuat jus atau smoothie sehari-hari.",
        category: "rumah-tangga",
        prices: [8000, 40000, 130000, null],
        images: [
          `https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcSpQsDSI42pnZZvHm0pN2e1TL9qgHWBO6Pqj-6Y38C1WmKoaKbfST-yvwOX7T_7`,
        ],
        status: "rented",
      },
      {
        title: "Sewa Kipas Angin Maspion",
        name: "Kipas Angin Maspion",
        description: "Kipas angin untuk kebutuhan musim panas di kos.",
        category: "rumah-tangga",
        prices: [8000, 40000, 130000, null],
        images: [
          `https://images.openai.com/static-rsc-4/w3ca6HNWBmThRsyrGzKjpm0f-yDmCJhNdsT8jatwqxoVj-HnkOGE68poA2T1bLc3SbyABhHQyqUcKTmNPXU-xMaWO4Gigd2ZAUHlb2JOXzyEtoHDCt5HgZxgklxypm3VDe0yFnlURbc2w37g_Bdy0sb23-NJOkbOiiiMXxkG2d7eQ454lGJlNc-qgNxEvpjY?purpose=fullsize`,
        ],
        status: "available",
      },
      {
        title: "Sewa Water Heater Portable",
        name: "Water Heater Portable Ariston",
        description: "Pemanas air portable untuk mandi air hangat.",
        category: "rumah-tangga",
        prices: [15000, 80000, 250000, null],
        images: [
          `https://images.openai.com/static-rsc-4/UqFqnQ7KX3B801d5Xj0b9B_mW9Mc9-a9TZVHKOotJZJ4ky1sBMPTXyjAtxN_R-0FLDZdWbje_O5V6fc65dSys7OjJQUFUIIXwrUJcxoSA9Zlfdt0qBxn7LMZxw2WSnARQJGg6hXqboBqrKxcz76Dv_n2x5aife1uzQrNgudD1YhhdJz0H8d9yrwK9ItvdNHb?purpose=fullsize`,
        ],
        status: "available",
      },
      {
        title: "Sewa Mesin Cuci Mini Portable",
        name: "Mesin Cuci Mini Portable",
        description: "Mesin cuci mini cocok untuk kos dengan ruang terbatas.",
        category: "rumah-tangga",
        prices: [20000, 110000, 380000, null],
        images: [
          `https://images.openai.com/static-rsc-4/sMTCfCyV3YwT22_75KnsZObBngZh9wGEXHPENGM8e3Q3K3gysySTPx-OKAvtcjnfjBr2x3WDfS26KXGI0JWPTJFDv8R4BFq8Tve-2JSSGojVgP2FKmktmadIgAHS99z9wCXIu9_nClrtdXlK33UufukI26T2kWi4ZULR4vlxRwxVmfupbk7XD_OpRikJH3rZ?purpose=fullsize`,
        ],
        status: "available",
      },
      {
        title: "Sewa Air Fryer Philips",
        name: "Air Fryer Philips",
        description: "Air fryer untuk masak praktis tanpa minyak berlebih.",
        category: "rumah-tangga",
        prices: [15000, 80000, 260000, null],
        images: [
          `https://images.openai.com/static-rsc-4/0yIEicEEj71xRjTmSA4dmCMFuZ4gXQnNcFM9SLgeMw6tRRjPIQFP5LPCSPKhpHj7GcMcAfXF4QgkQ2s3LlajLT9JRJu8oiZ7sQlTaP7rWjBe-0aExKDukDe0vTZK0f-TgXLwQQhkO6g_qS83OsTVn7SxNmwP0dLjJ4pmYEnBpqM97exPlo_wwqlKqW1Mmhnk?purpose=fullsize`,
        ],
        status: "available",
      },

      // ===== Alat Teknik =====
      {
        title: "Sewa Bor Listrik Bosch",
        name: "Bor Listrik Bosch",
        description: "Bor listrik untuk keperluan proyek atau tugas praktikum. Lengkap dengan mata bor.",
        category: "alat-teknik",
        prices: [30000, 180000, 600000, null],
        images: [
          `https://images.openai.com/static-rsc-4/Pwxga3K0HsZKgbTui9oClSZ2nnbyyCei-kV0YkxRA8GFvZwxnPBRL-AZ5gRkdfWOfR1CsSXsfzERH499WBmOB8sP7Y3OxYRrcpzhKaPGckbpOVVo3Yv6epdrUjj0wWSzWAGL5TgdNYhIIHPb5ClzC5Q7SLuACiw_Cw3Wq14avB8?purpose=inline`,
        ],
        status: "available",
      },
      {
        title: "Sewa Gerinda Tangan Makita",
        name: "Gerinda Tangan Makita",
        description: "Gerinda untuk memotong atau menghaluskan material proyek.",
        category: "alat-teknik",
        prices: [35000, 200000, 650000, null],
        images: [
          `https://images.openai.com/static-rsc-4/2ZtCXmcxOzsQhUb98Jgnin2KcwkuITmsyGRNc06tqIbHZ4fcsiJT50ludRFpDXhfRC3j5FI0FumeEN2mYGZKze-L36qvcmGCppsnO8695R54cQWBVbUxiqVcvAmDjEvITONuIq4LYhBaHWbIfVreD-UN_WkOljs6wieKjwkM4ZM?purpose=inline`,
        ],
        status: "available",
      },
      {
        title: "Sewa Mesin Las Mini Lakoni",
        name: "Mesin Las Mini Lakoni",
        description: "Mesin las portable untuk keperluan proyek teknik mesin.",
        category: "alat-teknik",
        prices: [40000, 240000, 800000, null],
        images: [
          `https://images.openai.com/static-rsc-4/hi8oREXaj-P4jGlCy6Q9umw2XE1WDgJSd8yYdLjMXVUOd05UhMA2EN8_4fG3WJv2q2ob221K06LcyIJy1ynfhkQsKKmssqmFmbWaHYhXBnuczyPr62kVoLSbGmqM933LUCw3g-rThPeexueO2_QgQlJsti7Ir7gUcrpM7sUejS4?purpose=inline`,
        ],
        status: "available",
      },
      {
        title: "Sewa Obeng Set Elektrik",
        name: "Obeng Set Elektrik Xiaomi",
        description: "Obeng elektrik untuk perakitan alat elektronik atau furnitur.",
        category: "alat-teknik",
        prices: [15000, 90000, 300000, null],
        images: [
          `https://images.openai.com/static-rsc-4/dp9dMT7iYzcm_K4MzHDWxXVJQqrPMz6zqVIlgAqM7h6leEtrPW9Z8-Sxg_1Uu_Ml2voCyDODrwZliBKk6xkvq2SgKT_X9RNe6JtWMpdhwC_PFfJ4eqNCt6-4uErAhQbGBgLgdQE-l1gU4eCurfkyu1w3p0gTxo8T4rRpesf3-rwkZaPExI7M1osOu8ucQkob?purpose=fullsize`,
        ],
        status: "available",
      },
      {
        title: "Sewa Multimeter Digital Sanwa",
        name: "Multimeter Digital Sanwa",
        description: "Multimeter untuk pengukuran rangkaian listrik tugas praktikum.",
        category: "alat-teknik",
        prices: [10000, 60000, 200000, null],
        images: [
          `https://images.openai.com/static-rsc-4/OWNZxpw4gnXRiN5S1sgw8KOdkRhttwjqFGc-38lyrIbnA2c9ns-qnT-eZGzF3d_wvS9HXW6nnVSJxD7gRJ96_-TaOQj1y-K2S0t5EsYHJEJ_eoZ9XDrIJZ-iMQ71w3BRj4OTyCdzkPH4-BnQviX8gZruAwmfSAgwVAYK2UJKqLU?purpose=inline`,
        ],
        status: "available",
      },
      {
        title: "Sewa Soldering Station Quick",
        name: "Soldering Station Quick",
        description: "Alat solder untuk merakit PCB atau proyek elektronika.",
        category: "alat-teknik",
        prices: [12000, 70000, 230000, null],
        images: [
          `https://images.unsplash.com/photo-1518770660439-4636190af475?w=800`,
        ],
        status: "available",
      },
      {
        title: "Sewa Gergaji Listrik Bosch",
        name: "Gergaji Listrik Bosch",
        description: "Gergaji listrik untuk memotong kayu proyek tugas akhir.",
        category: "alat-teknik",
        prices: [35000, 200000, 650000, null],
        images: [
          `https://images.openai.com/static-rsc-4/u_yE9hOrbAEXhVyGh3t0Lz_nQ9aF4PtOy2yHtn8xEH2EyfY4yS-31dlTdPXxg47duMEy3-FDTMnjtuF0FcQkME2d0S2gggTtRU3JnqwdKj0-qNfWpJB6ccCFSDvrE7ewdPAkoHfoI3_-ZE_dtX9HlfCsfyEpAiJD-ldzVAO-cnvAijClQLDm_ysoKWiSz36e?purpose=inline`,
        ],
        status: "available",
      },
      {
        title: "Sewa Kompresor Mini Portable",
        name: "Kompresor Mini Portable",
        description: "Kompresor angin portable untuk keperluan bengkel kecil.",
        category: "alat-teknik",
        prices: [30000, 180000, 600000, null],
        images: [
          `https://images.openai.com/static-rsc-4/7AIl3y_UP7op7WjbNFBdmCDO9IE722mYO1g5CuDOcjXR6mhDNW-WGkn_tENPR0DOBvmovQSM8tiFxJO5_NLEoJnKeeUHCW-BIcA2gAEGXxkG1jsMqUDDNPvkR-plPrKTJIJ7APoHvQdjPAhsDEGey8jKA6sVWYbOOZEpuc5VfEVEdT9lz417EcxTXtQsuxwi?purpose=fullsize`,
        ],
        status: "available",
      },

      // ===== Lainnya =====
      {
        title: "Sewa Tenda Camping 4 Orang",
        name: "Tenda Eiger Dome 4P",
        description: "Tenda kapasitas 4 orang, tahan hujan, cocok untuk camping.",
        category: "lainnya",
        prices: [40000, 250000, 800000, null],
        images: [
          `https://images.openai.com/static-rsc-4/7B21t69-RxdA_gtgkJKUVk9a5MaxYYwVPapAcLc2xMjZff3NRADJyIdpFMKhSDr2DHn-smy-eYo563o0F6n2hZcVCg4cLsuHu8HDdU9aajwF7o3VHP2M-czQyKa7rKtKkRZjZ3Yy4GmhTuBBXH1VA9rW6szv-AGBRUjjZG9AOqM?purpose=inline`,
        ],
        status: "available",
      },
      {
        title: "Sewa Ransel Carrier 60L",
        name: "Ransel Carrier Consina 60L",
        description: "Ransel carrier untuk pendakian atau camping jarak jauh.",
        category: "lainnya",
        prices: [25000, 150000, 500000, null],
        images: [
          `https://images.openai.com/static-rsc-4/hcD2h-fDTZvrem-q-bq6_QkPmmM_DHjydv8zCM9L_Y87z5Foluj_HWhJYQdUMamF3MGW_B29737ST0rT6EWRlfV0pgD7joEJHGy9t_smLCuiq8WGjZLTVPhKXjEzX-tnzdIt_glgF7W7DVvgAstLQrjgrQuqub8caOHFf-rD4iN8MmtAV6ZBH4GcJuc34b2g?purpose=fullsize`,
        ],
        status: "available",
      },
      {
        title: "Sewa Sleeping Bag Eiger",
        name: "Sleeping Bag Eiger",
        description: "Sleeping bag hangat untuk camping di area pegunungan.",
        category: "lainnya",
        prices: [15000, 90000, 300000, null],
        images: [
          `https://images.openai.com/static-rsc-4/G1UCceAo7HG8r8keyD8JUHDi8uAR1hDqKxNh-c_eJUZv3nCB3yzYJdkZueUNiQRRQfi4i9iUwk5LUSYW1sJfB9xk0T5vWfTFtKkvEak-PwcRL-Ypfs-MsP6u1ZZ2vnCk1V0yCCKxeu_mmkelj51u0rXar9Gu3PCWjSvG3OPMg4fIGPQxYnKtUAnkq64Jksy2?purpose=fullsize`,
        ],
        status: "available",
      },
      {
        title: "Sewa Kompor Camping Portable",
        name: "Kompor Camping Portable",
        description: "Kompor portable untuk masak saat camping atau pendakian.",
        category: "lainnya",
        prices: [12000, 70000, 230000, null],
        images: [
          `https://images.openai.com/static-rsc-4/Rz_aRvDZdzxnW--RRS7YKh1HfkDEoVx7hjeJ618Najxsq_ZG0YP0wIOgWUPxSYwHPSPuHORm1Oc58hk-yHzy158k1a8NBo4t_lnTxHRhiT4PBKgY99LXI059cv7s6s9c-UoG5E76i5nPdxdSlf_M5ech4xWMCmaBNjRDxf_VnzKssUznn1C63iai2_UsAXDu?purpose=fullsize`,
        ],
        status: "rented",
      },
      {
        title: "Sewa Meja Lipat Event",
        name: "Meja Lipat Portable",
        description: "Meja lipat untuk bazar, seminar, atau acara kampus.",
        category: "lainnya",
        prices: [20000, 120000, 400000, null],
        images: [
          `https://images.openai.com/static-rsc-4/dfRDFRKnC_2DkkKreehk0LfZWkQlhrg0U48hnawlAj9DswXJ2x_2ntu0vu2mUVjecLJUsJstddzuNzsgUUFIarI1pHpad28-9Xql6dtHaZgT7R2Mu4pan_FySsG1V7ihBxvBT_TjZl4XuMNQUoKX8egLjsS62922uObUopRpafA?purpose=inline`,
        ],
        status: "available",
      },
      {
        title: "Sewa Kursi Lipat Camping",
        name: "Kursi Lipat Camping",
        description: "Kursi lipat ringan untuk acara outdoor atau camping.",
        category: "lainnya",
        prices: [10000, 60000, 200000, null],
        images: [
          `https://images.openai.com/static-rsc-4/asZ9GO7_CaR3lYQOwI6213YPsvvprC81PHMdTDclE-gedRfPfKCU5PNWXVVRgkfgvGtGRyBx3bNx4i9BlPu8KhCSbfcYuviGxdYH2Lx8wtOngphxuYmscnE45z54AHkudvpVCtz7F13impdAooKAMZpnpSUcfkxYdCbWrd691YI?purpose=inline`,
        ],
        status: "available",
      },
      {
        title: "Sewa Jas Hujan Set",
        name: "Jas Hujan Set",
        description: "Jas hujan set untuk perjalanan motor saat musim hujan.",
        category: "lainnya",
        prices: [8000, 40000, 130000, null],
        images: [
          `https://images.openai.com/static-rsc-4/zdoDPQGNdTdDut2PAGUIYNm_Kg8Prcs3YVfihStPJro6PYTe-BVsIMWvaFbiczXmzQOHi5boyFUY19x4faPJUEJD1W7Try2XybSCiQQoqaZQrBDayIX_acs6KEHCXgUk9eVdt1gss1BtjImfn5kNxV7Fok6gfuN1Xc5dGgpugYY?purpose=inline`,
        ],
        status: "available",
      },
      {
        title: "Sewa Sepatu Hiking Eiger",
        name: "Sepatu Hiking Eiger",
        description: "Sepatu hiking untuk kegiatan pendakian atau outdoor.",
        category: "lainnya",
        prices: [20000, 120000, 400000, null],
        images: [
          `https://images.openai.com/static-rsc-4/i4-ZG8prU3tPk4tu8sSDkFHmW0yPaMCNSuqfOqd2N8bB36hsHlWWTAwdtZbxltFVUg11qeoyc8NdWF77KynH8WmElhSWyDPTduzeHV6Igmxh-vdZ6iRq3ycStCRViLyAIESCJBu4YOyDOT9F3meS4Qyt_yh3CeEVOFoZ_VGAfGUnLisZ4qP11JvV1XuaagcI?purpose=fullsize`,
        ],
        status: "available",
      },
      {
        title: "Sewa Payung Golf Besar",
        name: "Payung Golf Besar",
        description: "Payung golf besar untuk acara outdoor atau hujan deras.",
        category: "lainnya",
        prices: [10000, 60000, 200000, null],
        images: [
          `https://images.openai.com/static-rsc-4/Ebr8Dl2-wCdtU30W8V0lgz030-GtN_NHKOMmxLyRAc7vOVeQbFcEZOAC11ZdO8lEW62-SUgsCVNtTu7RzsIsUdCmnO0Ra1_UobM6u6Fu0Kr-pyofXC_rN-vyl8zsWY3_Zr_Szmm2BQzPXHyoRU2Bi5IZMZnNtjYadn5wdunhQ4g?purpose=inline`,
        ],
        status: "available",
      },
      {
        title: "Sewa Cooler Box Lion Star",
        name: "Cooler Box Lion Star",
        description: "Cooler box untuk menyimpan makanan dan minuman tetap dingin saat acara.",
        category: "lainnya",
        prices: [15000, 90000, 300000, null],
        images: [
          `https://images.openai.com/static-rsc-4/jMLWzzFdcK_KlofCF6cfoAX2fCBD56fkrNFiVdrETpzytHT5L-R8kVHgDJS0dHSMF9bBnrsHc4w3bF7HP0g9MWMYXM6Y-akV4gJTalvAa0R6jB2GLzXBAbXLMYxhZiQ_L4t-gB4k95TiVmKsw3-EKXZZAWP_HmFKVyFJYYq5_8c?purpose=inline`,
        ],
        status: "available",
      },
      {
        title: "Sewa Megaphone Toa",
        name: "Megaphone Toa",
        description: "Megaphone untuk acara orasi, ospek, atau kegiatan lapangan.",
        category: "lainnya",
        prices: [20000, 120000, 400000, null],
        images: [
          `https://images.openai.com/static-rsc-4/HxPLyzcNHCdvkR25aMdSr5VOs42J3FW77Ful-tYHecFDon8iteV20K6q_zjycdJChXGpypPNOLnn5huzS4v2dRbsiirWZmtyV4R1m4JDC5aZ2tAXuiLtxLiwgOq_g4LYBIu4SztXAP4HLaLBvkBIujKzCPw3r60SW0CL19Ya8FA?purpose=inline`,
        ],
        status: "available",
      },
      {
        title: "Sewa Easel Lukisan Kayu",
        name: "Easel Lukisan Kayu",
        description: "Easel kayu untuk kegiatan melukis atau pameran seni kampus.",
        category: "lainnya",
        prices: [12000, 70000, 230000, null],
        images: [
          `https://images.openai.com/static-rsc-4/SZHsK3s63vgk3CtXHJnwBVqD4wsQGBBVITeCww8i5hX-XOvoS1DK_Eh8o0O_gjwtuGfPFeL46ZVCJ4iQCXVTB-O8CtOnjIRvyX_cG7Agq6zeQ3YftG5cyYKWwpbFBlAEAqaKgMeykOWygnmNifasePSMJ1CdzlMnOVZ7vbkRAKwa6Br6FlSt3riktsNnzM6J?purpose=fullsize`,
        ],
        status: "available",
      },
      {
        title: "Sewa Alat Pancing Set",
        name: "Alat Pancing Set Lengkap",
        description: "Set alat pancing lengkap untuk kegiatan memancing santai.",
        category: "lainnya",
        prices: [20000, 120000, 400000, null],
        images: [
          `https://images.openai.com/static-rsc-4/bQqKS2DKKkcNlRjITJxkUohtJKrkaN-hZNj_dolF1aDLmC7W_HQpqmCKtlS-YPJNwDYpGX6sfVfUmlf6-18WEPJIVGO8M0UYw0vtEtmJAlr5-dhTaUDcL5N1jnwzSRZ-cXW5KRCfMpLr6UOh-8oytmaZrSsMNftaGV7j4UfhWQ4?purpose=inline`,
        ],
        status: "available",
      },
      {
        title: "Sewa Papan Catur Besar Outdoor",
        name: "Papan Catur Besar Outdoor",
        description: "Papan catur ukuran besar untuk acara outdoor atau lomba kampus.",
        category: "lainnya",
        prices: [15000, 90000, 300000, null],
        images: [
          `https://images.openai.com/static-rsc-4/octYeAxJG5ABCEfqQpw25QdieA-r47YIKtI-v0dAIQYJ57v1zB1Mzw_7_pmQxH_4Ubmu7CxTTHfOqynhJuWs68_QGVOTZb8qJd43GwcXGcIWLqSsK1N6rarwAK3kTuHbeYKaWPSnot4TIHQ3Np0ZY1wCT1oB4UJHZRCnXsJdH2qP2Kbatoils8-hwJ1H70Vl?purpose=inline`,
        ],
        status: "available",
      },
      {
        title: "Sewa Matras Yoga Premium",
        name: "Matras Yoga Premium",
        description: "Matras yoga empuk untuk olahraga ringan atau yoga di kos.",
        category: "lainnya",
        prices: [8000, 45000, 150000, null],
        images: [
          `https://images.openai.com/static-rsc-4/4mmx6p6ys14Q8Rb2EpWdpIY3ZA5ebyHwgbCvQO34WTi2zFMFt2wIDpvsWuV7qyork_ffDrsVlSb6_xiTpW1Fq3PVu5jKvYoON1EJvAWWoSgYo4OIYq7evRfDDTcf-kE_FvVEMt3BNBenXltlHwTV_3nn95jet7GqBzB8W9t107Q?purpose=inline`,
        ],
        status: "available",
      },
      {
        title: "Sewa Dumbbell Set 10kg",
        name: "Dumbbell Set 10kg",
        description: "Dumbbell set untuk latihan kekuatan di kos atau kontrakan.",
        category: "lainnya",
        prices: [15000, 90000, 300000, null],
        images: [
          `https://images.openai.com/static-rsc-4/6q8EVCKAN0m2LS6U9vY45gYKEi1WmnGkxeby_bgU6h55owxfQHlTXfoKtVWXwbs3NmSSIHti8jVx6igKZUICBt2ATTt07V6x3Yq30LPA6ss4GiCNQL9UrsS9iCeg3FR291W0L4fUym4upy73G9LricBmlVpebfaUhmIOMqpVv_sOlwXuYMHvw23gu4LCoYSH?purpose=fullsize`,
        ],
        status: "available",
      },
    ];

    for (const it of items) {
      await db.query(
        `INSERT INTO items
          (owner_id, category_id, title, name, description, price_daily, price_weekly, price_monthly, price_yearly, images, status, is_active)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, TRUE)`,
        [
          ownerId, catId(it.category), it.title, it.name, it.description,
          it.prices[0], it.prices[1], it.prices[2], it.prices[3],
          JSON.stringify(it.images), it.status,
        ]
      );
    }

    console.log("Seed berhasil!");
    console.log("  Admin   -> username: admin, password: admin123");
    console.log("  Pemilik -> username: budi,  password: owner123");
    console.log("  Peminjam -> username: andi,  password: peminjam123");
    console.log(`  ${items.length} barang contoh ditambahkan.`);
    process.exit(0);
  } catch (err) {
    console.error("Seed gagal:", err.message);
    process.exit(1);
  }
}

seed();
