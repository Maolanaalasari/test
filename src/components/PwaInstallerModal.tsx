import React from 'react';
import { Smartphone, Download, Wifi, CheckCircle2, X, ShieldCheck, Zap } from 'lucide-react';

interface PwaInstallerModalProps {
  onClose: () => void;
}

export const PwaInstallerModal: React.FC<PwaInstallerModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 border border-slate-200 space-y-5">
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-800">Fitur PWA (Progressive Web App)</h3>
              <p className="text-xs text-slate-500">Aplikasi Web Offline & Installable di HP</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 text-xs text-slate-600">
          <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-start space-x-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-emerald-900 text-sm block">Siap Beroperasi Offline</span>
              Pencatatan penimbangan balita dan pendataan ibu hamil dapat digunakan di lapangan meskipun tidak ada koneksi internet. Data tersimpan di memori browser (IndexedDB / LocalStorage).
            </div>
          </div>

          <div className="p-3.5 bg-sky-50 rounded-2xl border border-sky-100 flex items-start space-x-3">
            <Zap className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-sky-900 text-sm block">Akses Cepat dari Home Screen</span>
              Aplikasi dapat dipasang di layar utama (home screen) smartphone Android atau iPhone tanpa perlu download dari Play Store / App Store.
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
            <span className="font-bold text-slate-800 block text-xs">Cara Menginstall di Android / Chrome:</span>
            <ol className="list-decimal list-inside space-y-1 text-slate-600">
              <li>Buka web posyandu ini di Google Chrome.</li>
              <li>Klik tombol <b>"Instal PWA"</b> pada bagian atas navbar.</li>
              <li>Atau klik titik tiga ikon menu Chrome → pilih <b>"Tambahkan ke Layar Utama" / "Install App"</b>.</li>
            </ol>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-2.5 rounded-xl shadow transition"
          >
            Mengerti & Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
