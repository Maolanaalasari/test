import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Printer,
  Download,
  Calendar,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  FileText
} from 'lucide-react';
import { Balita, Penimbangan } from '../types';
import { computeSkdnStats } from '../utils/posyanduCalc';

interface LaporanViewProps {
  balitaList: Balita[];
  penimbanganList: Penimbangan[];
}

export const LaporanView: React.FC<LaporanViewProps> = ({ balitaList, penimbanganList }) => {
  const [selectedMonthYear, setSelectedMonthYear] = useState('2026-07');

  const skdn = computeSkdnStats(balitaList, penimbanganList, selectedMonthYear);

  const filteredPenimbanganBulanIni = penimbanganList.filter((p) =>
    p.tanggal.startsWith(selectedMonthYear)
  );

  const handlePrint = () => {
    window.print();
  };

  const handleExportCsv = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'NIK,Nama Balita,Jenis Kelamin,Tanggal Lahir,Tanggal Timbang,BB (kg),TB (cm),Status Gizi\n';

    filteredPenimbanganBulanIni.forEach((p) => {
      const b = balitaList.find((bal) => bal.id === p.balitaId);
      if (b) {
        csvContent += `"${b.nik}","${b.nama}","${b.jenisKelamin}","${b.tanggalLahir}","${p.tanggal}","${p.bb}","${p.tb}","${p.statusGizi}"\n`;
      }
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Laporan_Posyandu_SKDN_${selectedMonthYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <FileSpreadsheet className="w-6 h-6 text-emerald-600" />
            Laporan Penimbangan Bulanan & Indikator SKDN
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Format resmi laporan Posyandu Puskesmas untuk evaluasi tingkat partisipasi (D/S) dan keberhasilan (N/D)
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleExportCsv}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3.5 py-2 rounded-xl text-xs shadow flex items-center gap-1.5 transition"
          >
            <Download className="w-4 h-4" /> Export CSV / Excel
          </button>
          <button
            onClick={handlePrint}
            className="bg-slate-800 hover:bg-slate-900 text-white font-bold px-3.5 py-2 rounded-xl text-xs shadow flex items-center gap-1.5 transition"
          >
            <Printer className="w-4 h-4" /> Cetak Laporan
          </button>
        </div>
      </div>

      {/* Month Picker */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3">
        <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
          <Calendar className="w-4 h-4 text-sky-600" /> Periode Laporan:
        </span>
        <input
          type="month"
          value={selectedMonthYear}
          onChange={(e) => setSelectedMonthYear(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
        />
      </div>

      {/* SKDN Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
          <div className="text-xs font-extrabold text-slate-400 uppercase">S (Sasaran Balita)</div>
          <div className="text-3xl font-black text-slate-900">{skdn.S}</div>
          <div className="text-xs text-slate-500 font-medium">Total seluruh balita di wilayah Posyandu</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-sky-200 shadow-sm space-y-1 bg-sky-50/20">
          <div className="text-xs font-extrabold text-sky-700 uppercase">K (Memiliki KMS)</div>
          <div className="text-3xl font-black text-sky-900">{skdn.K}</div>
          <div className="text-xs text-sky-600 font-bold">Cakupan KMS: {Math.round((skdn.K / Math.max(1, skdn.S)) * 100)}%</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-emerald-200 shadow-sm space-y-1 bg-emerald-50/20">
          <div className="text-xs font-extrabold text-emerald-700 uppercase">D (Datang Ditimbang)</div>
          <div className="text-3xl font-black text-emerald-900">{skdn.D}</div>
          <div className="text-xs text-emerald-700 font-bold">Tingkat Partisipasi (D/S): {Math.round((skdn.D / Math.max(1, skdn.S)) * 100)}%</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-amber-200 shadow-sm space-y-1 bg-amber-50/20">
          <div className="text-xs font-extrabold text-amber-700 uppercase">N (Naik Berat Badan)</div>
          <div className="text-3xl font-black text-amber-900">{skdn.N}</div>
          <div className="text-xs text-amber-700 font-bold">Keberhasilan Program (N/D): {Math.round((skdn.N / Math.max(1, skdn.D)) * 100)}%</div>
        </div>
      </div>

      {/* Rincian Penimbangan Bulan Ini */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden p-6 space-y-4">
        <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
          <FileText className="w-5 h-5 text-sky-600" />
          Daftar Balita Ditimbang Periode {skdn.bulan} {skdn.tahun} ({filteredPenimbanganBulanIni.length} Record)
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold uppercase">
                <th className="p-3">Tanggal Timbang</th>
                <th className="p-3">Nama Balita & NIK</th>
                <th className="p-3">Jenis Kelamin</th>
                <th className="p-3">Usia (Bln)</th>
                <th className="p-3">BB (kg) / TB (cm)</th>
                <th className="p-3">Intervensi (Vit A / ASI)</th>
                <th className="p-3">Status Gizi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPenimbanganBulanIni.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    Belum ada data penimbangan balita pada periode {selectedMonthYear}.
                  </td>
                </tr>
              ) : (
                filteredPenimbanganBulanIni.map((p) => {
                  const b = balitaList.find((bal) => bal.id === p.balitaId);

                  return (
                    <tr key={p.id} className="hover:bg-slate-50 transition">
                      <td className="p-3 font-semibold">{p.tanggal}</td>
                      <td className="p-3">
                        <div className="font-bold text-slate-900">{b?.nama || 'Unknown'}</div>
                        <div className="text-[11px] text-slate-500">NIK: {b?.nik}</div>
                      </td>
                      <td className="p-3">{b?.jenisKelamin === 'L' ? 'Laki-Laki' : 'Perempuan'}</td>
                      <td className="p-3 font-bold">{p.usiaBulan} Bln</td>
                      <td className="p-3 font-medium">{p.bb} kg / {p.tb} cm</td>
                      <td className="p-3">
                        {p.vitA && <span className="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded mr-1">Vit A</span>}
                        {p.asiEksklusif && <span className="bg-sky-100 text-sky-800 font-bold px-2 py-0.5 rounded">ASI</span>}
                      </td>
                      <td className="p-3">
                        <span className="bg-emerald-100 text-emerald-800 font-black px-2.5 py-0.5 rounded-full">
                          {p.statusGizi}
                        </span>
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
  );
};
