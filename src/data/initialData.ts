import { Balita, Penimbangan, IbuHamil, JadwalPosyandu, ImunisasiMaster } from '../types';

export const initialBalitaList: Balita[] = [
  {
    id: 'BAL-001',
    nik: '3201011205230001',
    nama: 'Muhammad Al-Fatih',
    jenisKelamin: 'L',
    tanggalLahir: '2023-05-12',
    namaIbu: 'Siti Rahmawati',
    namaAyah: 'Budi Santoso',
    alamat: 'Jl. Melati No. 12',
    rt: '01',
    rw: '03',
    noHp: '081234567890',
    bbLahir: 3.2,
    tbLahir: 49,
    golDarah: 'O',
    posyanduName: 'Posyandu Mawar I',
    statusGiziTerakhir: 'Gizi Baik'
  },
  {
    id: 'BAL-002',
    nik: '3201012509230002',
    nama: 'Aisyah Humaira',
    jenisKelamin: 'P',
    tanggalLahir: '2023-09-25',
    namaIbu: 'Nurul Hidayah',
    namaAyah: 'Ahmad Fauzi',
    alamat: 'Jl. Mawar RT 02/03',
    rt: '02',
    rw: '03',
    noHp: '082198765432',
    bbLahir: 3.0,
    tbLahir: 48,
    golDarah: 'A',
    posyanduName: 'Posyandu Mawar I',
    statusGiziTerakhir: 'Gizi Baik'
  },
  {
    id: 'BAL-003',
    nik: '3201011002240003',
    nama: 'Arka Rayyan Prasetya',
    jenisKelamin: 'L',
    tanggalLahir: '2024-02-10',
    namaIbu: 'Dewi Lestari',
    namaAyah: 'Prasetyo Utomo',
    alamat: 'Jl. Flamboyan No. 5',
    rt: '03',
    rw: '03',
    noHp: '085712341234',
    bbLahir: 2.7,
    tbLahir: 46,
    golDarah: 'B',
    posyanduName: 'Posyandu Mawar I',
    statusGiziTerakhir: 'Gizi Kurang'
  },
  {
    id: 'BAL-004',
    nik: '3201011811230004',
    nama: 'Nabila Zahra',
    jenisKelamin: 'P',
    tanggalLahir: '2023-11-18',
    namaIbu: 'Anisa Putri',
    namaAyah: 'Rian Kurniawan',
    alamat: 'Jl. Anggrek No. 8',
    rt: '01',
    rw: '03',
    noHp: '081388990011',
    bbLahir: 3.4,
    tbLahir: 50,
    golDarah: 'AB',
    posyanduName: 'Posyandu Mawar I',
    statusGiziTerakhir: 'Gizi Baik'
  },
  {
    id: 'BAL-005',
    nik: '3201010101240005',
    nama: 'Kenzo Al-Ghifari',
    jenisKelamin: 'L',
    tanggalLahir: '2024-01-01',
    namaIbu: 'Rina Marlina',
    namaAyah: 'Doni Gunawan',
    alamat: 'Jl. Kamboja No. 15',
    rt: '02',
    rw: '03',
    noHp: '089677889900',
    bbLahir: 2.4,
    tbLahir: 45,
    golDarah: 'O',
    posyanduName: 'Posyandu Mawar I',
    statusGiziTerakhir: 'Gizi Buruk'
  }
];

export const initialPenimbanganList: Penimbangan[] = [
  // Muhammad Al-Fatih (2023-05-12)
  { id: 'PEN-001', balitaId: 'BAL-001', tanggal: '2023-05-12', usiaBulan: 0, bb: 3.2, tb: 49, lk: 34, asiEksklusif: true, vitA: false, obatCacing: false, imunisasiDiberikan: 'HB0', statusGizi: 'Gizi Baik', petugasName: 'Bidan Yuni' },
  { id: 'PEN-002', balitaId: 'BAL-001', tanggal: '2023-06-15', usiaBulan: 1, bb: 4.4, tb: 53, lk: 36, asiEksklusif: true, vitA: false, obatCacing: false, imunisasiDiberikan: 'BCG, Polio 1', statusGizi: 'Gizi Baik', petugasName: 'Kader Ani' },
  { id: 'PEN-003', balitaId: 'BAL-001', tanggal: '2023-07-14', usiaBulan: 2, bb: 5.5, tb: 57, lk: 38, asiEksklusif: true, vitA: false, obatCacing: false, imunisasiDiberikan: 'DPT-HB-Hib 1, Polio 2', statusGizi: 'Gizi Baik', petugasName: 'Kader Ani' },
  { id: 'PEN-004', balitaId: 'BAL-001', tanggal: '2023-08-16', usiaBulan: 3, bb: 6.3, tb: 60, lk: 39, asiEksklusif: true, vitA: false, obatCacing: false, imunisasiDiberikan: 'DPT-HB-Hib 2, Polio 3', statusGizi: 'Gizi Baik', petugasName: 'Bidan Yuni' },
  { id: 'PEN-005', balitaId: 'BAL-001', tanggal: '2023-09-15', usiaBulan: 4, bb: 7.0, tb: 63, lk: 41, asiEksklusif: true, vitA: false, obatCacing: false, imunisasiDiberikan: 'DPT-HB-Hib 3, Polio 4', statusGizi: 'Gizi Baik', petugasName: 'Kader Ani' },
  { id: 'PEN-006', balitaId: 'BAL-001', tanggal: '2023-11-15', usiaBulan: 6, bb: 7.8, tb: 66, lk: 43, asiEksklusif: true, vitA: true, obatCacing: false, imunisasiDiberikan: 'PCV 1', statusGizi: 'Gizi Baik', petugasName: 'Bidan Yuni' },
  { id: 'PEN-007', balitaId: 'BAL-001', tanggal: '2024-02-15', usiaBulan: 9, bb: 8.8, tb: 71, lk: 45, asiEksklusif: false, vitA: true, obatCacing: false, imunisasiDiberikan: 'MR (Campak)', statusGizi: 'Gizi Baik', petugasName: 'Kader Ani' },
  { id: 'PEN-008', balitaId: 'BAL-001', tanggal: '2026-07-15', usiaBulan: 38, bb: 14.5, tb: 96, lk: 49, asiEksklusif: false, vitA: true, obatCacing: true, imunisasiDiberikan: 'Lengkap', statusGizi: 'Gizi Baik', petugasName: 'Bidan Yuni' },

  // Aisyah Humaira
  { id: 'PEN-009', balitaId: 'BAL-002', tanggal: '2023-09-25', usiaBulan: 0, bb: 3.0, tb: 48, lk: 33, asiEksklusif: true, vitA: false, obatCacing: false, imunisasiDiberikan: 'HB0', statusGizi: 'Gizi Baik', petugasName: 'Bidan Yuni' },
  { id: 'PEN-010', balitaId: 'BAL-002', tanggal: '2023-10-20', usiaBulan: 1, bb: 4.1, tb: 52, lk: 35, asiEksklusif: true, vitA: false, obatCacing: false, imunisasiDiberikan: 'BCG', statusGizi: 'Gizi Baik', petugasName: 'Kader Sri' },
  { id: 'PEN-011', balitaId: 'BAL-002', tanggal: '2026-07-15', usiaBulan: 34, bb: 13.6, tb: 93, lk: 48, asiEksklusif: false, vitA: true, obatCacing: true, imunisasiDiberikan: 'DPT Lanjutan', statusGizi: 'Gizi Baik', petugasName: 'Bidan Yuni' },

  // Arka Rayyan Prasetya
  { id: 'PEN-012', balitaId: 'BAL-003', tanggal: '2024-02-10', usiaBulan: 0, bb: 2.7, tb: 46, lk: 32, asiEksklusif: true, vitA: false, obatCacing: false, imunisasiDiberikan: 'HB0', statusGizi: 'Gizi Kurang', petugasName: 'Bidan Yuni' },
  { id: 'PEN-013', balitaId: 'BAL-003', tanggal: '2026-07-15', usiaBulan: 29, bb: 10.2, tb: 85, lk: 46, asiEksklusif: false, vitA: true, obatCacing: false, imunisasiDiberikan: 'MR', statusGizi: 'Gizi Kurang', petugasName: 'Kader Ani' },

  // Kenzo Al-Ghifari
  { id: 'PEN-014', balitaId: 'BAL-005', tanggal: '2024-01-01', usiaBulan: 0, bb: 2.4, tb: 45, lk: 31, asiEksklusif: true, vitA: false, obatCacing: false, imunisasiDiberikan: 'HB0', statusGizi: 'Gizi Buruk', petugasName: 'Bidan Yuni' },
  { id: 'PEN-015', balitaId: 'BAL-005', tanggal: '2026-07-15', usiaBulan: 30, bb: 9.1, tb: 81, lk: 44, asiEksklusif: false, vitA: true, obatCacing: false, imunisasiDiberikan: 'Polio 3', statusGizi: 'Gizi Buruk', petugasName: 'Bidan Yuni' }
];

export const initialIbuHamilList: IbuHamil[] = [
  {
    id: 'IBU-001',
    nik: '3201014502980001',
    nama: 'Sri Wahyuni',
    namaSuami: 'Suryadi',
    tanggalLahir: '1998-02-15',
    alamat: 'Jl. Melati RT 01/03',
    rt: '01',
    rw: '03',
    hpht: '2026-01-10',
    hpl: '2026-10-17',
    usiaKehamilanMinggu: 28,
    lila: 24.5,
    bbAwal: 52,
    bbSekarang: 61,
    hb: 11.8,
    statusRisiko: 'Normal',
    noHp: '081299001122',
    suplemenFe: true
  },
  {
    id: 'IBU-002',
    nik: '3201016011000002',
    nama: 'Fitri Handayani',
    namaSuami: 'Eko Raharjo',
    tanggalLahir: '2000-11-20',
    alamat: 'Jl. Flamboyan RT 03/03',
    rt: '03',
    rw: '03',
    hpht: '2026-03-01',
    hpl: '2026-12-08',
    usiaKehamilanMinggu: 21,
    lila: 21.0, // < 23.5 cm -> KEK
    bbAwal: 42,
    bbSekarang: 46,
    hb: 10.2,
    statusRisiko: 'Kurang Energi Kronis (KEK)',
    noHp: '085711223344',
    suplemenFe: true
  }
];

export const initialJadwalList: JadwalPosyandu[] = [
  {
    id: 'JAD-001',
    judul: 'Penimbangan & Pemberian Vitamin A Bulan Agustus',
    tanggal: '2026-08-12',
    jam: '08:00 - 11:30 WIB',
    lokasi: 'Balai Warga RW 03',
    kegiatan: 'Penimbangan Balita, Pengukuran TB/LK, Kapsul Vitamin A Biru & Merah, Imunisasi Rutin, Penyuluhan Gizi Makanan Pendamping ASI (MPASI)',
    sasaran: 'Seluruh Balita (0-59 Bulan) & Ibu Hamil RW 03',
    rt: '01, 02, 03',
    petugasPenanggungJawab: 'Bidan Yuni & Kader Posyandu Mawar I'
  },
  {
    id: 'JAD-002',
    judul: 'Pemeriksaan Kesehatan Ibu Hamil & Kelas Ibu',
    tanggal: '2026-08-20',
    jam: '09:00 - 12:00 WIB',
    lokasi: 'Poskesdes / Posyandu Mawar I',
    kegiatan: 'Pemeriksaan USG Sederhana, Pengukuran LiLA & HB, Konsultasi Asupan Nutrisi Trimester 1-3, Pembagian Suplemen Fe',
    sasaran: 'Ibu Hamil Trimester 1, 2, dan 3',
    rt: 'Semua RT',
    petugasPenanggungJawab: 'Bidan Yuni S.ST'
  }
];

export const masterImunisasiList: ImunisasiMaster[] = [
  { id: 'IMU-01', nama: 'Hepatitis B (HB-0)', usiaRekomendasi: '0-7 Hari', deskripsi: 'Mencegah penularan Hepatitis B dari ibu ke bayi', wajib: true },
  { id: 'IMU-02', nama: 'BCG', usiaRekomendasi: '1 Bulan', deskripsi: 'Mencegah penyakit TBC (TBC Berat)', wajib: true },
  { id: 'IMU-03', nama: 'Polio Tetes 1', usiaRekomendasi: '1 Bulan', deskripsi: 'Mencegah kelumpuhan akibat virus Polio', wajib: true },
  { id: 'IMU-04', nama: 'DPT-HB-Hib 1 + Polio 2', usiaRekomendasi: '2 Bulan', deskripsi: 'Mencegah Difteri, Pertusis, Tetanus, Hepatitis B, Pneumonia & Meningitis', wajib: true },
  { id: 'IMU-05', nama: 'DPT-HB-Hib 2 + Polio 3', usiaRekomendasi: '3 Bulan', deskripsi: 'Dosis lanjutan DPT-HB-Hib', wajib: true },
  { id: 'IMU-06', nama: 'DPT-HB-Hib 3 + Polio 4 + IPV', usiaRekomendasi: '4 Bulan', deskripsi: 'Dosis lengkap awal & suntikan Polio IPV', wajib: true },
  { id: 'IMU-07', nama: 'Campak Rubella (MR)', usiaRekomendasi: '9 Bulan', deskripsi: 'Mencegah penyakit Campak & Rubella', wajib: true },
  { id: 'IMU-08', nama: 'PCV 1 & 2', usiaRekomendasi: '2 & 3 Bulan', deskripsi: 'Mencegah radang paru (Pneumonia)', wajib: true },
  { id: 'IMU-09', nama: 'DPT-HB-Hib Lanjutan', usiaRekomendasi: '18 Bulan', deskripsi: 'Booster perlindungan Difteri & Tetanus', wajib: true },
  { id: 'IMU-10', nama: 'MR Lanjutan', usiaRekomendasi: '18 Bulan', deskripsi: 'Booster Campak Rubella', wajib: true }
];
