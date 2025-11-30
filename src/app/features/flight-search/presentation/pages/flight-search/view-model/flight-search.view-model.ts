import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { PetType } from '@flight-search/core/types';
import { PassengerSelection } from '@shared/components/passenger-selector/passenger-selector.component';

export interface FlightSearchFormData {
  tipoViaje: string;
  origen: string;
  destino: string;
  fechaSalida: Date;
  fechaRegreso: Date | null;
  pasajeros: PassengerSelection;
  conMascota: boolean;
  tipoMascota: PetType;
  edadMascota: number;
  pesoMascota: number;
  razaMascota: string;
}

@Injectable()
export class FlightSearchViewModel {
  public searchForm!: FormGroup;
  public selectedPetType: PetType = null;
  public today = new Date();
  public petAgeOver24Weeks: boolean | null = null;

  private readonly destroy$ = new Subject<void>();

  constructor(private readonly fb: FormBuilder) {
    this.initializeForm();
    this.setupFormSubscriptions();
  }

  private initializeForm(): void {
    this.searchForm = this.fb.group({
      tipoViaje: ['roundtrip', Validators.required],
      origen: ['', Validators.required],
      destino: ['', Validators.required],
      fechaSalida: [null, Validators.required],
      fechaRegreso: [null],
      pasajeros: [
        { adults: 1, children: 0, travelClass: 'economy' } as PassengerSelection,
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

  public getFormData(): FlightSearchFormData {
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
      destino: '',
      fechaSalida: null,
      fechaRegreso: null,
      pasajeros: { adults: 1, children: 0, travelClass: 'economy' } as PassengerSelection,
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
