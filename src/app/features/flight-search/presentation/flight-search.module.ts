import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TooltipModule } from 'primeng/tooltip';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { SharedComponentsModule } from '@shared/components';
import { InputAutocompleteComponent } from '@shared/components/input-autocomplete';

import { FlightSearchRoutingModule } from './flight-search-routing.module';

import { FlightSearchPage } from './pages/flight-search/flight-search.page';
import { FlightResultsPage } from './pages/flight-results/flight-results.page';

import { FiltersAsideComponent } from './components/filters-aside/filters-aside.component';
import { FlightCardMobileComponent } from './components/flight-card-mobile/flight-card-mobile.component';
import { FlightCardDesktopComponent } from './components/flight-card-desktop/flight-card-desktop.component';

import { PetflyInteractor } from '@flight-search/core/interactor/petfly.interactor';

@NgModule({
  declarations: [
    FlightSearchPage,
    FlightResultsPage,
    FiltersAsideComponent,
    FlightCardMobileComponent,
    FlightCardDesktopComponent,
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
    SelectButtonModule,
    TooltipModule,
    OverlayPanelModule,
    ToastModule,
    SharedComponentsModule,
    InputAutocompleteComponent,
  ],
  providers: [PetflyInteractor, MessageService],
})
export class FlightSearchModule {}
