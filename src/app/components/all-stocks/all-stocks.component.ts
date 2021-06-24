import { Component, OnDestroy, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Delivery } from 'src/app/models/delivery';
import { DeliveryService } from 'src/app/services/delivery.service';
import {MenuItem, MessageService, PrimeNGConfig} from 'primeng/api';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-all-stocks',
  templateUrl: './all-stocks.component.html',
  styleUrls: ['./all-stocks.component.css'],
  providers: [MessageService]
})
export class AllStocksComponent implements OnInit, OnDestroy {
  deliveries: Delivery[] = [];
  rowGroupMetadata: any;
  searchDate: Date = new Date();
  loading: boolean = false;
  items: MenuItem[] = [];
  home!: MenuItem;

  destroy$: Subject<boolean> = new Subject<boolean>();

  deliveryOnly: boolean = false;

  constructor(private deliveryService: DeliveryService,
    private messageService: MessageService,
    private primengConfig: PrimeNGConfig,
    public router: Router,
    private titleService:Title) {

    }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    this.titleService.setTitle("All Stocks");

    this.items = [
      {label:'Stock Analysis'},
      {label:'All Stocks', url: '/home'}
  ];

  this.home = {icon: 'pi pi-home'};

  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  searchRecords() {
    var dateString = moment(this.searchDate).format('YYYY-MM-DD');
    const key =  `AllStocks_${dateString}`;

    var cachedData = localStorage.getItem(key);
    if(cachedData) {
      this.deliveries = JSON.parse(cachedData);
    } else {

    this.loading = true;
      this.deliveryService
        .getDataByDate(dateString, this.deliveryOnly)
        .pipe(takeUntil(this.destroy$))
        .subscribe((data: any[]) => {
          this.deliveries = data;
          this.loading = false;
          if(data.length >0) {
            localStorage.setItem(key, JSON.stringify(this.deliveries));
          }
        },
        (error) => {
          this.loading = false;
          this.messageService.add({severity:'error', summary: 'Error', detail: 'Error in getting data.'});
        });
      }
  }

  clear() {
    var dateString = moment(this.searchDate).format('YYYY-MM-DD');
    const key =  `AllStocks_${dateString}`;
    localStorage.removeItem(key);
  }


  showStock(stockName: any) {
    //this.router.navigate(['/stockchart',stockName])
    var dateString = moment(this.searchDate).format('YYYY-MM-DD');

    const url = this.router.serializeUrl(
      this.router.createUrlTree(['/stockchart', stockName, dateString])
    );
    window.open(url, '_blank')
  }

  showAllStocks(sectorName: any, date: any, gainer: number) {
    var dateString = moment(date).format('YYYY-MM-DD');
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['/sectorstock/sector', sectorName, dateString, gainer])
    );
    window.open(url, '_blank');
  }

  openChart(delivery:Delivery) {
    window.open("https://in.tradingview.com/chart/?symbol=NSE:" + delivery.symbolName, '_blank');
  }
}
