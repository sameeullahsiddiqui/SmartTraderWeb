import {
  Compiler,
  Component,
  Injector,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Subject, zip } from 'rxjs';
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
import { RangeSelectorOptions, TooltipOptions, YAxisOptions, YAxisPlotLinesOptions } from 'highcharts';

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
  //#region START Variables Declaration
  stockPrices: StockPrice[] = [];
  rowGroupMetadata: any;

  Highcharts: typeof Highcharts = Highcharts;
  stockName: string = '';
  loading: boolean = false;
  isChart: string = 'on';
  updateChart = false;
  searchDate: any;
  dateParam!: Date;

  yAxis_Price:YAxisOptions = {};
  yAxis_Volume:YAxisOptions = {};
  yAxis_OverBoughtSold:YAxisOptions = {};

  destroy$: Subject<boolean> = new Subject<boolean>();

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
  bottom: number | undefined;
  top: number | undefined;

  q1HighLine: YAxisPlotLinesOptions = {};

  q1LowLine: YAxisPlotLinesOptions = {};

  isQ1HighVisible = false;
  isQ1LowVisible = false;
  chartColors: string[] = [];
//#endregion END Variables Declaration

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

    this.chartColors = ['#016aff','#fc5ab2','#16d8ec','#fc975a','#b62fff','#7f8899','#8085e9','#f7a35c',
                        '#f15c80','#e4d354','#2b908f','#f45b5b','#91e8e1','#7cb5ec',];

    this.setHighLowLines();
    this.setYAxis();
  }


  searchRecords() {
    this.searchDate = moment(this.dateParam).format('YYYY-MM-DD');
    this.stockPrices = [];
    this.loading = true;

    zip(
      this.stockChartService.getByName(this.stockName, this.searchDate),
      this.portfolioService.getByName(this.stockName)
    )
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        ([response1, response2]) => {
          this.stockPrices = response1;
          this.portfolios = response2;

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

  setChartOptions(): Highcharts.Options {

    return {
      chart: {
        type: 'candlestick',
        panning: { enabled: true, type: 'x' },
        pinchType: 'x',
        events: {},
        spacingRight: 0,
        marginRight: 10,
      },
      time: { useUTC: false },
      title: { text: this.stockName },
      subtitle: { text: '' },
      credits: { enabled: false },
      navigator: { enabled: true },
      scrollbar: { enabled: true },
      colors: this.chartColors,
      rangeSelector:  this.setRangeSelector(),
      stockTools: this.setStockTools(),
      tooltip: this.setTooltips(),
      plotOptions: this.setPlotOptions(),

      xAxis: this.setxAxis(),
      yAxis: [this.yAxis_Price, this.yAxis_Volume, this.yAxis_OverBoughtSold],
      legend: { enabled: true },
      navigation: {
        bindings: {
          candlestick: {
            className: 'highcharts-series-type-candlestick',
          },
          ohlc: {
            className: 'highcharts-series-type-ohlc',
          },
          line: {
            className: 'highcharts-series-type-line',
          },
          fullScreen: {
            className: 'highcharts-full-screen',
          },
        },
      },

      series: [
        this.setOHLCSeries(),
        this.setVolumeSeries(),
        this.setIndicatorFlag(),
        this.setSplitFlag(),
        this.setBonusFlag(),
        this.setEarningsFlag(),
        this.setNegativeEarningsFlag(),
        this.setBuyFlag(),
        this.setSellFlag(),
        this.setSMAFlag(),
        this.setRSIFlag(),
        { type: 'area', name: 'Q1High', color: 'red', visible:false },
        { type: 'area', name: 'Q1Low', color: 'green', visible:false },
      ],
    };
  }


  private toggleBands(chart: Highcharts.Chart, name: string) {
    switch (name) {
      case 'Q1High':
        if (this.isQ1HighVisible) {
          chart.yAxis[0].removePlotLine('Q1High');
        } else {
          chart.yAxis[0].addPlotLine(this.q1HighLine);
        }
        this.isQ1HighVisible = !this.isQ1HighVisible;
        break;
      case 'Q1Low':
        if (this.isQ1LowVisible) {
          chart.yAxis[0].removePlotLine('Q1Low');
        } else {
          chart.yAxis[0].addPlotLine(this.q1LowLine);
        }
        this.isQ1LowVisible = !this.isQ1LowVisible;
        break;
      default:
        break;
    }
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

      this.setQuarterHighLow();
      this.setBuySellSignal();

      this.updateChart = true;
    }
  }

  private setQuarterHighLow() {
    //var highLowData = this.stockPrices[this.stockPrices.length - 2];
    const highLowData = this.stockPrices.filter(x => x.date.toString() === this.searchDate+"T00:00:00")[0];

    if(highLowData) {
    this.q1HighLine.value = highLowData.q1High;

    this.q1LowLine.value = highLowData.q1Low;

    //this.chartOptions.yAxis[0].plotLines[0].value = highLowData.q1High;
    //this.chartOptions.yAxis[0].plotLines[1].value = highLowData.q1Low;
    }

  }

  private setBuySellSignal() {
    this.buyFlags = [];
    this.sellFlags = [];

    this.portfolios.forEach((row) => {
      this.buyFlags.push({
        x: new Date(row.buyDate).getTime(),
        title: 'Buy',
        text: row.buyPrice,
      });

      if (row.sellDate) {
        this.sellFlags.push({
          x: new Date(row.sellDate).getTime(),
          title: 'Sell',
          text: row.sellPrice,
        });
      }
    });

    this.chartOptions.series[7].data = this.buyFlags;
    this.chartOptions.series[8].data = this.sellFlags;
  }

//#region START Chart Settings

  private setHighLowLines() {
    this.isQ1HighVisible = true;

    this.isQ1LowVisible = true;

    this.q1HighLine = {
      value: 0,
      id: 'Q1High',
      color: 'red',
      dashStyle: 'ShortDash',
      width: 2,
      label: { text: 'Q high' },
    };

    this.q1LowLine = {
      value: 0,
      id: 'Q1Low',
      color: 'green',
      dashStyle: 'ShortDash',
      width: 2,
      label: { text: 'Q low' },
    };

  }

  private setYAxis() {
    this.yAxis_Price = {
      labels: { y: -2, align: 'left', reserveSpace: false, x: -20 },
      showFirstLabel: true,
      title: { text: 'Price' },
      top: '0%',
      height: '65%',
      resize: {
        enabled: true,
        controlledAxis: { next: ['highcharts-y80ahrf-43873'] },
      },
      crosshair: { width: 2 },
      events: {},
      showLastLabel: true,
      minorGridLineWidth: 1,
      //plotLines: [this.q1HighLine, this.q1LowLine],
    };

    this.yAxis_Volume = {
      id: 'highcharts-y80ahrf-43873',
      labels: { align: 'right', x: -3 },
      title: { text: 'Volume' },
      top: '65%',
      height: '35%',
      offset: 1,
      lineWidth: 2,
      gridLineWidth: 0,
      resize: {
        enabled: true,
        controlledAxis: { next: ['highcharts-y80ahrf-43874'] },
      },
    };

    this.yAxis_OverBoughtSold =  {
      id: 'highcharts-y80ahrf-43874',
      offset: 1,
      lineWidth: 1,
      opposite: true,
      title: { text: '' },
      tickPixelInterval: 40,
      showLastLabel: true,
      labels: { align: 'left', x: -3 },
      angle: 10,
      top: '65%',
      height: '35%',
      resize: { enabled: false },
      gridLineWidth: 1,
      events: {},
      plotLines: [
        {
          value: 20,
          color: 'green',
          dashStyle: 'ShortDash',
          width: 2,
          label: {
            text: 'over sold',
          },
        },
        {
          value: 80,
          color: 'red',
          dashStyle: 'ShortDash',
          width: 2,
          label: {
            text: 'over bought',
          },
        },
      ],
    };
  }

  private setRangeSelector() : RangeSelectorOptions{
    return {
      enabled: true,
      allButtonsEnabled: true,
      inputEnabled: true,
      inputBoxBorderColor: 'transparent',
      inputStyle: { fontWeight: 'bold' },
      selected: 1,
    };

  }

  private setStockTools(): Highcharts.StockToolsOptions{
    return {
      gui: {
        enabled: true,
        buttons: ['typeChange', 'indicators', 'currentPriceIndicator', 'separator', 'fullScreen', 'zoomChange',
          'separator', 'toggleAnnotations', 'simpleShapes', 'flags', 'lines', 'crookedLines', 'measure',
          'advanced', 'verticalLabels',],
      },
    };
  }

  private setTooltips(): Highcharts.TooltipOptions{

    const component = new ComponentFactoryClass<
    TooltipModule,
    TooltipComponent
  >(this.injector, this.compiler).createComponent(
    TooltipModule,
    TooltipComponent
  );

  component.instance.stockPrices = this.stockPrices;

    return {
      split: true,
      borderColor: '#00537B',
      borderWidth: 0,
      valueDecimals: 2,
      shared: true,
      shadow: true,
      followPointer: true,
      style: { fontSize: '10px', padding: '3px' },
      outside: false,
      useHTML: false,
      formatter(): string {
        component.instance.data = this;
        component.changeDetectorRef.detectChanges();
        return component.location.nativeElement.outerHTML;
      },
    };
  }

  private setRSIFlag(): Highcharts.SeriesOptionsType {
    return {
      linkedTo: 'Price',
      type: 'rsi',
      id: 'highcharts-y80ahrf-43871',
      marker: { enabled: false },
      params: { period: 14, decimals: 4 },
      lineWidth: 1,
      yAxis: 'highcharts-y80ahrf-43874',
      colorIndex: 2,
      zones: [
        {
          value: 20,
          className: 'zone-0',
          fillColor: 'green',
        },
        {
          value: 80,
          className: 'zone-1',
          fillColor: 'red',
        },
      ],
      data: [],
    };
  }

  private setSMAFlag(): Highcharts.SeriesOptionsType {
    return {
      linkedTo: 'Price',
      type: 'sma',
      marker: { enabled: false },
      id: 'highcharts-y80ahrf-41719',
      params: { index: 0, period: 44 },
      colorIndex: 1,
      lineWidth: 1,
      data: [],
    };
  }

  private setSellFlag(): Highcharts.SeriesOptionsType {
    return {
      type: 'flags',
      shape: 'squarepin',
      onSeries: 'Price',
      name: 'sell',
      color: 'red',
      yAxis: 0,
      data: this.sellFlags,
      fillColor: 'red',
      style: { color: 'white' },
    };
  }

  private setBuyFlag(): Highcharts.SeriesOptionsType {
    return {
      type: 'flags',
      shape: 'squarepin',
      name: 'buy',
      onSeries: 'Price',
      color: 'green',
      yAxis: 0,
      data: this.buyFlags,
      fillColor: 'green',
      style: { color: 'white' },
    };
  }

  private setNegativeEarningsFlag(): Highcharts.SeriesOptionsType {
    return {
      type: 'flags',
      shape: 'squarepin',
      name: 'NegativeEarnings',
      color: 'white',
      yAxis: 0,
      data: this.negativeEarningFlags,
      fillColor: 'red',
      style: { color: 'white' },
      showInLegend: false,
    };
  }

  private setEarningsFlag(): Highcharts.SeriesOptionsType {
    return {
      type: 'flags',
      shape: 'squarepin',
      name: 'Earnings',
      color: 'yellow',
      yAxis: 0,
      data: this.positiveEarningFlags,
      fillColor: 'green',
      style: { color: 'white' },
      showInLegend: false,
    };
  }

  private setBonusFlag(): Highcharts.SeriesOptionsType {
    return {
      type: 'flags',
      shape: 'squarepin',
      name: 'Bonus',
      color: 'purple',
      yAxis: 0,
      data: this.bonusFlags,
      fillColor: 'purple',
      style: { color: 'white' },
      showInLegend: false,
    };
  }

  private setSplitFlag(): Highcharts.SeriesOptionsType {
    return {
      type: 'flags',
      shape: 'squarepin',
      name: 'Split',
      color: 'green',
      yAxis: 0,
      data: this.splitFlags,
      fillColor: 'gray',
      style: { color: 'white' },
      showInLegend: false,
    };
  }

  private setIndicatorFlag(): Highcharts.SeriesOptionsType {
    return {
      type: 'flags',
      onSeries: 'Price',
      shape: 'squarepin',
      name: 'Indicators',
      color: 'yellow',
      yAxis: 0,
      data: this.flags,
    };
  }

  private setVolumeSeries(): Highcharts.SeriesOptionsType {
    return {
      type: 'column',
      name: 'Volume',
      id: 'volume',
      data: this.volume,
      yAxis: 1,
      color: 'green',
      showInNavigator: true,
      showInLegend: false,
    };
  }

  private setOHLCSeries(): Highcharts.SeriesOptionsType {
    return {
      type: 'candlestick',
      name: this.stockName,
      id: 'Price',
      data: this.ohlc,
      yAxis: 0,
      color: '#cf6753',
      upColor: '#83ad91',
      showInNavigator: true,
    };
  }

  private setxAxis(): Highcharts.XAxisOptions | Highcharts.XAxisOptions[] | undefined {
    return {
      type: 'datetime',
      minPadding: 0,
      maxPadding: 0,
      overscroll: 0,
      ordinal: true,
      labels: { overflow: 'justify' },
      showLastLabel: true,
      crosshair: { width: 2 },
    };
  }

  private setPlotOptions(): Highcharts.PlotOptions | undefined {
    const obj = this;

    return {
      series: {
        shadow: false,
        marker: { enabled: false },
      },
      area: {
        events: {
          legendItemClick: function (e) {
            obj.toggleBands(this.chart, this.name);
          },
        },
      },
    };
  }

  //#endregion END Chart Settings

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
    this.symbolService.getSymbols(event.query).subscribe((data) => {
      this.results = data;
    });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
