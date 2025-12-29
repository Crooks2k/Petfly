import { Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Subject } from 'rxjs';
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

@Injectable()
export class FlightResultsViewModel extends FlightFormBaseViewModel {
  public get filtersForm() {
    return this.form;
  }

  public autoApplyFilters = true;
  public isLoadingResults = false;
  public flightResults: SearchFlightsResponseEntity | null = null;
  private searchId: string | null = null;

  // Subject para notificar cambios
  private readonly resultsUpdated$ = new Subject<void>();
  public onResultsUpdated$ = this.resultsUpdated$.asObservable();

  constructor(
    fb: FormBuilder,
    currencyService: CurrencyService,
    i18nService: I18nService,
    private readonly petflyInteractor: PetflyInteractor
  ) {
    super(fb, currencyService, i18nService, {
      requireOrigin: false,
      requireDestination: false,
      requireDepartureDate: false,
      requireReturnDate: false,
      requirePassengers: false,
      requirePetType: false,
      requirePetWeight: false,
      requirePetBreed: false,
      enableTripTypeValidation: false,
      enableDepartureDateValidation: false,
      enablePetAgeValidation: false,
    });
  }

  public setSearchId(searchId: string): void {
    this.searchId = searchId;
  }

  public applyFiltersToSearch() {
    if (!this.searchId) {
      return;
    }

    this.isLoadingResults = true;
    this.resultsUpdated$.next();

    const formData = this.getFormData();
    const currency = this.getCurrentCurrency();
    const locale = this.getCurrentLocale();

    return this.petflyInteractor.filterFlights(formData, this.searchId, currency, locale, {
      useDefaults: true,
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
