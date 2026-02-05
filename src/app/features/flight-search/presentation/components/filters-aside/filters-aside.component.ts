import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { PetType } from '@flight-search/core/types';
import { I18nService } from '@core/i18n/i18n.service';
import { CityOption, CitySelectionEvent } from '@shared/core/entities';
import {
  Subject,
  takeUntil,
  debounceTime,
  distinctUntilChanged,
  map,
  switchMap,
  of,
  catchError,
} from 'rxjs';
import { FiltersAsideConfig, ResolvedFiltersAsideTexts } from './filters-aside.config';
import { PetflyInteractor } from '@flight-search/core/interactor/petfly.interactor';
import { FLIGHT_SEARCH_CONSTANTS } from '@flight-search/core/constants';
import { FiltersBoundaryEntity } from '@flight-search/core/entities';

@Component({
  selector: 'app-filters-aside',
  templateUrl: './filters-aside.component.html',
  styleUrl: './filters-aside.component.scss',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FiltersAsideComponent implements OnInit, OnDestroy {
  @Input() filtersForm!: FormGroup;
  @Input() selectedPetType: PetType = null;
  @Input() today!: Date;
  @Input() filtersBoundary: FiltersBoundaryEntity | null = null;

  public texts: ResolvedFiltersAsideTexts = {} as ResolvedFiltersAsideTexts;
  public readonly config = FiltersAsideConfig;

  public ciudadesOrigenOptions: CityOption[] = [];
  public ciudadesDestinoOptions: CityOption[] = [];
  public isLoadingCitiesOrigen = false;
  public isLoadingCitiesDestino = false;

  public razasOptions: { label: string; value: string }[] = [];
  public isLoadingBreeds = false;

  public airlinesOptions: { label: string; value: string }[] = [];

  private readonly destroy$ = new Subject<void>();
  private readonly origenSearchSubject = new Subject<string>();
  private readonly destinoSearchSubject = new Subject<string>();

  @Output() petTypeSelected = new EventEmitter<Exclude<PetType, null>>();
  @Output() certificateToggled = new EventEmitter<string>();
  @Output() filtersApplied = new EventEmitter<void>();

  constructor(
    private readonly i18nService: I18nService,
    private readonly petflyInteractor: PetflyInteractor,
    private readonly cdr: ChangeDetectorRef
  ) {}

  public ngOnInit(): void {
    if (!this.filtersForm) {
      throw new Error('filtersForm is required');
    }
    this.setupReactiveTexts();
    this.setupCitiesSearch();
    this.setupPetAgeValidation();

    if (this.selectedPetType) {
      this.loadBreedsByPetType(this.selectedPetType);
    }

    this.initializeAirlines();
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
    const origenValue = this.filtersForm.get('origen')?.value;
    const destinoValue = this.filtersForm.get('destino')?.value;

    if (origenValue && destinoValue && origenValue === destinoValue) {
      this.filtersForm.patchValue({ destino: null }, { emitEvent: false });
      return;
    }

    this.filtersApplied.emit();
  }

  public onOrigenSearch(event: { query: string }): void {
    this.origenSearchSubject.next(event.query);
  }

  public onDestinoSearch(event: { query: string }): void {
    this.destinoSearchSubject.next(event.query);
  }

  public onOrigenSelect(event: unknown): void {
    const cityEvent = event as CitySelectionEvent;
    if (cityEvent?.city) {
      this.filtersForm.patchValue(
        { origen: cityEvent.city.cityCode, origenCity: cityEvent.city },
        { emitEvent: false }
      );
    }
  }

  public onDestinoSelect(event: unknown): void {
    const cityEvent = event as CitySelectionEvent;
    if (cityEvent?.city) {
      this.filtersForm.patchValue(
        { destino: cityEvent.city.cityCode, destinoCity: cityEvent.city },
        { emitEvent: false }
      );
    }
  }

  private setupReactiveTexts(): void {
    this.i18nService
      .getReactiveTexts(this.config)
      .pipe(takeUntil(this.destroy$))
      .subscribe(resolvedTexts => {
        this.texts = resolvedTexts as unknown as ResolvedFiltersAsideTexts;
        this.cdr.markForCheck();
      });
  }

  private setupCitiesSearch(): void {
    const minLen = FLIGHT_SEARCH_CONSTANTS.SEARCH.MIN_QUERY_LENGTH;
    const debounceMs = FLIGHT_SEARCH_CONSTANTS.SEARCH.DEBOUNCE_TIME;
    const limit = FLIGHT_SEARCH_CONSTANTS.SEARCH.CITIES_LIMIT;

    this.origenSearchSubject
      .pipe(
        debounceTime(debounceMs),
        map((q: string) => (q ?? '').trim()),
        distinctUntilChanged(),
        switchMap(query => {
          if (query.length < minLen) {
            return of([]);
          }
          this.isLoadingCitiesOrigen = true;
          this.cdr.markForCheck();
          return this.petflyInteractor.getCities({ query, limit }).pipe(
            catchError(() => of([]))
          );
        }),
        takeUntil(this.destroy$)
      )
      .subscribe(response => {
        this.ciudadesOrigenOptions =
          response.length > 0
            ? response.map(city => ({
                label: city.displayName,
                value: city.cityCode,
                city: city,
              }))
            : [];
        this.isLoadingCitiesOrigen = false;
        this.cdr.markForCheck();
      });

    this.destinoSearchSubject
      .pipe(
        debounceTime(debounceMs),
        map((q: string) => (q ?? '').trim()),
        distinctUntilChanged(),
        switchMap(query => {
          if (query.length < minLen) {
            return of([]);
          }
          this.isLoadingCitiesDestino = true;
          this.cdr.markForCheck();
          return this.petflyInteractor.getCities({ query, limit }).pipe(
            catchError(() => of([]))
          );
        }),
        takeUntil(this.destroy$)
      )
      .subscribe(response => {
        this.ciudadesDestinoOptions =
          response.length > 0
            ? response.map(city => ({
                label: city.displayName,
                value: city.cityCode,
                city: city,
              }))
            : [];
        this.isLoadingCitiesDestino = false;
        this.cdr.markForCheck();
      });
  }

  private loadBreedsByPetType(petType: 'dog' | 'cat'): void {
    this.isLoadingBreeds = true;
    this.razasOptions = [];
    this.cdr.markForCheck();

    const breedControl = this.filtersForm.get('razaMascota');
    const currentBreed = breedControl?.value;
    breedControl?.disable();

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

          if (currentBreed && this.razasOptions.some(r => r.value === currentBreed)) {
            breedControl?.patchValue(currentBreed, { emitEvent: false });
          }

          this.cdr.markForCheck();
        },
        error: () => {
          this.razasOptions = [];
          this.isLoadingBreeds = false;
          breedControl?.enable();
          this.cdr.markForCheck();
        },
      });
  }

  private setupPetAgeValidation(): void {
    this.filtersForm
      .get('edadMascota')
      ?.valueChanges.pipe(debounceTime(150), takeUntil(this.destroy$))
      .subscribe(age => {
        if (age != null && age > 24) {
          this.filtersForm.patchValue({ edadMascota: 24 }, { emitEvent: false });
        }
      });
  }

  private initializeAirlines(): void {
    if (this.filtersBoundary?.airlines && this.filtersBoundary.airlines.length > 0) {
      this.airlinesOptions = this.filtersBoundary.airlines.map(airline => ({
        label: airline.name,
        value: airline.iata,
      }));
    } else {
      this.airlinesOptions = [
        { label: 'Avianca', value: 'AV' },
        { label: 'LATAM', value: 'LA' },
        { label: 'Copa Airlines', value: 'CM' },
        { label: 'Iberia', value: 'IB' },
        { label: 'TAP Air Portugal', value: 'TP' },
        { label: 'Air Europa', value: 'UX' },
        { label: 'American Airlines', value: 'AA' },
        { label: 'United Airlines', value: 'UA' },
        { label: 'Delta', value: 'DL' },
      ];
    }
  }
}
