import { I18nConfigEntity } from '@core/i18n/config';

export const FlightCardMobileConfig = {
  i18n: {
    pricePerPerson: 'flightCard.pricePerPerson',
    petPrice: 'flightCard.petPrice',
    totalPrice: 'flightCard.totalPrice',
    totalPriceSubtitle: 'flightCard.totalPriceSubtitle',
    selectButton: 'flightCard.selectButton',
    loading: 'flightCard.loading',
    viewDetails: 'flightCard.viewDetails',
    viewLess: 'flightCard.viewLess',
    certificatesAccepted: 'flightCard.certificatesAccepted',
    certificatesNotAccepted: 'flightCard.certificatesNotAccepted',
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
    bookingLinkErrorSummary: 'flightCard.bookingLinkErrorSummary',
    bookingLinkErrorDetail: 'flightCard.bookingLinkErrorDetail',
    bookingRedirectSummary: 'flightCard.bookingRedirectSummary',
    bookingRedirectDetail: 'flightCard.bookingRedirectDetail',
    notAvailable: 'flightCard.notAvailable',
  },
} as const satisfies I18nConfigEntity;

export type ResolvedFlightCardMobileTexts = {
  [K in keyof typeof FlightCardMobileConfig.i18n]: string;
};
