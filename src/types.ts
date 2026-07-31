export type JenisKelamin = 'L' | 'P';

export type StatusGizi = 
  | 'Gizi Buruk' 
  | 'Gizi Kurang' 
  | 'Gizi Baik' 
  | 'Risiko Gizi Lebih' 
  | 'Gizi Lebih';

export type StatusRisikoIbu = 'Normal' | 'Risiko Tinggi' | 'Kurang Energi Kronis (KEK)';

export interface Balita {
  id: string;
  nik: string;
  nama: string;
  jenisKelamin: JenisKelamin;
  tanggalLahir: string; // YYYY-MM-DD
  namaIbu: string;
  namaAyah: string;
  alamat: string;
  rt: string;
  rw: string;
  noHp: string;
  bbLahir: number; // kg
  tbLahir: number; // cm
  golDarah?: string;
  posyanduName?: string;
  statusGiziTerakhir?: StatusGizi;
}

export interface Penimbangan {
  id: string;
  balitaId: string;
  tanggal: string; // YYYY-MM-DD
  usiaBulan: number;
  bb: number; // kg
  tb: number; // cm
  lk?: number; // cm (lingkar kepala)
  asiEksklusif: boolean;
  vitA: boolean;
  obatCacing: boolean;
  imunisasiDiberikan?: string;
  catatan?: string;
  statusGizi: StatusGizi;
  petugasName?: string;
}

export interface IbuHamil {
  id: string;
  nik: string;
  nama: string;
  namaSuami: string;
  tanggalLahir: string;
  alamat: string;
  rt: string;
  rw: string;
  hpht: string; // Hari Pertama Haid Terakhir
  hpl: string;  // Hari Perkiraan Lahir
  usiaKehamilanMinggu: number;
  lila: number; // cm Lingkar Lengan Atas
  bbAwal: number; // kg
  bbSekarang: number; // kg
  hb?: number; // g/dL
  statusRisiko: StatusRisikoIbu;
  noHp: string;
  suplemenFe: boolean;
}

export interface JadwalPosyandu {
  id: string;
  judul: string;
  tanggal: string; // YYYY-MM-DD
  jam: string;
  lokasi: string;
  kegiatan: string;
  sasaran: string;
  rt: string;
  petugasPenanggungJawab: string;
}

export interface ImunisasiMaster {
  id: string;
  nama: string;
  usiaRekomendasi: string; // e.g. "0 Bulan", "2 Bulan"
  deskripsi: string;
  wajib: boolean;
}

export interface SkdnData {
  bulan: string;
  tahun: number;
  S: number; // Sasaran Balita seluruhnya
  K: number; // Mempunyai KMS
  D: number; // Ditimbang bulan ini
  N: number; // Naik berat badannya
  T: number; // Tidak naik berat badannya
  O: number; // Tidak hadir ditimbang
  B: number; // Balita baru
}

export interface PHPFile {
  filename: string;
  language: string;
  title: string;
  description: string;
  content: string;
}
