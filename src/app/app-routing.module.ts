import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutComponent } from './components/about/about.component';
import { AllStocksComponent } from './components/all-stocks/all-stocks.component';
import { BackgroundJobsComponent } from './components/background-jobs/background-jobs.component';
import { CorporateActionComponent } from './components/corporate-action/corporate-action.component';
import { DeliveryComponent } from './components/delivery/delivery.component';
import { FileCategoryComponent } from './components/file-category/file-category.component';
import { HomeComponent } from './components/home/home.component';
import { IndustryDashboardComponent } from './components/industry-dashboard/industry-dashboard.component';
import { IndustryComponent } from './components/industry/industry.component';
import { PortfolioComponent } from './components/portfolio/portfolio.component';
import { SectorDashboardComponent } from './components/sector-dashboard/sector-dashboard.component';
import { SectorStockComponent } from './components/sector-stock/sector-stock.component';
import { SectorComponent } from './components/sector/sector.component';
import { StockChartComponent } from './components/stock-chart/stock-chart.component';
import { StocksComponent } from './components/stocks/stocks.component';
import { TradesComponent } from './components/trades/trades.component';
import { WatchListComponent } from './components/watch-list/watch-list.component';

const routes: Routes = [
  { path: '', redirectTo: 'Home', pathMatch: 'full'},
  { path: 'home', component: HomeComponent},
  { path: 'about', component: AboutComponent},
  { path: 'industrydashboard', component: IndustryDashboardComponent},
  { path: 'industry/:industryName', component: IndustryComponent},
  { path: 'sectordashboard', component: SectorDashboardComponent},
  { path: 'sector/:sectorName', component: SectorComponent},
  { path: 'delivery', component: DeliveryComponent},
  { path: 'allStocks', component: AllStocksComponent},
  { path: 'stocks', component: StocksComponent},
  { path: 'stockchart/:stockName/:date', component: StockChartComponent},
  { path: 'sectorstock/:sectoryType/:industryName/:date/:gainer', component: SectorStockComponent},
  { path: 'watchlist', component: WatchListComponent},
  { path: 'corporateActions', component: CorporateActionComponent},
  { path: 'trades', component: TradesComponent},
  { path: 'portfolio', component: PortfolioComponent},
  { path:'backgroundJobs', component: BackgroundJobsComponent},
  { path:'fileCategory', component: FileCategoryComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
