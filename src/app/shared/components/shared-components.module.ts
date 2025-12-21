import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { DropdownModule } from 'primeng/dropdown';

import { InputSelectComponent } from './input-select/input-select.component';
import { InputCalendarComponent } from './input-calendar/input-calendar.component';
import { InputNumberComponent } from './input-number/input-number.component';
import { HeaderComponent } from './header/header.component';
import { PassengerSelectorComponent } from './passenger-selector/passenger-selector.component';

const STANDALONE_COMPONENTS = [
  InputSelectComponent,
  InputCalendarComponent,
  InputNumberComponent,
  HeaderComponent,
];

const MODULE_COMPONENTS = [PassengerSelectorComponent];

@NgModule({
  declarations: [...MODULE_COMPONENTS],
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    OverlayPanelModule,
    DropdownModule,
    ...STANDALONE_COMPONENTS,
  ],
  exports: [CommonModule, FormsModule, ...STANDALONE_COMPONENTS, ...MODULE_COMPONENTS],
})
export class SharedComponentsModule {}
