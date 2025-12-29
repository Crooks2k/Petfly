import { TravelClass } from '../../constants';

export interface PassengerSelectionEntity {
  adults: number;
  children: number;
  childrenAges: number[];
  travelClass: TravelClass;
}
