import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ExampleRepository } from '@flight-search/core/repositories/example.repository';
import { ExampleImplementationRepositoryFake } from '@flight-search/data/repositories/example-implementation.repository.fake';

@NgModule({
  providers: [
    {
      provide: ExampleRepository,
      useClass: ExampleImplementationRepositoryFake,
    },
  ],
  imports: [CommonModule, HttpClientModule],
})
export class ServiceProviderModule {}
