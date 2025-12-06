import { PetType } from '@flight-search/core/types';
import { PassengerSelection } from '@shared/components/passenger-selector/passenger-selector.component';
import { CityEntity } from './get-cities-response.entity';

export interface FlightSearchFormEntity {
  tipoViaje: string;
  origen: string;
  origenCity: CityEntity | null;
  destino: string;
  destinoCity: CityEntity | null;
  fechaSalida: Date;
  fechaRegreso: Date | null;
  pasajeros: PassengerSelection;
  conMascota: boolean;
  tipoMascota: PetType;
  edadMascota: number;
  pesoMascota: number;
  razaMascota: string;
}
