export interface Sector {
  date: Date;
  sector: string;
  gainers: number;
  loser: number;
  nutral: number;
  total: number;
  gainerRatio: number;
  score: number;
  day1Gainer: number;
  day2Gainer: number;
  day3Gainer: number;
  day4Gainer: number;
  day5Gainer: number;

  day0Color: string;
  day1Color: string;
  day2Color: string;
  day3Color: string;
  day4Color: string;
  day5Color: string;

}
