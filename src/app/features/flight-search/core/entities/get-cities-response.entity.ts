export type GetCitiesResponseEntity = CityEntity[];

export interface CityEntity {
  cityName: string;
  cityCode: string;
  countryCode: string;
  countryName: string;
  displayName: string;
}
