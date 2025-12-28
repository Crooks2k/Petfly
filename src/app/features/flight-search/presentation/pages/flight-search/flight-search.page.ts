import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { I18nService } from '@core/i18n/i18n.service';
import { CityOption, CitySelectionEvent } from '@shared/core/entities';
import {
  Subject,
  takeUntil,
  debounceTime,
  distinctUntilChanged,
  switchMap,
  of,
  catchError,
} from 'rxjs';
import { FlightSearchConfig, ResolvedFlightSearchTexts } from './flight-search.config';
import { tripType, PetType } from '@flight-search/core/types';
import { FlightSearchViewModel } from './view-model/flight-search.view-model';
import { PetflyInteractor } from '@flight-search/core/interactor/petfly.interactor';
import { CurrencyService } from '@shared/services/currency/currency.service';
import { FLIGHT_SEARCH_CONSTANTS } from '@flight-search/core/constants';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-flight-search',
  templateUrl: './flight-search.page.html',
  styleUrl: './flight-search.page.scss',
  standalone: false,
  providers: [FlightSearchViewModel],
  animations: [FlightSearchConfig.animations.slideInOut],
})
export class FlightSearchPage implements OnInit, OnDestroy {
  public searchForm!: FormGroup;

  public tripType!: tripType[];
  public isSearching = false;
  public readonly config = FlightSearchConfig;
  public texts: ResolvedFlightSearchTexts = {} as ResolvedFlightSearchTexts;

  public readonly ciudades = [...FlightSearchConfig.options.cities];
  public razasOptions: { label: string; value: string }[] = [];
  public isLoadingBreeds = false;

  public ciudadesOrigenOptions: CityOption[] = [];
  public ciudadesDestinoOptions: CityOption[] = [];
  public isLoadingCitiesOrigen = false;
  public isLoadingCitiesDestino = false;

  private readonly destroy$ = new Subject<void>();
  private readonly origenSearchSubject = new Subject<string>();
  private readonly destinoSearchSubject = new Subject<string>();

  constructor(
    private readonly router: Router,
    private readonly i18nService: I18nService,
    public readonly viewModel: FlightSearchViewModel,
    private readonly petflyInteractor: PetflyInteractor,
    private readonly currencyService: CurrencyService,
    private readonly messageService: MessageService
  ) {
    this.searchForm = this.viewModel.searchForm;
  }

  public ngOnInit(): void {
    this.setupReactiveTexts();
    this.setupPetTypeSubscription();
    this.setupCitiesSearch();
    this.setupCitiesValidation();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.viewModel.destroy();
  }

  public onSearch(): void {
    if (this.viewModel.isFormValid()) {
      this.isSearching = true;

      const formData = this.viewModel.getFormData();

      const origenCode =
        typeof formData.origen === 'string'
          ? formData.origen
          : (formData.origen as { value: string })?.value;
      const destinoCode =
        typeof formData.destino === 'string'
          ? formData.destino
          : (formData.destino as { value: string })?.value;

      if (!formData.origenCity && origenCode) {
        const origenOption = this.ciudadesOrigenOptions.find(opt => opt.value === origenCode);
        if (origenOption?.city) {
          formData.origenCity = origenOption.city;
        }
      }

      if (!formData.destinoCity && destinoCode) {
        const destinoOption = this.ciudadesDestinoOptions.find(opt => opt.value === destinoCode);
        if (destinoOption?.city) {
          formData.destinoCity = destinoOption.city;
        }
      }

      const currency = this.viewModel.getCurrentCurrency();
      const locale = this.viewModel.getCurrentLocale();

      this.petflyInteractor
        .searchFlights(formData, currency, locale)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: response => {
            this.isSearching = false;

            // Validar que la respuesta tenga datos
            if (!response) {
              this.messageService.add({
                severity: 'warn',
                summary: this.texts.searchErrorTitle,
                detail: this.texts.searchErrorMessage,
                life: 5000,
              });
              return;
            }

            // Verificar si hay vuelos en la respuesta
            if (!response.flightTickets || response.flightTickets.length === 0) {
              this.messageService.add({
                severity: 'warn',
                summary: this.texts.searchErrorTitle,
                detail: this.texts.searchErrorMessage,
                life: 5000,
              });
              return;
            }

            const searchId = response.searchId || 'mock-search-id-123';

            // Navegar a resultados enviando todos los datos (sin toast, se ve en la página de resultados)
            this.router.navigate([FlightSearchConfig.routes.flightResults], {
              state: {
                searchResults: response,
                searchParams: formData,
                currency: currency,
                locale: locale,
                searchId: searchId,
              },
            });
          },
          error: () => {
            this.isSearching = false;
            this.messageService.add({
              severity: 'error',
              summary: this.texts.searchErrorTitle,
              detail: this.texts.searchErrorMessage,
              life: 5000,
            });
          },
        });
    } else {
      this.viewModel.markAllAsTouched();
    }
  }

  public selectPetType(type: Exclude<PetType, null>): void {
    this.viewModel.selectPetType(type);
    this.loadBreedsByPetType(type);
  }

  private setupPetTypeSubscription(): void {
    const breedControl = this.searchForm.get('razaMascota');

    if (!this.selectedPetType) {
      breedControl?.disable();
    }

    this.searchForm
      .get('tipoMascota')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((petType: PetType) => {
        if (petType) {
          this.loadBreedsByPetType(petType);
        } else {
          this.razasOptions = [];
          breedControl?.disable();
          this.searchForm.patchValue({ razaMascota: '' }, { emitEvent: false });
        }
      });
  }

  private loadBreedsByPetType(petType: 'dog' | 'cat'): void {
    this.isLoadingBreeds = true;
    this.razasOptions = [];

    const breedControl = this.searchForm.get('razaMascota');
    breedControl?.disable();
    this.searchForm.patchValue({ razaMascota: '' }, { emitEvent: false });

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

  public getMinReturnDate(): Date {
    return this.viewModel.getMinReturnDate();
  }

  public get selectedPetType(): PetType {
    return this.viewModel.selectedPetType;
  }

  public get today(): Date {
    return this.viewModel.today;
  }

  private setupReactiveTexts(): void {
    this.i18nService
      .getReactiveTexts(this.config)
      .pipe(takeUntil(this.destroy$))
      .subscribe(resolvedTexts => {
        this.texts = resolvedTexts as unknown as ResolvedFlightSearchTexts;
        this.tripType = [
          { label: this.texts.roundTrip, value: 'roundtrip' },
          { label: this.texts.oneWay, value: 'oneway' },
        ];
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

  public onOrigenSearch(event: { query: string }): void {
    this.origenSearchSubject.next(event.query);
  }

  public onDestinoSearch(event: { query: string }): void {
    this.destinoSearchSubject.next(event.query);
  }

  public onOrigenSelect(event: unknown): void {
    const cityEvent = event as CitySelectionEvent;
    if (cityEvent.city) {
      this.searchForm.patchValue({ origenCity: cityEvent.city }, { emitEvent: false });
    }
  }

  public onDestinoSelect(event: unknown): void {
    const cityEvent = event as CitySelectionEvent;
    if (cityEvent.city) {
      this.searchForm.patchValue({ destinoCity: cityEvent.city }, { emitEvent: false });
    }
  }

  private setupCitiesValidation(): void {
    this.searchForm
      .get('origen')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(origenValue => {
        const destinoValue = this.searchForm.get('destino')?.value;
        if (origenValue && destinoValue && origenValue === destinoValue) {
          this.searchForm.patchValue({ destino: null }, { emitEvent: false });
        }
      });

    this.searchForm
      .get('destino')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(destinoValue => {
        const origenValue = this.searchForm.get('origen')?.value;
        if (origenValue && destinoValue && origenValue === destinoValue) {
          this.searchForm.patchValue({ destino: null }, { emitEvent: false });
        }
      });
  }
}
