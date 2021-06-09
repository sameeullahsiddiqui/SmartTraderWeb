import { Component, OnDestroy, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Industry } from 'src/app/models/industry';
import { IndustryService } from 'src/app/services/industry.service';
import { MenuItem, MessageService, PrimeNGConfig, SortEvent} from 'primeng/api';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-industry-dashboard',
  templateUrl: './industry-dashboard.component.html',
  styleUrls: ['./industry-dashboard.component.css'],
  providers: [MessageService]
})
export class IndustryDashboardComponent implements OnInit, OnDestroy {
  industries: Industry[] = [];
  rowGroupMetadata: any;
  searchDate: Date = new Date();
  loading: boolean = false;
  items: MenuItem[] = [];
  home!: MenuItem;

  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private industryService: IndustryService,
    private messageService: MessageService,
    private primengConfig: PrimeNGConfig,
    public router: Router,
    private titleService:Title) {

    }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    this.titleService.setTitle("Industry");

    this.items = [
      {label:'Industry Analysis'},
      {label:'Dashboard', url: '/home'}
  ];

  this.home = {icon: 'pi pi-home'};

  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  searchRecords() {
    var dateString = moment(this.searchDate).format('YYYY-MM-DD');
      this.loading = true;
      this.industryService
        .getDataByDate(dateString)
        .pipe(takeUntil(this.destroy$))
        .subscribe((data: any[]) => {
          this.industries = data;
          this.loading = false;
        },
        (error) => {
          this.loading = false;
          this.messageService.add({severity:'error', summary: 'Error', detail: 'Error in getting data.'});
        });
  }

  onSort() {

  }

  showIndustry(industryName: any) {
    //var dateString = moment(this.searchDate).format('YYYY-MM-DD');
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['/industry', industryName])
    );
    window.open(url, '_blank')

  }

  showStocks(industryName: any, date: any, gainer: number) {
    var dateString = moment(date).format('YYYY-MM-DD');
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['/sectorstock/industry', industryName, dateString, gainer])
    );
    window.open(url, '_blank');
  }


  customSort(event: any) {
    event.data.sort((data1:any, data2:any) => {
        let value1 = data1[event.field];
        let value2 = data2[event.field];
        let result = null;

        if(event.field === 'ratio')
        {
          value1 = (data1['gain']/data1['total']) * 100;
          value2 = (data2['gain']/data2['total']) * 100;
        }

        if (value1 == null && value2 != null)
            result = -1;
        else if (value1 != null && value2 == null)
            result = 1;
        else if (value1 == null && value2 == null)
            result = 0;
        else if (typeof value1 === 'string' && typeof value2 === 'string')
            result = value1.localeCompare(value2);
        else
            result = (value1 < value2) ? -1 : (value1 > value2) ? 1 : 0;

        return (event.order * result);
    });
}

}
