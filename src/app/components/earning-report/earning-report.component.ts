import { Component, OnDestroy, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {MenuItem, MessageService, PrimeNGConfig} from 'primeng/api';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { EarningReport } from 'src/app/models/earning-report';
import { EarningReportService } from 'src/app/services/earning-report.service';
import { SymbolService } from 'src/app/services/symbol.service';
import { Symbols } from 'src/app/models/symbol';

@Component({
  selector: 'app-earning-report',
  templateUrl: './earning-report.component.html',
  styleUrls: ['./earning-report.component.css'],
  providers: [MessageService],
})
export class EarningReportComponent implements OnInit, OnDestroy {
  earningReports: EarningReport[] = [];
  rowGroupMetadata: any;
  searchDate: Date = new Date();
  loading: boolean = false;
  items: MenuItem[] = [];
  home!: MenuItem;
  quarterOptions: { label: string; value: string; }[] = [];
  selectedQuarter: any;

  intervalOptions : { label: string; value: string; }[] = [];
  selectedInterval: any;

  isYoY = false;
  isQoQ = true;
  isAll = false;
  isAllQuarter = false;
  isQ1 = true;
  isQ2 = true;
  isQ3 = true;
  isQ4 = true;

  destroy$: Subject<boolean> = new Subject<boolean>();
  earningReportOnly: boolean = false;


  constructor(
    private earningReportService: EarningReportService,
    private symbolService: SymbolService,
    private messageService: MessageService,
    private primengConfig: PrimeNGConfig,
    public router: Router,
    private titleService: Title
  ) {}

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    this.titleService.setTitle('Earning Reports');

    this.quarterOptions = [
      { label: "All", value: 'All' },
      { label: "Q1", value: 'Q1' },
      { label: "Q2", value: 'Q2' },
      { label: "Q3", value: 'Q3' },
      { label: "Q4", value: 'Q4' },
    ];

    this.intervalOptions = [
      { label: "All", value: 'All' },
      { label: "QoQ", value: 'QoQ' },
      { label: "YoY", value: 'YoY' },
    ];


    this.selectedQuarter = this.quarterOptions[0];
    this.selectedInterval = this.intervalOptions[0];
    this.searchRecords();
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  searchRecords() {
    var dateString = moment(this.searchDate).format('YYYY-MM-DD');
    const key = `earningReport_${dateString}`;

    var cachedData = localStorage.getItem(key);
    if (cachedData) {
      this.earningReports = JSON.parse(cachedData);
    } else {
      this.loading = true;
      this.earningReportService
        .getAll()
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (data: any[]) => {
            this.earningReports = data;
            this.loading = false;
            localStorage.setItem(key, JSON.stringify(this.earningReports));
          },
          (error: any) => {
            this.loading = false;
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error in getting data.',
            });
          }
        );
    }
  }

  clear() {
    var dateString = moment(this.searchDate).format('YYYY-MM-DD');
    const key = `earningReport_${dateString}`;
    localStorage.removeItem(key);
  }

  showStock(stockName: any) {
    this.loading = true;
    this.symbolService.getCompanyCode(stockName)
    .subscribe(
      (response: Symbols)=>{
        var dateString = moment(new Date()).format('YYYY-MM-DD');
        const url = this.router.serializeUrl(
          this.router.createUrlTree(['/stockchart', response.code, dateString])
          );
        window.open(url, '_blank');
        this.loading = false;
      },
      (error: any) => {
        this.loading = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Company code not found',});
      }
      );
  }

  isQoQVisible(quarter: string) {
    switch (quarter) {
      case 'Q1':
        return (this.isQoQ || this.isAll) && (this.isAllQuarter || this.isQ1);
      case 'Q2':
        return (this.isQoQ || this.isAll) && (this.isAllQuarter || this.isQ2);
      case 'Q3':
        return (this.isQoQ || this.isAll) && (this.isAllQuarter || this.isQ3);
      case 'Q4':
        return (this.isQoQ || this.isAll) && (this.isAllQuarter || this.isQ4);
      default:
        return false;
    }
  }

  isYoYVisible(quarter: string) {
    switch (quarter) {
      case 'Q1':
        return (this.isYoY || this.isAll) && (this.isAllQuarter || this.isQ1);
      case 'Q2':
        return (this.isYoY || this.isAll) && (this.isAllQuarter || this.isQ2);
      case 'Q3':
        return (this.isYoY || this.isAll) && (this.isAllQuarter || this.isQ3);
      case 'Q4':
        return (this.isYoY || this.isAll) && (this.isAllQuarter || this.isQ4);
      default:
        return false;
    }
  }

  getSpanCount()
  {
    let count = 0;
    if (this.isQ1) {
      count++;
    }
    if (this.isQ2) {
      count++;
    }
    if (this.isQ3) {
      count++;
    }

    if (this.isQ4) {
      count++;
    }

    if (this.isAllQuarter) {
      count = 4;
    }

    if (this.isAll && this.isAllQuarter) {
      count = 4;
    }

    return count;
  }

  onQuarterChange($event: any) {
    this.isQ1 = this.selectedQuarter.value === "Q1";
    this.isQ2 = this.selectedQuarter.value === "Q2";
    this.isQ3 = this.selectedQuarter.value === "Q3";
    this.isQ4 = this.selectedQuarter.value === "Q4";
    this.isAllQuarter = this.selectedQuarter.value === "All";
  }

  onIntervalChange($event: any) {
    this.isQoQ = this.selectedInterval.value === "QoQ";
    this.isYoY = this.selectedInterval.value === "YoY";
    this.isAll = this.selectedInterval.value === "All";
  }

}
