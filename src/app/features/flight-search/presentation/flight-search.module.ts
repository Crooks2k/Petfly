import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

// PrimeNG Modules
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TooltipModule } from 'primeng/tooltip';

// Petfly Components Module
import { SharedComponentsModule } from '@shared/components';
import { InputAutocompleteComponent } from '@shared/components/input-autocomplete';

// Routing
import { FlightSearchRoutingModule } from './flight-search-routing.module';

// Pages
import { FlightSearchPage } from './pages/flight-search/flight-search.page';
import { FlightResultsPage } from './pages/flight-results/flight-results.page';

// Components
import { FiltersAsideComponent } from './components/filters-aside/filters-aside.component';

// Core
import { PetflyInteractor } from '@flight-search/core/interactor/petfly.interactor';

@NgModule({
  declarations: [
    FlightSearchPage,
    FlightResultsPage,
    FiltersAsideComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    TranslateModule,
    FlightSearchRoutingModule,
    AutoCompleteModule,
    ButtonModule,
    CardModule,
    DropdownModule,
    InputTextModule,
    InputTextareaModule,
    RadioButtonModule,
    TooltipModule,
    SharedComponentsModule,
    InputAutocompleteComponent,
  ],
  providers: [PetflyInteractor],
})
export class FlightSearchModule {}
