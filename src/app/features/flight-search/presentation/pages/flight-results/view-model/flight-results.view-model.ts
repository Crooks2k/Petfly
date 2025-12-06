import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { PetType } from '@flight-search/core/types';
import { PassengerSelectionEntity } from '@shared/core/entities';

export interface FlightFiltersData {
  tipoMascota: PetType;
  pesoMascota: number | null;
  altura: number | null;
  largo: number | null;
  ancho: number | null;
  sinTransportador: boolean;
  origen: string;
  destino: string;
  fechaSalida: Date | null;
  fechaRegreso: Date | null;
  pasajeros: PassengerSelectionEntity;
  clasesCabina: string[];
  certificados: string[];
  permitirEscalas: boolean;
  equipajeTarifa: string[];
  aerolineas: string[];
  aerolineasAceptanMascotas: string[];
  tiempoViaje: { min: number; max: number } | null;
  aeropuertoEscalas: string[];
  precio: { min: number; max: number } | null;
  tiempoEscalas: { min: number; max: number } | null;
  sinTransportadorPerros: boolean;
}

@Injectable()
export class FlightResultsViewModel {
  public filtersForm!: FormGroup;
  public selectedPetType: PetType = null;
  public today = new Date();
  public autoApplyFilters = true;

  private readonly destroy$ = new Subject<void>();
  private readonly filterChange$ = new Subject<Partial<FlightFiltersData>>();

  constructor(private readonly fb: FormBuilder) {
    this.initializeForm();
    this.setupFormSubscriptions();
  }

  private initializeForm(): void {
    this.filtersForm = this.fb.group({
      // Detalles de la mascota
      tipoMascota: [null],
      pesoMascota: [null],
      altura: [null],
      largo: [null],
      ancho: [null],
      sinTransportador: [null],

      // Detalles del viaje
      origen: [''],
      destino: [''],
      fechaSalida: [null],
      fechaRegreso: [null],
      pasajeros: [{ adults: 1, children: 0, childrenAges: [], travelClass: 'economy' } as PassengerSelectionEntity],
      clasesCabina: [[]],

      // Certificados
      certificados: [[]],

      // Aerolíneas y escalas
      permitirEscalas: [null],
      equipajeTarifa: [[]],
      aerolineas: [[]],
      aerolineasAceptanMascotas: [[]],

      // Otros filtros
      tiempoViaje: [null],
      aeropuertoEscalas: [[]],
      precio: [null],
      tiempoEscalas: [null],
      sinTransportadorPerros: [false],
    });
  }

  private setupFormSubscriptions(): void {
    this.filtersForm.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe(filters => {
        if (this.autoApplyFilters) {
          this.onFiltersChange(filters);
        }
      });

    this.setupImmediateFilters();
  }

  private setupImmediateFilters(): void {
    this.filtersForm.get('tipoMascota')?.valueChanges.subscribe(value => {
      if (this.autoApplyFilters) {
        this.applyFilter({ tipoMascota: value });
      }
    });

    this.filtersForm.get('sinTransportador')?.valueChanges.subscribe(value => {
      if (this.autoApplyFilters) {
        this.applyFilter({ sinTransportador: value });
      }
    });

    this.filtersForm.get('permitirEscalas')?.valueChanges.subscribe(value => {
      if (this.autoApplyFilters) {
        this.applyFilter({ permitirEscalas: value });
      }
    });

    this.filtersForm.get('clasesCabina')?.valueChanges.subscribe(value => {
      if (this.autoApplyFilters) {
        this.applyFilter({ clasesCabina: value });
      }
    });

    this.filtersForm.get('certificados')?.valueChanges.subscribe(value => {
      if (this.autoApplyFilters) {
        this.applyFilter({ certificados: value });
      }
    });
  }

  private onFiltersChange(filters: FlightFiltersData): void {
    this.filterChange$.next(filters);
  }

  private applyFilter(filter: Partial<FlightFiltersData>): void {
    this.filterChange$.next(filter);
  }

  public selectPetType(type: Exclude<PetType, null>): void {
    this.selectedPetType = type;
    this.filtersForm.patchValue({ tipoMascota: type });
  }

  public toggleCabinClass(className: string): void {
    const current = this.filtersForm.get('clasesCabina')?.value || [];
    const index = current.indexOf(className);
    
    if (index > -1) {
      current.splice(index, 1);
    } else {
      current.push(className);
    }
    
    this.filtersForm.patchValue({ clasesCabina: [...current] });
  }

  public toggleCertificate(certificate: string): void {
    const current = this.filtersForm.get('certificados')?.value || [];
    const index = current.indexOf(certificate);
    
    if (index > -1) {
      current.splice(index, 1);
    } else {
      current.push(certificate);
    }
    
    this.filtersForm.patchValue({ certificados: [...current] });
  }

  public isCabinClassSelected(className: string): boolean {
    const classes = this.filtersForm.get('clasesCabina')?.value || [];
    return classes.includes(className);
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

  public getFiltersData(): FlightFiltersData {
    return this.filtersForm.value;
  }

  public resetFilters(): void {
    this.filtersForm.reset({
      tipoMascota: null,
      pesoMascota: null,
      altura: null,
      largo: null,
      ancho: null,
      sinTransportador: false,
      origen: '',
      destino: '',
      fechaSalida: null,
      fechaRegreso: null,
      pasajeros: { adults: 1, children: 0, childrenAges: [], travelClass: 'economy' } as PassengerSelectionEntity,
      clasesCabina: [],
      certificados: [],
      permitirEscalas: true,
      equipajeTarifa: [],
      aerolineas: [],
      aerolineasAceptanMascotas: [],
      tiempoViaje: null,
      aeropuertoEscalas: [],
      precio: null,
      tiempoEscalas: null,
      sinTransportadorPerros: false,
    });
    this.selectedPetType = null;
  }

  public destroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
