import { Observable } from 'rxjs';
import {
  CreateExampleRequestEntity,
  ExampleItemEntity,
  UpdateExampleRequestEntity,
} from '../entities';

export abstract class ExampleRepository {
  abstract getItems(): Observable<ExampleItemEntity[]>;
  abstract getItemById(id: string): Observable<ExampleItemEntity>;
  abstract createItem(request: CreateExampleRequestEntity): Observable<ExampleItemEntity>;
  abstract updateItem(request: UpdateExampleRequestEntity): Observable<ExampleItemEntity>;
  abstract deleteItem(id: string): Observable<boolean>;
}
