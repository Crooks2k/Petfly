import { FilterFlightsDimensionsEntity } from './filter-flights-dimensions.entity';

export interface FilterFlightsParametersEntity {
  isDirect: boolean;
  maxPrice: number;
  minPrice: number;
  dimensions: FilterFlightsDimensionsEntity;
  airlineCode: string;
  certificateType: string;
}
