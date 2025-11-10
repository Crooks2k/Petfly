import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ExampleItemEntity } from '../entities';
import { ExampleRepository } from '../repositories/example.repository';

@Injectable()
export class GetExamplesUseCase {
  constructor(private exampleRepository: ExampleRepository) {}

  execute(): Observable<ExampleItemEntity[]> {
    return this.exampleRepository.getItems();
  }
}
