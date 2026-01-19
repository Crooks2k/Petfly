import { BookingLinkEntity } from '@flight-search/core/entities';

export interface BookingLinkApiResponse {
  params: Record<string, unknown>;
  method: string;
  url: string;
  gate_id: number;
  click_id: number;
}

export class BookingLinkMapper {
  static toDomain(apiResponse: BookingLinkApiResponse): BookingLinkEntity {
    return {
      params: apiResponse.params,
      method: apiResponse.method,
      url: apiResponse.url,
      gateId: apiResponse.gate_id,
      clickId: apiResponse.click_id,
    };
  }
}
