import { Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { FlightFormBaseViewModel } from '@shared/view-models/flight-form-base.view-model';
import { PetflyInteractor } from '@flight-search/core/interactor/petfly.interactor';
import { CurrencyService } from '@shared/services/currency/currency.service';
import { I18nService } from '@core/i18n/i18n.service';
import { FlightSearchFormEntity, SearchFlightsResponseEntity } from '@flight-search/core/entities';

export interface FlightFiltersData extends FlightSearchFormEntity {
  altura: number | null;
  largo: number | null;
  ancho: number | null;
  sinTransportador: boolean | null;
  certificados: string[];
  permitirEscalas: boolean | null;
}

/**
 * ViewModel para la página de resultados de vuelos con filtros
 * Extiende del ViewModel base SIN validaciones required (todos los campos opcionales)
 */
@Injectable()
export class FlightResultsViewModel extends FlightFormBaseViewModel {
  // Alias para mantener compatibilidad con el código existente
  public get filtersForm() {
    return this.form;
  }

  public autoApplyFilters = true;
  public isLoadingResults = false;
  public flightResults: SearchFlightsResponseEntity | null = null;
  private searchId: string | null = null;

  private readonly filterChange$ = new Subject<Partial<FlightFiltersData>>();

  constructor(
    fb: FormBuilder,
    currencyService: CurrencyService,
    i18nService: I18nService,
    private readonly petflyInteractor: PetflyInteractor
  ) {
    // Configuración SIN validaciones required para filtros
    super(fb, currencyService, i18nService, {
      requireOrigin: false,
      requireDestination: false,
      requireDepartureDate: false,
      requireReturnDate: false,
      requirePassengers: false,
      requirePetType: false,
      requirePetWeight: false,
      requirePetBreed: false,
      enableTripTypeValidation: false, // No validar tipo de viaje en filtros
      enableDepartureDateValidation: true,
      enablePetAgeValidation: true,
    });

    this.setupFilterSubscriptions();
  }

  /**
   * Establece el searchId recibido de la búsqueda original
   */
  public setSearchId(searchId: string): void {
    this.searchId = searchId;
    console.log('🔑 Search ID establecido:', searchId);
  }

  private setupFilterSubscriptions(): void {
    // Ya no aplicamos filtros automáticamente
    // El usuario debe hacer clic en el botón "Filtrar"
    console.log('📋 Filtros inicializados - Aplicación manual solamente');
  }

  /**
   * Aplica los filtros llamando al servicio de filtros con valores por defecto
   * Los servicios de currency e i18n se obtienen automáticamente del ViewModel base
   */
  public applyFiltersToSearch(): void {
    if (!this.searchId) {
      console.error('❌ No se puede aplicar filtros sin searchId');
      return;
    }

    this.isLoadingResults = true;
    const formData = this.getFormData();
    const currency = this.getCurrentCurrency();
    const locale = this.getCurrentLocale();

    console.log('🚀 Aplicando filtros al servicio de filtros...');
    console.log('  🔍 Search ID:', this.searchId);
    console.log('  📋 Datos del formulario:', formData);
    console.log('  💰 Moneda:', currency);
    console.log('  🌍 Idioma:', locale);

    this.petflyInteractor
      .filterFlights(formData, this.searchId, currency, locale, { useDefaults: true })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: response => {
          this.flightResults = response;
          this.isLoadingResults = false;
          console.log('✅ Resultados filtrados obtenidos:', response);
          console.log('  📊 Total de vuelos:', response.flightTickets.length);
        },
        error: error => {
          this.isLoadingResults = false;
          console.error('❌ Error al filtrar vuelos:', error);
        },
      });
  }

  public toggleCertificate(certificate: string): void {
    const current = this.form.get('certificados')?.value || [];
    const index = current.indexOf(certificate);

    if (index > -1) {
      current.splice(index, 1);
    } else {
      current.push(certificate);
    }

    this.form.patchValue({ certificados: [...current] });
  }

  public isCertificateSelected(certificate: string): boolean {
    const certificates = this.form.get('certificados')?.value || [];
    return certificates.includes(certificate);
  }

  public getFiltersData(): FlightFiltersData {
    return this.form.value;
  }

  public resetFilters(): void {
    this.resetForm({
      tipoMascota: null,
      altura: null,
      largo: null,
      ancho: null,
      sinTransportador: null,
      certificados: [],
      permitirEscalas: null,
    });
  }
}
