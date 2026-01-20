export interface BookingLinkEntity {
  params: Record<string, unknown>;
  method: string;
  url: string;
  gateId: number;
  clickId: number;
}
