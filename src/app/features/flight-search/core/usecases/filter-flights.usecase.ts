import { Observable } from 'rxjs';
import { PetflyRepository } from '../repositories/petfly.repository';
import { FlightSearchFormEntity, FilterFlightsResponseEntity } from '../entities';

export interface FilterFlightsUseCaseParams {
  formData: FlightSearchFormEntity;
  searchId: string;
  currency: string;
  locale: string;
  options?: { useDefaults?: boolean };
}

export class FilterFlightsUseCase {
  constructor(private readonly repository: PetflyRepository) {}

  execute(params: FilterFlightsUseCaseParams): Observable<FilterFlightsResponseEntity> {
    return this.repository.filterFlights(
      params.formData,
      params.searchId,
      params.currency,
      params.locale,
      params.options
    );
  }
}
