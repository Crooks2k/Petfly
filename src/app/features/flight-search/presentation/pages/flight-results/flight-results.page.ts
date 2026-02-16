import {
  Component,
  OnDestroy,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { I18nService } from '@core/i18n/i18n.service';
import { Subject, skip, take, takeUntil } from 'rxjs';
import { MessageService } from 'primeng/api';
import { CurrencyService } from '@shared/services/currency/currency.service';
import { FlightResultsViewModel } from './view-model/flight-results.view-model';
import { PetType } from '@flight-search/core/types';
import { FlightResultsConfig, ResolvedFlightResultsTexts } from './flight-results.config';
import {
  SearchFlightsResponseEntity,
  FlightSearchFormEntity,
  FlightTicketEntity,
} from '@flight-search/core/entities';

export interface FlightResultsState {
  searchResults: SearchFlightsResponseEntity;
  searchParams: FlightSearchFormEntity;
  currency: string;
  locale: string;
  searchId: string;
}

@Component({
  selector: 'app-flight-results',
  templateUrl: './flight-results.page.html',
  styleUrl: './flight-results.page.scss',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [FlightResultsViewModel],
})
export class FlightResultsPage implements OnInit, OnDestroy {
  public filtersForm!: FormGroup;
  public readonly config = FlightResultsConfig;
  public texts: ResolvedFlightResultsTexts = {} as ResolvedFlightResultsTexts;
  public isFiltersModalOpen = false;
  public isFiltersAsideCollapsed = false;

  public searchResults: SearchFlightsResponseEntity | null = null;
  public searchParams: FlightSearchFormEntity | null = null;
  public searchCurrency: string | null = null;
  public searchLocale: string | null = null;
  public searchId: string | null = null;
  public isRoundTrip: boolean = false;
  public isPetPriceInfoOpen: boolean = false;

  public currentSort: 'price' | 'duration' | null = null;
  public sortDirection: 'asc' | 'desc' = 'asc';
  public sortedFlightTickets: FlightTicketEntity[] = [];
  public displayedFlightTickets: FlightTicketEntity[] = [];
  public readonly INITIAL_DISPLAY_COUNT = 50;
  public readonly LOAD_MORE_COUNT = 25;
  public currentDisplayCount = this.INITIAL_DISPLAY_COUNT;

  private lastSearchTravelClass: string | null = null;
  private lastSearchOriginCode: string | null = null;
  private lastSearchDestCode: string | null = null;
  private readonly destroy$ = new Subject<void>();

  constructor(
    public readonly viewModel: FlightResultsViewModel,
    private readonly i18nService: I18nService,
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef,
    private readonly messageService: MessageService,
    private readonly currencyService: CurrencyService
  ) {
    this.filtersForm = this.viewModel.filtersForm;
    this.loadSearchData();
  }

  public ngOnInit(): void {
    this.setupReactiveTexts();
    this.initializeFiltersFromSearch();

    this.viewModel.onResultsUpdated$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.cdr.markForCheck();
    });

    let previousCurrencyCode: string | undefined;
    this.currencyService.currentCurrency$
      .pipe(take(1), takeUntil(this.destroy$))
      .subscribe(currency => {
        previousCurrencyCode = currency.code;
      });
    this.currencyService.currentCurrency$
      .pipe(skip(1), takeUntil(this.destroy$))
      .subscribe(currency => {
        if (previousCurrencyCode !== undefined && currency.code !== previousCurrencyCode) {
          this.messageService.add({
            severity: 'info',
            summary: this.texts.currencyChangeApplyFiltersSummary,
            detail: this.texts.currencyChangeApplyFiltersDetail,
            life: 6000,
          });
        }
        previousCurrencyCode = currency.code;
      });
  }

  private loadSearchData(): void {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras?.state as FlightResultsState;

    if (state) {
      this.searchResults = state.searchResults;
      this.searchParams = state.searchParams;
      this.searchCurrency = state.currency;
      this.searchLocale = state.locale;
      this.searchId = state.searchId;

      const params = state.searchParams;
      this.lastSearchTravelClass = params?.pasajeros?.travelClass ?? 'economy';
      this.lastSearchOriginCode = this.getCityCode(params?.origen);
      this.lastSearchDestCode = this.getCityCode(params?.destino);

      this.sortedFlightTickets = [...(this.searchResults?.flightTickets || [])];
      this.updateDisplayedFlights();

      if (this.searchId) {
        this.viewModel.setSearchId(this.searchId);
      }
    } else {
      this.router.navigate(['/search']);
    }
  }

  private updateDisplayedFlights(): void {
    this.displayedFlightTickets = this.sortedFlightTickets.slice(0, this.currentDisplayCount);
    this.cdr.markForCheck();
  }

  public loadMoreFlights(): void {
    this.currentDisplayCount += this.LOAD_MORE_COUNT;
    this.updateDisplayedFlights();
  }

  public get hasMoreFlights(): boolean {
    return this.currentDisplayCount < this.sortedFlightTickets.length;
  }

  private initializeFiltersFromSearch(): void {
    if (this.searchParams) {
      this.isRoundTrip = this.searchParams.tipoViaje === 'roundtrip';

      const petType = this.searchParams.tipoMascota;
      const breedValue = this.searchParams.razaMascota;
      const rawAge = this.searchParams.edadMascota;
      const petAge =
        rawAge === 24 || rawAge == null ? null : Math.min(24, rawAge);

      this.viewModel.form.patchValue(
        {
          origen: this.searchParams.origen,
          origenCity: this.searchParams.origenCity,
          destino: this.searchParams.destino,
          destinoCity: this.searchParams.destinoCity,
          fechaSalida: this.searchParams.fechaSalida,
          fechaRegreso: this.searchParams.fechaRegreso,
          pasajeros: this.searchParams.pasajeros,
          tipoMascota: petType,
          pesoMascota: this.searchParams.pesoMascota,
          razaMascota: breedValue,
          edadMascota: petAge,
        },
        { emitEvent: false }
      );

      if (petType) {
        this.viewModel.selectPetType(petType as Exclude<PetType, null>);
      }
    }
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.viewModel.destroy();
  }

  public selectPetType(type: Exclude<PetType, null>): void {
    this.viewModel.selectPetType(type);
    this.cdr.markForCheck();
  }

  public toggleCertificate(certificate: string): void {
    this.viewModel.toggleCertificate(certificate);
  }

  public isCertificateSelected(certificate: string): boolean {
    return this.viewModel.isCertificateSelected(certificate);
  }

  public get selectedPetType(): PetType {
    return this.viewModel.selectedPetType;
  }

  public get today(): Date {
    return this.viewModel.today;
  }

  public getMinReturnDate(): Date {
    return this.viewModel.getMinReturnDate();
  }

  public openFiltersModal(): void {
    this.isFiltersModalOpen = true;
    document.body.style.overflow = 'hidden';
  }

  public closeFiltersModal(): void {
    this.isFiltersModalOpen = false;
    document.body.style.overflow = '';
  }

  public toggleFiltersAside(): void {
    this.isFiltersAsideCollapsed = !this.isFiltersAsideCollapsed;
    this.cdr.markForCheck();
  }

  private getCityCode(value: unknown): string {
    if (typeof value === 'string') return value;
    if (value && typeof value === 'object' && 'value' in value) {
      return (value as { value: string }).value ?? '';
    }
    return '';
  }

  private hasRouteChanged(): boolean {
    const formData = this.viewModel.getFormData();
    const currentOrigin = this.getCityCode(formData.origen);
    const currentDest = this.getCityCode(formData.destino);
    const savedOrigin = this.lastSearchOriginCode ?? this.getCityCode(this.searchParams?.origen);
    const savedDest = this.lastSearchDestCode ?? this.getCityCode(this.searchParams?.destino);
    return currentOrigin !== savedOrigin || currentDest !== savedDest;
  }

  private hasTravelClassChanged(): boolean {
    const formData = this.viewModel.getFormData();
    const current = formData.pasajeros?.travelClass ?? 'economy';
    const saved = this.lastSearchTravelClass ?? 'economy';
    return current !== saved;
  }

  private hasTripTypeChanged(): boolean {
    const formData = this.viewModel.getFormData();
    const saved = this.searchParams;
    if (!saved) return false;
    return formData.tipoViaje !== saved.tipoViaje;
  }

  private hasDatesChanged(): boolean {
    const formData = this.viewModel.getFormData();
    const saved = this.searchParams;
    if (!saved) return false;

    const normalize = (value: unknown): number | null => {
      if (!value) return null;
      if (value instanceof Date) return value.getTime();
      const d = new Date(value as string);
      return Number.isNaN(d.getTime()) ? null : d.getTime();
    };

    const currentDeparture = normalize(formData.fechaSalida);
    const currentReturn = normalize(formData.fechaRegreso);
    const savedDeparture = normalize(saved.fechaSalida);
    const savedReturn = normalize(saved.fechaRegreso);

    return currentDeparture !== savedDeparture || currentReturn !== savedReturn;
  }

  private hasPassengersChanged(): boolean {
    const formData = this.viewModel.getFormData();
    const current = formData.pasajeros;
    const saved = this.searchParams?.pasajeros;

    if (!current && !saved) return false;
    if (!current || !saved) return true;

    const currentAges = current.childrenAges || [];
    const savedAges = saved.childrenAges || [];

    if (
      current.adults !== saved.adults ||
      current.children !== saved.children ||
      currentAges.length !== savedAges.length
    ) {
      return true;
    }

    for (let i = 0; i < currentAges.length; i++) {
      if (currentAges[i] !== savedAges[i]) {
        return true;
      }
    }

    return false;
  }

  private hasSearchParametersChanged(): boolean {
    return (
      this.hasRouteChanged() ||
      this.hasTravelClassChanged() ||
      this.hasTripTypeChanged() ||
      this.hasDatesChanged() ||
      this.hasPassengersChanged()
    );
  }

  private copyFormDataForSearchParams(formData: FlightSearchFormEntity): FlightSearchFormEntity {
    const pasajeros = formData.pasajeros;
    return {
      ...formData,
      pasajeros: pasajeros
        ? { ...pasajeros, childrenAges: [...(pasajeros.childrenAges || [])] }
        : formData.pasajeros,
      origenCity: formData.origenCity ? { ...formData.origenCity } : null,
      destinoCity: formData.destinoCity ? { ...formData.destinoCity } : null,
    };
  }

  private applySearchResponse(
    response: SearchFlightsResponseEntity,
    formData: FlightSearchFormEntity
  ): void {
    const newSearchId = response.searchId ?? this.searchId ?? '';

    this.viewModel.flightResults = response;
    this.viewModel.isLoadingResults = false;
    if (newSearchId) this.viewModel.setSearchId(newSearchId);

    this.searchResults = response;
    this.searchParams = this.copyFormDataForSearchParams(formData);
    this.searchId = newSearchId;
    this.searchCurrency = this.currencyService.getCurrentCurrencyCode();
    this.lastSearchTravelClass = formData.pasajeros?.travelClass ?? 'economy';
    this.lastSearchOriginCode = this.getCityCode(formData.origen);
    this.lastSearchDestCode = this.getCityCode(formData.destino);
    this.sortedFlightTickets = [...(response?.flightTickets || [])];
    this.currentDisplayCount = this.INITIAL_DISPLAY_COUNT;
    this.updateDisplayedFlights();
    this.cdr.detectChanges();
  }

  public onFiltersApplied(): void {
    const formData = this.viewModel.getFormData();

    if (this.hasSearchParametersChanged()) {
      const searchObservable = this.viewModel.runNewSearch();
      searchObservable.pipe(takeUntil(this.destroy$)).subscribe({
        next: response => {
          if (!response) {
            this.viewModel.isLoadingResults = false;
            this.messageService.add({
              severity: 'warn',
              summary: this.texts.filterErrorTitle,
              detail: this.texts.filterErrorMessage,
              life: 5000,
            });
            this.cdr.detectChanges();
            return;
          }
          this.applySearchResponse(response, formData);
          if (!response.flightTickets || response.flightTickets.length === 0) {
            this.messageService.add({
              severity: 'warn',
              summary: this.texts.filterErrorTitle,
              detail: this.texts.filterErrorMessage,
              life: 5000,
            });
          } else {
            this.messageService.add({
              severity: 'success',
              summary: this.texts.filterSuccessTitle,
              detail: this.texts.filterSuccessMessage,
              life: 3000,
            });
          }
        },
        error: () => {
          this.viewModel.isLoadingResults = false;
          this.messageService.add({
            severity: 'error',
            summary: this.texts.filterErrorTitle,
            detail: this.texts.filterErrorMessage,
            life: 5000,
          });
          this.cdr.detectChanges();
        },
      });
      return;
    }

    if (!this.searchId) return;

    const filterObservable = this.viewModel.applyFiltersToSearch();
    if (!filterObservable) return;

    filterObservable.pipe(takeUntil(this.destroy$)).subscribe({
      next: response => {
        this.viewModel.flightResults = response;
        this.viewModel.isLoadingResults = false;
        this.searchResults = response;
        this.searchCurrency = this.currencyService.getCurrentCurrencyCode();
        this.sortedFlightTickets = [...(response?.flightTickets || [])];
        this.currentDisplayCount = this.INITIAL_DISPLAY_COUNT;
        this.updateDisplayedFlights();

        if (!response.flightTickets || response.flightTickets.length === 0) {
          this.messageService.add({
            severity: 'warn',
            summary: this.texts.filterErrorTitle,
            detail: this.texts.filterErrorMessage,
            life: 5000,
          });
        } else {
          this.messageService.add({
            severity: 'success',
            summary: this.texts.filterSuccessTitle,
            detail: this.texts.filterSuccessMessage,
            life: 3000,
          });
        }
        this.cdr.detectChanges();
      },
      error: () => {
        this.viewModel.isLoadingResults = false;
        this.messageService.add({
          severity: 'error',
          summary: this.texts.filterErrorTitle,
          detail: this.texts.filterErrorMessage,
          life: 5000,
        });
        this.cdr.detectChanges();
      },
    });
  }

  public applyFilters(): void {
    const formData = this.viewModel.getFormData();

    if (this.hasSearchParametersChanged()) {
      const searchObservable = this.viewModel.runNewSearch();
      searchObservable.pipe(takeUntil(this.destroy$)).subscribe({
        next: response => {
          if (!response) {
            this.viewModel.isLoadingResults = false;
            this.messageService.add({
              severity: 'warn',
              summary: this.texts.filterErrorTitle,
              detail: this.texts.filterErrorMessage,
              life: 5000,
            });
            this.closeFiltersModal();
            this.cdr.detectChanges();
            return;
          }
          this.applySearchResponse(response, formData);
          if (!response.flightTickets || response.flightTickets.length === 0) {
            this.messageService.add({
              severity: 'warn',
              summary: this.texts.filterErrorTitle,
              detail: this.texts.filterErrorMessage,
              life: 5000,
            });
          } else {
            this.messageService.add({
              severity: 'success',
              summary: this.texts.filterSuccessTitle,
              detail: this.texts.filterSuccessMessage,
              life: 3000,
            });
          }
          this.closeFiltersModal();
          this.cdr.detectChanges();
        },
        error: () => {
          this.viewModel.isLoadingResults = false;
          this.messageService.add({
            severity: 'error',
            summary: this.texts.filterErrorTitle,
            detail: this.texts.filterErrorMessage,
            life: 5000,
          });
          this.closeFiltersModal();
          this.cdr.detectChanges();
        },
      });
      return;
    }

    if (!this.searchId) return;

    const filterObservable = this.viewModel.applyFiltersToSearch();
    if (!filterObservable) return;

    filterObservable.pipe(takeUntil(this.destroy$)).subscribe({
      next: response => {
        this.viewModel.flightResults = response;
        this.viewModel.isLoadingResults = false;
        this.searchResults = response;
        this.searchCurrency = this.currencyService.getCurrentCurrencyCode();
        this.sortedFlightTickets = [...(response?.flightTickets || [])];
        this.currentDisplayCount = this.INITIAL_DISPLAY_COUNT;
        this.updateDisplayedFlights();

        if (!response.flightTickets || response.flightTickets.length === 0) {
          this.messageService.add({
            severity: 'warn',
            summary: this.texts.filterErrorTitle,
            detail: this.texts.filterErrorMessage,
            life: 5000,
          });
        } else {
          this.messageService.add({
            severity: 'success',
            summary: this.texts.filterSuccessTitle,
            detail: this.texts.filterSuccessMessage,
            life: 3000,
          });
        }
        this.closeFiltersModal();
        this.cdr.detectChanges();
      },
      error: () => {
        this.viewModel.isLoadingResults = false;
        this.messageService.add({
          severity: 'error',
          summary: this.texts.filterErrorTitle,
          detail: this.texts.filterErrorMessage,
          life: 5000,
        });
        this.closeFiltersModal();
        this.cdr.detectChanges();
      },
    });
  }

  public togglePetPriceInfo(): void {
    if (window.innerWidth < 768) {
      this.isPetPriceInfoOpen = !this.isPetPriceInfoOpen;
      this.cdr.markForCheck();
    }
  }

  public toggleSort(type: 'price' | 'duration'): void {
    if (this.currentSort === type) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.currentSort = type;
      this.sortDirection = 'asc';
    }

    this.applySorting();
    this.cdr.detectChanges();
  }

  private applySorting(): void {
    if (!this.sortedFlightTickets || this.sortedFlightTickets.length === 0) {
      return;
    }

    const tickets = [...this.sortedFlightTickets];

    if (this.currentSort === 'price') {
      tickets.sort((a, b) => {
        const nullSentinel = this.sortDirection === 'asc' ? Infinity : -Infinity;
        const priceA = a.total != null ? a.total.min : nullSentinel;
        const priceB = b.total != null ? b.total.min : nullSentinel;
        return this.sortDirection === 'asc' ? priceA - priceB : priceB - priceA;
      });
    } else if (this.currentSort === 'duration') {
      tickets.sort((a, b) => {
        const durationA = this.calculateTotalDuration(a);
        const durationB = this.calculateTotalDuration(b);
        return this.sortDirection === 'asc' ? durationA - durationB : durationB - durationA;
      });
    }

    this.sortedFlightTickets = tickets;
    this.currentDisplayCount = this.INITIAL_DISPLAY_COUNT;
    this.updateDisplayedFlights();
    this.cdr.detectChanges();
  }

  private calculateTotalDuration(ticket: FlightTicketEntity): number {
    let totalDuration = 0;

    if (ticket.flights && Array.isArray(ticket.flights)) {
      for (const flight of ticket.flights) {
        if (flight.flightItems && Array.isArray(flight.flightItems)) {
          for (const item of flight.flightItems) {
            totalDuration += item.duration || 0;
          }
        }
      }
    }

    return totalDuration;
  }

  private setupReactiveTexts(): void {
    this.i18nService
      .getReactiveTexts(this.config)
      .pipe(takeUntil(this.destroy$))
      .subscribe(resolvedTexts => {
        this.texts = resolvedTexts as unknown as ResolvedFlightResultsTexts;
      });
  }

  public trackByFlightTicket(index: number, item: FlightTicketEntity): string {
    return `${item.flights[0]?.flightItems[0]?.airlineCode}-${item.price}-${index}`;
  }
}
