import { RegisterInformationEntity } from './register-infortmation.entity';

export interface RegisterResponseEntity extends RegisterInformationEntity {
  token: string;
}
