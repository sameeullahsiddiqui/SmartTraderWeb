import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { WatchList } from 'src/app/models/watch-list';
import { WatchListService } from 'src/app/services/watch-list.service';

@Component({
  selector: 'app-watch-list',
  templateUrl: './watch-list.component.html',
  styleUrls: ['./watch-list.component.css'],
  styles: [
    `
      :host ::ng-deep .p-dialog .watchList-image {
        width: 150px;
        margin: 0 auto 2rem auto;
        display: block;
      }
    `,
  ],
  providers: [MessageService, ConfirmationService],
})
export class WatchListComponent implements OnInit {
  watchListDialog: boolean = false;
  selectedWatchList: WatchList = new WatchList();
  selectedWatchLists: WatchList[] = [];
  submitted: boolean = false;
  statuses: any[] = [];
  watchListTypes: any[] = [];
  watchListCollection: WatchList[] = [];

  formInput: FormGroup = new FormGroup({});
  properties = {
    watchListId: 'watchListId',
    symbol: 'symbol',
    price: 'price',
    status: 'status',
    description: 'description',
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


  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private watchListService: WatchListService,
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
      watchListId: new FormControl(this.selectedWatchList.watchListId),
      symbol: new FormControl(this.selectedWatchList.symbol),
      price: new FormControl(this.selectedWatchList.price),
      description: new FormControl(this.selectedWatchList.description),
      reasonToWatch: new FormControl(this.selectedWatchList.reasonToWatch),
      status: new FormControl(this.selectedWatchList.status),
      date: new FormControl(this.selectedWatchList.date),
      updateTime: new FormControl(this.selectedWatchList.updateTime),
      currentPrice: new FormControl(this.selectedWatchList.currentPrice),
      changeSinceAdded: new FormControl(this.selectedWatchList.changeSinceAdded),
      days: new FormControl(this.selectedWatchList.days),
    });
  }

  ngOnInit() {
    this.getWatchLists();
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  getWatchLists() {
      this.loading = true;
      this.watchListCollection = [];

      this.watchListService
      .getAll(this.activeOnly)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (data: WatchList[]) => {
            this.watchListCollection = data;
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
    this.selectedWatchList = new WatchList();
    this.submitted = false;
    this.watchListDialog = true;
  }

  // deleteSelectedWatchLists() {
  //   this.confirmationService.confirm({
  //     message: 'Are you sure you want to delete the selected watchlist?',
  //     header: 'Confirm',
  //     icon: 'pi pi-exclamation-triangle',
  //     accept: () => {
  //       this.selectedWatchLists.forEach((item) => {
  //         //TODO:call delete service
  //       });

  //       this.selectedWatchLists = [];
  //       this.messageService.add({
  //         severity: 'success',
  //         summary: 'Successful',
  //         detail: 'Stock watchlist Deleted',
  //         life: 3000,
  //       });
  //     },
  //   });
  // }

  editWatchList(watchList: WatchList) {
    this.selectedWatchList = { ...watchList };
    this.watchListDialog = true;
    this.formInput.reset();
    this.setFormData();
  }

  deleteWatchList(watchList: WatchList) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + watchList.symbol + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {

        this.watchListService.delete(watchList.watchListId)
        .subscribe(
          response => {
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'Stock watchlist deleted',
              life: 3000,
            });

            this.submitted = true;
            this.getWatchLists();
          },
          error => {
            this.messageService.add({
              severity: 'error',
              summary: 'Failed',
              detail: 'Stock watchlist deletion failed',
              life: 3000,
            });
          });

      },
    });
  }

  hideDialog() {
    this.watchListDialog = false;
    this.submitted = false;
  }

  saveWatchList() {
    this.submitted = true;

    if (this.selectedWatchList.watchListId) {
      this.selectedWatchList.symbol = this.formInput.controls[this.properties.symbol].value;
      this.selectedWatchList.description = this.formInput.controls[this.properties.description].value;
      this.selectedWatchList.reasonToWatch = this.formInput.controls[this.properties.reasonToWatch].value;
      this.selectedWatchList.price = this.formInput.controls[this.properties.price].value;
      this.selectedWatchList.status = this.formInput.controls[this.properties.status].value;
      this.selectedWatchList.updateTime = new Date();

      // this.selectedWatchList.date = this.formInput.controls[this.properties.date].value;
      // this.selectedWatchList.currentPrice = this.formInput.controls[this.properties.currentPrice].value;
      // this.selectedWatchList.changeSinceAdded = this.formInput.controls[this.properties.changeSinceAdded].value;
      // this.selectedWatchList.days = this.formInput.controls[this.properties.days].value;

      this.watchListService.update(this.selectedWatchList.watchListId, this.selectedWatchList)
      .subscribe(
        response => {
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Stock watchlist updated',
            life: 3000,
          });

          this.submitted = true;
          this.getWatchLists();
        },
        error => {
          this.messageService.add({
            severity: 'error',
            summary: 'Failed',
            detail: 'Stock watchlist updation failed',
            life: 3000,
          });
        });

    } else {

      this.selectedWatchList.symbol = this.formInput.controls[this.properties.symbol].value;
      this.selectedWatchList.description = this.formInput.controls[this.properties.description].value;
      this.selectedWatchList.reasonToWatch = this.formInput.controls[this.properties.reasonToWatch].value;
      this.selectedWatchList.price = this.formInput.controls[this.properties.price].value;
      this.selectedWatchList.status = 'Open';
      this.selectedWatchList.date = new Date();
      this.selectedWatchList.updateTime = new Date();
      this.selectedWatchList.currentPrice = this.formInput.controls[this.properties.price].value;;
      this.selectedWatchList.changeSinceAdded = 0;
      this.selectedWatchList.days = 0;

      this.watchListService.create(this.selectedWatchList)
      .subscribe(
        response => {
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Stock watchlist Created',
            life: 3000,
          });

          this.submitted = true;
          this.getWatchLists();
        },
        error => {
          this.messageService.add({
            severity: 'error',
            summary: 'Failed',
            detail: 'Stock watchlist creation failed',
            life: 3000,
          });

        });
    }

    this.watchListDialog = false;
    this.selectedWatchList = new WatchList();
  }

openChart(watchlist:WatchList) {
  window.open("https://in.tradingview.com/chart/?symbol=NSE:" + watchlist.symbol, '_blank');
}

showStock(stockName: any) {
  var dateString = moment(new Date()).format('YYYY-MM-DD');
  const url = this.router.serializeUrl(
    this.router.createUrlTree(['/stockchart', stockName, dateString])
  );
  window.open(url, '_blank')

}

sync() {
  this.watchListService.sync()
      .subscribe(
        response => {
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Sync Successful',
            life: 3000,
          });

          this.submitted = true;
          this.getWatchLists();
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


}
