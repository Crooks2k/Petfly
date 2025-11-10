import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateExampleRequestEntity, ExampleItemEntity } from '../entities';
import { ExampleRepository } from '../repositories/example.repository';

@Injectable()
export class ExampleInteractor {
  constructor(private readonly exampleRepository: ExampleRepository) {}

  public getExamples(): Observable<ExampleItemEntity[]> {
    return this.exampleRepository.getItems();
  }

  public createExample(request: CreateExampleRequestEntity): Observable<ExampleItemEntity> {
    return this.exampleRepository.createItem(request);
  }
}
