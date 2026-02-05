import { I18nConfigEntity } from '@core/i18n/config';

export const FlightCardDesktopConfig = {
  i18n: {
    pricePerPerson: 'flightCard.pricePerPerson',
    petPrice: 'flightCard.petPrice',
    totalPrice: 'flightCard.totalPrice',
    selectButton: 'flightCard.selectButton',
    loading: 'flightCard.loading',
    clickCertificatesInfo: 'flightCard.clickCertificatesInfo',
    direct: 'flightCard.direct',
    stop: 'flightCard.stop',
    stops: 'flightCard.stops',
    mrBadge: 'flightCard.mrBadge',
    aeBadge: 'flightCard.aeBadge',
    psBadge: 'flightCard.psBadge',
    mrLabel: 'flightCard.mrLabel',
    aeLabel: 'flightCard.aeLabel',
    psLabel: 'flightCard.psLabel',
    aeNotAccepted: 'flightCard.aeNotAccepted',
    psNotAccepted: 'flightCard.psNotAccepted',
    mrNotAccepted: 'flightCard.mrNotAccepted',
    priceEstimationWarning: 'flightCard.priceEstimationWarning',
    stopAtAirport: 'flightCard.stopAtAirport',
    operatedBy: 'flightCard.operatedBy',
    outboundFlight: 'flightCard.outboundFlight',
    returnFlight: 'flightCard.returnFlight',
    bookingLinkErrorSummary: 'flightCard.bookingLinkErrorSummary',
    bookingLinkErrorDetail: 'flightCard.bookingLinkErrorDetail',
    bookingRedirectSummary: 'flightCard.bookingRedirectSummary',
    bookingRedirectDetail: 'flightCard.bookingRedirectDetail',
    notAvailable: 'flightCard.notAvailable',
  },
} as const satisfies I18nConfigEntity;

export type ResolvedFlightCardDesktopTexts = {
  [K in keyof typeof FlightCardDesktopConfig.i18n]: string;
};
