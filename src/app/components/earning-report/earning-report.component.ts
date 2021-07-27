import { Component, OnDestroy, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {ConfirmationService, MenuItem, MessageService, PrimeNGConfig} from 'primeng/api';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { EarningReport } from 'src/app/models/earning-report';
import { EarningReportService } from 'src/app/services/earning-report.service';
import { SymbolService } from 'src/app/services/symbol.service';
import { Symbols } from 'src/app/models/symbol';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-earning-report',
  templateUrl: './earning-report.component.html',
  styleUrls: ['./earning-report.component.css'],
  providers: [MessageService, ConfirmationService],
})
export class EarningReportComponent implements OnInit, OnDestroy {
  earningReports: EarningReport[] = [];
  rowGroupMetadata: any;
  searchDate: Date = new Date();
  loading: boolean = false;
  items: MenuItem[] = [];
  home!: MenuItem;
  selectedQuarter: any;

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

  formInput: FormGroup = new FormGroup({});
  selectedEarningReport:  EarningReport = new EarningReport();
  earningReportDialog: boolean = false;
  submitted: boolean = false;
  properties = {
    company: 'company',
    date: 'date'
  };

  constructor(
    private earningReportService: EarningReportService,
    private symbolService: SymbolService,
    private messageService: MessageService,
    private primengConfig: PrimeNGConfig,
    public router: Router,
    private titleService: Title
  ) {
    this.setFormData();
  }

  private setFormData() {
    this.formInput = new FormGroup({
      earningReportId: new FormControl(this.selectedEarningReport.earningReportId),
      company: new FormControl(this.selectedEarningReport.company),
      date: new FormControl(''),
    });
  }

  editEarningReport(earningReport: EarningReport) {
    this.selectedEarningReport = { ...earningReport };
    this.earningReportDialog = true;
    this.formInput.reset();
    this.setFormData();
  }

  hideDialog() {
    this.earningReportDialog = false;
    this.submitted = false;
  }

  saveEarningReport() {
    this.submitted = true;

    if (this.selectedEarningReport.earningReportId) {
      this.selectedEarningReport.company = this.formInput.controls[this.properties.company].value;
      this.selectedEarningReport.date = this.formInput.controls[this.properties.date].value;
      this.earningReportService.update(this.selectedEarningReport.earningReportId, this.selectedEarningReport)
      .subscribe( response => {
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Earning report updated',
            life: 3000,
          });

          this.submitted = true;
        },
        error => {
          this.messageService.add({
            severity: 'error',
            summary: 'Failed',
            detail: 'Earning report updation failed',
            life: 3000,
          });
        });

      }

    this.earningReportDialog = false;
    this.selectedEarningReport = new EarningReport();
  }


  ngOnInit(): void {
    this.primengConfig.ripple = true;
    this.titleService.setTitle('Earning Reports');
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
        //.getDataByDate(dateString,true)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (data: any[]) => {
            this.earningReports = data;
            this.loading = false;
            if(data.length >0) {
              localStorage.setItem(key, JSON.stringify(this.earningReports));
            }
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

  openChart(stockName: any) {
    this.loading = true;
    this.symbolService.getCompanyCode(stockName)
    .subscribe(
      (response: Symbols)=>{
        window.open("https://in.tradingview.com/chart/?symbol=NSE:" + response.code, '_blank');
        this.loading = false;
      },
      (error: any) => {
        this.loading = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Company code not found',});
      }
      );
  }

  getSpanCount()
  {
    let count = 0;
    if (this.isQ1) {
      count++;
    }

    if (this.isAll) {
      count = 4;
    }

    return count;
  }

  onIntervalChange($event: any) {
    this.isQoQ = this.selectedInterval.value === "QoQ";
    this.isYoY = this.selectedInterval.value === "YoY";
    this.isAll = this.selectedInterval.value === "All";
  }

}
