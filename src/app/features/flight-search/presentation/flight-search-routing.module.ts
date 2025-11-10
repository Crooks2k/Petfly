import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExamplePagePage } from './pages/example-page/example-page.page';
import { FlightSearchPage } from './pages/flight-search/flight-search.page';
import { FlightResultsPage } from './pages/flight-results/flight-results.page';

const routes: Routes = [
  { path: '', component: FlightSearchPage },
  { path: 'results', component: FlightResultsPage },
  { path: 'component-examples', component: ExamplePagePage },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FlightSearchRoutingModule {}
