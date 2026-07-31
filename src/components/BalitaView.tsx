import React, { useState } from 'react';
import {
  Baby,
  Search,
  Plus,
  Filter,
  Eye,
  Edit,
  Trash2,
  Calendar,
  User,
  Scale,
  X,
  CheckCircle2,
  Download
} from 'lucide-react';
import { Balita, JenisKelamin, StatusGizi, Penimbangan } from '../types';
import { calculateAgeInMonths } from '../utils/posyanduCalc';

interface BalitaViewProps {
  balitaList: Balita[];
  penimbanganList: Penimbangan[];
  onAddBalita: (newBalita: Balita) => void;
  onUpdateBalita: (updatedBalita: Balita) => void;
  onDeleteBalita: (id: string) => void;
  onOpenKms: (balita: Balita) => void;
  onNavigateToTimbang: (balitaId: string) => void;
}

export const BalitaView: React.FC<BalitaViewProps> = ({
  balitaList,
  penimbanganList,
  onAddBalita,
  onUpdateBalita,
  onDeleteBalita,
  onOpenKms,
  onNavigateToTimbang
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRt, setSelectedRt] = useState('ALL');
  const [selectedGender, setSelectedGender] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBalita, setEditingBalita] = useState<Balita | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    nik: '',
    nama: '',
    jenisKelamin: 'L' as JenisKelamin,
    tanggalLahir: '',
    namaIbu: '',
    namaAyah: '',
    alamat: '',
    rt: '01',
    rw: '03',
    noHp: '',
    bbLahir: 3.2,
    tbLahir: 49,
    golDarah: '-'
  });

  const resetForm = () => {
    setFormData({
      nik: '',
      nama: '',
      jenisKelamin: 'L',
      tanggalLahir: '',
      namaIbu: '',
      namaAyah: '',
      alamat: '',
      rt: '01',
      rw: '03',
      noHp: '',
      bbLahir: 3.2,
      tbLahir: 49,
      golDarah: '-'
    });
    setEditingBalita(null);
  };

  const handleOpenAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (balita: Balita) => {
    setEditingBalita(balita);
    setFormData({
      nik: balita.nik,
      nama: balita.nama,
      jenisKelamin: balita.jenisKelamin,
      tanggalLahir: balita.tanggalLahir,
      namaIbu: balita.namaIbu,
      namaAyah: balita.namaAyah,
      alamat: balita.alamat,
      rt: balita.rt,
      rw: balita.rw,
      noHp: balita.noHp,
      bbLahir: balita.bbLahir,
      tbLahir: balita.tbLahir,
      golDarah: balita.golDarah || '-'
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBalita) {
      onUpdateBalita({
        ...editingBalita,
        ...formData
      });
    } else {
      const newBalita: Balita = {
        id: `BAL-${Date.now().toString().slice(-4)}`,
        ...formData,
        posyanduName: 'Posyandu Mawar I',
        statusGiziTerakhir: 'Gizi Baik'
      };
      onAddBalita(newBalita);
    }
    setIsModalOpen(false);
    resetForm();
  };

  const filteredBalita = balitaList.filter((b) => {
    const matchesSearch =
      b.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.nik.includes(searchTerm) ||
      b.namaIbu.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRt = selectedRt === 'ALL' || b.rt === selectedRt;
    const matchesGender = selectedGender === 'ALL' || b.jenisKelamin === selectedGender;
    return matchesSearch && matchesRt && matchesGender;
  });

  const getStatusBadgeClass = (status?: StatusGizi) => {
    switch (status) {
      case 'Gizi Buruk':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'Gizi Kurang':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Gizi Baik':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Risiko Gizi Lebih':
      case 'Gizi Lebih':
        return 'bg-sky-100 text-sky-800 border-sky-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Baby className="w-6 h-6 text-sky-600" />
            Pendataan Balita ({balitaList.length} Anak)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola data identitas anak, riwayat orang tua, dan tautan KMS grafik
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl shadow transition flex items-center gap-2 text-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Daftarkan Balita Baru</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Cari NIK, nama balita, atau nama ibu..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          <div className="flex items-center gap-1 text-xs text-slate-500 font-semibold shrink-0">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </div>
          <select
            value={selectedRt}
            onChange={(e) => setSelectedRt(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700"
          >
            <option value="ALL">Semua RT</option>
            <option value="01">RT 01</option>
            <option value="02">RT 02</option>
            <option value="03">RT 03</option>
          </select>

          <select
            value={selectedGender}
            onChange={(e) => setSelectedGender(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700"
          >
            <option value="ALL">Semua Gender</option>
            <option value="L">Laki-Laki (L)</option>
            <option value="P">Perempuan (P)</option>
          </select>
        </div>
      </div>

      {/* Balita Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-600 uppercase tracking-wider">
                <th className="p-4">Nama Balita & NIK</th>
                <th className="p-4">Jenis Kelamin</th>
                <th className="p-4">Usia & Lahir</th>
                <th className="p-4">Orang Tua / Alamat</th>
                <th className="p-4">BB/TB Lahir</th>
                <th className="p-4">Status Gizi</th>
                <th className="p-4 text-center">Aksi / KMS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBalita.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    Tidak ada data balita yang cocok dengan filter atau pencarian.
                  </td>
                </tr>
              ) : (
                filteredBalita.map((balita) => {
                  const usiaBulan = calculateAgeInMonths(balita.tanggalLahir);
                  const balitaPenimbangan = penimbanganList.filter((p) => p.balitaId === balita.id);
                  const lastPenimbangan = balitaPenimbangan.sort((a, b) => b.tanggal.localeCompare(a.tanggal))[0];
                  const currentStatus = lastPenimbangan ? lastPenimbangan.statusGizi : balita.statusGiziTerakhir;

                  return (
                    <tr key={balita.id} className="hover:bg-sky-50/30 transition">
                      <td className="p-4">
                        <div className="font-bold text-slate-900">{balita.nama}</div>
                        <div className="text-xs text-slate-500 font-mono">NIK: {balita.nik}</div>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-0.5 text-xs rounded-full font-bold border ${
                            balita.jenisKelamin === 'L'
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : 'bg-pink-50 text-pink-700 border-pink-200'
                          }`}
                        >
                          {balita.jenisKelamin === 'L' ? 'Laki-Laki' : 'Perempuan'}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-slate-800">{usiaBulan} Bulan</div>
                        <div className="text-xs text-slate-500">{balita.tanggalLahir}</div>
                      </td>
                      <td className="p-4">
                        <div className="text-xs font-semibold text-slate-800">Ibu: {balita.namaIbu}</div>
                        <div className="text-xs text-slate-500">
                          {balita.alamat} (RT {balita.rt}/RW {balita.rw})
                        </div>
                      </td>
                      <td className="p-4 text-xs font-medium text-slate-700">
                        {balita.bbLahir} kg / {balita.tbLahir} cm
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-1 text-xs rounded-full font-extrabold border ${getStatusBadgeClass(
                            currentStatus
                          )}`}
                        >
                          {currentStatus || 'Gizi Baik'}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center space-x-1.5">
                          <button
                            onClick={() => onOpenKms(balita)}
                            className="bg-sky-600 hover:bg-sky-700 text-white p-2 rounded-lg text-xs font-bold transition flex items-center gap-1 shadow-sm"
                            title="Buka Kartu Menuju Sehat (KMS Chart)"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">KMS</span>
                          </button>

                          <button
                            onClick={() => onNavigateToTimbang(balita.id)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded-lg text-xs font-bold transition flex items-center gap-1 shadow-sm"
                            title="Catat Penimbangan"
                          >
                            <Scale className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleOpenEditModal(balita)}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-2 rounded-lg text-xs font-bold transition"
                            title="Edit Data"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => {
                              if (confirm(`Hapus data balita ${balita.nama}?`)) {
                                onDeleteBalita(balita.id);
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

      {/* Add / Edit Balita Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto border border-slate-200">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-2xl">
              <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                <Baby className="w-5 h-5 text-sky-600" />
                {editingBalita ? 'Edit Data Balita' : 'Form Pendaftaran Balita Baru'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-200/50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-sm">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">NIK Balita (16 Digit)</label>
                  <input
                    type="text"
                    required
                    maxLength={16}
                    placeholder="3201..."
                    value={formData.nik}
                    onChange={(e) => setFormData({ ...formData, nik: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl p-2.5 focus:ring-2 focus:ring-sky-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nama Lengkap Balita</label>
                  <input
                    type="text"
                    required
                    placeholder="Nama lengkap anak..."
                    value={formData.nama}
                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl p-2.5 focus:ring-2 focus:ring-sky-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Jenis Kelamin</label>
                  <select
                    value={formData.jenisKelamin}
                    onChange={(e) => setFormData({ ...formData, jenisKelamin: e.target.value as JenisKelamin })}
                    className="w-full border border-slate-200 rounded-xl p-2.5 focus:ring-2 focus:ring-sky-500 outline-none bg-white"
                  >
                    <option value="L">Laki-Laki</option>
                    <option value="P">Perempuan</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tanggal Lahir</label>
                  <input
                    type="date"
                    required
                    value={formData.tanggalLahir}
                    onChange={(e) => setFormData({ ...formData, tanggalLahir: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl p-2.5 focus:ring-2 focus:ring-sky-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nama Ibu Kandung</label>
                  <input
                    type="text"
                    required
                    placeholder="Nama ibu..."
                    value={formData.namaIbu}
                    onChange={(e) => setFormData({ ...formData, namaIbu: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl p-2.5 focus:ring-2 focus:ring-sky-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nama Ayah</label>
                  <input
                    type="text"
                    required
                    placeholder="Nama ayah..."
                    value={formData.namaAyah}
                    onChange={(e) => setFormData({ ...formData, namaAyah: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl p-2.5 focus:ring-2 focus:ring-sky-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">BB Lahir (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={formData.bbLahir}
                    onChange={(e) => setFormData({ ...formData, bbLahir: parseFloat(e.target.value) || 0 })}
                    className="w-full border border-slate-200 rounded-xl p-2.5 focus:ring-2 focus:ring-sky-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">TB Lahir (cm)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={formData.tbLahir}
                    onChange={(e) => setFormData({ ...formData, tbLahir: parseFloat(e.target.value) || 0 })}
                    className="w-full border border-slate-200 rounded-xl p-2.5 focus:ring-2 focus:ring-sky-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">RT</label>
                  <input
                    type="text"
                    required
                    value={formData.rt}
                    onChange={(e) => setFormData({ ...formData, rt: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl p-2.5 focus:ring-2 focus:ring-sky-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Alamat Lengkap</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Jl. Melati RT 01 / RW 03..."
                  value={formData.alamat}
                  onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl p-2.5 focus:ring-2 focus:ring-sky-500 outline-none resize-none"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold shadow"
                >
                  {editingBalita ? 'Simpan Perubahan' : 'Daftarkan Balita'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
