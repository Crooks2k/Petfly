import { Observable } from 'rxjs';
import { UseCase } from '@core/base/use-case';
import { GetCurrenciesRequestEntity, GetCurrenciesResponseEntity } from '../entities';
import { PetflyRepository } from '../repositories/petfly.repository';

export class GetCurrenciesUseCase
  implements UseCase<GetCurrenciesRequestEntity, GetCurrenciesResponseEntity>
{
  constructor(private readonly petflyRepository: PetflyRepository) {}

  public execute(request: GetCurrenciesRequestEntity): Observable<GetCurrenciesResponseEntity> {
    return this.petflyRepository.getCurrencies(request);
  }
}
