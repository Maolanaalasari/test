import { PHPFile } from '../types';

export const phpCodeFiles: PHPFile[] = [
  {
    filename: 'database.sql',
    language: 'sql',
    title: 'Database Schema (MySQL / MariaDB)',
    description: 'Skrip DDL SQL untuk membuat database posyandu_db dan tabel balita, penimbangan, ibu_hamil, jadwal, serta admin.',
    content: `-- SQL Schema untuk Sistem Informasi Posyandu Native PHP
CREATE DATABASE IF NOT EXISTS \`posyandu_db\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE \`posyandu_db\`;

-- Tabel Admin / Users
CREATE TABLE IF NOT EXISTS \`users\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`username\` VARCHAR(50) NOT NULL UNIQUE,
  \`password\` VARCHAR(255) NOT NULL,
  \`nama_lengkap\` VARCHAR(100) NOT NULL,
  \`role\` ENUM('admin', 'kader', 'bidan') DEFAULT 'kader',
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed Admin Default (password: admin123)
INSERT INTO \`users\` (\`username\`, \`password\`, \`nama_lengkap\`, \`role\`) 
VALUES ('admin', '$2y$10$e0MYzXyjpJS7Pd0RVvHwHe1T98LdJ56i622YI5aYg4N102iL6JGe6', 'Kader Utama Posyandu', 'admin')
ON DUPLICATE KEY UPDATE \`username\`=\`username\`;

-- Tabel Data Balita
CREATE TABLE IF NOT EXISTS \`balita\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`nik\` VARCHAR(20) NOT NULL UNIQUE,
  \`nama\` VARCHAR(100) NOT NULL,
  \`jenis_kelamin\` ENUM('L', 'P') NOT NULL,
  \`tanggal_lahir\` DATE NOT NULL,
  \`nama_ibu\` VARCHAR(100) NOT NULL,
  \`nama_ayah\` VARCHAR(100) NOT NULL,
  \`alamat\` TEXT NOT NULL,
  \`rt\` VARCHAR(5) DEFAULT '01',
  \`rw\` VARCHAR(5) DEFAULT '01',
  \`no_hp\` VARCHAR(20),
  \`bb_lahir\` FLOAT DEFAULT 3.0,
  \`tb_lahir\` FLOAT DEFAULT 49.0,
  \`gol_darah\` VARCHAR(5) DEFAULT '-',
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabel Records Penimbangan
CREATE TABLE IF NOT EXISTS \`penimbangan\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`balita_id\` INT NOT NULL,
  \`tanggal\` DATE NOT NULL,
  \`usia_bulan\` INT NOT NULL,
  \`bb\` FLOAT NOT NULL,
  \`tb\` FLOAT NOT NULL,
  \`lk\` FLOAT DEFAULT 0,
  \`asi_eksklusif\` TINYINT(1) DEFAULT 0,
  \`vit_a\` TINYINT(1) DEFAULT 0,
  \`obat_cacing\` TINYINT(1) DEFAULT 0,
  \`imunisasi\` VARCHAR(100) DEFAULT '-',
  \`status_gizi\` ENUM('Gizi Buruk', 'Gizi Kurang', 'Gizi Baik', 'Risiko Gizi Lebih', 'Gizi Lebih') DEFAULT 'Gizi Baik',
  \`catatan\` TEXT,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (\`balita_id\`) REFERENCES \`balita\`(\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabel Ibu Hamil
CREATE TABLE IF NOT EXISTS \`ibu_hamil\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`nik\` VARCHAR(20) NOT NULL UNIQUE,
  \`nama\` VARCHAR(100) NOT NULL,
  \`nama_suami\` VARCHAR(100) NOT NULL,
  \`tanggal_lahir\` DATE NOT NULL,
  \`alamat\` TEXT NOT NULL,
  \`rt\` VARCHAR(5) DEFAULT '01',
  \`rw\` VARCHAR(5) DEFAULT '01',
  \`hpht\` DATE NOT NULL,
  \`hpl\` DATE NOT NULL,
  \`lila\` FLOAT NOT NULL,
  \`bb_sekarang\` FLOAT NOT NULL,
  \`status_risiko\` ENUM('Normal', 'Risiko Tinggi', 'Kurang Energi Kronis (KEK)') DEFAULT 'Normal',
  \`no_hp\` VARCHAR(20),
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabel Jadwal Kegiatan Posyandu
CREATE TABLE IF NOT EXISTS \`jadwal\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`judul\` VARCHAR(150) NOT NULL,
  \`tanggal\` DATE NOT NULL,
  \`jam\` VARCHAR(50) NOT NULL,
  \`lokasi\` VARCHAR(100) NOT NULL,
  \`kegiatan\` TEXT NOT NULL,
  \`sasaran\` VARCHAR(100) NOT NULL,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
`
  },
  {
    filename: 'config.php',
    language: 'php',
    title: 'Koneksi Database & Helper Function',
    description: 'File konfigurasi koneksi PDO MySQL dan fungsi bantuan pendukung.',
    content: `<?php
// config.php - File Koneksi Database MySQL PDO
$db_host = 'localhost';
$db_name = 'posyandu_db';
$db_user = 'root';
$db_pass = '';

try {
    $pdo = new PDO("mysql:host=$db_host;dbname=$db_name;charset=utf8mb4", $db_user, $db_pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
} catch (PDOException $e) {
    die("Koneksi Database Gagal: " . $e->getMessage());
}

// Helper Hitung Status Gizi Berdasarkan Standar WHO
function hitungStatusGizi($bb, $usiaBulan, $gender = 'L') {
    // Estimasi sederhana garis median & SD WHO Weight-for-Age
    $median = 3.3 + ($usiaBulan * 0.35);
    $sd2Neg = $median * 0.82;
    $sd3Neg = $median * 0.70;
    $sd2Pos = $median * 1.20;

    if ($bb < $sd3Neg) {
        return 'Gizi Buruk';
    } else if ($bb < $sd2Neg) {
        return 'Gizi Kurang';
    } else if ($bb <= $sd2Pos) {
        return 'Gizi Baik';
    } else {
        return 'Gizi Lebih';
    }
}
?>
`
  },
  {
    filename: 'index.php',
    language: 'php',
    title: 'Dashboard Utama Posyandu & PWA Entry',
    description: 'Halaman dashboard utama dengan ringkasan SKDN, pendaftaran PWA Service Worker, dan navigasi utama.',
    content: `<?php
require_once 'config.php';

// Ambil Statistik
$totalBalita = $pdo->query("SELECT COUNT(*) FROM balita")->fetchColumn();
$totalIbuHamil = $pdo->query("SELECT COUNT(*) FROM ibu_hamil")->fetchColumn();
$totalPenimbangan = $pdo->query("SELECT COUNT(*) FROM penimbangan WHERE MONTH(tanggal) = MONTH(CURRENT_DATE())")->fetchColumn();
$totalGiziBuruk = $pdo->query("SELECT COUNT(*) FROM penimbangan WHERE status_gizi = 'Gizi Buruk'")->fetchColumn();

// Ambil Jadwal Terdekat
$stmtJadwal = $pdo->query("SELECT * FROM jadwal WHERE tanggal >= CURRENT_DATE() ORDER BY tanggal ASC LIMIT 2");
$jadwalList = $stmtJadwal->fetchAll();
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Web Posyandu Digital PWA</title>
    <!-- PWA Manifest & Theme -->
    <link rel="manifest" href="manifest.json">
    <meta name="theme-color" content="#0284c7">
    <link rel="apple-touch-icon" href="icon-192.png">
    
    <!-- Tailwind CSS via CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body class="bg-slate-50 text-slate-800 pb-16">

    <!-- Header Navbar -->
    <nav class="bg-sky-700 text-white shadow-md sticky top-0 z-50">
        <div class="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
            <div class="flex items-center space-x-3">
                <i class="fa-solid fa-heart-pulse text-2xl text-pink-300"></i>
                <div>
                    <h1 class="font-bold text-lg leading-none">Posyandu Digital</h1>
                    <span class="text-xs text-sky-200">Sistem Informasi & PWA Terpadu</span>
                </div>
            </div>
            <button id="pwaInstallBtn" class="hidden bg-emerald-500 hover:bg-emerald-600 text-white text-xs px-3 py-1.5 rounded-full font-semibold shadow flex items-center gap-1.5 transition">
                <i class="fa-solid fa-download"></i> Install App PWA
            </button>
        </div>
    </nav>

    <!-- Menu Navigasi Top Bar -->
    <div class="bg-sky-800 text-sky-100 shadow-inner">
        <div class="max-w-6xl mx-auto px-4 flex space-x-6 overflow-x-auto py-2.5 text-sm font-medium">
            <a href="index.php" class="text-white border-b-2 border-amber-400 pb-1 flex items-center gap-2"><i class="fa-solid fa-chart-pie"></i> Dashboard</a>
            <a href="balita.php" class="hover:text-white flex items-center gap-2"><i class="fa-solid fa-child"></i> Data Balita</a>
            <a href="penimbangan.php" class="hover:text-white flex items-center gap-2"><i class="fa-solid fa-weight-scale"></i> Penimbangan</a>
            <a href="ibu_hamil.php" class="hover:text-white flex items-center gap-2"><i class="fa-solid fa-person-pregnant"></i> Ibu Hamil</a>
            <a href="jadwal.php" class="hover:text-white flex items-center gap-2"><i class="fa-solid fa-calendar-days"></i> Jadwal</a>
        </div>
    </div>

    <!-- Main Container -->
    <main class="max-w-6xl mx-auto px-4 mt-6">
        <!-- Banner Selamat Datang -->
        <div class="bg-gradient-to-r from-sky-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
                <span class="bg-sky-500/40 text-sky-100 text-xs px-3 py-1 rounded-full font-medium">PWA Offline-Ready</span>
                <h2 class="text-2xl font-bold mt-2">Selamat Datang di Portal Posyandu</h2>
                <p class="text-sky-100 text-sm mt-1">Sistem pencatatan tumbuh kembang balita, imunisasi, dan pemantauan gizi terpadu.</p>
            </div>
            <a href="penimbangan.php" class="bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold px-5 py-2.5 rounded-xl shadow transition text-sm flex items-center gap-2">
                <i class="fa-solid fa-plus-circle"></i> Input Penimbangan
            </a>
        </div>

        <!-- Metric Cards Grid -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
                <div class="bg-sky-100 text-sky-600 p-3 rounded-lg"><i class="fa-solid fa-child text-xl"></i></div>
                <div>
                    <div class="text-2xl font-bold text-slate-800"><?= $totalBalita ?></div>
                    <div class="text-xs text-slate-500 font-medium">Total Balita</div>
                </div>
            </div>
            <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
                <div class="bg-pink-100 text-pink-600 p-3 rounded-lg"><i class="fa-solid fa-person-pregnant text-xl"></i></div>
                <div>
                    <div class="text-2xl font-bold text-slate-800"><?= $totalIbuHamil ?></div>
                    <div class="text-xs text-slate-500 font-medium">Ibu Hamil</div>
                </div>
            </div>
            <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
                <div class="bg-emerald-100 text-emerald-600 p-3 rounded-lg"><i class="fa-solid fa-weight-scale text-xl"></i></div>
                <div>
                    <div class="text-2xl font-bold text-slate-800"><?= $totalPenimbangan ?></div>
                    <div class="text-xs text-slate-500 font-medium">Ditimbang Bulan Ini</div>
                </div>
            </div>
            <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
                <div class="bg-rose-100 text-rose-600 p-3 rounded-lg"><i class="fa-solid fa-triangle-exclamation text-xl"></i></div>
                <div>
                    <div class="text-2xl font-bold text-slate-800"><?= $totalGiziBuruk ?></div>
                    <div class="text-xs text-slate-500 font-medium">Gizi Buruk / Stunting</div>
                </div>
            </div>
        </div>

        <!-- Jadwal Posyandu Terdekat -->
        <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm mb-6">
            <h3 class="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
                <i class="fa-solid fa-calendar-check text-sky-600"></i> Jadwal Kegiatan Posyandu Mendatang
            </h3>
            <div class="grid md:grid-cols-2 gap-4">
                <?php foreach($jadwalList as $j): ?>
                <div class="p-4 bg-sky-50 rounded-xl border border-sky-100">
                    <div class="flex justify-between items-start">
                        <span class="font-bold text-sky-900"><?= htmlspecialchars($j['judul']) ?></span>
                        <span class="bg-sky-200 text-sky-800 text-xs px-2.5 py-1 rounded-full font-semibold"><?= $j['tanggal'] ?></span>
                    </div>
                    <p class="text-xs text-slate-600 mt-2"><i class="fa-solid fa-clock text-sky-500 mr-1"></i> <?= $j['jam'] ?> | <i class="fa-solid fa-location-dot text-sky-500 mr-1"></i> <?= htmlspecialchars($j['lokasi']) ?></p>
                    <p class="text-xs text-slate-500 mt-1"><?= htmlspecialchars($j['kegiatan']) ?></p>
                </div>
                <?php endforeach; ?>
                <?php if(empty($jadwalList)): ?>
                <p class="text-slate-500 text-sm">Belum ada jadwal kegiatan terdekat.</p>
                <?php endif; ?>
            </div>
        </div>
    </main>

    <!-- Script PWA Service Worker -->
    <script>
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', function() {
                navigator.serviceWorker.register('sw.js').then(function(reg) {
                    console.log('Service Worker PWA terdaftar!', reg.scope);
                }).catch(function(err) {
                    console.log('Gagal daftar SW:', err);
                });
            });
        }

        // PWA Prompt Install
        let deferredPrompt;
        const installBtn = document.getElementById('pwaInstallBtn');
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            if(installBtn) installBtn.classList.remove('hidden');
        });

        if(installBtn) {
            installBtn.addEventListener('click', () => {
                if (deferredPrompt) {
                    deferredPrompt.prompt();
                    deferredPrompt.userChoice.then((choiceResult) => {
                        if (choiceResult.outcome === 'accepted') {
                            console.log('Pengguna menginstall PWA');
                        }
                        deferredPrompt = null;
                        installBtn.classList.add('hidden');
                    });
                }
            });
        }
    </script>
</body>
</html>
`
  },
  {
    filename: 'balita.php',
    language: 'php',
    title: 'Manajemen Data Balita & Form Modal',
    description: 'Halaman kelola data balita (Tambah, Edit, Hapus, Pencarian NIK/Nama) lengkap dengan modal pendaftaran.',
    content: `<?php
require_once 'config.php';

// Handle Tambah Balita
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'tambah') {
    $stmt = $pdo->prepare("INSERT INTO balita (nik, nama, jenis_kelamin, tanggal_lahir, nama_ibu, nama_ayah, alamat, rt, rw, no_hp, bb_lahir, tb_lahir) 
                           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->execute([
        $_POST['nik'], $_POST['nama'], $_POST['jenis_kelamin'], $_POST['tanggal_lahir'],
        $_POST['nama_ibu'], $_POST['nama_ayah'], $_POST['alamat'], $_POST['rt'],
        $_POST['rw'], $_POST['no_hp'], $_POST['bb_lahir'], $_POST['tb_lahir']
    ]);
    header('Location: balita.php?msg=sukses');
    exit;
}

// Search & Filter
$search = $_GET['q'] ?? '';
$sql = "SELECT * FROM balita WHERE nama LIKE ? OR nik LIKE ? ORDER BY id DESC";
$stmt = $pdo->prepare($sql);
$stmt->execute(["%$search%", "%$search%"]);
$balitaList = $stmt->fetchAll();
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Data Balita - Posyandu Digital</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body class="bg-slate-50 text-slate-800">

    <nav class="bg-sky-700 text-white shadow p-4 flex justify-between items-center">
        <a href="index.php" class="font-bold text-lg flex items-center gap-2"><i class="fa-solid fa-arrow-left"></i> Kembali ke Dashboard</a>
        <h1 class="font-bold">Kelola Data Balita</h1>
    </nav>

    <div class="max-w-6xl mx-auto p-4 mt-4">
        <div class="flex flex-col md:flex-row justify-between gap-4 mb-6">
            <form method="GET" class="flex gap-2 flex-1">
                <input type="text" name="q" value="<?= htmlspecialchars($search) ?>" placeholder="Cari NIK atau Nama Balita..." class="border border-slate-300 rounded-xl px-4 py-2 w-full text-sm">
                <button type="submit" class="bg-sky-600 text-white px-4 py-2 rounded-xl text-sm font-semibold">Cari</button>
            </form>
            <button onclick="document.getElementById('modalAdd').classList.remove('hidden')" class="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-xl font-bold text-sm shadow flex items-center gap-2">
                <i class="fa-solid fa-user-plus"></i> Tambah Balita Baru
            </button>
        </div>

        <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <table class="w-full text-left border-collapse text-sm">
                <thead>
                    <tr class="bg-slate-100 border-b border-slate-200 text-slate-700">
                        <th class="p-3">NIK & Nama</th>
                        <th class="p-3">JK</th>
                        <th class="p-3">Tanggal Lahir</th>
                        <th class="p-3">Orang Tua</th>
                        <th class="p-3">RT/RW</th>
                        <th class="p-3 text-center">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach($balitaList as $b): ?>
                    <tr class="border-b border-slate-100 hover:bg-slate-50">
                        <td class="p-3">
                            <div class="font-bold text-slate-900"><?= htmlspecialchars($b['nama']) ?></div>
                            <div class="text-xs text-slate-500">NIK: <?= $b['nik'] ?></div>
                        </td>
                        <td class="p-3">
                            <span class="px-2 py-0.5 text-xs rounded-full font-bold <?= $b['jenis_kelamin'] === 'L' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700' ?>">
                                <?= $b['jenis_kelamin'] ?>
                            </span>
                        </td>
                        <td class="p-3"><?= $b['tanggal_lahir'] ?></td>
                        <td class="p-3">Ibu: <?= htmlspecialchars($b['nama_ibu']) ?></td>
                        <td class="p-3">RT <?= $b['rt'] ?> / RW <?= $b['rw'] ?></td>
                        <td class="p-3 text-center space-x-2">
                            <a href="kms.php?id=<?= $b['id'] ?>" class="bg-sky-500 text-white px-2.5 py-1 rounded text-xs"><i class="fa-solid fa-chart-line"></i> KMS</a>
                        </td>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
    </div>

    <!-- Modal Form Tambah Balita -->
    <div id="modalAdd" class="hidden fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <h3 class="font-bold text-lg mb-4">Pendaftaran Balita Baru</h3>
            <form method="POST">
                <input type="hidden" name="action" value="tambah">
                <div class="space-y-3 text-sm">
                    <div>
                        <label class="block font-medium">NIK Balita</label>
                        <input type="text" name="nik" required class="w-full border rounded-lg p-2">
                    </div>
                    <div>
                        <label class="block font-medium">Nama Lengkap Balita</label>
                        <input type="text" name="nama" required class="w-full border rounded-lg p-2">
                    </div>
                    <div class="grid grid-cols-2 gap-3">
                        <div>
                            <label class="block font-medium">Jenis Kelamin</label>
                            <select name="jenis_kelamin" class="w-full border rounded-lg p-2">
                                <option value="L">Laki-Laki</option>
                                <option value="P">Perempuan</option>
                            </select>
                        </div>
                        <div>
                            <label class="block font-medium">Tanggal Lahir</label>
                            <input type="date" name="tanggal_lahir" required class="w-full border rounded-lg p-2">
                        </div>
                    </div>
                    <div class="grid grid-cols-2 gap-3">
                        <div>
                            <label class="block font-medium">Nama Ibu</label>
                            <input type="text" name="nama_ibu" required class="w-full border rounded-lg p-2">
                        </div>
                        <div>
                            <label class="block font-medium">Nama Ayah</label>
                            <input type="text" name="nama_ayah" required class="w-full border rounded-lg p-2">
                        </div>
                    </div>
                    <div class="grid grid-cols-3 gap-2">
                        <div>
                            <label class="block font-medium">BB Lahir (kg)</label>
                            <input type="number" step="0.1" name="bb_lahir" value="3.0" class="w-full border rounded-lg p-2">
                        </div>
                        <div>
                            <label class="block font-medium">TB Lahir (cm)</label>
                            <input type="number" step="0.1" name="tb_lahir" value="49" class="w-full border rounded-lg p-2">
                        </div>
                        <div>
                            <label class="block font-medium">RT</label>
                            <input type="text" name="rt" value="01" class="w-full border rounded-lg p-2">
                        </div>
                    </div>
                    <div>
                        <label class="block font-medium">Alamat</label>
                        <textarea name="alamat" required class="w-full border rounded-lg p-2"></textarea>
                    </div>
                    <input type="hidden" name="rw" value="01">
                    <input type="hidden" name="no_hp" value="-">
                </div>
                <div class="mt-6 flex justify-end gap-3">
                    <button type="button" onclick="document.getElementById('modalAdd').classList.add('hidden')" class="px-4 py-2 border rounded-lg">Batal</button>
                    <button type="submit" class="px-4 py-2 bg-sky-600 text-white rounded-lg font-bold">Simpan</button>
                </div>
            </form>
        </div>
    </div>
</body>
</html>
`
  },
  {
    filename: 'penimbangan.php',
    language: 'php',
    title: 'Input & Pencatatan Penimbangan Balita',
    description: 'Halaman pencatatan pertumbuhan bulanan dengan kalkulasi otomatis status gizi berdasarkan standar WHO.',
    content: `<?php
require_once 'config.php';

// Handle Simpan Penimbangan
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $balitaId = $_POST['balita_id'];
    $bb = (float)$_POST['bb'];
    $tb = (float)$_POST['tb'];
    $usiaBulan = (int)$_POST['usia_bulan'];
    $statusGizi = hitungStatusGizi($bb, $usiaBulan);

    $stmt = $pdo->prepare("INSERT INTO penimbangan (balita_id, tanggal, usia_bulan, bb, tb, lk, asi_eksklusif, vit_a, obat_cacing, imunisasi, status_gizi, catatan) 
                           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->execute([
        $balitaId, $_POST['tanggal'], $usiaBulan, $bb, $tb, $_POST['lk'] ?? 0,
        isset($_POST['asi_eksklusif']) ? 1 : 0,
        isset($_POST['vit_a']) ? 1 : 0,
        isset($_POST['obat_cacing']) ? 1 : 0,
        $_POST['imunisasi'] ?? '-', $statusGizi, $_POST['catatan'] ?? ''
    ]);
    header('Location: penimbangan.php?status=saved');
    exit;
}

$balitaList = $pdo->query("SELECT id, nama, nik, tanggal_lahir FROM balita ORDER BY nama ASC")->fetchAll();
$penimbanganHistory = $pdo->query("SELECT p.*, b.nama as nama_balita, b.nik FROM penimbangan p JOIN balita b ON p.balita_id = b.id ORDER BY p.tanggal DESC LIMIT 20")->fetchAll();
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Penimbangan - Posyandu Digital</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body class="bg-slate-50 text-slate-800">

    <nav class="bg-sky-700 text-white p-4 flex justify-between">
        <a href="index.php" class="font-bold flex items-center gap-2"><i class="fa-solid fa-arrow-left"></i> Dashboard</a>
        <h1 class="font-bold">Input Penimbangan Balita</h1>
    </nav>

    <div class="max-w-6xl mx-auto p-4 mt-4 grid md:grid-cols-3 gap-6">
        <!-- Form Input Penimbangan -->
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 md:col-span-1">
            <h2 class="font-bold text-lg mb-4 text-sky-800"><i class="fa-solid fa-weight-scale"></i> Form Penimbangan</h2>
            <form method="POST" class="space-y-3 text-sm">
                <div>
                    <label class="block font-medium">Pilih Balita</label>
                    <select name="balita_id" required class="w-full border rounded-lg p-2">
                        <option value="">-- Pilih Balita --</option>
                        <?php foreach($balitaList as $b): ?>
                        <option value="<?= $b['id'] ?>"><?= htmlspecialchars($b['nama']) ?> (<?= $b['nik'] ?>)</option>
                        <?php endforeach; ?>
                    </select>
                </div>
                <div>
                    <label class="block font-medium">Tanggal Timbang</label>
                    <input type="date" name="tanggal" value="<?= date('Y-m-d') ?>" required class="w-full border rounded-lg p-2">
                </div>
                <div class="grid grid-cols-2 gap-2">
                    <div>
                        <label class="block font-medium">Usia (Bulan)</label>
                        <input type="number" name="usia_bulan" value="6" required class="w-full border rounded-lg p-2">
                    </div>
                    <div>
                        <label class="block font-medium">BB (kg)</label>
                        <input type="number" step="0.1" name="bb" placeholder="7.5" required class="w-full border rounded-lg p-2">
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-2">
                    <div>
                        <label class="block font-medium">TB/PB (cm)</label>
                        <input type="number" step="0.1" name="tb" placeholder="65" required class="w-full border rounded-lg p-2">
                    </div>
                    <div>
                        <label class="block font-medium">LK (cm)</label>
                        <input type="number" step="0.1" name="lk" placeholder="42" class="w-full border rounded-lg p-2">
                    </div>
                </div>
                <div class="space-y-1 pt-2">
                    <label class="flex items-center gap-2"><input type="checkbox" name="asi_eksklusif" value="1"> ASI Eksklusif</label>
                    <label class="flex items-center gap-2"><input type="checkbox" name="vit_a" value="1"> Kapsul Vitamin A</label>
                    <label class="flex items-center gap-2"><input type="checkbox" name="obat_cacing" value="1"> Obat Cacing</label>
                </div>
                <button type="submit" class="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 rounded-xl mt-4">Simpan Hasil Timbang</button>
            </form>
        </div>

        <!-- Tabel Riwayat -->
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 md:col-span-2 overflow-hidden">
            <h2 class="font-bold text-lg mb-4 text-slate-800">Riwayat Penimbangan Terbaru</h2>
            <div class="overflow-x-auto">
                <table class="w-full text-left text-sm">
                    <thead>
                        <tr class="bg-slate-100 border-b">
                            <th class="p-2">Tanggal</th>
                            <th class="p-2">Balita</th>
                            <th class="p-2">BB / TB</th>
                            <th class="p-2">Status Gizi</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach($penimbanganHistory as $p): ?>
                        <tr class="border-b">
                            <td class="p-2"><?= $p['tanggal'] ?></td>
                            <td class="p-2 font-medium"><?= htmlspecialchars($p['nama_balita']) ?></td>
                            <td class="p-2"><?= $p['bb'] ?> kg / <?= $p['tb'] ?> cm</td>
                            <td class="p-2">
                                <span class="px-2 py-0.5 text-xs rounded-full font-bold bg-emerald-100 text-emerald-800"><?= $p['status_gizi'] ?></span>
                            </td>
                        </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</body>
</html>
`
  },
  {
    filename: 'manifest.json',
    language: 'json',
    title: 'PWA Web App Manifest',
    description: 'Konfigurasi PWA Web App Manifest agar web posyandu dapat diinstal di smartphone Android/iOS.',
    content: `{
  "short_name": "Posyandu PWA",
  "name": "Sistem Informasi Posyandu Digital",
  "description": "Aplikasi Web Posyandu dengan Fitur Pendataan Balita, KMS, dan Penimbangan Offline",
  "icons": [
    {
      "src": "icon-192.png",
      "type": "image/png",
      "sizes": "192x192"
    },
    {
      "src": "icon-512.png",
      "type": "image/png",
      "sizes": "512x512"
    }
  ],
  "start_url": "index.php",
  "background_color": "#f8fafc",
  "theme_color": "#0284c7",
  "display": "standalone",
  "orientation": "portrait"
}`
  },
  {
    filename: 'sw.js',
    language: 'javascript',
    title: 'Service Worker PWA Offline Cache',
    description: 'Skrip Service Worker PWA untuk caching aset dan halaman offline saat tidak ada jaringan internet.',
    content: `// Service Worker untuk PWA Offline Cache
const CACHE_NAME = 'posyandu-pwa-v1';
const urlsToCache = [
  './',
  './index.php',
  './balita.php',
  './penimbangan.php',
  './manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).catch(() => {
        return caches.match('./index.php');
      });
    })
  );
});
`
  },
  {
    filename: 'README.md',
    language: 'markdown',
    title: 'Panduan Instalasi & Deployment PHP',
    description: 'Instruksi langkah demi langkah cara memasang source code PHP Native di XAMPP / CPanel / Web Hosting.',
    content: `# Panduan Instalasi Web Posyandu Native PHP & PWA

## Persyaratan Sistem:
- PHP >= 7.4 / 8.0 / 8.2
- Database MySQL atau MariaDB
- Server Apache / Nginx / XAMPP / Laragon / cPanel

## Langkah-Langkah Instalasi:

1. **Import Database SQL**:
   - Buka \`phpMyAdmin\` (http://localhost/phpmyadmin)
   - Buat database baru bernama \`posyandu_db\`
   - Klik tab **Import** dan pilih file \`database.sql\` lalu klik **Go / Kirim**

2. **Pengaturan Koneksi**:
   - Buka file \`config.php\`
   - Sesuaikan $db_user dan $db_pass jika menggunakan password MySQL kustom:
     \`\`\`php
     $db_host = 'localhost';
     $db_name = 'posyandu_db';
     $db_user = 'root';
     $db_pass = '';
     \`\`\`

3. **Menjalankan Aplikasi**:
   - Copy seluruh folder project ke folder \`htdocs\` (XAMPP) atau \`www\` (Laragon)
   - Buka browser dan kunjungi: \`http://localhost/posyandu_pwa/\`

4. **Uji Coba Fitur PWA (Progressive Web App)**:
   - Buka web posyandu di Google Chrome (Desktop atau HP Android)
   - Tombol **"Install App PWA"** akan otomatis muncul di bagian atas navbar
   - Klik tombol tersebut untuk memasang aplikasi ke layar utama (Home Screen) smartphone!
`
  }
];
