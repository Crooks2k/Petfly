import { I18nConfigEntity } from '@core/i18n/config';

export const FlightCardConfig = {
  i18n: {
    pricePerPerson: 'flightCard.pricePerPerson',
    petPrice: 'flightCard.petPrice',
    totalPrice: 'flightCard.totalPrice',
    totalPriceSubtitle: 'flightCard.totalPriceSubtitle',
    selectButton: 'flightCard.selectButton',
    direct: 'flightCard.direct',
    stop: 'flightCard.stop',
    stops: 'flightCard.stops',
    stopAtAirport: 'flightCard.stopAtAirport',
    operatedBy: 'flightCard.operatedBy',
    outboundFlight: 'flightCard.outboundFlight',
    returnFlight: 'flightCard.returnFlight',
    priceEstimationWarning: 'flightCard.priceEstimationWarning',
    mrBadge: 'flightCard.mrBadge',
    aeBadge: 'flightCard.aeBadge',
    psBadge: 'flightCard.psBadge',
    mrLabel: 'flightCard.mrLabel',
    aeLabel: 'flightCard.aeLabel',
    psLabel: 'flightCard.psLabel',
    aeNotAccepted: 'flightCard.aeNotAccepted',
  },
} as const satisfies I18nConfigEntity;

export type ResolvedFlightCardTexts = {
  [K in keyof typeof FlightCardConfig.i18n]: string;
};
