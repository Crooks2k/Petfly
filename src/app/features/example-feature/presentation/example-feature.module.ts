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

// Routing
import { ExampleFeatureRoutingModule } from './example-feature-routing.module';

// Pages
import { ExamplePagePage } from './pages/example-page/example-page.page';

// Core
import { ExampleInteractor } from '@example/core/interactor/example.interactor';

@NgModule({
  declarations: [ExamplePagePage],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    TranslateModule,
    ExampleFeatureRoutingModule,
    // PrimeNG
    ButtonModule,
    CardModule,
    DropdownModule,
    InputTextModule,
    InputTextareaModule,
  ],
  providers: [ExampleInteractor],
})
export class ExampleFeatureModule {}
