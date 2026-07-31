import React, { useState } from 'react';
import {
  PersonStanding,
  Plus,
  Search,
  AlertTriangle,
  Calendar,
  Heart,
  Edit,
  Trash2,
  X,
  CheckCircle2,
  Phone
} from 'lucide-react';
import { IbuHamil, StatusRisikoIbu } from '../types';
import { calculateHpl, calculatePregnancyWeeks } from '../utils/posyanduCalc';

interface IbuHamilViewProps {
  ibuHamilList: IbuHamil[];
  onAddIbuHamil: (newIbu: IbuHamil) => void;
  onUpdateIbuHamil: (updatedIbu: IbuHamil) => void;
  onDeleteIbuHamil: (id: string) => void;
}

export const IbuHamilView: React.FC<IbuHamilViewProps> = ({
  ibuHamilList,
  onAddIbuHamil,
  onUpdateIbuHamil,
  onDeleteIbuHamil
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIbu, setEditingIbu] = useState<IbuHamil | null>(null);

  const [formData, setFormData] = useState({
    nik: '',
    nama: '',
    namaSuami: '',
    tanggalLahir: '',
    alamat: '',
    rt: '01',
    rw: '03',
    hpht: '',
    lila: 24.5,
    bbAwal: 50,
    bbSekarang: 55,
    hb: 11.5,
    noHp: '',
    suplemenFe: true
  });

  const handleOpenAdd = () => {
    setEditingIbu(null);
    setFormData({
      nik: '',
      nama: '',
      namaSuami: '',
      tanggalLahir: '',
      alamat: '',
      rt: '01',
      rw: '03',
      hpht: new Date().toISOString().split('T')[0],
      lila: 24.5,
      bbAwal: 50,
      bbSekarang: 55,
      hb: 11.5,
      noHp: '',
      suplemenFe: true
    });
    setIsModalOpen(true);
  };

  const calculatedHpl = calculateHpl(formData.hpht);
  const calculatedWeeks = calculatePregnancyWeeks(formData.hpht);

  // Auto detect KEK status
  const autoStatusRisiko: StatusRisikoIbu =
    formData.lila < 23.5
      ? 'Kurang Energi Kronis (KEK)'
      : formData.hb && formData.hb < 10.5
      ? 'Risiko Tinggi'
      : 'Normal';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingIbu) {
      onUpdateIbuHamil({
        ...editingIbu,
        ...formData,
        hpl: calculatedHpl,
        usiaKehamilanMinggu: calculatedWeeks,
        statusRisiko: autoStatusRisiko
      });
    } else {
      const newIbu: IbuHamil = {
        id: `IBU-${Date.now().toString().slice(-4)}`,
        ...formData,
        hpl: calculatedHpl,
        usiaKehamilanMinggu: calculatedWeeks,
        statusRisiko: autoStatusRisiko
      };
      onAddIbuHamil(newIbu);
    }
    setIsModalOpen(false);
  };

  const filteredList = ibuHamilList.filter(
    (ibu) =>
      ibu.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ibu.nik.includes(searchTerm) ||
      ibu.namaSuami.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <PersonStanding className="w-6 h-6 text-pink-600" />
            Pendataan Ibu Hamil ({ibuHamilList.length} Orang)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Pemantauan usia kehamilan, HPL (Rumus Naegele), lingkar lengan atas (LiLA), dan deteksi KEK
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="bg-pink-600 hover:bg-pink-700 text-white font-bold px-4 py-2.5 rounded-xl shadow transition flex items-center gap-2 text-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Ibu Hamil Baru</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Cari NIK, nama ibu, atau nama suami..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
          />
        </div>
      </div>

      {/* Table Data Ibu Hamil */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-600 uppercase tracking-wider">
                <th className="p-4">Nama Ibu & NIK</th>
                <th className="p-4">Suami & Kontak</th>
                <th className="p-4">HPHT & HPL (Tafsiran)</th>
                <th className="p-4">Usia Kehamilan</th>
                <th className="p-4">LiLA & HB</th>
                <th className="p-4">Status Risiko</th>
                <th className="p-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    Belum ada data ibu hamil terdaftar.
                  </td>
                </tr>
              ) : (
                filteredList.map((ibu) => {
                  const weeks = calculatePregnancyWeeks(ibu.hpht);
                  const hpl = calculateHpl(ibu.hpht);

                  return (
                    <tr key={ibu.id} className="hover:bg-pink-50/20 transition">
                      <td className="p-4">
                        <div className="font-bold text-slate-900">{ibu.nama}</div>
                        <div className="text-xs text-slate-500 font-mono">NIK: {ibu.nik}</div>
                      </td>
                      <td className="p-4">
                        <div className="text-xs font-semibold text-slate-800">Suami: {ibu.namaSuami}</div>
                        <div className="text-xs text-slate-500 flex items-center gap-1">
                          <Phone className="w-3 h-3" /> {ibu.noHp || '-'}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-xs text-slate-600">HPHT: {ibu.hpht}</div>
                        <div className="font-bold text-pink-700 text-xs">HPL: {hpl || ibu.hpl}</div>
                      </td>
                      <td className="p-4">
                        <span className="font-extrabold text-slate-900 text-sm">{weeks || ibu.usiaKehamilanMinggu}</span>{' '}
                        <span className="text-xs text-slate-500 font-medium">Minggu</span>
                      </td>
                      <td className="p-4 text-xs font-semibold">
                        <div className={ibu.lila < 23.5 ? 'text-rose-600 font-extrabold' : 'text-slate-800'}>
                          LiLA: {ibu.lila} cm {ibu.lila < 23.5 && '⚠️ (<23.5)'}
                        </div>
                        <div className="text-slate-500">HB: {ibu.hb || '-'} g/dL</div>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-1 text-xs rounded-full font-extrabold border ${
                            ibu.statusRisiko === 'Kurang Energi Kronis (KEK)'
                              ? 'bg-rose-100 text-rose-800 border-rose-300'
                              : ibu.statusRisiko === 'Risiko Tinggi'
                              ? 'bg-amber-100 text-amber-800 border-amber-300'
                              : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          }`}
                        >
                          {ibu.statusRisiko}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center space-x-1.5">
                          <button
                            onClick={() => {
                              setEditingIbu(ibu);
                              setFormData({
                                nik: ibu.nik,
                                nama: ibu.nama,
                                namaSuami: ibu.namaSuami,
                                tanggalLahir: ibu.tanggalLahir,
                                alamat: ibu.alamat,
                                rt: ibu.rt,
                                rw: ibu.rw,
                                hpht: ibu.hpht,
                                lila: ibu.lila,
                                bbAwal: ibu.bbAwal,
                                bbSekarang: ibu.bbSekarang,
                                hb: ibu.hb || 11.5,
                                noHp: ibu.noHp,
                                suplemenFe: ibu.suplemenFe
                              });
                              setIsModalOpen(true);
                            }}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-2 rounded-lg text-xs font-bold transition"
                            title="Edit"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Hapus data ibu hamil ${ibu.nama}?`)) {
                                onDeleteIbuHamil(ibu.id);
                              }
                            }}
                            className="bg-rose-50 hover:bg-rose-100 text-rose-600 p-2 rounded-lg text-xs font-bold transition"
                            title="Hapus"
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

      {/* Add / Edit Ibu Hamil Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto border border-slate-200">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-pink-50 rounded-t-2xl">
              <h3 className="font-bold text-lg text-pink-900 flex items-center gap-2">
                <PersonStanding className="w-5 h-5 text-pink-600" />
                {editingIbu ? 'Edit Data Ibu Hamil' : 'Form Pendataan Ibu Hamil Baru'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-sm">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">NIK Ibu Hamil</label>
                  <input
                    type="text"
                    required
                    maxLength={16}
                    value={formData.nik}
                    onChange={(e) => setFormData({ ...formData, nik: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl p-2.5 focus:ring-2 focus:ring-pink-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nama Lengkap Ibu</label>
                  <input
                    type="text"
                    required
                    value={formData.nama}
                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl p-2.5 focus:ring-2 focus:ring-pink-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nama Suami</label>
                  <input
                    type="text"
                    required
                    value={formData.namaSuami}
                    onChange={(e) => setFormData({ ...formData, namaSuami: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl p-2.5 focus:ring-2 focus:ring-pink-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nomor HP / WhatsApp</label>
                  <input
                    type="text"
                    value={formData.noHp}
                    onChange={(e) => setFormData({ ...formData, noHp: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl p-2.5 focus:ring-2 focus:ring-pink-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Hari Pertama Haid Terakhir (HPHT)</label>
                  <input
                    type="date"
                    required
                    value={formData.hpht}
                    onChange={(e) => setFormData({ ...formData, hpht: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl p-2.5 focus:ring-2 focus:ring-pink-500 outline-none font-bold"
                  />
                </div>
                <div className="p-3 bg-pink-50 rounded-xl border border-pink-100 flex flex-col justify-center">
                  <span className="text-[11px] font-bold text-pink-700 uppercase">Tafsiran Lahir (HPL Rumus Naegele)</span>
                  <span className="font-extrabold text-pink-900 text-sm">{calculatedHpl || '-'}</span>
                  <span className="text-xs text-pink-700 font-semibold">{calculatedWeeks} Minggu Usia Kehamilan</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">LiLA (cm)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={formData.lila}
                    onChange={(e) => setFormData({ ...formData, lila: parseFloat(e.target.value) || 0 })}
                    className="w-full border border-slate-200 rounded-xl p-2.5 focus:ring-2 focus:ring-pink-500 outline-none font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">BB Sekarang (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={formData.bbSekarang}
                    onChange={(e) => setFormData({ ...formData, bbSekarang: parseFloat(e.target.value) || 0 })}
                    className="w-full border border-slate-200 rounded-xl p-2.5 focus:ring-2 focus:ring-pink-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">HB (g/dL)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.hb}
                    onChange={(e) => setFormData({ ...formData, hb: parseFloat(e.target.value) || 0 })}
                    className="w-full border border-slate-200 rounded-xl p-2.5 focus:ring-2 focus:ring-pink-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Alamat</label>
                <textarea
                  required
                  rows={2}
                  value={formData.alamat}
                  onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl p-2.5 focus:ring-2 focus:ring-pink-500 outline-none resize-none"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 font-semibold"
                >
                  Batal
                </button>
                <button type="submit" className="px-5 py-2 bg-pink-600 text-white rounded-xl font-bold shadow">
                  Simpan Data Ibu Hamil
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
