import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ExampleRepository } from '@flight-search/core/repositories/example.repository';
import { ExampleImplementationRepository } from '@flight-search/data/repositories/example-implementation.repository';

@NgModule({
  providers: [
    {
      provide: ExampleRepository,
      useClass: ExampleImplementationRepository,
    },
  ],
  imports: [CommonModule, HttpClientModule],
})
export class ServiceProviderModule {}
