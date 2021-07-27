export class EarningReport {
    earningReportId: number;
    yoYNetProfit_Q1: number;
    yoYGrossProfit_Q1: number;
    yoYSales_Q1: number;
    qoQNetProfit_Q1: number;
    qoQGrossProfit_Q1: number;
    qoQSales_Q1: number;
    date: Date;
    company: string;
    year: number;
    currentQuarter: string;

  constructor()
  {
    this.earningReportId = 0;
    this.company = '';
    this.year = 0;
    this.currentQuarter = '';
    this.date = new Date();

    this.yoYNetProfit_Q1 = 0;
    this.yoYGrossProfit_Q1 = 0;
    this.yoYSales_Q1 = 0;

    this.qoQNetProfit_Q1 = 0;
    this.qoQGrossProfit_Q1 = 0;
    this.qoQSales_Q1 = 0;
  }
}
