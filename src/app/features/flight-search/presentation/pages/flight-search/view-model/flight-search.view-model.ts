import { Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { FlightFormBaseViewModel } from '@shared/view-models/flight-form-base.view-model';
import { CurrencyService } from '@shared/services/currency/currency.service';
import { I18nService } from '@core/i18n/i18n.service';

@Injectable()
export class FlightSearchViewModel extends FlightFormBaseViewModel {
  public get searchForm() {
    return this.form;
  }

  constructor(fb: FormBuilder, currencyService: CurrencyService, i18nService: I18nService) {
    super(fb, currencyService, i18nService, {
      requireOrigin: true,
      requireDestination: true,
      requireDepartureDate: true,
      requireReturnDate: false,
      requirePassengers: true,
      requirePetType: false,
      requirePetWeight: false,
      requirePetBreed: false,
      enableTripTypeValidation: true,
      enableDepartureDateValidation: true,
      enablePetAgeValidation: true,
    });
  }
}
