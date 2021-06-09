export interface SectorStock {
  date:           Date;
  code:           string;
  close:          number;
  percentage:     number;
  monthly:        number;
  weekly:         number;
  marketCap:      number;
  totalTradedQty: number;
  avgVolume_30:   number;
  sector:         string;
  industry:       string;
  reason:         string;
}
