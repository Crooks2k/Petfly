export const INPUT_SELECT_CONSTANTS = {
  DEFAULT_OPTION_LABEL: 'label',
  DEFAULT_OPTION_VALUE: 'value',
} as const;

export const INPUT_SELECT_SIZE = {
  SMALL: 'small',
  NORMAL: 'normal',
  LARGE: 'large',
} as const;

export type InputSelectSize = typeof INPUT_SELECT_SIZE[keyof typeof INPUT_SELECT_SIZE];
