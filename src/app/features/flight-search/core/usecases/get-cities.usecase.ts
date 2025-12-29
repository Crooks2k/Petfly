import { Observable } from 'rxjs';
import { UseCase } from '@core/base/use-case';
import { GetCitiesRequestEntity, GetCitiesResponseEntity } from '../entities';
import { PetflyRepository } from '../repositories/petfly.repository';

export class GetCitiesUseCase implements UseCase<GetCitiesRequestEntity, GetCitiesResponseEntity> {
  constructor(private readonly petflyRepository: PetflyRepository) {}

  public execute(request: GetCitiesRequestEntity): Observable<GetCitiesResponseEntity> {
    return this.petflyRepository.getCities(request);
  }
}
