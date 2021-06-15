export class EarningReport {
    earningReportId: number;
    yoYNetProfit_Q4: number;
    yoYNetProfit_Q3: number;
    yoYNetProfit_Q2: number;
    yoYNetProfit_Q1: number;
    yoYGrossProfit_Q4: number;
    yoYGrossProfit_Q3: number;
    yoYGrossProfit_Q2: number;
    yoYGrossProfit_Q1: number;
    yoYSales_Q4: number;
    yoYSales_Q3: number;
    yoYSales_Q2: number;
    yoYSales_Q1: number;
    qoQNetProfit_Q4: number;
    qoQNetProfit_Q3: number;
    qoQNetProfit_Q2: number;
    qoQNetProfit_Q1: number;
    qoQGrossProfit_Q4: number;
    qoQGrossProfit_Q3: number;
    qoQGrossProfit_Q2: number;
    qoQGrossProfit_Q1: number;
    qoQSales_Q4: number;
    qoQSales_Q3: number;
    qoQSales_Q2: number;
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

    this.yoYNetProfit_Q4 = 0;
    this.yoYNetProfit_Q3 = 0;
    this.yoYNetProfit_Q2 = 0;
    this.yoYNetProfit_Q1 = 0;
    this.yoYGrossProfit_Q4 = 0;
    this.yoYGrossProfit_Q3 = 0;
    this.yoYGrossProfit_Q2 = 0;
    this.yoYGrossProfit_Q1 = 0;
    this.yoYSales_Q4 = 0;
    this.yoYSales_Q3 = 0;
    this.yoYSales_Q2 = 0;
    this.yoYSales_Q1 = 0;

    this.qoQNetProfit_Q4 = 0;
    this.qoQNetProfit_Q3 = 0;
    this.qoQNetProfit_Q2 = 0;
    this.qoQNetProfit_Q1 = 0;
    this.qoQGrossProfit_Q4 = 0;
    this.qoQGrossProfit_Q3 = 0;
    this.qoQGrossProfit_Q2 = 0;
    this.qoQGrossProfit_Q1 = 0;
    this.qoQSales_Q4 = 0;
    this.qoQSales_Q3 = 0;
    this.qoQSales_Q2 = 0;
    this.qoQSales_Q1 = 0;
  }
}
