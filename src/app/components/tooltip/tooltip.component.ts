import { Component, Input } from '@angular/core';
import * as Highcharts from 'highcharts';
import * as moment from 'moment';
import { Delivery } from 'src/app/models/delivery';
import { StockPrice } from 'src/app/models/stock-price';

@Component({
  selector: 'app-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.css'],
})
export class TooltipComponent {
  @Input() data!: Highcharts.TooltipFormatterContextObject;
  @Input() stockPrices: StockPrice[] = [];
  selectedStockPrice: StockPrice | undefined;

  getCssClass(value: any) {
    if(value < 0) {
      return 'font-weight:bold;color:red;';
    } else if(value > 0) {
      return 'font-weight:bold;color:green;';
    }

    return '';
  }

  getCssDelivery(value: any) {
    if(value > 1.5) {
      return 'font-weight:bold;color:green;';
    }

    return 'font-weight:bold;';
  }

  getDate() {
    var dateString = moment(this.data.x).format('YYYY-MM-DD');
    this.selectedStockPrice = this.stockPrices.find(x=>new Date(x.date).getTime() === this.data.x);

    return dateString;
  }



}
