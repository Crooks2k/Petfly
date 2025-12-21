import { Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { FlightFormBaseViewModel } from '@shared/view-models/flight-form-base.view-model';
import { CurrencyService } from '@shared/services/currency/currency.service';
import { I18nService } from '@core/i18n/i18n.service';

/**
 * ViewModel para la página de búsqueda de vuelos
 * Extiende del ViewModel base con validaciones REQUIRED para campos obligatorios
 */
@Injectable()
export class FlightSearchViewModel extends FlightFormBaseViewModel {
  // Alias para mantener compatibilidad con el código existente
  public get searchForm() {
    return this.form;
  }

  constructor(fb: FormBuilder, currencyService: CurrencyService, i18nService: I18nService) {
    // Configuración con validaciones REQUIRED para búsqueda
    super(fb, currencyService, i18nService, {
      requireOrigin: true,
      requireDestination: true,
      requireDepartureDate: true,
      requireReturnDate: false, // Se valida dinámicamente según tipo de viaje
      requirePassengers: true,
      requirePetType: false,
      requirePetWeight: false,
      requirePetBreed: false,
      enableTripTypeValidation: true,
      enableDepartureDateValidation: true,
      enablePetAgeValidation: true,
    });
  }

  // Métodos adicionales específicos de búsqueda si los necesitas
}
