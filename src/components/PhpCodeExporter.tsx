import React, { useState } from 'react';
import {
  FileCode2,
  Copy,
  Check,
  Download,
  Server,
  BookOpen,
  Database,
  Terminal,
  ExternalLink,
  Code2
} from 'lucide-react';
import { phpCodeFiles } from '../data/phpNativeCode';

export const PhpCodeExporter: React.FC = () => {
  const [activeFilename, setActiveFilename] = useState<string>('index.php');
  const [copied, setCopied] = useState<boolean>(false);

  const activeFile = phpCodeFiles.find((f) => f.filename === activeFilename) || phpCodeFiles[0];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(activeFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSingleFile = (file: typeof activeFile) => {
    const element = document.createElement('a');
    const blob = new Blob([file.content], { type: 'text/plain' });
    element.href = URL.createObjectURL(blob);
    element.download = file.filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleDownloadAllFiles = () => {
    phpCodeFiles.forEach((file) => {
      setTimeout(() => {
        handleDownloadSingleFile(file);
      }, 200);
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-indigo-950 p-6 rounded-3xl text-white shadow-xl border border-sky-800/50">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-amber-400 text-slate-950 font-extrabold text-xs px-2.5 py-0.5 rounded-full shadow-sm">
                PHP Native + MySQL (PDO)
              </span>
              <span className="bg-sky-500/30 text-sky-200 text-xs px-2.5 py-0.5 rounded-full border border-sky-400/30">
                PWA Ready
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-2">
              <Code2 className="w-8 h-8 text-amber-400" />
              Source Code PHP Native & PWA
            </h2>
            <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
              Seluruh source code PHP Native lengkap dengan skrip MySQL database, Service Worker PWA,
              dan halaman web posyandu siap pakai di XAMPP, Laragon, atau cPanel web hosting.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleDownloadAllFiles}
              className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-extrabold px-5 py-3 rounded-2xl shadow-lg transition flex items-center gap-2 text-sm"
            >
              <Download className="w-4 h-4" />
              <span>Download Semua File PHP</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Code Viewer Box */}
      <div className="bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden">
        {/* File Tabs Bar */}
        <div className="bg-slate-950/80 border-b border-slate-800 p-2 flex space-x-1 overflow-x-auto scrollbar-none">
          {phpCodeFiles.map((file) => {
            const isActive = file.filename === activeFilename;

            return (
              <button
                key={file.filename}
                onClick={() => {
                  setActiveFilename(file.filename);
                  setCopied(false);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-mono font-semibold transition flex items-center gap-2 whitespace-nowrap ${
                  isActive
                    ? 'bg-sky-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <FileCode2 className={`w-3.5 h-3.5 ${isActive ? 'text-amber-300' : 'text-slate-500'}`} />
                <span>{file.filename}</span>
              </button>
            );
          })}
        </div>

        {/* File Description Header */}
        <div className="p-4 bg-slate-900 border-b border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h3 className="font-bold text-white text-base flex items-center gap-2 font-mono">
              <Terminal className="w-4 h-4 text-sky-400" />
              {activeFile.title} ({activeFile.filename})
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">{activeFile.description}</p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopyCode}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-300" /> Tersalin!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" /> Salin Kode
                </>
              )}
            </button>

            <button
              onClick={() => handleDownloadSingleFile(activeFile)}
              className="bg-sky-600 hover:bg-sky-500 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow"
            >
              <Download className="w-3.5 h-3.5" /> Unduh File
            </button>
          </div>
        </div>

        {/* Code Content Editor Display */}
        <div className="p-5 overflow-x-auto max-h-[500px] font-mono text-xs text-slate-200 leading-relaxed bg-slate-950 selection:bg-sky-600 selection:text-white">
          <pre>
            <code>{activeFile.content}</code>
          </pre>
        </div>
      </div>

      {/* Deployment & Setup Instructions */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
        <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
          <Server className="w-5 h-5 text-sky-600" />
          Cara Menjalankan Source Code PHP di XAMPP / CPanel
        </h3>

        <div className="grid md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <div className="font-bold text-sky-900 text-sm flex items-center gap-2">
              <Database className="w-4 h-4 text-sky-600" /> 1. Import Database SQL
            </div>
            <p className="text-slate-600 leading-relaxed">
              Buka <b>phpMyAdmin</b> (<code className="bg-slate-200 px-1 py-0.5 rounded text-slate-800">localhost/phpmyadmin</code>), buat database bernama <code className="bg-slate-200 px-1 py-0.5 rounded font-bold">posyandu_db</code>, lalu import file <code className="bg-slate-200 px-1 py-0.5 rounded">database.sql</code>.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <div className="font-bold text-sky-900 text-sm flex items-center gap-2">
              <Server className="w-4 h-4 text-sky-600" /> 2. Copy Folder ke Htdocs
            </div>
            <p className="text-slate-600 leading-relaxed">
              Copy semua file di atas ke dalam folder <code className="bg-slate-200 px-1 py-0.5 rounded">C:/xampp/htdocs/posyandu/</code> atau public_html cPanel hosting Anda.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <div className="font-bold text-sky-900 text-sm flex items-center gap-2">
              <ExternalLink className="w-4 h-4 text-sky-600" /> 3. Buka di Browser & PWA
            </div>
            <p className="text-slate-600 leading-relaxed">
              Akses <code className="bg-slate-200 px-1 py-0.5 rounded text-slate-800">http://localhost/posyandu/</code>. Aplikasi PWA dapat langsung diinstall di Google Chrome atau HP Android!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
