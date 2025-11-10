import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateExampleRequestEntity, ExampleItemEntity } from '../entities';
import { ExampleRepository } from '../repositories/example.repository';

@Injectable()
export class CreateExampleUseCase {
  constructor(private exampleRepository: ExampleRepository) {}

  execute(request: CreateExampleRequestEntity): Observable<ExampleItemEntity> {
    return this.exampleRepository.createItem(request);
  }
}
