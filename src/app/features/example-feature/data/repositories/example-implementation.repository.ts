import { Injectable } from '@angular/core';
import {
  CreateExampleRequestEntity,
  ExampleItemEntity,
  UpdateExampleRequestEntity,
} from '@example/core/entities';
import { ExampleRepository } from '@example/core/repositories/example.repository';
import { Observable, delay, of } from 'rxjs';

@Injectable()
export class ExampleImplementationRepository extends ExampleRepository {
  private mockData: ExampleItemEntity[] = [
    {
      id: '1',
      name: 'Ejemplo Real 1',
      description: 'Este es un elemento de ejemplo usando la implementación real del repositorio',
      category: 'technology',
      status: 'active',
      createdAt: new Date('2025-01-10'),
      updatedAt: new Date('2025-01-12'),
    },
    {
      id: '2',
      name: 'Ejemplo Real 2',
      description:
        'Segundo elemento de ejemplo con implementación real (normalmente conectaría a API)',
      category: 'business',
      status: 'pending',
      createdAt: new Date('2025-01-11'),
      updatedAt: new Date('2025-01-13'),
    },
  ];

  getItems(): Observable<ExampleItemEntity[]> {
    // En producción, aquí haríamos una llamada HTTP real
    // return this.http.get<ExampleItemEntity[]>('/api/examples');
    return of(this.mockData).pipe(delay(300));
  }

  getItemById(id: string): Observable<ExampleItemEntity> {
    const item = this.mockData.find(item => item.id === id);
    if (!item) {
      throw new Error('Item not found');
    }

    return of(item).pipe(delay(200));
  }

  createItem(request: CreateExampleRequestEntity): Observable<ExampleItemEntity> {
    const newItem: ExampleItemEntity = {
      id: `real-${Date.now()}`,
      ...request,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.mockData.push(newItem);

    // En producción: return this.http.post<ExampleItemEntity>('/api/examples', request);
    return of(newItem).pipe(delay(600));
  }

  updateItem(request: UpdateExampleRequestEntity): Observable<ExampleItemEntity> {
    const index = this.mockData.findIndex(item => item.id === request.id);

    if (index === -1) {
      throw new Error('Item not found');
    }

    const updatedItem: ExampleItemEntity = {
      ...this.mockData[index],
      ...request,
      updatedAt: new Date(),
    };

    this.mockData[index] = updatedItem;

    // En producción: return this.http.put<ExampleItemEntity>(`/api/examples/${request.id}`, request);
    return of(updatedItem).pipe(delay(600));
  }

  deleteItem(id: string): Observable<boolean> {
    const index = this.mockData.findIndex(item => item.id === id);

    if (index === -1) {
      throw new Error('Item not found');
    }

    this.mockData.splice(index, 1);

    // En producción: return this.http.delete<boolean>(`/api/examples/${id}`);
    return of(true).pipe(delay(400));
  }
}
