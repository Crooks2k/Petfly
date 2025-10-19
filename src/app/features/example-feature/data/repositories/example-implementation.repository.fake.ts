import { Injectable } from '@angular/core';
import {
  CreateExampleRequestEntity,
  ExampleItemEntity,
  UpdateExampleRequestEntity,
} from '@example/core/entities';
import { ExampleRepository } from '@example/core/repositories/example.repository';
import { Observable, delay, of } from 'rxjs';

@Injectable()
export class ExampleImplementationRepositoryFake extends ExampleRepository {
  private mockData: ExampleItemEntity[] = [
    {
      id: '1',
      name: 'Ejemplo Mock 1',
      description: 'Este es un elemento de ejemplo usando datos simulados (fake)',
      category: 'technology',
      status: 'active',
      createdAt: new Date('2025-01-10'),
      updatedAt: new Date('2025-01-12'),
    },
    {
      id: '2',
      name: 'Ejemplo Mock 2',
      description: 'Segundo elemento de ejemplo con datos simulados para desarrollo',
      category: 'business',
      status: 'pending',
      createdAt: new Date('2025-01-11'),
      updatedAt: new Date('2025-01-13'),
    },
    {
      id: '3',
      name: 'Ejemplo Mock 3',
      description: 'Tercer elemento para demostrar la funcionalidad con más datos',
      category: 'education',
      status: 'inactive',
      createdAt: new Date('2025-01-09'),
      updatedAt: new Date('2025-01-11'),
    },
  ];

  getItems(): Observable<ExampleItemEntity[]> {
    return of(this.mockData).pipe(delay(800)); // Simular latencia de red
  }

  getItemById(id: string): Observable<ExampleItemEntity> {
    const item = this.mockData.find(item => item.id === id);
    if (!item) {
      throw new Error('Item not found');
    }

    return of(item).pipe(delay(500));
  }

  createItem(request: CreateExampleRequestEntity): Observable<ExampleItemEntity> {
    const newItem: ExampleItemEntity = {
      id: `mock-${Date.now()}`,
      ...request,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.mockData.push(newItem);

    return of(newItem).pipe(delay(1000));
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

    return of(updatedItem).pipe(delay(1000));
  }

  deleteItem(id: string): Observable<boolean> {
    const index = this.mockData.findIndex(item => item.id === id);

    if (index === -1) {
      throw new Error('Item not found');
    }

    this.mockData.splice(index, 1);

    return of(true).pipe(delay(600));
  }
}
