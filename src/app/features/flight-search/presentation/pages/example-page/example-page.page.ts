import { Component, OnDestroy, OnInit } from '@angular/core';
import { I18N_CONSTANTS } from '@core/i18n/config';
import { I18nService } from '@core/i18n/i18n.service';
import { ExampleItemEntity } from '@flight-search/core/entities';
import { ExampleInteractor } from '@flight-search/core/interactor/example.interactor';
import { Subject, takeUntil } from 'rxjs';
import { ExampleConfig, ResolvedExampleTexts } from './example.config';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-example-page',
  templateUrl: './example-page.page.html',
  styleUrl: './example-page.page.scss',
  standalone: false,
})
export class ExamplePagePage implements OnInit, OnDestroy {
  public examples: ExampleItemEntity[] = [];
  public isLoading = false;
  public currentLanguage: string = I18N_CONSTANTS.DEFAULT_LANGUAGE;
  public readonly availableLanguages = [...I18N_CONSTANTS.AVAILABLE_LANGUAGES];
  public readonly config = ExampleConfig;
  public texts: ResolvedExampleTexts = {} as ResolvedExampleTexts;

  public ciudades = [
    { label: 'Bogotá, Colombia (BOG)', value: 'BOG' },
    { label: 'Barcelona, España (BCN)', value: 'BCN' },
    { label: 'Madrid, España (MAD)', value: 'MAD' },
    { label: 'Valencia, España (VLC)', value: 'VLC' },
    { label: 'Medellín, Colombia (MDE)', value: 'MDE' },
    { label: 'Lima, Perú (LIM)', value: 'LIM' }
  ];

  public tipoViaje = [
    { label: 'Solo ida', value: 'oneway' },
    { label: 'Ida y vuelta', value: 'roundtrip' }
  ];

  public aerolineas = [
    { label: 'Iberia', value: 'IB' },
    { label: 'Vueling', value: 'VY' },
    { label: 'Air Europa', value: 'UX' },
    { label: 'Ryanair', value: 'FR' },
    { label: 'easyJet', value: 'U2' }
  ];

  public opcionesBusqueda: MenuItem[] = [
    {
      label: 'Búsqueda avanzada',
      icon: 'pi pi-search-plus',
      command: () => this.onAdvancedSearch()
    },
    {
      label: 'Filtrar por precio',
      icon: 'pi pi-dollar',
      command: () => this.onFilterByPrice()
    },
    {
      separator: true
    },
    {
      label: 'Guardar búsqueda',
      icon: 'pi pi-bookmark',
      command: () => this.onSaveSearch()
    }
  ];

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly i18nService: I18nService,
    private readonly exampleInteractor: ExampleInteractor
  ) {}

  public ngOnInit(): void {
    this.setupLanguageSubscription();
    this.setupReactiveTexts();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public loadExamples(): void {
    this.isLoading = true;

    this.exampleInteractor
      .getExamples()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: examples => {
          this.examples = examples;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        },
      });
  }

  public changeLanguage(languageCode: string): void {
    this.i18nService.setLanguage(languageCode);
  }

  public getCategoryText(category: string): string {
    const categoryKey =
      `category${category.charAt(0).toUpperCase() + category.slice(1)}` as keyof ResolvedExampleTexts;
    return (
      this.texts[categoryKey] || this.i18nService.translateInstant(`example.categories.${category}`)
    );
  }

  public getStatusText(status: string): string {
    const statusKey =
      `status${status.charAt(0).toUpperCase() + status.slice(1)}` as keyof ResolvedExampleTexts;
    return this.texts[statusKey] || this.i18nService.translateInstant(`example.status.${status}`);
  }

  private setupLanguageSubscription(): void {
    this.i18nService.currentLanguage$.pipe(takeUntil(this.destroy$)).subscribe(lang => {
      this.currentLanguage = lang;
    });
  }

  private setupReactiveTexts(): void {
    this.i18nService
      .getReactiveTexts(this.config)
      .pipe(takeUntil(this.destroy$))
      .subscribe(resolvedTexts => {
        this.texts = resolvedTexts as unknown as ResolvedExampleTexts;
      });
  }

  private onAdvancedSearch(): void {
    // Implementar búsqueda avanzada
  }

  private onFilterByPrice(): void {
    // Implementar filtro por precio
  }

  private onSaveSearch(): void {
    // Implementar guardar búsqueda
  }
}
