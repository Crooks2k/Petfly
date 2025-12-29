import { GetBreedsResponseEntity } from '@flight-search/core/entities';

export const mockBreeds: { [petTypeId: number]: GetBreedsResponseEntity } = {
  1: [
    { name: 'Labrador Retriever', petTypeId: 1 },
    { name: 'Golden Retriever', petTypeId: 1 },
    { name: 'Pastor Alemán', petTypeId: 1 },
    { name: 'Bulldog Francés', petTypeId: 1 },
    { name: 'Beagle', petTypeId: 1 },
    { name: 'Poodle', petTypeId: 1 },
    { name: 'Chihuahua', petTypeId: 1 },
    { name: 'Husky Siberiano', petTypeId: 1 },
  ],
  2: [
    { name: 'Persa', petTypeId: 2 },
    { name: 'Siamés', petTypeId: 2 },
    { name: 'Maine Coon', petTypeId: 2 },
    { name: 'Bengalí', petTypeId: 2 },
    { name: 'Ragdoll', petTypeId: 2 },
    { name: 'British Shorthair', petTypeId: 2 },
  ],
};
