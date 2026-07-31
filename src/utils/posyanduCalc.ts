import { JenisKelamin, StatusGizi, SkdnData, Balita, Penimbangan } from '../types';
import { whoBoysWeightForAge, whoGirlsWeightForAge, WhoWeightForAgePoint } from '../data/whoGrowthData';

/**
 * Calculates age in months between birth date and target date
 */
export function calculateAgeInMonths(birthDateStr: string, targetDateStr: string = new Date().toISOString().split('T')[0]): number {
  const birth = new Date(birthDateStr);
  const target = new Date(targetDateStr);

  let months = (target.getFullYear() - birth.getFullYear()) * 12;
  months -= birth.getMonth();
  months += target.getMonth();

  if (target.getDate() < birth.getDate()) {
    months--;
  }

  return Math.max(0, months);
}

/**
 * Gets nearest WHO reference point for given month and gender
 */
export function getWhoBenchmark(month: number, gender: JenisKelamin): WhoWeightForAgePoint {
  const list = gender === 'L' ? whoBoysWeightForAge : whoGirlsWeightForAge;
  
  // Find closest month
  let closest = list[0];
  let minDiff = Math.abs(list[0].month - month);

  for (const item of list) {
    const diff = Math.abs(item.month - month);
    if (diff < minDiff) {
      minDiff = diff;
      closest = item;
    }
  }

  return closest;
}

/**
 * Calculates status gizi based on weight, age in months, and gender using WHO standards
 */
export function calculateStatusGizi(weightKg: number, monthAge: number, gender: JenisKelamin): StatusGizi {
  const benchmark = getWhoBenchmark(monthAge, gender);

  if (weightKg < benchmark.sd3Neg) {
    return 'Gizi Buruk';
  } else if (weightKg < benchmark.sd2Neg) {
    return 'Gizi Kurang';
  } else if (weightKg <= benchmark.sd2Pos) {
    return 'Gizi Baik';
  } else if (weightKg <= benchmark.sd3Pos) {
    return 'Risiko Gizi Lebih';
  } else {
    return 'Gizi Lebih';
  }
}

/**
 * Naegele's rule to estimate HPL (Hari Perkiraan Lahir) from HPHT
 * +7 days, -3 months, +1 year
 */
export function calculateHpl(hphtDateStr: string): string {
  if (!hphtDateStr) return '';
  const hpht = new Date(hphtDateStr);
  if (isNaN(hpht.getTime())) return '';

  const hpl = new Date(hpht);
  hpl.setDate(hpl.getDate() + 7);
  hpl.setMonth(hpl.getMonth() - 3 + 12);
  if (hpht.getMonth() >= 3) {
    hpl.setFullYear(hpl.getFullYear() + 1);
  } else {
    hpl.setFullYear(hpht.getFullYear());
  }

  return hpl.toISOString().split('T')[0];
}

/**
 * Calculates pregnancy age in weeks from HPHT
 */
export function calculatePregnancyWeeks(hphtDateStr: string): number {
  if (!hphtDateStr) return 0;
  const hpht = new Date(hphtDateStr);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - hpht.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.floor(diffDays / 7);
}

/**
 * Computes SKDN stats for a given month/year
 */
export function computeSkdnStats(
  balitaList: Balita[],
  penimbanganList: Penimbangan[],
  targetMonthYear: string // 'YYYY-MM'
): SkdnData {
  const [yearStr, monthStr] = targetMonthYear.split('-');
  const year = parseInt(yearStr) || new Date().getFullYear();
  const bulanNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  const bulanName = bulanNames[parseInt(monthStr) - 1] || 'Bulan Ini';

  const S = balitaList.length; // Total sasaran balita
  const K = balitaList.length; // Balita yang punya KMS (biasanya 100% atau mendekati)

  // Filter penimbangan di bulan yang dituju
  const penimbanganBulanIni = penimbanganList.filter(p => p.tanggal.startsWith(targetMonthYear));
  
  // Set of balita unique IDs ditimbang
  const ditimbangSet = new Set(penimbanganBulanIni.map(p => p.balitaId));
  const D = ditimbangSet.size;

  let N = 0; // Naik berat badan dibanding bulan sebelumnya
  let T = 0; // Tidak naik / tetap
  let B = 0; // Baru

  for (const balita of balitaList) {
    const records = penimbanganList
      .filter(p => p.balitaId === balita.id)
      .sort((a, b) => a.tanggal.localeCompare(b.tanggal));

    const currentRecord = records.find(p => p.tanggal.startsWith(targetMonthYear));
    if (currentRecord) {
      const prevRecordIndex = records.findIndex(p => p.id === currentRecord.id) - 1;
      if (prevRecordIndex >= 0) {
        const prevRecord = records[prevRecordIndex];
        if (currentRecord.bb > prevRecord.bb) {
          N++;
        } else {
          T++;
        }
      } else {
        B++; // First time recorded
      }
    }
  }

  const O = S - D; // Tidak hadir ditimbang

  return {
    bulan: bulanName,
    tahun: year,
    S,
    K,
    D,
    N,
    T,
    O,
    B
  };
}
