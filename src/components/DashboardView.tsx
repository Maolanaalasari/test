import React from 'react';
import {
  Baby,
  PersonStanding,
  Scale,
  AlertTriangle,
  PlusCircle,
  Calendar,
  Clock,
  MapPin,
  TrendingUp,
  FileCode,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { Balita, Penimbangan, IbuHamil, JadwalPosyandu } from '../types';
import { computeSkdnStats } from '../utils/posyanduCalc';

interface DashboardViewProps {
  balitaList: Balita[];
  penimbanganList: Penimbangan[];
  ibuHamilList: IbuHamil[];
  jadwalList: JadwalPosyandu[];
  onNavigate: (tab: string) => void;
  onOpenKms: (balita: Balita) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  balitaList,
  penimbanganList,
  ibuHamilList,
  jadwalList,
  onNavigate,
  onOpenKms
}) => {
  const currentMonthYear = new Date().toISOString().substring(0, 7); // 'YYYY-MM'
  const skdn = computeSkdnStats(balitaList, penimbanganList, currentMonthYear);

  // Filter Gizi Buruk & Gizi Kurang
  const giziBurukList = balitaList.filter(b => {
    const records = penimbanganList.filter(p => p.balitaId === b.id);
    if (records.length === 0) return b.statusGiziTerakhir === 'Gizi Buruk' || b.statusGiziTerakhir === 'Gizi Kurang';
    const lastRecord = records.sort((a, b) => b.tanggal.localeCompare(a.tanggal))[0];
    return lastRecord.statusGizi === 'Gizi Buruk' || lastRecord.statusGizi === 'Gizi Kurang';
  });

  const totalDitimbangBulanIni = penimbanganList.filter(p => p.tanggal.startsWith(currentMonthYear)).length;

  return (
    <div className="space-y-6">
      {/* Hero Quick Banner */}
      <div className="bg-gradient-to-r from-sky-700 via-sky-800 to-indigo-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="bg-amber-400 text-slate-900 font-bold text-xs px-2.5 py-0.5 rounded-full shadow-sm">
                Posyandu Mawar I
              </span>
              <span className="bg-sky-500/40 text-sky-100 text-xs px-2.5 py-0.5 rounded-full border border-sky-400/30">
                PWA Offline Mode Ready
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
              Sistem Informasi Posyandu Terpadu
            </h2>
            <p className="text-sky-100 text-sm leading-relaxed">
              Pemantauan tumbuh kembang balita dengan standar WHO, pemantauan kesehatan ibu hamil,
              pencatatan SKDN bulanan, dan fitur PWA offline.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('penimbangan')}
              className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold px-4 py-2.5 rounded-xl shadow-lg hover:shadow-xl transition flex items-center gap-2 text-sm"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Input Penimbangan</span>
            </button>
            <button
              onClick={() => onNavigate('balita')}
              className="bg-sky-600/80 hover:bg-sky-600 text-white font-semibold px-4 py-2.5 rounded-xl border border-sky-400/40 transition text-sm flex items-center gap-2"
            >
              <Baby className="w-4 h-4" />
              <span>Tambah Balita</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div
          onClick={() => onNavigate('balita')}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Sasaran Balita</span>
            <div className="bg-sky-100 text-sky-700 p-2.5 rounded-xl group-hover:scale-110 transition">
              <Baby className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-800">{balitaList.length}</span>
            <span className="text-xs text-sky-600 font-semibold flex items-center gap-1">
              Anak <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        <div
          onClick={() => onNavigate('ibu_hamil')}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Ibu Hamil Terdaftar</span>
            <div className="bg-pink-100 text-pink-700 p-2.5 rounded-xl group-hover:scale-110 transition">
              <PersonStanding className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-800">{ibuHamilList.length}</span>
            <span className="text-xs text-pink-600 font-semibold flex items-center gap-1">
              Ibu <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        <div
          onClick={() => onNavigate('penimbangan')}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Penimbangan Bulan Ini</span>
            <div className="bg-emerald-100 text-emerald-700 p-2.5 rounded-xl group-hover:scale-110 transition">
              <Scale className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-800">{totalDitimbangBulanIni}</span>
            <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
              {Math.round((totalDitimbangBulanIni / Math.max(1, balitaList.length)) * 100)}% D/S
            </span>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-rose-200/80 bg-rose-50/30 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-700">Perhatian / Stunting</span>
            <div className="bg-rose-100 text-rose-700 p-2.5 rounded-xl">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-rose-800">{giziBurukList.length}</span>
            <span className="text-xs text-rose-600 font-bold">Butuh Intervensi</span>
          </div>
        </div>
      </div>

      {/* SKDN Progress & Metrics Section */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-sky-600" />
              Laporan Indikator SKDN - {skdn.bulan} {skdn.tahun}
            </h3>
            <p className="text-xs text-slate-500">
              S (Sasaran), K (KMS), D (Ditimbang), N (Naik Berat Badan)
            </p>
          </div>
          <button
            onClick={() => onNavigate('laporan')}
            className="text-xs font-bold text-sky-600 hover:text-sky-800 flex items-center gap-1 bg-sky-50 px-3 py-1.5 rounded-lg hover:bg-sky-100 transition"
          >
            Lihat Laporan Lengkap <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/60">
            <div className="text-xs font-bold text-slate-500 uppercase">S (Sasaran)</div>
            <div className="text-xl font-black text-slate-800 mt-1">{skdn.S} <span className="text-xs font-medium text-slate-500">Balita</span></div>
            <div className="text-[11px] text-slate-500 mt-0.5">Total Balita di Wilayah</div>
          </div>
          <div className="p-3.5 bg-sky-50 rounded-xl border border-sky-100">
            <div class="text-xs font-bold text-sky-700 uppercase">K (Punya KMS)</div>
            <div className="text-xl font-black text-sky-900 mt-1">{skdn.K} <span className="text-xs font-medium text-sky-600">({Math.round((skdn.K/Math.max(1,skdn.S))*100)}%)</span></div>
            <div className="text-[11px] text-sky-600 mt-0.5">Memiliki Kartu KMS</div>
          </div>
          <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-100">
            <div className="text-xs font-bold text-emerald-700 uppercase">D (Ditimbang)</div>
            <div className="text-xl font-black text-emerald-900 mt-1">{skdn.D} <span className="text-xs font-medium text-emerald-600">({Math.round((skdn.D/Math.max(1,skdn.S))*100)}%)</span></div>
            <div className="text-[11px] text-emerald-600 mt-0.5">Partisipasi (D/S)</div>
          </div>
          <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-100">
            <div className="text-xs font-bold text-amber-700 uppercase">N (Naik Berat)</div>
            <div className="text-xl font-black text-amber-900 mt-1">{skdn.N} <span className="text-xs font-medium text-amber-600">({Math.round((skdn.N/Math.max(1,skdn.D))*100)}%)</span></div>
            <div className="text-[11px] text-amber-600 mt-0.5">Keberhasilan Program (N/D)</div>
          </div>
        </div>

        {/* Visual Progress Bar D/S */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold text-slate-600">
            <span>Cakupan Penimbangan Balita (D/S Target: ≥ 80%)</span>
            <span>{skdn.D} / {skdn.S} Anak ({Math.round((skdn.D/Math.max(1,skdn.S))*100)}%)</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200">
            <div
              className="bg-gradient-to-r from-emerald-500 to-sky-500 h-full transition-all duration-500 rounded-full"
              style={{ width: `${Math.min(100, Math.round((skdn.D/Math.max(1,skdn.S))*100))}%` }}
            />
          </div>
        </div>
      </div>

      {/* Grid 2 Column: Balita Status Alert & Schedule */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Balita Perlindungan Gizi / Alert */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-500" />
                Daftar Balita Perlu Perhatian Khusus
              </h3>
              <span className="text-xs bg-rose-100 text-rose-700 font-bold px-2.5 py-0.5 rounded-full">
                {giziBurukList.length} Anak
              </span>
            </div>

            {giziBurukList.length === 0 ? (
              <div className="p-6 text-center text-slate-500 bg-emerald-50/50 rounded-xl border border-emerald-100">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <p className="text-sm font-semibold text-emerald-900">Seluruh Balita dalam Status Gizi Normal</p>
                <p className="text-xs text-emerald-700 mt-1">Tidak ada balita terindikasi Gizi Buruk atau Gizi Kurang bulan ini.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {giziBurukList.map((balita) => (
                  <div
                    key={balita.id}
                    className="p-3.5 bg-rose-50/60 border border-rose-200/80 rounded-xl flex items-center justify-between gap-3 hover:bg-rose-100/50 transition"
                  >
                    <div>
                      <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                        {balita.nama}
                        <span className="text-[10px] bg-rose-200 text-rose-800 px-2 py-0.2 rounded font-extrabold">
                          {balita.statusGiziTerakhir || 'Gizi Kurang'}
                        </span>
                      </div>
                      <div className="text-xs text-slate-600 mt-0.5">
                        Ibu: {balita.namaIbu} • RT {balita.rt}/RW {balita.rw} • Lahir: {balita.tanggalLahir}
                      </div>
                    </div>
                    <button
                      onClick={() => onOpenKms(balita)}
                      className="bg-sky-600 hover:bg-sky-700 text-white text-xs px-3 py-1.5 rounded-lg font-bold shrink-0 transition"
                    >
                      Lihat KMS
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
            <span>Rekomendasi: Berikan Makanan Tambahan (PMT) & Konsultasi Bidan.</span>
          </div>
        </div>

        {/* Upcoming Schedule */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-sky-600" />
                Jadwal Kegiatan Posyandu
              </h3>
              <button
                onClick={() => onNavigate('jadwal')}
                className="text-xs font-bold text-sky-600 hover:text-sky-800 flex items-center gap-1"
              >
                Lihat Semua <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {jadwalList.map((jadwal) => (
                <div
                  key={jadwal.id}
                  className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl space-y-2 hover:bg-sky-50/50 transition"
                >
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-slate-900 text-sm leading-snug">{jadwal.judul}</h4>
                    <span className="bg-sky-100 text-sky-800 font-extrabold text-[11px] px-2.5 py-0.5 rounded-full shrink-0 ml-2">
                      {jadwal.tanggal}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-sky-600" /> {jadwal.jam}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-sky-600" /> {jadwal.lokasi}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2">{jadwal.kegiatan}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Petugas PJ: Bidan Desa & Kader Posyandu</span>
            <button
              onClick={() => onNavigate('php')}
              className="text-amber-700 font-bold hover:underline flex items-center gap-1"
            >
              <FileCode className="w-3.5 h-3.5" /> Source PHP
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
