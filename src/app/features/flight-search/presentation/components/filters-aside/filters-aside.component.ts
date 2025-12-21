import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { PetType } from '@flight-search/core/types';
import { I18nService } from '@core/i18n/i18n.service';
import {
  Subject,
  takeUntil,
  debounceTime,
  distinctUntilChanged,
  switchMap,
  of,
  catchError,
} from 'rxjs';
import { FiltersAsideConfig, ResolvedFiltersAsideTexts } from './filters-aside.config';
import { PetflyInteractor } from '@flight-search/core/interactor/petfly.interactor';
import { FLIGHT_SEARCH_CONSTANTS } from '@flight-search/core/constants';

@Component({
  selector: 'app-filters-aside',
  templateUrl: './filters-aside.component.html',
  styleUrl: './filters-aside.component.scss',
  standalone: false,
})
export class FiltersAsideComponent implements OnInit, OnDestroy {
  @Input() filtersForm!: FormGroup;
  @Input() selectedPetType: PetType = null;
  @Input() today!: Date;

  public texts: ResolvedFiltersAsideTexts = {} as ResolvedFiltersAsideTexts;
  public readonly config = FiltersAsideConfig;

  // Cities
  public ciudadesOrigenOptions: { label: string; value: string; city?: any }[] = [];
  public ciudadesDestinoOptions: { label: string; value: string; city?: any }[] = [];
  public isLoadingCitiesOrigen = false;
  public isLoadingCitiesDestino = false;

  // Breeds
  public razasOptions: { label: string; value: string }[] = [];
  public isLoadingBreeds = false;

  private readonly destroy$ = new Subject<void>();
  private readonly origenSearchSubject = new Subject<string>();
  private readonly destinoSearchSubject = new Subject<string>();

  @Output() petTypeSelected = new EventEmitter<Exclude<PetType, null>>();
  @Output() certificateToggled = new EventEmitter<string>();
  @Output() filtersApplied = new EventEmitter<void>();

  constructor(
    private readonly i18nService: I18nService,
    private readonly petflyInteractor: PetflyInteractor
  ) {}

  public ngOnInit(): void {
    if (!this.filtersForm) {
      throw new Error('filtersForm is required');
    }
    this.setupReactiveTexts();
    this.setupCitiesSearch();
    this.setupCitiesValidation();
    this.setupPetTypeSubscription();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public selectPetType(type: Exclude<PetType, null>): void {
    this.petTypeSelected.emit(type);
    this.loadBreedsByPetType(type);
  }

  public toggleCertificate(certificate: string): void {
    this.certificateToggled.emit(certificate);
  }

  public isCertificateSelected(certificate: string): boolean {
    const certificates = this.filtersForm.get('certificados')?.value || [];
    return certificates.includes(certificate);
  }

  public getMinReturnDate(): Date {
    const departureDate = this.filtersForm.get('fechaSalida')?.value;
    if (departureDate && departureDate instanceof Date) {
      return departureDate;
    }
    return this.today;
  }

  public onUpdateFilters(): void {
    this.filtersApplied.emit();
  }

  // Cities methods
  public onOrigenSearch(event: { query: string }): void {
    this.origenSearchSubject.next(event.query);
  }

  public onDestinoSearch(event: { query: string }): void {
    this.destinoSearchSubject.next(event.query);
  }

  public onOrigenSelect(event: unknown): void {
    if (event && typeof event === 'object' && 'city' in event) {
      const cityEvent = event as { city?: any };
      if (cityEvent.city) {
        this.filtersForm.patchValue({ origenCity: cityEvent.city }, { emitEvent: false });
      }
    }
  }

  public onDestinoSelect(event: unknown): void {
    if (event && typeof event === 'object' && 'city' in event) {
      const cityEvent = event as { city?: any };
      if (cityEvent.city) {
        this.filtersForm.patchValue({ destinoCity: cityEvent.city }, { emitEvent: false });
      }
    }
  }

  private setupReactiveTexts(): void {
    this.i18nService
      .getReactiveTexts(this.config)
      .pipe(takeUntil(this.destroy$))
      .subscribe(resolvedTexts => {
        this.texts = resolvedTexts as unknown as ResolvedFiltersAsideTexts;
      });
  }

  private setupCitiesSearch(): void {
    this.origenSearchSubject
      .pipe(
        debounceTime(FLIGHT_SEARCH_CONSTANTS.SEARCH.DEBOUNCE_TIME),
        distinctUntilChanged(),
        switchMap(query => {
          if (!query || query.length < FLIGHT_SEARCH_CONSTANTS.SEARCH.MIN_QUERY_LENGTH) {
            this.ciudadesOrigenOptions = [];
            this.isLoadingCitiesOrigen = false;
            return of([]);
          }
          this.isLoadingCitiesOrigen = true;
          return this.petflyInteractor
            .getCities({
              query,
              limit: FLIGHT_SEARCH_CONSTANTS.SEARCH.CITIES_LIMIT,
            })
            .pipe(
              catchError(() => {
                this.isLoadingCitiesOrigen = false;
                return of([]);
              })
            );
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: response => {
          this.ciudadesOrigenOptions =
            response.length > 0
              ? response.map(city => ({
                label: city.displayName,
                value: city.cityCode,
                city: city,
              }))
              : [];
          this.isLoadingCitiesOrigen = false;
        },
      });

    this.destinoSearchSubject
      .pipe(
        debounceTime(FLIGHT_SEARCH_CONSTANTS.SEARCH.DEBOUNCE_TIME),
        distinctUntilChanged(),
        switchMap(query => {
          if (!query || query.length < FLIGHT_SEARCH_CONSTANTS.SEARCH.MIN_QUERY_LENGTH) {
            this.ciudadesDestinoOptions = [];
            this.isLoadingCitiesDestino = false;
            return of([]);
          }
          this.isLoadingCitiesDestino = true;
          return this.petflyInteractor
            .getCities({
              query,
              limit: FLIGHT_SEARCH_CONSTANTS.SEARCH.CITIES_LIMIT,
            })
            .pipe(
              catchError(() => {
                this.isLoadingCitiesDestino = false;
                return of([]);
              })
            );
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: response => {
          this.ciudadesDestinoOptions =
            response.length > 0
              ? response.map(city => ({
                label: city.displayName,
                value: city.cityCode,
                city: city,
              }))
              : [];
          this.isLoadingCitiesDestino = false;
        },
      });
  }

  private setupCitiesValidation(): void {
    this.filtersForm
      .get('origen')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(origenValue => {
        const destinoValue = this.filtersForm.get('destino')?.value;
        if (origenValue && destinoValue && origenValue === destinoValue) {
          this.filtersForm.patchValue({ destino: null }, { emitEvent: false });
        }
      });

    this.filtersForm
      .get('destino')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(destinoValue => {
        const origenValue = this.filtersForm.get('origen')?.value;
        if (origenValue && destinoValue && origenValue === destinoValue) {
          this.filtersForm.patchValue({ destino: null }, { emitEvent: false });
        }
      });
  }

  private setupPetTypeSubscription(): void {
    const breedControl = this.filtersForm.get('razaMascota');

    if (!this.selectedPetType) {
      breedControl?.disable();
    }

    this.filtersForm
      .get('tipoMascota')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((petType: PetType) => {
        if (petType) {
          this.loadBreedsByPetType(petType);
        } else {
          this.razasOptions = [];
          breedControl?.disable();
          this.filtersForm.patchValue({ razaMascota: '' }, { emitEvent: false });
        }
      });
  }

  private loadBreedsByPetType(petType: 'dog' | 'cat'): void {
    this.isLoadingBreeds = true;
    this.razasOptions = [];

    const breedControl = this.filtersForm.get('razaMascota');
    breedControl?.disable();
    this.filtersForm.patchValue({ razaMascota: '' }, { emitEvent: false });

    const petTypeId =
      petType === 'dog'
        ? FLIGHT_SEARCH_CONSTANTS.PET_TYPE.DOG_ID
        : FLIGHT_SEARCH_CONSTANTS.PET_TYPE.CAT_ID;

    this.petflyInteractor
      .getBreeds({ petTypeId })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: response => {
          this.razasOptions = response.map(breed => ({
            label: breed.name,
            value: breed.name,
          }));
          this.isLoadingBreeds = false;
          breedControl?.enable();
        },
        error: () => {
          this.razasOptions = [];
          this.isLoadingBreeds = false;
          breedControl?.enable();
        },
      });
  }
}
