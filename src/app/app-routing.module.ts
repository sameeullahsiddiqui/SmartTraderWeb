import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SectorPerformanceComponent } from './components/sector-performance/sector-performance.component';

const routes: Routes = [
  { path: '', redirectTo: 'Home',pathMatch: 'full'},
  { path: 'sectorperformance', component: SectorPerformanceComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
