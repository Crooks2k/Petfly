import { FormBuilder, FormGroup, Validators, ValidatorFn } from '@angular/forms';
import { Subject } from 'rxjs';
import { PetType } from '@flight-search/core/types';
import { PassengerSelectionEntity } from '@shared/core/entities';
import { FlightSearchFormEntity } from '@flight-search/core/entities';
import { CurrencyService } from '@shared/services/currency/currency.service';
import { I18nService } from '@core/i18n/i18n.service';

export interface FlightFormConfig {
  requireOrigin?: boolean;
  requireDestination?: boolean;
  requireDepartureDate?: boolean;
  requireReturnDate?: boolean;
  requirePassengers?: boolean;
  requirePetType?: boolean;
  requirePetWeight?: boolean;
  requirePetBreed?: boolean;
  enableTripTypeValidation?: boolean;
  enableDepartureDateValidation?: boolean;
  enablePetAgeValidation?: boolean;
}

export abstract class FlightFormBaseViewModel {
  public form!: FormGroup;
  public selectedPetType: PetType = null;
  public today = new Date();
  public petAgeOver24Weeks: boolean | null = null;

  protected readonly destroy$ = new Subject<void>();
  protected config: FlightFormConfig;

  constructor(
    protected readonly fb: FormBuilder,
    protected readonly currencyService: CurrencyService,
    protected readonly i18nService: I18nService,
    config: Partial<FlightFormConfig> = {}
  ) {
    // Configuración por defecto (para búsqueda)
    this.config = {
      requireOrigin: true,
      requireDestination: true,
      requireDepartureDate: true,
      requireReturnDate: false, // Se valida dinámicamente
      requirePassengers: true,
      requirePetType: false,
      requirePetWeight: false,
      requirePetBreed: false,
      enableTripTypeValidation: true,
      enableDepartureDateValidation: true,
      enablePetAgeValidation: true,
      ...config,
    };

    this.initializeForm();
    this.setupFormSubscriptions();
  }

  protected initializeForm(): void {
    const origenValidators = this.config.requireOrigin ? [Validators.required] : [];
    const destinoValidators = this.config.requireDestination ? [Validators.required] : [];
    const fechaSalidaValidators = this.config.requireDepartureDate ? [Validators.required] : [];
    const pasajerosValidators = this.config.requirePassengers ? [Validators.required] : [];

    this.form = this.fb.group({
      tipoViaje: ['roundtrip'],
      origen: ['', origenValidators],
      origenCity: [null],
      destino: ['', destinoValidators],
      destinoCity: [null],
      fechaSalida: [null, fechaSalidaValidators],
      fechaRegreso: [null],
      pasajeros: [
        {
          adults: 1,
          children: 0,
          childrenAges: [],
          travelClass: 'economy',
        } as PassengerSelectionEntity,
        pasajerosValidators,
      ],
      conMascota: [true],
      tipoMascota: [null],
      petAgeOver24Weeks: [null],
      edadMascota: [null],
      pesoMascota: [null, [Validators.min(0.5), Validators.max(50)]],
      razaMascota: [''],
      altura: [null],
      largo: [null],
      ancho: [null],
      sinTransportador: [null],
      certificados: [[]],
      permitirEscalas: [null],
      precioMinimo: [null],
      precioMaximo: [null],
      aerolinea: [null],
    });
  }

  protected setupFormSubscriptions(): void {
    // Solo configurar suscripciones si están habilitadas
    if (this.config.enableTripTypeValidation) {
      this.setupTripTypeValidation();
    }
    if (this.config.enableDepartureDateValidation) {
      this.setupDepartureDateValidation();
    }
    if (this.config.enablePetAgeValidation) {
      this.setupPetAgeValidation();
    }
  }

  protected setupPetAgeValidation(): void {
    this.form.get('petAgeOver24Weeks')?.valueChanges.subscribe(isOver24Weeks => {
      if (isOver24Weeks === true) {
        this.petAgeOver24Weeks = true;
        this.form.patchValue({ edadMascota: 24 }, { emitEvent: false });
      } else if (isOver24Weeks === false) {
        this.petAgeOver24Weeks = false;
        this.form.patchValue({ edadMascota: null }, { emitEvent: false });
      }
    });
  }

  protected setupTripTypeValidation(): void {
    this.form.get('tipoViaje')?.valueChanges.subscribe(tipo => {
      const fechaRegresoControl = this.form.get('fechaRegreso');
      if (tipo === 'roundtrip' && this.config.requireReturnDate !== false) {
        fechaRegresoControl?.setValidators([Validators.required]);
      } else {
        fechaRegresoControl?.clearValidators();
      }
      fechaRegresoControl?.updateValueAndValidity();
    });
  }

  protected setupDepartureDateValidation(): void {
    this.form.get('fechaSalida')?.valueChanges.subscribe(fechaSalida => {
      const fechaRegresoControl = this.form.get('fechaRegreso');
      if (fechaSalida && fechaRegresoControl?.value && fechaSalida >= fechaRegresoControl.value) {
        const newReturnDate = new Date(fechaSalida);
        newReturnDate.setDate(newReturnDate.getDate() + 1);
        fechaRegresoControl.setValue(newReturnDate);
      }
    });
  }

  public selectPetType(type: Exclude<PetType, null>): void {
    this.selectedPetType = type;
    this.form.patchValue({ tipoMascota: type });
  }

  public getMinReturnDate(): Date {
    const departureDate = this.form.get('fechaSalida')?.value;
    if (departureDate && departureDate instanceof Date) {
      return departureDate;
    }
    return this.today;
  }

  public getFormData(): FlightSearchFormEntity {
    return this.form.value;
  }

  /**
   * Obtiene el código de moneda actual
   */
  public getCurrentCurrency(): string {
    return this.currencyService.getCurrentCurrencyCode();
  }

  /**
   * Obtiene el idioma actual
   */
  public getCurrentLocale(): string {
    return this.i18nService.getCurrentLanguage();
  }

  public isFormValid(): boolean {
    return this.form.valid;
  }

  public markAllAsTouched(): void {
    this.form.markAllAsTouched();
  }

  public resetForm(defaultValues?: Partial<FlightSearchFormEntity>): void {
    const defaults = {
      tipoViaje: 'roundtrip',
      origen: '',
      origenCity: null,
      destino: '',
      destinoCity: null,
      fechaSalida: null,
      fechaRegreso: null,
      pasajeros: {
        adults: 1,
        children: 0,
        childrenAges: [],
        travelClass: 'economy',
      } as PassengerSelectionEntity,
      conMascota: true,
      tipoMascota: null,
      petAgeOver24Weeks: null,
      edadMascota: null,
      pesoMascota: null,
      razaMascota: '',
      altura: null,
      largo: null,
      ancho: null,
      sinTransportador: null,
      certificados: [],
      permitirEscalas: null,
      ...defaultValues,
    };

    this.form.reset(defaults);
    this.selectedPetType = null;
    this.petAgeOver24Weeks = null;
  }

  public destroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Método para actualizar validaciones dinámicamente
  protected updateFieldValidation(fieldName: string, validators: ValidatorFn[]): void {
    const control = this.form.get(fieldName);
    if (control) {
      control.setValidators(validators);
      control.updateValueAndValidity();
    }
  }
}
