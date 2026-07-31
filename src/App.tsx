import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { DashboardView } from './components/DashboardView';
import { BalitaView } from './components/BalitaView';
import { PenimbanganView } from './components/PenimbanganView';
import { IbuHamilView } from './components/IbuHamilView';
import { JadwalImunisasiView } from './components/JadwalImunisasiView';
import { LaporanView } from './components/LaporanView';
import { PhpCodeExporter } from './components/PhpCodeExporter';
import { KmsChartModal } from './components/KmsChartModal';
import { PwaInstallerModal } from './components/PwaInstallerModal';

import { Balita, Penimbangan, IbuHamil, JadwalPosyandu } from './types';
import {
  initialBalitaList,
  initialPenimbanganList,
  initialIbuHamilList,
  initialJadwalList,
  masterImunisasiList
} from './data/initialData';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // LocalStorage Persistence State
  const [balitaList, setBalitaList] = useState<Balita[]>(() => {
    const saved = localStorage.getItem('posyandu_balita');
    return saved ? JSON.parse(saved) : initialBalitaList;
  });

  const [penimbanganList, setPenimbanganList] = useState<Penimbangan[]>(() => {
    const saved = localStorage.getItem('posyandu_penimbangan');
    return saved ? JSON.parse(saved) : initialPenimbanganList;
  });

  const [ibuHamilList, setIbuHamilList] = useState<IbuHamil[]>(() => {
    const saved = localStorage.getItem('posyandu_ibu_hamil');
    return saved ? JSON.parse(saved) : initialIbuHamilList;
  });

  const [jadwalList, setJadwalList] = useState<JadwalPosyandu[]>(() => {
    const saved = localStorage.getItem('posyandu_jadwal');
    return saved ? JSON.parse(saved) : initialJadwalList;
  });

  // Modal States
  const [kmsBalitaModal, setKmsBalitaModal] = useState<Balita | null>(null);
  const [isPwaModalOpen, setIsPwaModalOpen] = useState<boolean>(false);
  const [selectedBalitaForPenimbangan, setSelectedBalitaForPenimbangan] = useState<string>('');

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('posyandu_balita', JSON.stringify(balitaList));
  }, [balitaList]);

  useEffect(() => {
    localStorage.setItem('posyandu_penimbangan', JSON.stringify(penimbanganList));
  }, [penimbanganList]);

  useEffect(() => {
    localStorage.setItem('posyandu_ibu_hamil', JSON.stringify(ibuHamilList));
  }, [ibuHamilList]);

  useEffect(() => {
    localStorage.setItem('posyandu_jadwal', JSON.stringify(jadwalList));
  }, [jadwalList]);

  // Register PWA Service Worker on Mount
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(
          (reg) => console.log('Service Worker PWA berhasil didaftarkan:', reg.scope),
          (err) => console.log('Service Worker PWA error:', err)
        );
      });
    }
  }, []);

  // Handlers
  const handleAddBalita = (newBalita: Balita) => {
    setBalitaList((prev) => [newBalita, ...prev]);
  };

  const handleUpdateBalita = (updatedBalita: Balita) => {
    setBalitaList((prev) => prev.map((b) => (b.id === updatedBalita.id ? updatedBalita : b)));
  };

  const handleDeleteBalita = (id: string) => {
    setBalitaList((prev) => prev.filter((b) => b.id !== id));
    setPenimbanganList((prev) => prev.filter((p) => p.balitaId !== id));
  };

  const handleAddPenimbangan = (newRecord: Penimbangan) => {
    setPenimbanganList((prev) => [newRecord, ...prev]);

    // Update last status gizi on balita
    setBalitaList((prev) =>
      prev.map((b) => {
        if (b.id === newRecord.balitaId) {
          return {
            ...b,
            statusGiziTerakhir: newRecord.statusGizi
          };
        }
        return b;
      })
    );
  };

  const handleDeletePenimbangan = (id: string) => {
    setPenimbanganList((prev) => prev.filter((p) => p.id !== id));
  };

  const handleAddIbuHamil = (newIbu: IbuHamil) => {
    setIbuHamilList((prev) => [newIbu, ...prev]);
  };

  const handleUpdateIbuHamil = (updatedIbu: IbuHamil) => {
    setIbuHamilList((prev) => prev.map((i) => (i.id === updatedIbu.id ? updatedIbu : i)));
  };

  const handleDeleteIbuHamil = (id: string) => {
    setIbuHamilList((prev) => prev.filter((i) => i.id !== id));
  };

  const handleAddJadwal = (newJadwal: JadwalPosyandu) => {
    setJadwalList((prev) => [newJadwal, ...prev]);
  };

  const handleNavigateToTimbang = (balitaId: string) => {
    setSelectedBalitaForPenimbangan(balitaId);
    setActiveTab('penimbangan');
  };

  // Stunting count
  const stuntingCount = balitaList.filter((b) => {
    const records = penimbanganList.filter((p) => p.balitaId === b.id);
    if (records.length === 0) return b.statusGiziTerakhir === 'Gizi Buruk' || b.statusGiziTerakhir === 'Gizi Kurang';
    const last = records.sort((a, b) => b.tanggal.localeCompare(a.tanggal))[0];
    return last.statusGizi === 'Gizi Buruk' || last.statusGizi === 'Gizi Kurang';
  }).length;

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 flex flex-col antialiased selection:bg-sky-500 selection:text-white">
      {/* App Header Bar */}
      <Header
        onOpenPhpExporter={() => setActiveTab('php')}
        onOpenPwaInfo={() => setIsPwaModalOpen(true)}
        activeTab={activeTab}
      />

      {/* App Tab Navigation */}
      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        stuntingCount={stuntingCount}
      />

      {/* Main Page Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        {activeTab === 'dashboard' && (
          <DashboardView
            balitaList={balitaList}
            penimbanganList={penimbanganList}
            ibuHamilList={ibuHamilList}
            jadwalList={jadwalList}
            onNavigate={(tab) => setActiveTab(tab)}
            onOpenKms={(balita) => setKmsBalitaModal(balita)}
          />
        )}

        {activeTab === 'balita' && (
          <BalitaView
            balitaList={balitaList}
            penimbanganList={penimbanganList}
            onAddBalita={handleAddBalita}
            onUpdateBalita={handleUpdateBalita}
            onDeleteBalita={handleDeleteBalita}
            onOpenKms={(balita) => setKmsBalitaModal(balita)}
            onNavigateToTimbang={handleNavigateToTimbang}
          />
        )}

        {activeTab === 'penimbangan' && (
          <PenimbanganView
            balitaList={balitaList}
            penimbanganList={penimbanganList}
            selectedBalitaIdInitial={selectedBalitaForPenimbangan}
            onAddPenimbangan={handleAddPenimbangan}
            onDeletePenimbangan={handleDeletePenimbangan}
            onOpenKms={(balita) => setKmsBalitaModal(balita)}
          />
        )}

        {activeTab === 'ibu_hamil' && (
          <IbuHamilView
            ibuHamilList={ibuHamilList}
            onAddIbuHamil={handleAddIbuHamil}
            onUpdateIbuHamil={handleUpdateIbuHamil}
            onDeleteIbuHamil={handleDeleteIbuHamil}
          />
        )}

        {activeTab === 'jadwal' && (
          <JadwalImunisasiView
            jadwalList={jadwalList}
            masterImunisasiList={masterImunisasiList}
            onAddJadwal={handleAddJadwal}
          />
        )}

        {activeTab === 'laporan' && (
          <LaporanView
            balitaList={balitaList}
            penimbanganList={penimbanganList}
          />
        )}

        {activeTab === 'php' && <PhpCodeExporter />}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-xs py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-3">
          <div>
            <span className="font-bold text-slate-200">Posyandu Digital PWA</span> • Sistem Informasi Terpadu Pos Pelayanan Kesehatan
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setActiveTab('php')}
              className="text-amber-400 font-bold hover:underline"
            >
              Source Code PHP Native
            </button>
            <button
              onClick={() => setIsPwaModalOpen(true)}
              className="text-sky-400 font-bold hover:underline"
            >
              Fitur PWA Offline
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {kmsBalitaModal && (
        <KmsChartModal
          balita={kmsBalitaModal}
          penimbanganList={penimbanganList}
          onClose={() => setKmsBalitaModal(null)}
        />
      )}

      {isPwaModalOpen && (
        <PwaInstallerModal onClose={() => setIsPwaModalOpen(false)} />
      )}
    </div>
  );
}
