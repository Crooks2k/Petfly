export const I18N_CONSTANTS = {
  DEFAULT_LANGUAGE: 'es',
  STORAGE_KEY: 'selected-language',
  AVAILABLE_LANGUAGES: [
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
  ],
} as const;

export const I18N_PATHS = {
  ASSETS_PATH: './assets/i18n/',
  FILE_EXTENSION: '.json',
} as const;
