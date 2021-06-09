import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  HttpClient,
  HttpClientModule,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { SideNavComponent } from './components/side-nav/side-nav.component';
import { LoadingComponent } from './components/loading/loading.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SectorDashboardComponent } from './components/sector-dashboard/sector-dashboard.component';
import { DeliveryComponent } from './components/delivery/delivery.component';
import { StocksComponent } from './components/stocks/stocks.component';

import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { CalendarModule } from 'primeng/calendar';
import { ProgressBarModule } from 'primeng/progressbar';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ChartModule } from 'primeng/chart';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { SelectButtonModule } from 'primeng/selectbutton';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToolbarModule } from 'primeng/toolbar';

import { SliderModule } from 'primeng/slider';
import { MultiSelectModule } from 'primeng/multiselect';
import { ContextMenuModule } from 'primeng/contextmenu';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { AutoCompleteModule} from 'primeng/autocomplete';

import { HighchartsChartModule } from 'highcharts-angular';
import { StockChartComponent } from './components/stock-chart/stock-chart.component';
import { SectorComponent } from './components/sector/sector.component';
import { IndustryDashboardComponent } from './components/industry-dashboard/industry-dashboard.component';
import { IndustryComponent } from './components/industry/industry.component';
import { SectorStockComponent } from './components/sector-stock/sector-stock.component';
import { AllStocksComponent } from './components/all-stocks/all-stocks.component';
import { WatchListComponent } from './components/watch-list/watch-list.component';
import { CorporateActionComponent } from './components/corporate-action/corporate-action.component';
import { TradesComponent } from './components/trades/trades.component';
import { PortfolioComponent } from './components/portfolio/portfolio.component';
import { BackgroundJobsComponent } from './components/background-jobs/background-jobs.component';
import { FileCategoryComponent } from './components/file-category/file-category.component';
import { TooltipComponent } from './components/tooltip/tooltip.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SideNavComponent,
    LoadingComponent,
    HomeComponent,
    AboutComponent,
    DeliveryComponent,
    StocksComponent,
    StockChartComponent,
    IndustryDashboardComponent,
    SectorDashboardComponent,
    SectorComponent,
    IndustryComponent,
    SectorStockComponent,
    AllStocksComponent,
    WatchListComponent,
    CorporateActionComponent,
    TradesComponent,
    PortfolioComponent,
    BackgroundJobsComponent,
    FileCategoryComponent,
    TooltipComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    TableModule,
    ConfirmDialogModule,
    DialogModule,
    CalendarModule,
    ProgressSpinnerModule,
    ProgressBarModule,
    SliderModule,
    ToastModule,
    ToolbarModule,
    ChartModule,
    HighchartsChartModule,
    BreadcrumbModule,
    SelectButtonModule,
    DropdownModule,
    AutoCompleteModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
      isolate: false,
    }),
    NgbModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

// required for AOT compilation
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(
    http,
    '/assets/i18n/',
    '.json?random=' + new Date().getTime()
  );
}
