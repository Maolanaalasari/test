import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Scatter
} from 'recharts';
import { X, Printer, Baby, ShieldCheck, Download, AlertTriangle } from 'lucide-react';
import { Balita, Penimbangan } from '../types';
import { whoBoysWeightForAge, whoGirlsWeightForAge } from '../data/whoGrowthData';
import { calculateAgeInMonths } from '../utils/posyanduCalc';

interface KmsChartModalProps {
  balita: Balita;
  penimbanganList: Penimbangan[];
  onClose: () => void;
}

export const KmsChartModal: React.FC<KmsChartModalProps> = ({
  balita,
  penimbanganList,
  onClose
}) => {
  const records = penimbanganList
    .filter((p) => p.balitaId === balita.id)
    .sort((a, b) => a.usiaBulan - b.usiaBulan);

  const whoData = balita.jenisKelamin === 'L' ? whoBoysWeightForAge : whoGirlsWeightForAge;

  // Merge WHO standard lines with actual child weights
  const chartData = whoData.map((who) => {
    const childRecord = records.find((r) => r.usiaBulan === who.month);
    return {
      month: who.month,
      sd3Neg: who.sd3Neg,
      sd2Neg: who.sd2Neg,
      median: who.median,
      sd2Pos: who.sd2Pos,
      actualWeight: childRecord ? childRecord.bb : null,
      childDetail: childRecord || null
    };
  });

  const currentAge = calculateAgeInMonths(balita.tanggalLahir);
  const lastRecord = records[records.length - 1];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto border border-slate-200">
        {/* Header Modal */}
        <div className="p-5 bg-gradient-to-r from-sky-700 to-sky-900 text-white rounded-t-3xl flex justify-between items-center print:hidden">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-white/10 rounded-2xl border border-white/20">
              <Baby className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg sm:text-xl tracking-tight">Kartu Menuju Sehat (KMS) Digital</h3>
              <p className="text-xs text-sky-200">Standar Pertumbuhan Balita WHO (Berat Badan Menurut Umur)</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
              title="Cetak KMS Balita"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Cetak</span>
            </button>
            <button
              onClick={onClose}
              className="bg-white/10 hover:bg-rose-500 text-white p-2 rounded-xl transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content printable area */}
        <div className="p-6 space-y-6">
          {/* Child Identity Banner */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 grid sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-slate-400 font-semibold block">Nama Balita</span>
              <span className="font-extrabold text-slate-900 text-sm">{balita.nama}</span>
              <span className="text-slate-500 block font-mono">NIK: {balita.nik}</span>
            </div>

            <div>
              <span className="text-slate-400 font-semibold block">Jenis Kelamin / Lahir</span>
              <span className="font-bold text-slate-800 text-sm">
                {balita.jenisKelamin === 'L' ? 'Laki-Laki ♂' : 'Perempuan ♀'}
              </span>
              <span className="text-slate-500 block">{balita.tanggalLahir} ({currentAge} Bln)</span>
            </div>

            <div>
              <span className="text-slate-400 font-semibold block">Orang Tua / Alamat</span>
              <span className="font-bold text-slate-800">Ibu: {balita.namaIbu}</span>
              <span className="text-slate-500 block">RT {balita.rt} / RW {balita.rw}</span>
            </div>

            <div>
              <span className="text-slate-400 font-semibold block">Status Gizi Terakhir</span>
              <span className="inline-block bg-emerald-100 text-emerald-800 border border-emerald-300 font-black text-xs px-2.5 py-1 rounded-full mt-1">
                {lastRecord?.statusGizi || balita.statusGiziTerakhir || 'Gizi Baik'}
              </span>
            </div>
          </div>

          {/* KMS Chart Box */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-inner">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-bold text-sm text-slate-800">
                Grafik Kurva Pertumbuhan Berat Badan vs Umur (0-60 Bulan)
              </h4>
              <div className="flex items-center gap-3 text-[11px] font-semibold">
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Median (Normal)</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" /> Kuning (-2 SD)</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" /> Merah (-3 SD)</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-sky-600 inline-block" /> BB Balita</span>
              </div>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" label={{ value: 'Usia (Bulan)', position: 'insideBottom', offset: -2, fontSize: 10 }} tick={{ fontSize: 10 }} />
                  <YAxis label={{ value: 'Berat (kg)', angle: -90, position: 'insideLeft', fontSize: 10 }} tick={{ fontSize: 10 }} domain={[0, 28]} />
                  <Tooltip
                    formatter={(value: any, name: string) => {
                      if (name === 'actualWeight') return [`${value} kg`, 'BB Anak'];
                      if (name === 'median') return [`${value} kg`, 'Median Standard'];
                      if (name === 'sd2Neg') return [`${value} kg`, 'Gizi Kurang (-2SD)'];
                      if (name === 'sd3Neg') return [`${value} kg`, 'Gizi Buruk (-3SD)'];
                      return [value, name];
                    }}
                    labelFormatter={(label) => `Usia ${label} Bulan`}
                  />
                  {/* WHO Standard Reference Lines */}
                  <Line type="monotone" dataKey="sd3Pos" stroke="#e0f2fe" strokeWidth={1.5} dot={false} name="sd3Pos" />
                  <Line type="monotone" dataKey="sd2Pos" stroke="#fef08a" strokeWidth={1.5} dot={false} name="sd2Pos" />
                  <Line type="monotone" dataKey="median" stroke="#10b981" strokeWidth={2.5} dot={false} name="median" />
                  <Line type="monotone" dataKey="sd2Neg" stroke="#f59e0b" strokeWidth={2} dot={false} name="sd2Neg" />
                  <Line type="monotone" dataKey="sd3Neg" stroke="#f43f5e" strokeWidth={2} dot={false} name="sd3Neg" />

                  {/* Actual Weight Points Line */}
                  <Line
                    type="monotone"
                    dataKey="actualWeight"
                    stroke="#0284c7"
                    strokeWidth={3}
                    connectNulls
                    dot={{ r: 5, fill: '#0284c7', strokeWidth: 2, stroke: '#ffffff' }}
                    name="actualWeight"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Table Measurement History */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <h4 className="font-bold text-sm text-slate-800 mb-3">Catatan Riwayat Penimbangan</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-200/70 text-slate-700 font-bold border-b">
                    <th className="p-2">Tanggal</th>
                    <th className="p-2">Usia (Bln)</th>
                    <th className="p-2">BB (kg)</th>
                    <th className="p-2">TB (cm)</th>
                    <th className="p-2">LK (cm)</th>
                    <th className="p-2">ASI / Vit A</th>
                    <th className="p-2">Status Gizi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {records.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-4 text-center text-slate-500">
                        Belum ada riwayat penimbangan untuk balita ini.
                      </td>
                    </tr>
                  ) : (
                    records.map((r) => (
                      <tr key={r.id} className="hover:bg-white transition">
                        <td className="p-2 font-medium">{r.tanggal}</td>
                        <td className="p-2 font-bold">{r.usiaBulan} Bln</td>
                        <td className="p-2 font-extrabold text-sky-700">{r.bb} kg</td>
                        <td className="p-2">{r.tb} cm</td>
                        <td className="p-2">{r.lk || '-'} cm</td>
                        <td className="p-2">
                          {r.asiEksklusif && <span className="bg-sky-200 text-sky-800 px-1 py-0.5 rounded text-[10px] mr-1 font-bold">ASI</span>}
                          {r.vitA && <span className="bg-amber-200 text-amber-800 px-1 py-0.5 rounded text-[10px] font-bold">Vit A</span>}
                        </td>
                        <td className="p-2">
                          <span className="font-extrabold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                            {r.statusGizi}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
