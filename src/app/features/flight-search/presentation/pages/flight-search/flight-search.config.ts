import { I18nConfigEntity } from '@core/i18n/config';
import { trigger, style, transition, animate } from '@angular/animations';

export const FlightSearchConfig = {
  i18n: {
    title: 'flightSearch.title',
    subtitle: 'flightSearch.subtitle',
    searchButton: 'flightSearch.searchButton',
    originLabel: 'flightSearch.originLabel',
    destinationLabel: 'flightSearch.destinationLabel',
    departureDateLabel: 'flightSearch.departureDateLabel',
    returnDateLabel: 'flightSearch.returnDateLabel',
    passengersLabel: 'flightSearch.passengersLabel',
    tripTypeLabel: 'flightSearch.tripTypeLabel',
    oneWay: 'flightSearch.oneWay',
    roundTrip: 'flightSearch.roundTrip',
    adults: 'flightSearch.adults',
    children: 'flightSearch.children',
    infants: 'flightSearch.infants',
    searchingFlights: 'flightSearch.searchingFlights',
    policysTitle: 'flightSearch.policiesTitle',
    petDetailsTitle: 'flightSearch.petDetailsTitle',
    dogLabel: 'flightSearch.dogLabel',
    catLabel: 'flightSearch.catLabel',
    petAgeLabel: 'flightSearch.petAgeLabel',
    petAgeQuestion: 'flightSearch.petAgeQuestion',
    petAgeYes: 'flightSearch.petAgeYes',
    petAgeNo: 'flightSearch.petAgeNo',
    petWeightLabel: 'flightSearch.petWeightLabel',
    petWeightSubtitle: 'flightSearch.petWeightSubtitle',
    petBreedLabel: 'flightSearch.petBreedLabel',
    petBreedPlaceholder: 'flightSearch.petBreedPlaceholder',
    petBreedFilterPlaceholder: 'flightSearch.petBreedFilterPlaceholder',
    cityFilterPlaceholder: 'flightSearch.cityFilterPlaceholder',
    passengersPlaceholder: 'flightSearch.passengersPlaceholder',
    passengerSelectorAdults: 'flightSearch.passengerSelectorAdults',
    passengerSelectorAdultsSubLabel: 'flightSearch.passengerSelectorAdultsSubLabel',
    passengerSelectorChildren: 'flightSearch.passengerSelectorChildren',
    passengerSelectorChildrenSubLabel: 'flightSearch.passengerSelectorChildrenSubLabel',
    passengerSelectorClass: 'flightSearch.passengerSelectorClass',
    passengerSelectorEconomy: 'flightSearch.passengerSelectorEconomy',
    passengerSelectorBusiness: 'flightSearch.passengerSelectorBusiness',
    passengerSelectorPassenger: 'flightSearch.passengerSelectorPassenger',
    passengerSelectorPassengers: 'flightSearch.passengerSelectorPassengers',
    passengerSelectorCancel: 'flightSearch.passengerSelectorCancel',
    passengerSelectorSave: 'flightSearch.passengerSelectorSave',
  },
  animations: {
    slideInOut: trigger('slideInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(20px)' }),
        animate('300ms ease-in-out', style({ opacity: 1, transform: 'translateX(0)' })),
      ]),
      transition(':leave', [
        animate('300ms ease-in-out', style({ opacity: 0, transform: 'translateX(20px)' })),
      ]),
    ]),
  },
  options: {
    tripTypes: [
      { value: 'roundtrip', i18nKey: 'roundTrip' },
      { value: 'oneway', i18nKey: 'oneWay' },
    ],
    cities: [
      { label: 'Bogotá, Colombia (BOG)', value: 'BOG' },
      { label: 'Barcelona, España (BCN)', value: 'BCN' },
      { label: 'Madrid, España (MAD)', value: 'MAD' },
      { label: 'Valencia, España (VLC)', value: 'VLC' },
      { label: 'Medellín, Colombia (MDE)', value: 'MDE' },
      { label: 'Lima, Perú (LIM)', value: 'LIM' },
      { label: 'Buenos Aires, Argentina (EZE)', value: 'EZE' },
      { label: 'Santiago, Chile (SCL)', value: 'SCL' },
    ],
    passengers: [
      { value: '1-adult-economy', i18nKey: 'flightSearch.passengers.1AdultEconomy' },
      { value: '2-adults-economy', i18nKey: 'flightSearch.passengers.2AdultsEconomy' },
      { value: '1-adult-1-child-economy', i18nKey: 'flightSearch.passengers.1Adult1ChildEconomy' },
      { value: '1-adult-premium', i18nKey: 'flightSearch.passengers.1AdultPremium' },
    ],
    breeds: [
      { value: 'labrador', i18nKey: 'flightSearch.breeds.labrador' },
      { value: 'golden', i18nKey: 'flightSearch.breeds.golden' },
      { value: 'bulldog-frances', i18nKey: 'flightSearch.breeds.bulldogFrances' },
      { value: 'pastor-aleman', i18nKey: 'flightSearch.breeds.pastorAleman' },
      { value: 'chihuahua', i18nKey: 'flightSearch.breeds.chihuahua' },
      { value: 'poodle', i18nKey: 'flightSearch.breeds.poodle' },
      { value: 'persa', i18nKey: 'flightSearch.breeds.persa' },
      { value: 'siames', i18nKey: 'flightSearch.breeds.siames' },
      { value: 'maine-coon', i18nKey: 'flightSearch.breeds.maineCoon' },
      { value: 'otra', i18nKey: 'flightSearch.breeds.other' },
    ],
  },
  routes: {
    flightResults: '/flight-results',
  },
} as const satisfies I18nConfigEntity;

export type ResolvedFlightSearchTexts = {
  [K in keyof typeof FlightSearchConfig.i18n]: string;
};
