import {
  Compiler,
  Component,
  Injector,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { StockPrice } from 'src/app/models/stock-price';
import { StockPriceService } from 'src/app/services/stock-price.service';
import { Title } from '@angular/platform-browser';

import * as Highcharts from 'highcharts';

import StockModule from 'highcharts/modules/stock';
import ExportingModule from 'highcharts/modules/exporting';
import HDragPanes from 'highcharts/modules/drag-panes';

import HIndicatorsAll from 'highcharts/indicators/indicators-all';
import HAnnotationsAdvanced from 'highcharts/modules/annotations-advanced';
import HPriceIndicator from 'highcharts/modules/price-indicator';
import HFullScreen from 'highcharts/modules/full-screen';
import HStockTools from 'highcharts/modules/stock-tools';
import data from 'highcharts/modules/data';

import SandSignikaTheme from 'highcharts/themes/sand-signika';
import AvocadoTheme from 'highcharts/themes/avocado';
import DarkGreenTheme from 'highcharts/themes/dark-green';
import SunSetTheme from 'highcharts/themes/sunset';
import * as moment from 'moment';
import { WatchList } from 'src/app/models/watch-list';
import { WatchListService } from 'src/app/services/watch-list.service';
import { TooltipModule } from 'primeng/tooltip';
import { ComponentFactoryClass } from 'src/app/shared/animations/utils/component-factory';
import { TooltipComponent } from '../tooltip/tooltip.component';
import { SymbolService } from 'src/app/services/symbol.service';
import { PortfolioService } from 'src/app/services/portfolio.service';

StockModule(Highcharts); // <-- Have to be first
data(Highcharts);
ExportingModule(Highcharts);
HIndicatorsAll(Highcharts);
HDragPanes(Highcharts);
HAnnotationsAdvanced(Highcharts);
HPriceIndicator(Highcharts);
HFullScreen(Highcharts);
HStockTools(Highcharts);

SandSignikaTheme(Highcharts);
//SunSetTheme(Highcharts);
//DarkGreenTheme(Highcharts);
//AvocadoTheme(Highcharts);

@Component({
  selector: 'app-stock-chart',
  templateUrl: './stock-chart.component.html',
  styleUrls: ['./stock-chart.component.css'],
  providers: [MessageService],
})
export class StockChartComponent implements OnInit, OnDestroy {
  stockPrices: StockPrice[] = [];
  rowGroupMetadata: any;

  Highcharts: typeof Highcharts = Highcharts;
  stockName: string = '';
  loading: boolean = false;
  isChart: string = 'on';
  updateChart = false;
  searchDate: any;
  dateParam!: Date;

  destroy$: Subject<boolean> = new Subject<boolean>();

  //chartOptions: Highcharts.Options;
  ohlc: any[] = [];
  volume: any[] = [];
  groupingUnits = [
    ['week', [1]],
    ['month', [1, 2, 3, 4, 6]],
  ];

  stateOptions: { label: string; value: string }[] = [];
  dates: any;
  flags: any[] = [];
  bonusFlags: any[] = [];
  splitFlags: any[] = [];

  positiveEarningFlags: any[] = [];
  negativeEarningFlags: any[] = [];

  buyFlags: any[] = [];
  sellFlags: any[] = [];

  chartOptions: any;
  results: string[] = [];
  portfolios: any[] = [];

  constructor(
    private stockChartService: StockPriceService,
    private portfolioService: PortfolioService,
    private messageService: MessageService,
    private watchListService: WatchListService,
    private symbolService: SymbolService,
    private primengConfig: PrimeNGConfig,
    public router: Router,
    private route: ActivatedRoute,
    private titleService: Title,
    private injector: Injector,
    private compiler: Compiler
  ) {}

  ngOnInit(): void {
    this.stateOptions = [
      { label: 'Grid', value: 'off' },
      { label: 'Chart', value: 'on' },
    ];

    this.route.params.subscribe((params) => {
      this.stockName = params['stockName'];
      this.searchDate = params['date'];
      this.dateParam = new Date(this.searchDate);

      if (this.stockName) {
        this.titleService.setTitle(this.stockName);
        this.searchRecords();
      }
    });
    this.primengConfig.ripple = true;
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  searchRecords() {
    this.searchDate = moment(this.dateParam).format('YYYY-MM-DD');
    this.stockPrices = [];
    this.loading = true;

    this.stockChartService
      .getByName(this.stockName, this.searchDate)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (data: any[]) => {
          this.stockPrices = data;
          this.loading = false;

          //this.stockPrices.forEach(childObj=> {
          //childObj.delRatio = childObj.delRatio * 100;
          //childObj.delPercentage = ((childObj.deliveryQty - childObj.avgDelivery_30)/childObj.avgDelivery_30)*100;
          //});

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

  setChartOptions(): Highcharts.Options {
    const component = new ComponentFactoryClass<
      TooltipModule,
      TooltipComponent
    >(this.injector, this.compiler).createComponent(
      TooltipModule,
      TooltipComponent
    );

    component.instance.stockPrices = this.stockPrices;

    return {
      chart: {
        type: 'candlestick',
        alignTicks: false,
        zoomType: 'x',
      },
      time: { useUTC: false },
      rangeSelector: { selected: 0, enabled: true },
      title: { text: this.stockName },
      subtitle: { text: '' },
      credits: { enabled: false},
      xAxis: {
        type: 'datetime',
        dateTimeLabelFormats: {
          millisecond: '%H:%M:%S.%L',
          second: '%H:%M:%S',
          minute: '%H:%M',
          hour: '%H:%M',
          day: '%e. %b',
          week: '%e. %b',
          month: "%b '%y",
          year: '%Y',
        },
      },
      yAxis: [
        {
          title: { text: 'Price' },
          labels: { align: 'right', x: -3 },
          showLastLabel: true,
          minorGridLineWidth: 1,
          height: '60%',
          resize: { enabled: true },
          startOnTick: false,
          endOnTick: false,
          lineWidth: 2,
        },
        {
          labels: { align: 'right', x: -3 },
          title: { text: 'Volume' },
          top: '65%',
          height: '35%',
          offset: 1,
          lineWidth: 2,
        },
      ],
      tooltip: {
        split: true,
        borderColor: '#00537B',
        style: {
          fontSize: '10px',
          padding: '3px',
        },
        outside: false,
        useHTML: false,
        formatter(): string {
          //Pass the point data to the dynamic tooltip component
          component.instance.data = this;
          component.changeDetectorRef.detectChanges();
          //Return the tooltip html to highcharts
          return component.location.nativeElement.outerHTML;
        },
      },
      navigator: { enabled: true },
      legend: { enabled: true },
      stockTools: {
        gui: {
          enabled: true,
          buttons: [
            'indicators',
            'separator',
            'simpleShapes',
            'lines',
            'crookedLines',
            'measure',
            'advanced',
            'toggleAnnotations',
            'separator',
            'verticalLabels',
            'flags',
            'separator',
            'zoomChange',
            'fullScreen',
            'typeChange',
            'separator',
            'currentPriceIndicator',
            'saveChart',
          ],
        },
      },
      series: [
        {
          type: 'candlestick',
          name: this.stockName,
          id: 'Price',
          data: this.ohlc,
          yAxis: 0,
          color: '#cf6753',
          upColor: '#83ad91',
          showInNavigator: true,
          //dataGrouping: { enabled: true, units: this.groupingUnits }
        },
        {
          type: 'column',
          name: 'Volume',
          id: 'volume',
          data: this.volume,
          yAxis: 1,
          color: 'green',
          showInNavigator: true,
          showInLegend: false,
          //dataGrouping: { enabled: true, units: this.groupingUnits}
        },
        {
          type: 'flags',
          onSeries: 'Price',
          shape: 'squarepin',
          name: 'Indicators',
          color: 'yellow',
          yAxis: 0,
          data: this.flags,
        },
        {
          type: 'flags',
          shape: 'squarepin',
          name: 'Split',
          color: 'green',
          yAxis: 0,
          data: this.splitFlags,
          fillColor: 'gray',
          style: { color: 'white' },
        },
        {
          type: 'flags',
          shape: 'squarepin',
          name: 'Bonus',
          color: 'purple',
          yAxis: 0,
          data: this.bonusFlags,
          fillColor: 'purple',
          style: { color: 'white' },
        },
        {
          type: 'flags',
          shape: 'squarepin',
          name: 'Earnings',
          color: 'yellow',
          yAxis: 0,
          data: this.positiveEarningFlags,
          fillColor: 'green',
          style: { color: 'white' },
        },
        {
          type: 'flags',
          shape: 'squarepin',
          name: 'NegativeEarnings',
          color: 'white',
          yAxis: 0,
          data: this.negativeEarningFlags,
          fillColor: 'red',
          style: { color: 'white' },
        },
        {
          type: 'flags',
          shape: 'squarepin',
          name: 'buy',
          onSeries: 'Price',
          color: 'green',
          yAxis: 0,
          data: this.buyFlags,
          fillColor: 'green',
          style: { color: 'white' },
        },
        {
          type: 'flags',
          shape: 'squarepin',
          onSeries: 'Price',
          name: 'sell',
          color: 'red',
          yAxis: 0,
          data: this.sellFlags,
          fillColor: 'red',
          style: { color: 'white' },
        },

      ],
    };
  }

  private showHighChart() {
    if (this.isChart) {

      this.ohlc = [];
      this.volume = [];
      this.flags = [];
      this.bonusFlags = [];
      this.splitFlags = [];
      this.positiveEarningFlags = [];
      this.negativeEarningFlags = [];

      this.stockPrices.forEach((row) => {
        this.ohlc.push([
          new Date(row.date).getTime(),
          row.open,
          row.high,
          row.low,
          row.close, // close
        ]);

        this.volume.push([
          new Date(row.date).getTime(),
          row.deliveryQty, // the volume
        ]);

        if (
          row.reason !== '' &&
          row.reason !== null &&
          row.reason !== 'B' &&
          row.reason !== 'S' &&
          !row.reason.includes('E(Q')
        ) {
          this.flags.push({
            x: new Date(row.date).getTime(),
            title: row.reason,
          });
        }

        if (row.reason !== '' && row.reason !== null && row.reason === 'B') {
          this.bonusFlags.push({
            x: new Date(row.date).getTime(),
            title: row.tooltip,
            text: row.tooltip,
          });
        }
        if (row.reason !== '' && row.reason !== null && row.reason === 'S') {
          this.splitFlags.push({
            x: new Date(row.date).getTime(),
            title: row.tooltip,
            text: row.tooltip,
          });
        }
        if (
          row.reason !== '' &&
          row.reason !== null &&
          row.reason.includes('Q+')
        ) {
          this.positiveEarningFlags.push({
            x: new Date(row.date).getTime(),
            title: row.reason,
            text: row.tooltip,
          });
        }

        if (
          row.reason !== '' &&
          row.reason !== null &&
          row.reason.includes('Q-')
        ) {
          this.negativeEarningFlags.push({
            x: new Date(row.date).getTime(),
            title: row.reason,
            text: row.tooltip,
          });
        }
      });

      this.chartOptions = this.setChartOptions();

      this.chartOptions.series[0].data = this.ohlc;
      this.chartOptions.series[1].data = this.volume;
      this.chartOptions.series[2].data = this.flags;
      this.chartOptions.series[3].data = this.splitFlags;
      this.chartOptions.series[4].data = this.bonusFlags;
      this.chartOptions.series[5].data = this.positiveEarningFlags;
      this.chartOptions.series[6].data = this.negativeEarningFlags;

      this.portfolioService
      .getByName(this.stockName)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (data: any[]) => {
          this.portfolios = data;
          this.loading = false;
          this.buyFlags = [];
          this.sellFlags = [];

          this.portfolios.forEach((row) => {

            this.buyFlags.push({
              x: new Date(row.buyDate).getTime(),
              title: 'Buy',
              text: row.buyPrice,
            });

            if(row.sellDate) {
            this.sellFlags.push({
              x: new Date(row.sellDate).getTime(),
              title: 'Sell',
              text: row.sellPrice,
            });
          }
          });

          this.chartOptions.series[7].data = this.buyFlags;
          this.chartOptions.series[8].data = this.sellFlags;
          this.updateChart = false;
          this.updateChart = true;

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

      this.updateChart = true;
    }
  }

  addToWatchList() {
    const newWatchList = new WatchList();
    newWatchList.symbol = this.stockName;
    newWatchList.description = '';
    newWatchList.reasonToWatch = 'Short listed';
    newWatchList.price = this.ohlc[this.ohlc.length - 1][4];
    newWatchList.status = 'Open';
    newWatchList.date = new Date();
    newWatchList.updateTime = new Date();

    this.watchListService.create(newWatchList).subscribe(
      (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Stock watchlist Created',
          life: 3000,
        });
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Failed',
          detail: 'Stock watchlist creation failed',
          life: 3000,
        });
      }
    );
  }

  updateIndicators() {
    this.searchDate = moment(this.dateParam).format('YYYY-MM-DD');
    this.loading = true;

    this.stockChartService
      .updateIndicators(this.stockName, this.searchDate)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Indicators updated',
            life: 3000,
          });

          this.loading = false;
          this.searchRecords();
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Failed',
            detail: 'Indicators updatedation failed',
            life: 3000,
          });

          this.loading = false;
        }
      );
  }

  search(event: any) {
    this.symbolService.getSymbols(event.query).subscribe(data => {
      this.results = data;
    });
  }

}
