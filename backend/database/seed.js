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
    // 3. Ambil id kategori
    // ============================
    const [cats] = await db.query("SELECT id, slug FROM categories");
    const catId = (slug) => cats.find((c) => c.slug === slug)?.id || null;

    // ============================
    // 4. Barang contoh
    // Hapus dulu barang lama milik pemilik contoh agar tidak dobel saat seed diulang
    // ============================
    await db.query("DELETE FROM items WHERE owner_id = ?", [ownerId]);

    const items = [
      {
        title: "Sewa Sepeda Gunung Polygon",
        name: "Sepeda Gunung Polygon",
        description: "Sepeda gunung kondisi mulus, cocok untuk keliling kampus atau gowes santai. Sudah termasuk helm.",
        category: "kendaraan",
        prices: [25000, 150000, 500000, null],
        images: ["https://picsum.photos/seed/bike1/600/400", "https://picsum.photos/seed/bike2/600/400"],
        status: "available",
      },
      {
        title: "Sewa Proyektor Epson",
        name: "Proyektor Epson EB-X05",
        description: "Proyektor terang 3300 lumens untuk presentasi, nobar, atau acara himpunan. Termasuk kabel HDMI dan VGA.",
        category: "elektronik",
        prices: [50000, 300000, 1000000, null],
        images: ["https://picsum.photos/seed/proj1/600/400"],
        status: "available",
      },
      {
        title: "Sewa Setrika Philips",
        name: "Setrika Philips",
        description: "Setrika uap kondisi bagus untuk keperluan kos. Hemat dan praktis.",
        category: "rumah-tangga",
        prices: [10000, 50000, 150000, null],
        images: ["https://picsum.photos/seed/iron1/600/400"],
        status: "rented",
      },
      {
        title: "Sewa Bor Listrik Bosch",
        name: "Bor Listrik Bosch",
        description: "Bor listrik untuk keperluan proyek atau tugas praktikum. Lengkap dengan mata bor.",
        category: "alat-teknik",
        prices: [30000, 180000, 600000, null],
        images: ["https://picsum.photos/seed/drill1/600/400"],
        status: "available",
      },
            {
        title: "Sewa Kamera Canon EOS M50",
        name: "Canon EOS M50",
        description: "Kamera mirrorless cocok untuk fotografi dan videografi. Sudah termasuk baterai dan charger.",
        category: "elektronik",
        prices: [75000, 450000, 1500000, null],
        images: [
          "https://picsum.photos/seed/camera1/600/400",
          "https://picsum.photos/seed/camera2/600/400"
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
          "https://picsum.photos/seed/laptop1/600/400",
          "https://picsum.photos/seed/laptop2/600/400"
        ],
        status: "available",
      },

      {
        title: "Sewa Proyektor Epson",
        name: "Proyektor Epson X05",
        description: "Cocok untuk presentasi, seminar, dan nonton bareng.",
        category: "elektronik",
        prices: [60000, 350000, 1200000, null],
        images: [
          "https://picsum.photos/seed/projector1/600/400",
          "https://picsum.photos/seed/projector2/600/400"
        ],
        status: "available",
      },

      {
        title: "Sewa Tenda Camping 4 Orang",
        name: "Tenda Eiger Dome 4P",
        description: "Tenda kapasitas 4 orang, tahan hujan, cocok untuk camping.",
        category: "peralatan",
        prices: [40000, 250000, 800000, null],
        images: [
          "https://picsum.photos/seed/tent1/600/400",
          "https://picsum.photos/seed/tent2/600/400"
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
          "https://picsum.photos/seed/drone1/600/400",
          "https://picsum.photos/seed/drone2/600/400"
        ],
        status: "available",
      },

      {
        title: "Sewa PlayStation 5",
        name: "Sony PlayStation 5",
        description: "PS5 lengkap dengan 2 stik dan beberapa game populer.",
        category: "hiburan",
        prices: [80000, 500000, 1800000, null],
        images: [
          "https://picsum.photos/seed/ps51/600/400",
          "https://picsum.photos/seed/ps52/600/400"
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
          "https://picsum.photos/seed/speaker1/600/400",
          "https://picsum.photos/seed/speaker2/600/400"
        ],
        status: "available",
      },

      {
        title: "Sewa Meja Lipat Event",
        name: "Meja Lipat Portable",
        description: "Meja lipat untuk bazar, seminar, atau acara kampus.",
        category: "furnitur",
        prices: [20000, 120000, 400000, null],
        images: [
          "https://picsum.photos/seed/table1/600/400",
          "https://picsum.photos/seed/table2/600/400"
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
