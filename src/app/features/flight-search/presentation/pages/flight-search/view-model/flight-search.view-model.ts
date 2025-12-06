import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { PetType } from '@flight-search/core/types';
import { PassengerSelectionEntity } from '@shared/core/entities';
import { CurrencyService } from '@shared/services/currency/currency.service';
import { FlightSearchFormEntity } from '@flight-search/core/entities';

@Injectable()
export class FlightSearchViewModel {
  public searchForm!: FormGroup;
  public selectedPetType: PetType = null;
  public today = new Date();
  public petAgeOver24Weeks: boolean | null = null;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly fb: FormBuilder,
    private readonly currencyService: CurrencyService
  ) {
    this.initializeForm();
    this.setupFormSubscriptions();
  }

  private initializeForm(): void {
    this.searchForm = this.fb.group({
      tipoViaje: ['roundtrip', Validators.required],
      origen: ['', Validators.required],
      origenCity: [null],
      destino: ['', Validators.required],
      destinoCity: [null],
      fechaSalida: [null, Validators.required],
      fechaRegreso: [null],
      pasajeros: [
        { adults: 1, children: 0, childrenAges: [], travelClass: 'economy' } as PassengerSelectionEntity,
        Validators.required,
      ],
      conMascota: [true],
      tipoMascota: [null],
      petAgeOver24Weeks: [null],
      edadMascota: [null],
      pesoMascota: [null, [Validators.min(0.5), Validators.max(50)]],
      razaMascota: [''],
    });
  }

  private setupFormSubscriptions(): void {
    this.setupTripTypeValidation();
    this.setupDepartureDateValidation();
    this.setupPetAgeValidation();
  }

  private setupPetAgeValidation(): void {
    this.searchForm.get('petAgeOver24Weeks')?.valueChanges.subscribe(isOver24Weeks => {
      if (isOver24Weeks === true) {
        this.petAgeOver24Weeks = true;
        this.searchForm.patchValue({ edadMascota: 24 }, { emitEvent: false });
      } else if (isOver24Weeks === false) {
        this.petAgeOver24Weeks = false;
        this.searchForm.patchValue({ edadMascota: null }, { emitEvent: false });
      }
    });
  }

  private setupTripTypeValidation(): void {
    this.searchForm.get('tipoViaje')?.valueChanges.subscribe(tipo => {
      const fechaRegresoControl = this.searchForm.get('fechaRegreso');
      if (tipo === 'roundtrip') {
        fechaRegresoControl?.setValidators([Validators.required]);
      } else {
        fechaRegresoControl?.clearValidators();
      }
      fechaRegresoControl?.updateValueAndValidity();
    });
  }

  private setupDepartureDateValidation(): void {
    this.searchForm.get('fechaSalida')?.valueChanges.subscribe(fechaSalida => {
      const fechaRegresoControl = this.searchForm.get('fechaRegreso');
      if (fechaSalida && fechaRegresoControl?.value && fechaSalida >= fechaRegresoControl.value) {
        const newReturnDate = new Date(fechaSalida);
        newReturnDate.setDate(newReturnDate.getDate() + 1);
        fechaRegresoControl.setValue(newReturnDate);
      }
    });
  }

  public selectPetType(type: Exclude<PetType, null>): void {
    this.selectedPetType = type;
    this.searchForm.patchValue({ tipoMascota: type });
  }



  public getMinReturnDate(): Date {
    const departureDate = this.searchForm.get('fechaSalida')?.value;
    if (departureDate && departureDate instanceof Date) {
      return departureDate;
    }
    return this.today;
  }

  public getFormData(): FlightSearchFormEntity {
    return this.searchForm.value;
  }

  public isFormValid(): boolean {
    return this.searchForm.valid;
  }

  public markAllAsTouched(): void {
    this.searchForm.markAllAsTouched();
  }

  public resetForm(): void {
    this.searchForm.reset({
      tipoViaje: 'roundtrip',
      origen: '',
      origenCity: null,
      destino: '',
      destinoCity: null,
      fechaSalida: null,
      fechaRegreso: null,
      pasajeros: { adults: 1, children: 0, childrenAges: [], travelClass: 'economy' } as PassengerSelectionEntity,
      conMascota: null,
      tipoMascota: null,
      petAgeOver24Weeks: null,
      edadMascota: null,
      pesoMascota: null,
      razaMascota: '',
    });
    this.selectedPetType = null;
    this.petAgeOver24Weeks = null;
  }

  public destroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
