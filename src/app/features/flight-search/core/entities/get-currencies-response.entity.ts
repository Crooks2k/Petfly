export type GetCurrenciesResponseEntity = CurrencyEntity[];

export interface CurrencyEntity {
  id: number;
  name: string;
  symbol: string;
}
