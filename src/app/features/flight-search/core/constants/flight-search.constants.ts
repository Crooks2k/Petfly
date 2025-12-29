export const FLIGHT_SEARCH_CONSTANTS = {
  SEARCH: {
    MIN_QUERY_LENGTH: 2,
    DEBOUNCE_TIME: 500,
    CITIES_LIMIT: 10,
  },
  PET_TYPE: {
    DOG_ID: 1,
    CAT_ID: 2,
  },
  TRIP_CLASS: {
    ECONOMY: 'Y',
    BUSINESS: 'C',
  },
  PET_TYPE_API: {
    DOG: 'Dog',
    CAT: 'Cat',
  },
  AGE: {
    INFANT_MAX: 2,
  },
  DATE_FORMAT: {
    PADDING_LENGTH: 2,
    PADDING_CHAR: '0',
  },
  WEIGHT: {
    DECIMAL_PRECISION: 10,
  },
} as const;

export const TRIP_CLASS_MAP: Record<string, string> = {
  economy: FLIGHT_SEARCH_CONSTANTS.TRIP_CLASS.ECONOMY,
  business: FLIGHT_SEARCH_CONSTANTS.TRIP_CLASS.BUSINESS,
};

export const PET_TYPE_MAP: Record<string, string> = {
  dog: FLIGHT_SEARCH_CONSTANTS.PET_TYPE_API.DOG,
  cat: FLIGHT_SEARCH_CONSTANTS.PET_TYPE_API.CAT,
};
