import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { PetflyRepository } from '@flight-search/core/repositories/petfly.repository';
import { PetflyImplementationRepository } from '@flight-search/data/repositories/petfly-implementation.repository';
import { PetflyInteractor } from '@flight-search/core/interactor/petfly.interactor';
import { environment } from '@environments/environment';

@NgModule({
  providers: [
    {
      provide: PetflyRepository,
      useClass: PetflyImplementationRepository,
    },
    PetflyInteractor,
    { provide: 'API_URL', useValue: environment.API_SERVICES.API_URL },
  ],
  imports: [CommonModule, HttpClientModule],
})
export class ServiceProviderModule {}
