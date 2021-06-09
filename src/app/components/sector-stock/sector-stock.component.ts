import { Component, OnDestroy, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MenuItem, MessageService, PrimeNGConfig } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

import * as Highcharts from 'highcharts';
import ExportingModule from 'highcharts/modules/exporting';
import SandSignikaTheme from 'highcharts/themes/sand-signika';
import { SectorStock } from 'src/app/models/sector-stock';
import { SectorStockService } from 'src/app/services/sector-stock.service';

ExportingModule(Highcharts);
SandSignikaTheme(Highcharts);


@Component({
  selector: 'app-sector-stock',
  templateUrl: './sector-stock.component.html',
  styleUrls: ['./sector-stock.component.css'],
  providers: [MessageService],
})
export class SectorStockComponent implements OnInit, OnDestroy {
  sectorstocks: SectorStock[] = [];
  sectorName: string = '';
  searchDate: Date = new Date();
  loading: boolean = false;
  items: MenuItem[] = [];
  home!: MenuItem;

  destroy$: Subject<boolean> = new Subject<boolean>();
  sectorType: any;
  gainer: number = 0;

  constructor(
    private sectorstockService: SectorStockService,
    private messageService: MessageService,
    private primengConfig: PrimeNGConfig,
    public router: Router,
    private route: ActivatedRoute,
    private titleService: Title
  ) {}

  ngOnInit(): void {
    this.primengConfig.ripple = true;

    this.route.params.subscribe((params) => {
      this.sectorType = params['sectoryType'];
      this.sectorName = params['industryName'];
      this.searchDate = moment(params['date']).toDate();
      this.gainer  = +params['gainer'];

      if (this.sectorName) {
        this.titleService.setTitle(this.sectorName);
        this.searchRecords();
      }

      this.items = [{ label: this.sectorType + ' Analysis' },{ label: this.sectorType },{ label: 'Stock' }, { label: '', url: '/home' }];
      this.home = { icon: 'pi pi-home' };

    });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  searchRecords() {
    var dateString = moment(this.searchDate).format('YYYY-MM-DD');

      this.loading = true;
      this.sectorstockService
        .getByName(dateString, this.sectorType, this.sectorName, this.gainer)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (data: any[]) => {
            this.sectorstocks = data;
            this.loading = false;
          },
          (error) => {
            this.loading = false;
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error in getting data.',
            });
          }
        );
    }

  showStock(stockName: any) {
    var dateString = moment(this.searchDate).format('YYYY-MM-DD');
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['/stockchart', stockName, dateString])
    );
    window.open(url, '_blank')

  }

  onSort() {}

}
