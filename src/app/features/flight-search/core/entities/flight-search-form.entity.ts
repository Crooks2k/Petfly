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
  petAgeOver24Weeks?: boolean | null;
  edadMascota: number;
  pesoMascota: number;
  razaMascota: string;
  altura?: number | null;
  largo?: number | null;
  ancho?: number | null;
  length?: number | null;
  width?: number | null;
  height?: number | null;
  sinTransportador?: boolean | null;
  isCarrierRequired?: boolean | null;
  certificados?: string[];
  permitirEscalas?: boolean | null;
  precioMinimo?: number | null;
  precioMaximo?: number | null;
  aerolinea?: string | null;
}
