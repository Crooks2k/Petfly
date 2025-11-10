import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

// PrimeNG Modules
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TooltipModule } from 'primeng/tooltip';

// Petfly Components Module
import { SharedComponentsModule } from '@shared/components';

// Routing
import { FlightSearchRoutingModule } from './flight-search-routing.module';

// Pages
import { ExamplePagePage } from './pages/example-page/example-page.page';
import { FlightSearchPage } from './pages/flight-search/flight-search.page';
import { FlightResultsPage } from './pages/flight-results/flight-results.page';

// Core
import { ExampleInteractor } from '@flight-search/core/interactor/example.interactor';

@NgModule({
  declarations: [
    ExamplePagePage,
    FlightSearchPage,
    FlightResultsPage
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    TranslateModule,
    FlightSearchRoutingModule,
    ButtonModule,
    CardModule,
    DropdownModule,
    InputTextModule,
    InputTextareaModule,
    TooltipModule,
    SharedComponentsModule,
  ],
  providers: [ExampleInteractor],
})
export class FlightSearchModule {}
