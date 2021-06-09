export interface Delivery {
  date: Date;
  symbolName: string;
  industry: string;
  sector: string;
  volRatio: number;
  delRatio: number;
  percentage: number;
  weekly: number;
  monthly: number;
  last: number;
  totalTradedQty: number;
  avgVolume_30: number;
  reason:  string;
  deliveryQty: number;
}
