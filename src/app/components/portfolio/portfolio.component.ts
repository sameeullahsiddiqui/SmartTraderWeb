import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Portfolio } from 'src/app/models/portfolio';
import { PortfolioService } from 'src/app/services/portfolio.service';
import { SymbolService } from 'src/app/services/symbol.service';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css'],
  styles: [
    `
      :host ::ng-deep .p-dialog .superStarPortfolio-image {
        width: 150px;
        margin: 0 auto 2rem auto;
        display: block;
      }
    `,
  ],
  providers: [MessageService, ConfirmationService],
})
export class PortfolioComponent implements OnInit {
  portfolioDialog: boolean = false;
  selectedPortfolio: Portfolio = new Portfolio();
  selectedPortfolios: Portfolio[] = [];
  submitted: boolean = false;
  statuses: any[] = [];
  portfolioTypes: any[] = [];
  portfolioCollection: Portfolio[] = [];

  formInput: FormGroup = new FormGroup({});
  properties = {
    portfolioId: 'portfolioId',
    portfolioName: 'portfolioName',
    quantity: 'quantity',
    buyDate: 'buyDate',
    buyPrice: 'buyPrice',
    buyCommission: 'buyCommission',
    sellDate: 'sellDate',
    sellPrice: 'sellPrice',
    sellCommission: 'sellCommission',
    targetPrice: 'targetPrice',
    stopLossPrice: 'stopLossPrice',
    breakEvenPrice: 'breakEvenPrice',
    buyOpen: 'buyOpen',
    buyHigh: 'buyHigh',
    buyLow: 'buyLow',
    buyClose: 'buyClose',
    buyDayReturn: 'buyDayReturn',
    buyComment: 'buyComment',
    buyGrade: 'buyGrade',
    sellOpen: 'sellOpen',
    sellHigh: 'sellHigh',
    sellLow: 'sellLow',
    sellClose: 'sellClose',
    sellDayReturn: 'sellDayReturn',
    sellComment: 'sellComment',
    sellGrade: 'sellGrade',
    tradeGrade: 'tradeGrade',
    tradeDays: 'tradeDays',
    status: 'status',
    currentProfit: 'currentProfit',
    tradeType: 'tradeType',
    allowedRiskOnBuyDay: 'allowedRiskOnBuyDay',
    holdingProfit: 'holdingProfit',
    profitPercent: 'profitPercent',
    symbolName: 'symbolName',
    buyExecutionTime: 'buyExecutionTime',
    sellExecutionTime: 'sellExecutionTime'
  };

  statusOptions: { label: string; value: string }[] = [];

  loading: boolean = false;
  activeOnly = 'Open';

  destroy$: Subject<boolean> = new Subject<boolean>();
  results: string[] = [];


  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private portfolioService: PortfolioService,
    private symbolService: SymbolService,
    private titleService: Title,
    public router: Router
  ) {
    this.statusOptions = [
      { label: 'Open', value: 'Open' },
      { label: 'Closed', value: 'Closed' },
    ];

    this.titleService.setTitle('Portfolio');

    this.setFormData();
    }

  private setFormData() {
    this.formInput = new FormGroup({
      portfolioId: new FormControl(this.selectedPortfolio.portfolioId),
      portfolioName: new FormControl(this.selectedPortfolio.portfolioName),
      quantity: new FormControl(this.selectedPortfolio.quantity),
      buyDate: new FormControl(new Date(this.selectedPortfolio.buyDate)),
      buyPrice: new FormControl(this.selectedPortfolio.buyPrice),
      buyCommission: new FormControl(this.selectedPortfolio.buyCommission),
      sellDate: new FormControl(
        this.selectedPortfolio.sellDate ? new Date(this.selectedPortfolio.sellDate): ''),
      sellPrice: new FormControl(this.selectedPortfolio.sellPrice),
      sellCommission: new FormControl(this.selectedPortfolio.sellCommission),
      targetPrice: new FormControl(this.selectedPortfolio.targetPrice),
      stopLossPrice: new FormControl(this.selectedPortfolio.stopLossPrice),
      breakEvenPrice: new FormControl(this.selectedPortfolio.breakEvenPrice),
      buyOpen: new FormControl(this.selectedPortfolio.buyOpen),
      buyHigh: new FormControl(this.selectedPortfolio.buyHigh),
      buyLow: new FormControl(this.selectedPortfolio.buyLow),
      buyClose: new FormControl(this.selectedPortfolio.buyClose),
      buyDayReturn: new FormControl(this.selectedPortfolio.buyDayReturn),
      buyComment: new FormControl(this.selectedPortfolio.buyComment),
      buyGrade: new FormControl(this.selectedPortfolio.buyGrade),
      sellOpen: new FormControl(this.selectedPortfolio.sellOpen),
      sellHigh: new FormControl(this.selectedPortfolio.sellHigh),
      sellLow: new FormControl(this.selectedPortfolio.sellLow),
      sellClose: new FormControl(this.selectedPortfolio.sellClose),
      sellDayReturn: new FormControl(this.selectedPortfolio.sellDayReturn),
      sellComment: new FormControl(this.selectedPortfolio.sellComment),
      sellGrade: new FormControl(this.selectedPortfolio.sellGrade),
      tradeGrade: new FormControl(this.selectedPortfolio.tradeGrade),
      tradeDays: new FormControl(this.selectedPortfolio.tradeDays),
      status: new FormControl(this.selectedPortfolio.status),
      currentProfit: new FormControl(this.selectedPortfolio.currentProfit),
      tradeType: new FormControl(this.selectedPortfolio.tradeType),
      allowedRiskOnBuyDay: new FormControl(
        this.selectedPortfolio.allowedRiskOnBuyDay
      ),
      holdingProfit: new FormControl(this.selectedPortfolio.holdingProfit),
      profitPercent: new FormControl(this.selectedPortfolio.profitPercent),
      symbolName: new FormControl(this.selectedPortfolio.symbolName),
      buyExecutionTime: new FormControl(new Date(this.selectedPortfolio.buyExecutionTime)
      ),
      sellExecutionTime: new FormControl(
        this.selectedPortfolio.sellExecutionTime ? new Date(this.selectedPortfolio.sellExecutionTime): ''
      ),
    });
  }

  ngOnInit() {
    this.getPortfolios();
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  getPortfolios() {
    this.loading = true;
    this.portfolioCollection = [];

    this.portfolioService
      .getAllByStatus(this.activeOnly)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (data: Portfolio[]) => {
          this.portfolioCollection = data;
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

  openNew() {
    this.selectedPortfolio = new Portfolio();
    this.submitted = false;
    this.portfolioDialog = true;
    this.formInput.reset();
  }

  // deleteSelectedPortfolios() {
  //   this.confirmationService.confirm({
  //     message: 'Are you sure you want to delete the selected Portfolio?',
  //     header: 'Confirm',
  //     icon: 'pi pi-exclamation-triangle',
  //     accept: () => {
  //       this.selectedPortfolios.forEach((item) => {
  //         //TODO:call delete service
  //       });

  //       this.selectedPortfolios = [];
  //       this.messageService.add({
  //         severity: 'success',
  //         summary: 'Successful',
  //         detail: 'Stock Portfolio Deleted',
  //         life: 3000,
  //       });
  //     },
  //   });
  // }

  editPortfolio(portfolio: Portfolio) {
    this.selectedPortfolio = { ...portfolio };
    this.portfolioDialog = true;
    this.formInput.reset();
    this.setFormData();
  }

  deletePortfolio(portfolio: Portfolio) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + portfolio.symbolName + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.portfolioService.delete(portfolio.portfolioId).subscribe(
          (response) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'Stock Portfolio deleted',
              life: 3000,
            });

            this.submitted = true;
            this.getPortfolios();
          },
          (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Failed',
              detail: 'Stock Portfolio deletion failed',
              life: 3000,
            });
          }
        );
      },
    });
  }

  hideDialog() {
    this.portfolioDialog = false;
    this.submitted = false;
  }

  savePortfolio() {
    if (this.selectedPortfolio.portfolioId) {
      this.selectedPortfolio.portfolioId= this.formInput.controls[this.properties.portfolioId].value;
      this.selectedPortfolio.portfolioName= this.formInput.controls[this.properties.portfolioName].value;
      this.selectedPortfolio.quantity= this.formInput.controls[this.properties.quantity].value;
      this.selectedPortfolio.buyDate= this.formInput.controls[this.properties.buyDate].value;
      this.selectedPortfolio.buyPrice= this.formInput.controls[this.properties.buyPrice].value;
      this.selectedPortfolio.buyCommission= this.formInput.controls[this.properties.buyCommission].value;
      this.selectedPortfolio.targetPrice= this.formInput.controls[this.properties.targetPrice].value;
      this.selectedPortfolio.stopLossPrice= this.formInput.controls[this.properties.stopLossPrice].value;
      this.selectedPortfolio.breakEvenPrice= this.formInput.controls[this.properties.breakEvenPrice].value;
      this.selectedPortfolio.buyOpen= this.formInput.controls[this.properties.buyOpen].value;
      this.selectedPortfolio.buyHigh= this.formInput.controls[this.properties.buyHigh].value;
      this.selectedPortfolio.buyLow= this.formInput.controls[this.properties.buyLow].value;
      this.selectedPortfolio.buyClose= this.formInput.controls[this.properties.buyClose].value;
      this.selectedPortfolio.buyDayReturn= this.formInput.controls[this.properties.buyDayReturn].value;
      this.selectedPortfolio.buyComment= this.formInput.controls[this.properties.buyComment].value;

      this.selectedPortfolio.buyGrade= this.formInput.controls[this.properties.buyGrade].value;

      this.selectedPortfolio.sellPrice= this.formInput.controls[this.properties.sellPrice].value;

      if (this.selectedPortfolio.sellPrice && this.selectedPortfolio.sellPrice >0) {
        this.selectedPortfolio.sellDate= this.formInput.controls[this.properties.sellDate].value;
        this.selectedPortfolio.sellCommission= this.formInput.controls[this.properties.sellCommission].value;
        this.selectedPortfolio.sellOpen= this.formInput.controls[this.properties.sellOpen].value;
        this.selectedPortfolio.sellHigh= this.formInput.controls[this.properties.sellHigh].value;
        this.selectedPortfolio.sellLow= this.formInput.controls[this.properties.sellLow].value;
        this.selectedPortfolio.sellClose= this.formInput.controls[this.properties.sellClose].value;
        this.selectedPortfolio.sellDayReturn= this.formInput.controls[this.properties.sellDayReturn].value;
        this.selectedPortfolio.sellComment= this.formInput.controls[this.properties.sellComment].value;
        this.selectedPortfolio.sellGrade= this.formInput.controls[this.properties.sellGrade].value;
        this.selectedPortfolio.tradeGrade= this.formInput.controls[this.properties.tradeGrade].value;
        this.selectedPortfolio.sellExecutionTime = this.formInput.controls[this.properties.sellExecutionTime].value;
      }

      this.selectedPortfolio.tradeDays= this.formInput.controls[this.properties.tradeDays].value;
      this.selectedPortfolio.status= this.formInput.controls[this.properties.status].value;
      this.selectedPortfolio.currentProfit= this.formInput.controls[this.properties.currentProfit].value;
      this.selectedPortfolio.tradeType= this.formInput.controls[this.properties.tradeType].value;
      this.selectedPortfolio.allowedRiskOnBuyDay= this.formInput.controls[this.properties.allowedRiskOnBuyDay].value;
      this.selectedPortfolio.holdingProfit= this.formInput.controls[this.properties.holdingProfit].value;
      this.selectedPortfolio.profitPercent= this.formInput.controls[this.properties.profitPercent].value;
      this.selectedPortfolio.symbolName= this.formInput.controls[this.properties.symbolName].value;
      this.selectedPortfolio.buyExecutionTime= this.formInput.controls[this.properties.buyExecutionTime].value;

      this.portfolioService.update(this.selectedPortfolio.portfolioId,this.selectedPortfolio
      ).subscribe(
        (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Stock Portfolio updated',
            life: 3000,
          });

          this.portfolioDialog = false;
          this.selectedPortfolio = new Portfolio();
          this.formInput.reset();
          this.submitted = true;

          this.getPortfolios();
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Failed',
            detail: 'Stock Portfolio updation failed',
            life: 3000,
          });
        }
      );
    } else {

      this.selectedPortfolio.portfolioId = '4862E53D-1A7E-4546-A2C0-013FF76E547F';
      this.selectedPortfolio.portfolioName= this.formInput.controls[this.properties.portfolioName].value;
      this.selectedPortfolio.quantity= this.formInput.controls[this.properties.quantity].value;
      this.selectedPortfolio.buyDate= this.formInput.controls[this.properties.buyDate].value;
      this.selectedPortfolio.buyPrice= this.formInput.controls[this.properties.buyPrice].value;
      this.selectedPortfolio.buyCommission= this.formInput.controls[this.properties.buyCommission].value;
      this.selectedPortfolio.targetPrice= this.formInput.controls[this.properties.targetPrice].value;
      this.selectedPortfolio.stopLossPrice= this.formInput.controls[this.properties.stopLossPrice].value;
      this.selectedPortfolio.breakEvenPrice= this.formInput.controls[this.properties.breakEvenPrice].value;
      this.selectedPortfolio.tradeType= this.formInput.controls[this.properties.tradeType].value;
      this.selectedPortfolio.buyComment= this.formInput.controls[this.properties.buyComment].value;
      this.selectedPortfolio.status= this.formInput.controls[this.properties.status].value;
      this.selectedPortfolio.symbolName= this.formInput.controls[this.properties.symbolName].value;
      this.selectedPortfolio.buyExecutionTime= this.formInput.controls[this.properties.buyExecutionTime].value;

      // this.selectedPortfolio.sellDate= this.formInput.controls[this.properties.sellDate].value;
      // this.selectedPortfolio.sellPrice= this.formInput.controls[this.properties.sellPrice].value;
      // this.selectedPortfolio.sellCommission= this.formInput.controls[this.properties.sellCommission].value;
      // this.selectedPortfolio.tradeDays= this.formInput.controls[this.properties.tradeDays].value;
      // this.selectedPortfolio.currentProfit= this.formInput.controls[this.properties.currentProfit].value;
      // this.selectedPortfolio.allowedRiskOnBuyDay= this.formInput.controls[this.properties.allowedRiskOnBuyDay].value;
      // this.selectedPortfolio.holdingProfit= this.formInput.controls[this.properties.holdingProfit].value;
      // this.selectedPortfolio.profitPercent= this.formInput.controls[this.properties.profitPercent].value;
      // this.selectedPortfolio.sellExecutionTime= this.formInput.controls[this.properties.sellExecutionTime].value;

      this.portfolioService.create(this.selectedPortfolio).subscribe(
        (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Stock Portfolio Created',
            life: 3000,
          });

          this.portfolioDialog = false;
          this.selectedPortfolio = new Portfolio();
          this.formInput.reset();
          this.submitted = true;

          this.getPortfolios();
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Failed',
            detail: 'Stock Portfolio creation failed',
            life: 3000,
          });
        }
      );
    }


  }

  openChart(portfolio: Portfolio) {
    window.open(
      'https://in.tradingview.com/chart/?symbol=NSE:' + portfolio.symbolName,
      '_blank'
    );
  }

  showStock(stockName: any, date: Date) {
    var dateString = moment(date).format('YYYY-MM-DD');
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['/stockchart', stockName, dateString])
    );
    window.open(url, '_blank');
  }

  sync() {
    this.portfolioService.SyncPortfolio(this.activeOnly).subscribe(
      (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Sync Successful',
          life: 3000,
        });

        this.submitted = true;
        this.getPortfolios();
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Failed',
          detail: 'Sync failed',
          life: 3000,
        });
      }
    );
  }

  search(event: any) {
    this.symbolService.getSymbols(event.query).subscribe((data) => {
      this.results = data;
    });
  }
}
