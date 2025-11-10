export interface LanguageEntity {
  code: string;
  name: string;
  flag: string;
  active?: boolean;
}

export interface TranslationConfigEntity {
  defaultLanguage: string;
  availableLanguages: LanguageEntity[];
  assetsPath: string;
  fileExtension: string;
  storageKey: string;
}

export interface TranslationLoadStateEntity {
  language: string;
  loading: boolean;
  error?: string;
  lastLoaded?: Date;
}

export interface TranslationParamsEntity {
  [key: string]: string | number | boolean | Date;
}

export type ResolvedI18nTexts<T extends I18nConfigEntity> = {
  readonly [K in keyof T['i18n']]: string;
};

export interface I18nConfigEntity {
  i18n: Record<string, string>;
  page?: {
    title?: string;
    description?: string;
    [key: string]: unknown;
  };
  api?: {
    endpoints?: Record<string, string>;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

export type I18nKeys<T extends I18nConfigEntity> = keyof T['i18n'];

export type I18nValues<T extends I18nConfigEntity> = T['i18n'][keyof T['i18n']];

export interface I18nLoadingStateEntity {
  loading: boolean;
  error?: string;
  lastLoaded?: Date;
}

export type I18nParamsEntity = Record<string, string | number | boolean | Date>;

export interface I18nNamespaceConfigEntity {
  namespace: string;
  prefix?: string;
  fallback?: string;
}
