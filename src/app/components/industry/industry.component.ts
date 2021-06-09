import { Component, OnDestroy, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Industry } from 'src/app/models/industry';
import { IndustryService } from 'src/app/services/industry.service';
import { MenuItem, MessageService, PrimeNGConfig } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-industry',
  templateUrl: './industry.component.html',
  styleUrls: ['./industry.component.css'],
  providers: [MessageService],
})
export class IndustryComponent implements OnInit, OnDestroy {
  industries: Industry[] = [];
  rowGroupMetadata: any;
  industryName: string = '';
  loading: boolean = false;
  items: MenuItem[] = [];
  home!: MenuItem;

  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private industryService: IndustryService,
    private messageService: MessageService,
    private primengConfig: PrimeNGConfig,
    public router: Router,
    private route: ActivatedRoute,
    private titleService: Title
  ) {}

  ngOnInit(): void {
    this.primengConfig.ripple = true;

    this.items = [{ label: 'Industry Analysis' },{ label: 'Industry' }, { label: '', url: '/home' }];
    this.home = { icon: 'pi pi-home' };

    this.route.params.subscribe((params) => {
      this.industryName = params['industryName'];
      if (this.industryName) {
        this.titleService.setTitle(this.industryName);
        this.searchRecords();
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  searchRecords() {
      this.loading = true;
      this.industryService
        .getByIndustryName(this.industryName)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (data: any[]) => {
            this.industries = data;
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

  onSort() {}

  showStocks(industryName: any, date: any, gainer: number) {
    var dateString = moment(date).format('YYYY-MM-DD');
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['/sectorstock/industry', industryName, dateString, gainer])
    );
    window.open(url, '_blank');
  }
}
