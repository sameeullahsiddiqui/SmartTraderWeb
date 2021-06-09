export class WatchList {
  watchListId: number;
  symbol: string;
  description: string;
  reasonToWatch: string;
  price: number;
  status: string;
  updateTime: Date;
  date: Date;
  currentPrice: number;
  changeSinceAdded: number;
  days: number

  constructor()
  {
    this.watchListId = 0;
    this.symbol = '';
    this.description = '';
    this.reasonToWatch = '';
    this.price = 0;
    this.status = 'New';
    this.updateTime = new Date();
    this.date = new Date();
    this.currentPrice = 0;
    this.changeSinceAdded = 0;
    this.days = 0;
  }
}
