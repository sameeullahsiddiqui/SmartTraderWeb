import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SuperStarPortfolio } from 'src/app/models/super-star-portfolio';
import { SuperStarPortfolioService } from 'src/app/services/super-star-portfolio.service';
import { SymbolService } from 'src/app/services/symbol.service';

@Component({
  selector: 'app-super-star-portfolio',
  templateUrl: './super-star-portfolio.component.html',
  styleUrls: ['./super-star-portfolio.component.css'],
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
export class SuperStarPortfolioComponent implements OnInit {
  superStarPortfolioDialog: boolean = false;
  selectedSuperStarPortfolio: SuperStarPortfolio = new SuperStarPortfolio();
  selectedSuperStarPortfolios: SuperStarPortfolio[] = [];
  submitted: boolean = false;
  statuses: any[] = [];
  superStarPortfolioTypes: any[] = [];
  superStarPortfolioCollection: SuperStarPortfolio[] = [];

  formInput: FormGroup = new FormGroup({});
  properties = {
    superstarPortfolioId: 'superstarPortfolioId',
    symbol: 'symbol',
    price: 'price',
    status: 'status',
    investorName: 'investorName',
    reasonToWatch: 'reasonToWatch',
    updateTime: 'updateTime',
    date: 'date',
    currentPrice: 'currentPrice',
    changeSinceAdded:'changeSinceAdded',
    days:'days'
  };

  stateOptions: { label: string; value: boolean; }[] = [];
  statusOptions: { label: string; value: string; }[] = [];
  loading: boolean = false;
  activeOnly: boolean = true;
  destroy$: Subject<boolean> = new Subject<boolean>();
  results: string[] = [];


  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private superStarPortfolioService: SuperStarPortfolioService,
    private symbolService: SymbolService,
    public router: Router
  ) {

    this.stateOptions = [
      { label: "Active Only", value: true },
      { label: "All", value: false }
    ];
    this.statusOptions = [
      { label: "New", value: 'Open' },
      { label: "Completed", value: "Completed" }
    ];

    this.setFormData();
  }

  private setFormData() {
    this.formInput = new FormGroup({
      superstarPortfolioId: new FormControl(this.selectedSuperStarPortfolio.superstarPortfolioId),
      symbol: new FormControl(this.selectedSuperStarPortfolio.symbol),
      price: new FormControl(this.selectedSuperStarPortfolio.price),
      investorName: new FormControl(this.selectedSuperStarPortfolio.investorName),
      reasonToWatch: new FormControl(this.selectedSuperStarPortfolio.reasonToWatch),
      status: new FormControl(this.selectedSuperStarPortfolio.status),
      date: new FormControl(this.selectedSuperStarPortfolio.date),
      updateTime: new FormControl(this.selectedSuperStarPortfolio.updateTime),
      currentPrice: new FormControl(this.selectedSuperStarPortfolio.currentPrice),
      changeSinceAdded: new FormControl(this.selectedSuperStarPortfolio.changeSinceAdded),
      days: new FormControl(this.selectedSuperStarPortfolio.days),
    });
  }

  ngOnInit() {
    this.getSuperStarPortfolios();
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  getSuperStarPortfolios() {
      this.loading = true;
      this.superStarPortfolioCollection = [];

      this.superStarPortfolioService
      .getAll(this.activeOnly)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (data: SuperStarPortfolio[]) => {
            this.superStarPortfolioCollection = data;
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
    this.selectedSuperStarPortfolio = new SuperStarPortfolio();
    this.submitted = false;
    this.superStarPortfolioDialog = true;
  }

  // deleteSelectedSuperStarPortfolios() {
  //   this.confirmationService.confirm({
  //     message: 'Are you sure you want to delete the selected superStarPortfolio?',
  //     header: 'Confirm',
  //     icon: 'pi pi-exclamation-triangle',
  //     accept: () => {
  //       this.selectedSuperStarPortfolios.forEach((item) => {
  //         //TODO:call delete service
  //       });

  //       this.selectedSuperStarPortfolios = [];
  //       this.messageService.add({
  //         severity: 'success',
  //         summary: 'Successful',
  //         detail: 'Stock superStarPortfolio Deleted',
  //         life: 3000,
  //       });
  //     },
  //   });
  // }

  editSuperStarPortfolio(superStarPortfolio: SuperStarPortfolio) {
    this.selectedSuperStarPortfolio = { ...superStarPortfolio };
    this.superStarPortfolioDialog = true;
    this.formInput.reset();
    this.setFormData();
  }

  deleteSuperStarPortfolio(superStarPortfolio: SuperStarPortfolio) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + superStarPortfolio.symbol + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {

        this.superStarPortfolioService.delete(superStarPortfolio.superstarPortfolioId)
        .subscribe(
          response => {
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'Stock SuperStarPortfolio deleted',
              life: 3000,
            });

            this.submitted = true;
            this.getSuperStarPortfolios();
          },
          error => {
            this.messageService.add({
              severity: 'error',
              summary: 'Failed',
              detail: 'Stock SuperStarPortfolio deletion failed',
              life: 3000,
            });
          });

      },
    });
  }

  hideDialog() {
    this.superStarPortfolioDialog = false;
    this.submitted = false;
  }

  saveSuperStarPortfolio() {
    this.submitted = true;

    if (this.selectedSuperStarPortfolio.superstarPortfolioId) {
      this.selectedSuperStarPortfolio.symbol = this.formInput.controls[this.properties.symbol].value;
      this.selectedSuperStarPortfolio.investorName = this.formInput.controls[this.properties.investorName].value;
      this.selectedSuperStarPortfolio.reasonToWatch = this.formInput.controls[this.properties.reasonToWatch].value;
      this.selectedSuperStarPortfolio.price = this.formInput.controls[this.properties.price].value;
      this.selectedSuperStarPortfolio.status = this.formInput.controls[this.properties.status].value;
      this.selectedSuperStarPortfolio.updateTime = new Date();

      this.superStarPortfolioService.update(this.selectedSuperStarPortfolio.superstarPortfolioId, this.selectedSuperStarPortfolio)
      .subscribe(
        response => {
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Stock SuperStarPortfolio updated',
            life: 3000,
          });

          this.submitted = true;
          this.getSuperStarPortfolios();
        },
        error => {
          this.messageService.add({
            severity: 'error',
            summary: 'Failed',
            detail: 'Stock SuperStarPortfolio updation failed',
            life: 3000,
          });
        });

    } else {

      this.selectedSuperStarPortfolio.symbol = this.formInput.controls[this.properties.symbol].value;
      this.selectedSuperStarPortfolio.investorName = this.formInput.controls[this.properties.investorName].value;
      this.selectedSuperStarPortfolio.reasonToWatch = this.formInput.controls[this.properties.reasonToWatch].value;
      this.selectedSuperStarPortfolio.price = this.formInput.controls[this.properties.price].value;
      this.selectedSuperStarPortfolio.status = 'Open';
      this.selectedSuperStarPortfolio.date = new Date();
      this.selectedSuperStarPortfolio.updateTime = new Date();
      this.selectedSuperStarPortfolio.currentPrice = this.formInput.controls[this.properties.price].value;;
      this.selectedSuperStarPortfolio.changeSinceAdded = 0;
      this.selectedSuperStarPortfolio.days = 0;

      this.superStarPortfolioService.create(this.selectedSuperStarPortfolio)
      .subscribe(
        response => {
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Stock SuperStarPortfolio Created',
            life: 3000,
          });

          this.submitted = true;
          this.getSuperStarPortfolios();
        },
        error => {
          this.messageService.add({
            severity: 'error',
            summary: 'Failed',
            detail: 'Stock SuperStarPortfolio creation failed',
            life: 3000,
          });

        });
    }

    this.superStarPortfolioDialog = false;
    this.selectedSuperStarPortfolio = new SuperStarPortfolio();
  }

openChart(superStarPortfolio:SuperStarPortfolio) {
  window.open("https://in.tradingview.com/chart/?symbol=NSE:" + superStarPortfolio.symbol, '_blank');
}

showStock(stockName: any) {
  var dateString = moment(new Date()).format('YYYY-MM-DD');
  const url = this.router.serializeUrl(
    this.router.createUrlTree(['/stockchart', stockName, dateString])
  );
  window.open(url, '_blank')

}

sync() {
  this.superStarPortfolioService.sync()
      .subscribe(
        response => {
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Sync Successful',
            life: 3000,
          });

          this.submitted = true;
          this.getSuperStarPortfolios();
        },
        error => {
          this.messageService.add({
            severity: 'error',
            summary: 'Failed',
            detail: 'Sync failed',
            life: 3000,
          });

        });
}

search(event: any) {
  this.symbolService.getSymbols(event.query).subscribe(data => {
    this.results = data;
  });
}


}
