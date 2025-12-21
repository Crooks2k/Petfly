import { Observable } from 'rxjs';
import { UseCase } from '@core/base/use-case';
import { FlightSearchFormEntity, SearchFlightsResponseEntity } from '../entities';
import { PetflyRepository } from '../repositories/petfly.repository';

export interface SearchFlightsUseCaseParams {
  formData: FlightSearchFormEntity;
  currency: string;
  locale: string;
  options?: { useDefaults?: boolean };
}

export class SearchFlightsUseCase
implements UseCase<SearchFlightsUseCaseParams, SearchFlightsResponseEntity>
{
  constructor(private readonly petflyRepository: PetflyRepository) {}

  public execute(params: SearchFlightsUseCaseParams): Observable<SearchFlightsResponseEntity> {
    return this.petflyRepository.searchFlights(
      params.formData,
      params.currency,
      params.locale,
      params.options
    );
  }
}
