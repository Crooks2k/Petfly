import { PetType } from '@flight-search/core/types';
import { PassengerSelectionEntity } from '@shared/core/entities';
import { CityEntity } from './get-cities-response.entity';

export interface FlightSearchFormEntity {
  tipoViaje: string;
  origen: string;
  origenCity: CityEntity | null;
  destino: string;
  destinoCity: CityEntity | null;
  fechaSalida: Date;
  fechaRegreso: Date | null;
  pasajeros: PassengerSelectionEntity;
  conMascota: boolean;
  tipoMascota: PetType;
  edadMascota: number;
  pesoMascota: number;
  razaMascota: string;
}
