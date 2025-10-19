export interface RegisterInformationEntity {
  userName: string;
  email: string;
  passWord: string;
  contractNumber: number;
  phoneNumber: string;
}

export interface RequestRegisterEntity extends RegisterInformationEntity {}
