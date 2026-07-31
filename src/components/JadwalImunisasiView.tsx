import React, { useState } from 'react';
import {
  CalendarCheck2,
  Syringe,
  Clock,
  MapPin,
  Plus,
  ShieldCheck,
  CheckCircle2,
  X,
  UserCheck,
  Calendar
} from 'lucide-react';
import { JadwalPosyandu, ImunisasiMaster } from '../types';

interface JadwalImunisasiViewProps {
  jadwalList: JadwalPosyandu[];
  masterImunisasiList: ImunisasiMaster[];
  onAddJadwal: (newJadwal: JadwalPosyandu) => void;
}

export const JadwalImunisasiView: React.FC<JadwalImunisasiViewProps> = ({
  jadwalList,
  masterImunisasiList,
  onAddJadwal
}) => {
  const [activeTabSub, setActiveTabSub] = useState<'jadwal' | 'imunisasi'>('jadwal');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    judul: '',
    tanggal: new Date().toISOString().split('T')[0],
    jam: '08:00 - 11:30 WIB',
    lokasi: 'Balai Warga Posyandu Mawar I',
    kegiatan: '',
    sasaran: 'Seluruh Balita 0-59 Bulan & Ibu Hamil',
    rt: '01, 02, 03',
    petugasPenanggungJawab: 'Bidan Desa & Kader Posyandu'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newJadwal: JadwalPosyandu = {
      id: `JAD-${Date.now().toString().slice(-4)}`,
      ...formData
    };
    onAddJadwal(newJadwal);
    setIsModalOpen(false);
    setFormData({
      judul: '',
      tanggal: new Date().toISOString().split('T')[0],
      jam: '08:00 - 11:30 WIB',
      lokasi: 'Balai Warga Posyandu Mawar I',
      kegiatan: '',
      sasaran: 'Seluruh Balita 0-59 Bulan & Ibu Hamil',
      rt: '01, 02, 03',
      petugasPenanggungJawab: 'Bidan Desa & Kader Posyandu'
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Sub Tabs */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <CalendarCheck2 className="w-6 h-6 text-sky-600" />
            Jadwal Posyandu & Jadwal Imunisasi Wajib
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Agenda penimbangan bulanan, vitamin A, dan master referensi vaksinasi anak Kementerian Kesehatan
          </p>
        </div>

        <div className="flex space-x-2 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTabSub('jadwal')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeTabSub === 'jadwal'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" /> Agenda Kegiatan
          </button>
          <button
            onClick={() => setActiveTabSub('imunisasi')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeTabSub === 'imunisasi'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Syringe className="w-3.5 h-3.5" /> Panduan Imunisasi
          </button>
        </div>
      </div>

      {activeTabSub === 'jadwal' ? (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-lg text-slate-800">Daftar Agenda Kegiatan Posyandu</h3>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-sky-600 hover:bg-sky-700 text-white font-bold px-4 py-2 rounded-xl shadow transition text-xs flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Tambah Agenda
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {jadwalList.map((j) => (
              <div
                key={j.id}
                className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-3 hover:border-sky-300 transition"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="bg-sky-100 text-sky-800 font-extrabold text-[11px] px-2.5 py-0.5 rounded-full inline-block mb-1">
                      {j.tanggal}
                    </span>
                    <h4 className="font-extrabold text-slate-900 text-base">{j.judul}</h4>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-sky-600" /> {j.jam}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-sky-600" /> {j.lokasi}
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1 text-slate-700">
                  <div>
                    <span className="font-bold text-slate-900">Rincian Kegiatan:</span> {j.kegiatan}
                  </div>
                  <div>
                    <span className="font-bold text-slate-900">Sasaran:</span> {j.sasaran} (RT {j.rt})
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 font-medium flex items-center justify-between border-t border-slate-100 pt-2">
                  <span>PJ: {j.petugasPenanggungJawab}</span>
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Terjadwal
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                <Syringe className="w-5 h-5 text-emerald-600" />
                Jadwal Imunisasi Rutin Lengkap Kemenkes RI
              </h3>
              <p className="text-xs text-slate-500">
                Imunisasi dasar lengkap perlindungan dari Difteri, Tetanus, Polio, Campak, Rubella, dan Hepatitis B
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {masterImunisasiList.map((imun) => (
              <div
                key={imun.id}
                className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 flex items-start space-x-3"
              >
                <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-xl shrink-0 mt-0.5">
                  <Syringe className="w-5 h-5" />
                </div>
                <div className="space-y-1 flex-1">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-slate-900 text-sm">{imun.nama}</span>
                    <span className="bg-emerald-100 text-emerald-800 font-extrabold text-[10px] px-2 py-0.5 rounded-full">
                      Usia {imun.usiaRekomendasi}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">{imun.deskripsi}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal Add Agenda */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-slate-200 space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-lg text-slate-800">Tambah Agenda Posyandu Baru</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-sm">
              <div>
                <label className="block font-semibold mb-1">Judul Kegiatan</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Penimbangan & Vitamin A Bulan Agustus"
                  value={formData.judul}
                  onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                  className="w-full border rounded-xl p-2.5"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Tanggal</label>
                  <input
                    type="date"
                    required
                    value={formData.tanggal}
                    onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
                    className="w-full border rounded-xl p-2.5"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Jam Operasional</label>
                  <input
                    type="text"
                    required
                    value={formData.jam}
                    onChange={(e) => setFormData({ ...formData, jam: e.target.value })}
                    className="w-full border rounded-xl p-2.5"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Lokasi Kegiatan</label>
                <input
                  type="text"
                  required
                  value={formData.lokasi}
                  onChange={(e) => setFormData({ ...formData, lokasi: e.target.value })}
                  className="w-full border rounded-xl p-2.5"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Deskripsi Kegiatan & Layanan</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Rincian penimbangan, pemberian obat cacing, imunisasi..."
                  value={formData.kegiatan}
                  onChange={(e) => setFormData({ ...formData, kegiatan: e.target.value })}
                  className="w-full border rounded-xl p-2.5 resize-none"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border rounded-xl font-semibold"
                >
                  Batal
                </button>
                <button type="submit" className="px-5 py-2 bg-sky-600 text-white font-bold rounded-xl shadow">
                  Simpan Agenda
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
