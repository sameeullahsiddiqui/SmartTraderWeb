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
  selector: 'app-delivery',
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.css'],
  providers: [MessageService]
})
export class DeliveryComponent implements OnInit, OnDestroy {
  deliveries: Delivery[] = [];
  rowGroupMetadata: any;
  searchDate: Date = new Date();
  loading: boolean = false;
  items: MenuItem[] = [];
  home!: MenuItem;

  destroy$: Subject<boolean> = new Subject<boolean>();

  deliveryOnly: boolean = true;
  deliveryOptions: { label: string; value: boolean; }[] = [];

  constructor(private deliveryService: DeliveryService,
    private messageService: MessageService,
    private primengConfig: PrimeNGConfig,
    public router: Router,
    private titleService:Title) {

    }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    this.titleService.setTitle("Delivery");

    this.items = [
      {label:'Stock Analysis'},
      {label:'Delivery', url: '/home'}
  ];

  this.home = {icon: 'pi pi-home'};

  this.deliveryOptions = [
    { label: "All", value: false },
    { label: "High Delivery", value: true }
  ];

  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  searchRecords() {
    var dateString = moment(this.searchDate).format('YYYY-MM-DD');

    this.loading = true;
      this.deliveryService
        .getDataByDate(dateString, this.deliveryOnly)
        .pipe(takeUntil(this.destroy$))
        .subscribe((data: any[]) => {
          this.deliveries = data;
          this.updateRowGroupMetaData();
          this.loading = false;
        },
        (error) => {
          this.loading = false;
          this.messageService.add({severity:'error', summary: 'Error', detail: 'Error in getting data.'});
        });
  }
  onSort() {
    this.updateRowGroupMetaData();
  }

  showStock(stockName: any) {
    //this.router.navigate(['/stockchart',stockName])
    var dateString = moment(this.searchDate).format('YYYY-MM-DD');

    const url = this.router.serializeUrl(
      this.router.createUrlTree(['/stockchart', stockName, dateString])
    );
    window.open(url, '_blank')

  }

  updateRowGroupMetaData() {
    this.rowGroupMetadata = {};

    if (this.deliveries) {
      for (let i = 0; i < this.deliveries.length; i++) {
        let rowData = this.deliveries[i];
        let industryName = rowData.industry;

        if (i == 0) {
          this.rowGroupMetadata[industryName] = { index: 0, size: 1 };
        } else {
          let previousRowData = this.deliveries[i - 1];
          let previousRowGroup = previousRowData.industry;
          if (industryName === previousRowGroup)
            this.rowGroupMetadata[industryName].size++;
          else this.rowGroupMetadata[industryName] = { index: i, size: 1 };
        }
      }
    }
  }
}
