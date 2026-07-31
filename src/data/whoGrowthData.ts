export interface WhoWeightForAgePoint {
  month: number;
  sd3Neg: number; // Gizi Buruk threshold (-3 SD)
  sd2Neg: number; // Gizi Kurang threshold (-2 SD)
  median: number; // Median (0 SD) Normal
  sd2Pos: number; // Risiko Gizi Lebih (+2 SD)
  sd3Pos: number; // Gizi Lebih (+3 SD)
}

// WHO Weight-for-Age Standard Benchmark Data for Boys (Laki-laki 0-60 bulan)
export const whoBoysWeightForAge: WhoWeightForAgePoint[] = [
  { month: 0, sd3Neg: 2.1, sd2Neg: 2.5, median: 3.3, sd2Pos: 4.4, sd3Pos: 5.0 },
  { month: 1, sd3Neg: 2.9, sd2Neg: 3.4, median: 4.5, sd2Pos: 5.8, sd3Pos: 6.6 },
  { month: 2, sd3Neg: 3.8, sd2Neg: 4.3, median: 5.6, sd2Pos: 7.1, sd3Pos: 8.0 },
  { month: 3, sd3Neg: 4.4, sd2Neg: 5.0, median: 6.4, sd2Pos: 8.0, sd3Pos: 9.0 },
  { month: 4, sd3Neg: 4.9, sd2Neg: 5.6, median: 7.0, sd2Pos: 8.7, sd3Pos: 9.7 },
  { month: 5, sd3Neg: 5.3, sd2Neg: 6.0, median: 7.5, sd2Pos: 9.3, sd3Pos: 10.4 },
  { month: 6, sd3Neg: 5.7, sd2Neg: 6.4, median: 7.9, sd2Pos: 9.8, sd3Pos: 10.9 },
  { month: 7, sd3Neg: 5.9, sd2Neg: 6.7, median: 8.3, sd2Pos: 10.3, sd3Pos: 11.4 },
  { month: 8, sd3Neg: 6.2, sd2Neg: 6.9, median: 8.6, sd2Pos: 10.7, sd3Pos: 11.9 },
  { month: 9, sd3Neg: 6.4, sd2Neg: 7.1, median: 8.9, sd2Pos: 11.0, sd3Pos: 12.3 },
  { month: 10, sd3Neg: 6.6, sd2Neg: 7.4, median: 9.2, sd2Pos: 11.4, sd3Pos: 12.7 },
  { month: 11, sd3Neg: 6.8, sd2Neg: 7.6, median: 9.4, sd2Pos: 11.7, sd3Pos: 13.0 },
  { month: 12, sd3Neg: 6.9, sd2Neg: 7.7, median: 9.6, sd2Pos: 12.0, sd3Pos: 13.3 },
  { month: 15, sd3Neg: 7.4, sd2Neg: 8.3, median: 10.3, sd2Pos: 12.8, sd3Pos: 14.3 },
  { month: 18, sd3Neg: 7.8, sd2Neg: 8.8, median: 10.9, sd2Pos: 13.7, sd3Pos: 15.3 },
  { month: 21, sd3Neg: 8.2, sd2Neg: 9.2, median: 11.5, sd2Pos: 14.5, sd3Pos: 16.2 },
  { month: 24, sd3Neg: 8.6, sd2Neg: 9.7, median: 12.2, sd2Pos: 15.3, sd3Pos: 17.1 },
  { month: 30, sd3Neg: 9.4, sd2Neg: 10.5, median: 13.3, sd2Pos: 16.9, sd3Pos: 19.0 },
  { month: 36, sd3Neg: 10.0, sd2Neg: 11.3, median: 14.3, sd2Pos: 18.3, sd3Pos: 20.7 },
  { month: 42, sd3Neg: 10.7, sd2Neg: 12.0, median: 15.3, sd2Pos: 19.7, sd3Pos: 22.4 },
  { month: 48, sd3Neg: 11.3, sd2Neg: 12.7, median: 16.3, sd2Pos: 21.2, sd3Pos: 24.2 },
  { month: 54, sd3Neg: 11.9, sd2Neg: 13.4, median: 17.3, sd2Pos: 22.7, sd3Pos: 26.1 },
  { month: 60, sd3Neg: 12.4, sd2Neg: 14.1, median: 18.3, sd2Pos: 24.2, sd3Pos: 27.9 },
];

// WHO Weight-for-Age Standard Benchmark Data for Girls (Perempuan 0-60 bulan)
export const whoGirlsWeightForAge: WhoWeightForAgePoint[] = [
  { month: 0, sd3Neg: 2.0, sd2Neg: 2.4, median: 3.2, sd2Pos: 4.2, sd3Pos: 4.8 },
  { month: 1, sd3Neg: 2.7, sd2Neg: 3.2, median: 4.2, sd2Pos: 5.5, sd3Pos: 6.2 },
  { month: 2, sd3Neg: 3.4, sd2Neg: 3.9, median: 5.1, sd2Pos: 6.6, sd3Pos: 7.5 },
  { month: 3, sd3Neg: 4.0, sd2Neg: 4.5, median: 5.8, sd2Pos: 7.5, sd3Pos: 8.5 },
  { month: 4, sd3Neg: 4.4, sd2Neg: 5.0, median: 6.4, sd2Pos: 8.2, sd3Pos: 9.3 },
  { month: 5, sd3Neg: 4.8, sd2Neg: 5.4, median: 6.9, sd2Pos: 8.8, sd3Pos: 10.0 },
  { month: 6, sd3Neg: 5.1, sd2Neg: 5.7, median: 7.3, sd2Pos: 9.3, sd3Pos: 10.6 },
  { month: 7, sd3Neg: 5.3, sd2Neg: 6.0, median: 7.6, sd2Pos: 9.8, sd3Pos: 11.1 },
  { month: 8, sd3Neg: 5.6, sd2Neg: 6.3, median: 7.9, sd2Pos: 10.2, sd3Pos: 11.6 },
  { month: 9, sd3Neg: 5.8, sd2Neg: 6.5, median: 8.2, sd2Pos: 10.5, sd3Pos: 12.0 },
  { month: 10, sd3Neg: 5.9, sd2Neg: 6.7, median: 8.5, sd2Pos: 10.9, sd3Pos: 12.4 },
  { month: 11, sd3Neg: 6.1, sd2Neg: 6.9, median: 8.7, sd2Pos: 11.2, sd3Pos: 12.8 },
  { month: 12, sd3Neg: 6.3, sd2Neg: 7.0, median: 8.9, sd2Pos: 11.5, sd3Pos: 13.1 },
  { month: 15, sd3Neg: 6.7, sd2Neg: 7.6, median: 9.6, sd2Pos: 12.4, sd3Pos: 14.1 },
  { month: 18, sd3Neg: 7.2, sd2Neg: 8.1, median: 10.2, sd2Pos: 13.2, sd3Pos: 15.1 },
  { month: 21, sd3Neg: 7.6, sd2Neg: 8.6, median: 10.9, sd2Pos: 14.0, sd3Pos: 16.1 },
  { month: 24, sd3Neg: 8.1, sd2Neg: 9.0, median: 11.5, sd2Pos: 14.8, sd3Pos: 17.0 },
  { month: 30, sd3Neg: 8.9, sd2Neg: 10.0, median: 12.7, sd2Pos: 16.5, sd3Pos: 19.0 },
  { month: 36, sd3Neg: 9.6, sd2Neg: 10.8, median: 13.9, sd2Pos: 18.1, sd3Pos: 20.9 },
  { month: 42, sd3Neg: 10.2, sd2Neg: 11.6, median: 15.0, sd2Pos: 19.6, sd3Pos: 22.8 },
  { month: 48, sd3Neg: 10.9, sd2Neg: 12.3, median: 16.1, sd2Pos: 21.2, sd3Pos: 24.8 },
  { month: 54, sd3Neg: 11.5, sd2Neg: 13.0, median: 17.2, sd2Pos: 22.8, sd3Pos: 26.8 },
  { month: 60, sd3Neg: 12.1, sd2Neg: 13.7, median: 18.2, sd2Pos: 24.4, sd3Pos: 28.8 },
];
