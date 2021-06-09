import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MenuItem } from 'primeng/api/menuitem';
import { PrimeNGConfig, MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { StockPriceService } from 'src/app/services/stock-price.service';
import { OperationType } from 'src/app/models/operation-type';
import { SymbolService } from 'src/app/services/symbol.service';
import * as moment from 'moment';

@Component({
  selector: 'app-corporate-action',
  templateUrl: './corporate-action.component.html',
  styleUrls: ['./corporate-action.component.css'],
  providers: [MessageService],
})
export class CorporateActionComponent implements OnInit, OnDestroy {

  results: string[] = [];

  items: MenuItem[] = [];
  home!: MenuItem;
  destroy$: Subject<boolean> = new Subject<boolean>();
  loading: boolean = false;

  operatioTypes: OperationType[] = [];

  splitFormInput: FormGroup = new FormGroup({});
  earningFormInput: FormGroup = new FormGroup({});

  properties = {
    symbol: 'symbol',
    date: 'date',
    operationType: 'operationType',
    oldFaceValue: 'oldFaceValue',
    newFaceValue: 'newFaceValue',
    year: 'year'
  };

  constructor(
    private stockPriceService: StockPriceService,
    private symbolService : SymbolService,
    private messageService: MessageService,
    private primengConfig: PrimeNGConfig,
    public router: Router,
    private route: ActivatedRoute,
    ) {

      this.operatioTypes = [
        {name: 'Split', code: 'Split'},
        {name: 'Bonus', code: 'Bonus'}
      ];
    }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    this.items = [{ label: 'Corporate Actions' },{ label: 'Updates' }, { label: '', url: '/home' }];
    this.home = { icon: 'pi pi-home' };

    this.setFormData();
  }

  private setFormData() {
    this.splitFormInput = new FormGroup({
      symbol: new FormControl(''),
      date: new FormControl(new Date()),
      operationType: new FormControl(this.operatioTypes[0]),
      oldFaceValue: new FormControl(0),
      newFaceValue: new FormControl(0),
    });

    this.earningFormInput = new FormGroup({
      year: new FormControl(2020),
    });
  }

  updateSplit() {
        this.loading = true;

        const symbol = this.splitFormInput.controls[this.properties.symbol].value;
        const date = this.splitFormInput.controls[this.properties.date].value;
        const operationType = this.splitFormInput.controls[this.properties.operationType].value.code;
        const oldFaceValue = this.splitFormInput.controls[this.properties.oldFaceValue].value;
        const newFaceValue = this.splitFormInput.controls[this.properties.newFaceValue].value;

        var dateString = moment(date).format('YYYY-MM-DD');

        this.stockPriceService.split(symbol, dateString, operationType, oldFaceValue, newFaceValue)
        .subscribe(
          response => {
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'Stock '+ operationType +' updated',
              life: 3000,
            });

            this.loading = false;
          },
          error => {
            this.messageService.add({
              severity: 'error',
              summary: 'Failed',
              detail: 'Stock '+ operationType +' failed',
              life: 3000,
            });
            this.loading = false;
          });
    }

    updateEarningTooltips() {
      this.loading = true;
      const year = this.earningFormInput.controls[this.properties.year].value;

      this.stockPriceService.updateEarningReports(year)
      .subscribe(
        response => {
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Earning tooltip updated',
            life: 3000,
          });

          this.loading = false;
        },
        error => {
          this.messageService.add({
            severity: 'error',
            summary: 'Failed',
            detail: 'Earning tooltip failed',
            life: 3000,
          });
          this.loading = false;
        });
  }


  search(event: any) {
    this.symbolService.getSymbols(event.query).subscribe(data => {
      this.results = data;
    });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
