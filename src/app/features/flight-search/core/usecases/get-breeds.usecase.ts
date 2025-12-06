import { Observable } from 'rxjs';
import { UseCase } from '@core/base/use-case';
import { GetBreedsRequestEntity, GetBreedsResponseEntity } from '../entities';
import { PetflyRepository } from '../repositories/petfly.repository';

export class GetBreedsUseCase
  implements UseCase<GetBreedsRequestEntity, GetBreedsResponseEntity>
{
  constructor(private readonly petflyRepository: PetflyRepository) {}

  public execute(request: GetBreedsRequestEntity): Observable<GetBreedsResponseEntity> {
    return this.petflyRepository.getBreeds(request);
  }
}
