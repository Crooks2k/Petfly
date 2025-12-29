import { CityEntity } from '@flight-search/core/entities';

export interface CitySelectionEvent {
  city?: CityEntity;
}

export interface CityOption {
  label: string;
  value: string;
  city?: CityEntity;
}
