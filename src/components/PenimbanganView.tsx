import React, { useState, useEffect } from 'react';
import {
  Scale,
  PlusCircle,
  History,
  Check,
  AlertCircle,
  Calendar,
  Baby,
  Pill,
  ShieldCheck,
  Search,
  Trash2,
  Eye,
  CheckCircle2
} from 'lucide-react';
import { Balita, Penimbangan, StatusGizi } from '../types';
import { calculateAgeInMonths, calculateStatusGizi } from '../utils/posyanduCalc';

interface PenimbanganViewProps {
  balitaList: Balita[];
  penimbanganList: Penimbangan[];
  selectedBalitaIdInitial?: string;
  onAddPenimbangan: (newRecord: Penimbangan) => void;
  onDeletePenimbangan: (id: string) => void;
  onOpenKms: (balita: Balita) => void;
}

export const PenimbanganView: React.FC<PenimbanganViewProps> = ({
  balitaList,
  penimbanganList,
  selectedBalitaIdInitial = '',
  onAddPenimbangan,
  onDeletePenimbangan,
  onOpenKms
}) => {
  const [selectedBalitaId, setSelectedBalitaId] = useState(selectedBalitaIdInitial);
  const [tanggal, setTanggal] = useState(new Date().toISOString().split('T')[0]);
  const [usiaBulan, setUsiaBulan] = useState(6);
  const [bb, setBb] = useState<number>(7.5);
  const [tb, setTb] = useState<number>(65);
  const [lk, setLk] = useState<number>(42);
  const [asiEksklusif, setAsiEksklusif] = useState(true);
  const [vitA, setVitA] = useState(false);
  const [obatCacing, setObatCacing] = useState(false);
  const [imunisasiDiberikan, setImunisasiDiberikan] = useState('');
  const [catatan, setCatatan] = useState('');

  const [searchTerm, setSearchTerm] = useState('');

  // Auto-update age in months when balita or date changes
  useEffect(() => {
    if (selectedBalitaId) {
      const selected = balitaList.find((b) => b.id === selectedBalitaId);
      if (selected) {
        const calculatedMonths = calculateAgeInMonths(selected.tanggalLahir, tanggal);
        setUsiaBulan(calculatedMonths);
      }
    }
  }, [selectedBalitaId, tanggal, balitaList]);

  // Selected Balita Object
  const currentBalita = balitaList.find((b) => b.id === selectedBalitaId);

  // Live WHO Status Gizi Calculation
  const liveStatusGizi: StatusGizi = currentBalita
    ? calculateStatusGizi(bb, usiaBulan, currentBalita.jenisKelamin)
    : 'Gizi Baik';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBalitaId) {
      alert('Pilih balita terlebih dahulu!');
      return;
    }

    const newRecord: Penimbangan = {
      id: `PEN-${Date.now().toString().slice(-5)}`,
      balitaId: selectedBalitaId,
      tanggal,
      usiaBulan,
      bb,
      tb,
      lk,
      asiEksklusif,
      vitA,
      obatCacing,
      imunisasiDiberikan: imunisasiDiberikan || '-',
      catatan,
      statusGizi: liveStatusGizi,
      petugasName: 'Kader Posyandu'
    };

    onAddPenimbangan(newRecord);

    // Reset form
    setCatatan('');
    setImunisasiDiberikan('');
    alert('Pencatatan penimbangan berhasil disimpan!');
  };

  const filteredPenimbangan = penimbanganList.filter((p) => {
    const balita = balitaList.find((b) => b.id === p.balitaId);
    if (!balita) return false;
    return (
      balita.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      balita.nik.includes(searchTerm) ||
      p.tanggal.includes(searchTerm)
    );
  });

  const getStatusBadgeClass = (status: StatusGizi) => {
    switch (status) {
      case 'Gizi Buruk':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      case 'Gizi Kurang':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Gizi Baik':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Risiko Gizi Lebih':
      case 'Gizi Lebih':
        return 'bg-sky-100 text-sky-800 border-sky-300';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Scale className="w-6 h-6 text-sky-600" />
            Penimbangan & Pemantauan Pertumbuhan (KMS)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Pencatatan hasil penimbangan berat badan, tinggi badan, imunisasi, dan kalkulasi Z-score WHO
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Form Input Penimbangan */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4 lg:col-span-1">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-base text-slate-800 flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-sky-600" />
              Input Penimbangan Baru
            </h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-sm">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Pilih Balita</label>
              <select
                required
                value={selectedBalitaId}
                onChange={(e) => setSelectedBalitaId(e.target.value)}
                className="w-full border border-slate-200 rounded-xl p-2.5 focus:ring-2 focus:ring-sky-500 outline-none bg-white font-medium"
              >
                <option value="">-- Pilih Balita --</option>
                {balitaList.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.nama} (NIK: {b.nik})
                  </option>
                ))}
              </select>
            </div>

            {currentBalita && (
              <div className="p-3 bg-sky-50 rounded-xl border border-sky-100 text-xs text-sky-900 flex justify-between items-center">
                <div>
                  <span className="font-bold">{currentBalita.nama}</span> • {currentBalita.jenisKelamin === 'L' ? 'Laki-Laki' : 'Perempuan'}
                  <div className="text-sky-700 mt-0.5">Lahir: {currentBalita.tanggalLahir}</div>
                </div>
                <button
                  type="button"
                  onClick={() => onOpenKms(currentBalita)}
                  className="bg-sky-600 text-white font-bold px-2.5 py-1 rounded-lg hover:bg-sky-700 transition"
                >
                  Lihat KMS
                </button>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tanggal Timbang</label>
                <input
                  type="date"
                  required
                  value={tanggal}
                  onChange={(e) => setTanggal(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl p-2.5 focus:ring-2 focus:ring-sky-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Usia (Bulan)</label>
                <input
                  type="number"
                  required
                  min={0}
                  max={60}
                  value={usiaBulan}
                  onChange={(e) => setUsiaBulan(parseInt(e.target.value) || 0)}
                  className="w-full border border-slate-200 rounded-xl p-2.5 focus:ring-2 focus:ring-sky-500 outline-none font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">BB (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  placeholder="7.5"
                  value={bb}
                  onChange={(e) => setBb(parseFloat(e.target.value) || 0)}
                  className="w-full border border-slate-200 rounded-xl p-2.5 focus:ring-2 focus:ring-sky-500 outline-none font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">TB/PB (cm)</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  placeholder="65"
                  value={tb}
                  onChange={(e) => setTb(parseFloat(e.target.value) || 0)}
                  className="w-full border border-slate-200 rounded-xl p-2.5 focus:ring-2 focus:ring-sky-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">LK (cm)</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="42"
                  value={lk}
                  onChange={(e) => setLk(parseFloat(e.target.value) || 0)}
                  className="w-full border border-slate-200 rounded-xl p-2.5 focus:ring-2 focus:ring-sky-500 outline-none"
                />
              </div>
            </div>

            {/* Real-time Status Gizi WHO Badge */}
            {currentBalita && (
              <div className={`p-3.5 rounded-xl border flex items-center justify-between ${getStatusBadgeClass(liveStatusGizi)}`}>
                <div>
                  <div className="text-[10px] uppercase font-extrabold tracking-wider opacity-80">Kalkulasi Otomatis WHO</div>
                  <div className="font-extrabold text-sm">{liveStatusGizi}</div>
                </div>
                <div className="text-[11px] font-semibold text-right">
                  Usia: {usiaBulan} bln<br />
                  BB: {bb} kg
                </div>
              </div>
            )}

            {/* Checkboxes Vitamin & ASI */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="flex items-center space-x-2 text-xs font-semibold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={asiEksklusif}
                  onChange={(e) => setAsiEksklusif(e.target.checked)}
                  className="w-4 h-4 text-sky-600 rounded focus:ring-sky-500"
                />
                <span>ASI Eksklusif</span>
              </label>

              <label className="flex items-center space-x-2 text-xs font-semibold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={vitA}
                  onChange={(e) => setVitA(e.target.checked)}
                  className="w-4 h-4 text-sky-600 rounded focus:ring-sky-500"
                />
                <span>Diberikan Kapsul Vitamin A</span>
              </label>

              <label className="flex items-center space-x-2 text-xs font-semibold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={obatCacing}
                  onChange={(e) => setObatCacing(e.target.checked)}
                  className="w-4 h-4 text-sky-600 rounded focus:ring-sky-500"
                />
                <span>Diberikan Obat Cacing</span>
              </label>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Imunisasi Hari Ini (Opsional)</label>
              <input
                type="text"
                placeholder="Contoh: DPT 2, Polio 3..."
                value={imunisasiDiberikan}
                onChange={(e) => setImunisasiDiberikan(e.target.value)}
                className="w-full border border-slate-200 rounded-xl p-2.5 focus:ring-2 focus:ring-sky-500 outline-none text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Catatan Bidan / Kader</label>
              <textarea
                rows={2}
                placeholder="Catatan perkembangan atau konseling gizi..."
                value={catatan}
                onChange={(e) => setCatatan(e.target.value)}
                className="w-full border border-slate-200 rounded-xl p-2.5 focus:ring-2 focus:ring-sky-500 outline-none text-xs resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 rounded-xl shadow transition"
            >
              Simpan Hasil Penimbangan
            </button>
          </form>
        </div>

        {/* Table Riwayat Penimbangan */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4 lg:col-span-2 overflow-hidden">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-3">
            <h3 className="font-bold text-base text-slate-800 flex items-center gap-2">
              <History className="w-5 h-5 text-sky-600" />
              Riwayat Penimbangan Terbaru ({penimbanganList.length})
            </h3>

            <div className="relative w-full sm:w-60">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Cari nama balita..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                  <th className="p-3">Tanggal</th>
                  <th className="p-3">Balita</th>
                  <th className="p-3">Usia</th>
                  <th className="p-3">BB / TB / LK</th>
                  <th className="p-3">Vit A / ASI</th>
                  <th className="p-3">Status Gizi</th>
                  <th className="p-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPenimbangan.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-500">
                      Belum ada catatan penimbangan yang sesuai.
                    </td>
                  </tr>
                ) : (
                  filteredPenimbangan.map((p) => {
                    const balita = balitaList.find((b) => b.id === p.balitaId);

                    return (
                      <tr key={p.id} className="hover:bg-slate-50 transition">
                        <td className="p-3 font-semibold text-slate-800 whitespace-nowrap">{p.tanggal}</td>
                        <td className="p-3">
                          <div className="font-bold text-slate-900">{balita?.nama || 'Unknown'}</div>
                          <div className="text-[11px] text-slate-500">RT {balita?.rt || '01'}</div>
                        </td>
                        <td className="p-3 font-bold text-slate-700">{p.usiaBulan} Bln</td>
                        <td className="p-3 font-medium text-slate-800 whitespace-nowrap">
                          {p.bb} kg / {p.tb} cm {p.lk ? `/ ${p.lk} cm` : ''}
                        </td>
                        <td className="p-3">
                          <div className="flex gap-1 flex-wrap">
                            {p.asiEksklusif && (
                              <span className="bg-sky-100 text-sky-800 px-1.5 py-0.5 rounded font-bold text-[10px]">
                                ASI
                              </span>
                            )}
                            {p.vitA && (
                              <span className="bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-bold text-[10px]">
                                Vit A
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded-full font-extrabold text-[11px] border ${getStatusBadgeClass(
                              p.statusGizi
                            )}`}
                          >
                            {p.statusGizi}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <div className="flex items-center justify-center space-x-1">
                            {balita && (
                              <button
                                onClick={() => onOpenKms(balita)}
                                className="p-1.5 bg-sky-100 text-sky-700 rounded-lg hover:bg-sky-200 transition"
                                title="Lihat KMS Chart"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                            )}
                            <button
                              onClick={() => {
                                if (confirm('Hapus pencatatan penimbangan ini?')) {
                                  onDeletePenimbangan(p.id);
                                }
                              }}
                              className="p-1.5 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 transition"
                              title="Hapus Record"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
