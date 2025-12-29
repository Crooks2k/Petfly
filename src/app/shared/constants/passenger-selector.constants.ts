export const PASSENGER_SELECTOR_CONSTANTS = {
  MIN_ADULTS: 1,
  MAX_ADULTS: 9,
  MIN_CHILDREN: 0,
  MAX_CHILDREN: 9,
  DEFAULT_CHILD_AGE: 0,
  MAX_CHILD_AGE: 17,
  MOBILE_BREAKPOINT: 768,
  CHANGE_DETECTION_DELAY: 0,
} as const;

export const TRAVEL_CLASS = {
  ECONOMY: 'economy',
  BUSINESS: 'business',
} as const;

export type TravelClass = (typeof TRAVEL_CLASS)[keyof typeof TRAVEL_CLASS];
