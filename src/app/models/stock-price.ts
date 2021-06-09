export interface StockPrice {
  stockPriceId:    string;
  open:            number;
  high:            number;
  low:             number;
  close:           number;
  last:            number;
  prevClose:       number;
  totalTradedQty:  number;
  date:            Date;
  percentage:      number;
  symbolName:      string;
  series:          string;
  symbolId:        number;
  symbol:          string;
  avgVolume_30:    number;
  monthly:         number;
  weekly:          number;
  deliveryQty:     number;
  avgDelivery_30:  number;
  reason:          string;
  volRatio:        number;
  delRatio:        number;
  isFlaged:        boolean;
  delPercentage: number;
  tooltip: string;
}
