export class Portfolio {
  portfolioId: string;
  portfolioName: string;
  quantity: number;
  buyDate: Date;
  buyPrice: number;
  buyCommission?: number;
  sellDate?: Date;
  sellPrice?: number;
  sellCommission?: number;
  targetPrice?: number;
  stopLossPrice?: number;
  breakEvenPrice?: number;
  buyOpen?: number;
  buyHigh?: number;
  buyLow?: number;
  buyClose?: number;
  buyDayReturn?: number;
  buyComment: string;
  buyGrade?: number;
  sellOpen?: number;
  sellHigh?: number;
  sellLow?: number;
  sellClose?: number;
  sellDayReturn?: number;
  sellComment?: string;
  sellGrade?: number;
  tradeGrade?: number;
  tradeDays: number;
  status: string;
  currentProfit?: number;
  tradeType: string;
  allowedRiskOnBuyDay?: number;
  holdingProfit?: number;
  profitPercent?: number;
  symbolName: string;
  buyExecutionTime: Date;
  sellExecutionTime?: Date;

  constructor() {
    this.portfolioId = '';
    this.portfolioName = '';
    this.symbolName = '';
    this.quantity = 0;
    this.buyDate = new Date();
    this.buyExecutionTime = new Date();
    this.buyPrice = 0;
    this.buyCommission = 0;
    this.targetPrice = 0;
    this.stopLossPrice = 0;
    this.breakEvenPrice = 0;
    this.buyComment = '';

    this.status = 'Open';
    this.tradeType = 'Holding';
    this.allowedRiskOnBuyDay = 0;
    this.tradeDays = 0;

    // this.buyOpen = 0;
    // this.buyHigh = 0;
    // this.buyLow = 0;
    // this.buyClose = 0;
    // this.buyDayReturn = 0;
    // this.buyGrade = 0;
    // this.holdingProfit = 0;
    // this.profitPercent = 0;
    // this.currentProfit = 0;
    // this.sellDate = new Date();
    // this.sellPrice = 0;
    // this.sellCommission = 0;
    // this.sellOpen = 0;
    // this.sellHigh = 0;
    // this.sellLow = 0;
    // this.sellClose = 0;
    // this.sellDayReturn = 0;
    // this.sellComment = '';
    // this.sellGrade = 0;
    // this.tradeGrade = 0;

  }
}
