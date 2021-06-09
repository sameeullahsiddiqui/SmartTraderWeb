import { Component, OnDestroy, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Sector } from 'src/app/models/sector';
import { SectorService } from 'src/app/services/sector.service';
import { MenuItem, MessageService, PrimeNGConfig } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

import * as Highcharts from 'highcharts';
import ExportingModule from 'highcharts/modules/exporting';
import SandSignikaTheme from 'highcharts/themes/sand-signika';

ExportingModule(Highcharts);
SandSignikaTheme(Highcharts);


@Component({
  selector: 'app-sector',
  templateUrl: './sector.component.html',
  styleUrls: ['./sector.component.css'],
  providers: [MessageService],
})
export class SectorComponent implements OnInit, OnDestroy {
  sectors: Sector[] = [];
  rowGroupMetadata: any;
  sectorName: string = '';
  loading: boolean = false;
  items: MenuItem[] = [];
  home!: MenuItem;

  destroy$: Subject<boolean> = new Subject<boolean>();
  isChart: string = "on";

  Highcharts: typeof Highcharts = Highcharts;
  updateChart = false;
  chartOptions: any;
  gainer: any[] = [];
  looser: any[] = [];
  dates: any[] = [];

  stateOptions: { label: string; value: string; }[] = [];

  constructor(
    private sectorService: SectorService,
    private messageService: MessageService,
    private primengConfig: PrimeNGConfig,
    public router: Router,
    private route: ActivatedRoute,
    private titleService: Title
  ) {}

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    this.stateOptions = [
      { label: "Grid", value: "off" },
      { label: "Chart", value: "on" }
    ];

    this.items = [{ label: 'Sector Analysis' },{ label: 'Sector' }, { label: '', url: '/home' }];
    this.home = { icon: 'pi pi-home' };

    this.route.params.subscribe((params) => {
      this.sectorName = params['sectorName'];
      if (this.sectorName) {
        this.titleService.setTitle(this.sectorName);
        this.searchRecords();
      }
    });
  }

  setChartOptions() {
    this.chartOptions = {
      chart: { type: 'column'},
      navigator: { enabled: true },
      title: { text: 'Sector Analysis' },
      subtitle: { text: '' },
      xAxis: { categories: [], crosshair: true },
      yAxis: { title: { text: 'Count' } },
      tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
            '<td style="padding:0"><b>{point.y}</b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true
    },
    plotOptions: {
      column: {
          stacking: 'normal'
      }
  },
    series: [{ stack: 'count', name: 'Gainer', data: [] },
            //  { stack: 'count', name: 'Looser', data: [] }
            ],
      legend: { enabled: true },
      stockTools: { gui : { enabled: false } }
    }
  }

  private showHighChart() {
    if (this.isChart) {
      this.setChartOptions();
      this.gainer = [];
      this.looser = [];
      this.dates = [];

      this.sectors.forEach(row => {
        this.gainer.push([row.gain]);
        this.looser.push([row.loss]);
        this.dates.push([ moment(row.date).format('YYYY-MM-DD')]);
      });


      this.chartOptions.series[0].data = this.gainer;
      //this.chartOptions.series[1].data = this.looser;
      this.chartOptions.xAxis.categories = this.dates;
      this.updateChart = true;
    }
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  searchRecords() {
      this.loading = true;
      this.sectorService
        .getBySectorName(this.sectorName)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (data: any[]) => {
            this.sectors = data;
            this.loading = false;
            this.showHighChart();
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

  onSort() {}

  showStocks(sectorName: any, date: any, gainer: number) {
    var dateString = moment(date).format('YYYY-MM-DD');
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['/sectorstock/sector', sectorName, dateString, gainer])
    );
    window.open(url, '_blank');
  }
}
