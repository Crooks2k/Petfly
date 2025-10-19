import { I18nConfigEntity } from '@core/i18n/config';

export const ExampleConfig: I18nConfigEntity = Object.freeze({
  i18n: {
    title: 'example.title',
    subtitle: 'example.subtitle',
    loadButton: 'example.loadButton',
    listTitle: 'example.sections.list',
    noDataMessage: 'example.noDataMessage',
    createdAtLabel: 'example.createdAt',
    categoryTechnology: 'example.categories.technology',
    categoryBusiness: 'example.categories.business',
    categoryEducation: 'example.categories.education',
    categoryHealth: 'example.categories.health',
    categoryOther: 'example.categories.other',
    statusActive: 'example.status.active',
    statusInactive: 'example.status.inactive',
    statusPending: 'example.status.pending',
    statusCompleted: 'example.status.completed',
    loading: 'common.loading',
  },
});

/**
 * Interfaz que representa las traducciones resueltas para la página de ejemplo
 * Define explícitamente cada propiedad para permitir acceso directo en templates
 */
export interface ResolvedExampleTexts {
  readonly title: string;
  readonly subtitle: string;
  readonly loadButton: string;
  readonly listTitle: string;
  readonly noDataMessage: string;
  readonly createdAtLabel: string;
  readonly categoryTechnology: string;
  readonly categoryBusiness: string;
  readonly categoryEducation: string;
  readonly categoryHealth: string;
  readonly categoryOther: string;
  readonly statusActive: string;
  readonly statusInactive: string;
  readonly statusPending: string;
  readonly statusCompleted: string;
  readonly loading: string;
}

/**
 * Tipo para las categorías disponibles
 */
export type ExampleCategory = 'technology' | 'business' | 'education' | 'health' | 'other';

/**
 * Tipo para los estados disponibles
 */
export type ExampleStatus = 'active' | 'inactive' | 'pending' | 'completed';
