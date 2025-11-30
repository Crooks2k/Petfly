import { I18nConfigEntity } from '@core/i18n/config';

export const PageNotFoundConfig = {
  i18n: {
    title: 'pageNotFound.title',
    description: 'pageNotFound.description',
    homeButton: 'pageNotFound.homeButton',
    backButton: 'pageNotFound.backButton',
  },
  routes: {
    home: '/',
  },
} as const satisfies I18nConfigEntity;

export type ResolvedPageNotFoundTexts = {
  [K in keyof typeof PageNotFoundConfig.i18n]: string;
};
