import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { I18nService } from '@core/i18n/i18n.service';
import { Subject, takeUntil } from 'rxjs';
import { FlightResultsViewModel } from './view-model/flight-results.view-model';
import { PetType } from '@flight-search/core/types';
import { FlightResultsConfig, ResolvedFlightResultsTexts } from './flight-results.config';
import { SearchFlightsResponseEntity, FlightSearchFormEntity } from '@flight-search/core/entities';

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
  providers: [FlightResultsViewModel],
})
export class FlightResultsPage implements OnInit, OnDestroy {
  public filtersForm!: FormGroup;
  public readonly config = FlightResultsConfig;
  public texts: ResolvedFlightResultsTexts = {} as ResolvedFlightResultsTexts;
  public isFiltersModalOpen = false;

  // Datos recibidos de la búsqueda
  public searchResults: SearchFlightsResponseEntity | null = null;
  public searchParams: FlightSearchFormEntity | null = null;
  public searchCurrency: string | null = null;
  public searchLocale: string | null = null;
  public searchId: string | null = null;
  public isRoundTrip: boolean = false;
  public isPetPriceInfoOpen: boolean = false;

  // Sorting
  public currentSort: 'price' | 'duration' | null = null;
  public sortDirection: 'asc' | 'desc' = 'asc';
  public sortedFlightTickets: any[] = [];

  private readonly destroy$ = new Subject<void>();

  constructor(
    public readonly viewModel: FlightResultsViewModel,
    private readonly i18nService: I18nService,
    private readonly router: Router
  ) {
    this.filtersForm = this.viewModel.filtersForm;
    this.loadSearchData();
  }

  public ngOnInit(): void {
    this.setupReactiveTexts();
    this.initializeFiltersFromSearch();
  }

  /**
   * Carga los datos enviados desde la página de búsqueda
   */
  private loadSearchData(): void {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras?.state as FlightResultsState;

    if (state) {
      this.searchResults = state.searchResults;
      this.searchParams = state.searchParams;
      this.searchCurrency = state.currency;
      this.searchLocale = state.locale;
      this.searchId = state.searchId;

      console.log('📦 Datos recibidos de la búsqueda:');
      console.log('  ✅ Resultados:', this.searchResults);
      console.log('  ✅ Parámetros de búsqueda:', this.searchParams);
      console.log('  ✅ Moneda:', this.searchCurrency);
      console.log('  ✅ Idioma:', this.searchLocale);
      console.log('  ✅ Search ID:', this.searchId);
      console.log('  ✅ Total de vuelos:', this.searchResults?.flightTickets?.length || 0);

      // Inicializar sortedFlightTickets con los resultados
      this.sortedFlightTickets = [...(this.searchResults?.flightTickets || [])];

      // Pasar el searchId al ViewModel
      if (this.searchId) {
        this.viewModel.setSearchId(this.searchId);
      }
    } else {
      console.warn('⚠️ No se recibieron datos de búsqueda');
      // Crear mocks para desarrollo
      this.sortedFlightTickets = [
        this.getMockFlightTicket(1),
        this.getMockFlightTicket(2),
        this.getMockFlightTicket(3),
        this.getMockFlightTicket(4),
        this.getMockFlightTicket(5),
      ];
      // Para mocks, simular viaje de ida y vuelta
      this.isRoundTrip = true;
    }
  }

  /**
   * Inicializa los filtros con los datos de la búsqueda original
   */
  private initializeFiltersFromSearch(): void {
    if (this.searchParams) {
      console.log('🔧 Inicializando filtros con datos de búsqueda...');

      // Determinar si es viaje de ida y vuelta
      this.isRoundTrip = this.searchParams.tipoViaje === 'roundtrip';

      this.viewModel.form.patchValue({
        origen: this.searchParams.origen,
        origenCity: this.searchParams.origenCity,
        destino: this.searchParams.destino,
        destinoCity: this.searchParams.destinoCity,
        fechaSalida: this.searchParams.fechaSalida,
        fechaRegreso: this.searchParams.fechaRegreso,
        pasajeros: this.searchParams.pasajeros,
        tipoMascota: this.searchParams.tipoMascota,
        pesoMascota: this.searchParams.pesoMascota,
        razaMascota: this.searchParams.razaMascota,
        edadMascota: this.searchParams.edadMascota,
      });

      if (this.searchParams.tipoMascota) {
        this.viewModel.selectPetType(this.searchParams.tipoMascota as Exclude<PetType, null>);
      }

      console.log('✅ Filtros inicializados correctamente');
      console.log('  🔄 Tipo de viaje:', this.isRoundTrip ? 'Ida y vuelta' : 'Solo ida');
    }
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.viewModel.destroy();
  }

  public selectPetType(type: Exclude<PetType, null>): void {
    this.viewModel.selectPetType(type);
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
    console.log('📱 Modal de filtros abierto');
  }

  public closeFiltersModal(): void {
    this.isFiltersModalOpen = false;
    document.body.style.overflow = '';
    console.log('💻 Modal de filtros cerrado');
  }

  public onFiltersApplied(): void {
    console.log('🔄 Aplicando filtros (desktop - botón Filtrar)...');
    if (this.searchId) {
      this.viewModel.applyFiltersToSearch();
    } else {
      console.error('❌ No hay searchId disponible para filtrar');
    }
  }

  public applyFilters(): void {
    if (this.searchId) {
      this.viewModel.applyFiltersToSearch();
      this.closeFiltersModal();
    } else {
      console.error('❌ No hay searchId disponible para filtrar');
    }
  }

  public togglePetPriceInfo(): void {
    // Solo funciona en mobile
    if (window.innerWidth < 768) {
      this.isPetPriceInfoOpen = !this.isPetPriceInfoOpen;
    }
  }

  /**
   * Alterna el ordenamiento por precio o duración
   */
  public toggleSort(type: 'price' | 'duration'): void {
    if (this.currentSort === type) {
      // Si ya está ordenado por este tipo, cambiar dirección
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      // Si es un nuevo tipo de ordenamiento, empezar con ascendente
      this.currentSort = type;
      this.sortDirection = 'asc';
    }

    this.applySorting();
  }

  /**
   * Aplica el ordenamiento a los vuelos
   */
  private applySorting(): void {
    if (!this.sortedFlightTickets || this.sortedFlightTickets.length === 0) {
      return;
    }

    const tickets = [...this.sortedFlightTickets];

    if (this.currentSort === 'price') {
      tickets.sort((a, b) => {
        const priceA = a.price || 0;
        const priceB = b.price || 0;
        return this.sortDirection === 'asc' ? priceA - priceB : priceB - priceA;
      });
    } else if (this.currentSort === 'duration') {
      tickets.sort((a, b) => {
        // Calcular duración total del viaje (suma de todos los vuelos)
        const durationA = this.calculateTotalDuration(a);
        const durationB = this.calculateTotalDuration(b);
        return this.sortDirection === 'asc' ? durationA - durationB : durationB - durationA;
      });
    }

    this.sortedFlightTickets = tickets;
    console.log(`🔄 Ordenado por ${this.currentSort} (${this.sortDirection})`);
    console.log('Precios ordenados:', tickets.map(t => t.price));
  }

  /**
   * Calcula la duración total de un ticket (suma de todos los vuelos)
   */
  private calculateTotalDuration(ticket: any): number {
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

  public getMockFlightTicket(index: number = 1) {
    const today = new Date();
    const departureDate = new Date(today);
    departureDate.setDate(today.getDate() + 15);

    const returnDate = new Date(departureDate);
    returnDate.setDate(departureDate.getDate() + 7);

    const departureDateStr = departureDate.toISOString().split('T')[0];
    const returnDateStr = returnDate.toISOString().split('T')[0];

    // Calcular fecha del día siguiente para vuelos que llegan al día siguiente
    const nextDay = new Date(departureDate);
    nextDay.setDate(departureDate.getDate());
    const nextDayStr = nextDay.toISOString().split('T')[0];

    const returnNextDay = new Date(returnDate);
    returnNextDay.setDate(returnDate.getDate());
    const returnNextDayStr = returnNextDay.toISOString().split('T')[0];

    // Diferentes precios, duraciones, horarios e imágenes para probar el sort
    const mockData = [
      { 
        price: 715, 
        duration1: 220, duration2: 500, duration3: 80, 
        airline: 'TAP Air Portugal',
        airlineCode: 'TP',
        imageUrl: 'https://img.wway.io/pics/root/TP@png?exar=1&rs=fit:200:200',
        dep1: '07:45', arr1: '12:30',
        dep2: '16:30', arr2: '05:50',
        dep3: '07:55', arr3: '10:15',
        // Vuelo de regreso
        retDep1: '08:00', retArr1: '09:20',
        retDep2: '14:30', retArr2: '22:55',
        retDep3: '01:20', retArr3: '06:25'
      },
      { 
        price: 450, 
        duration1: 180, duration2: 420, duration3: 90, 
        airline: 'Avianca',
        airlineCode: 'AV',
        imageUrl: 'https://img.wway.io/pics/root/AV@png?exar=1&rs=fit:200:200',
        dep1: '09:15', arr1: '12:15',
        dep2: '14:00', arr2: '21:00',
        dep3: '23:30', arr3: '02:00',
        // Vuelo de regreso
        retDep1: '10:15', retArr1: '11:35',
        retDep2: '16:00', retArr2: '23:00',
        retDep3: '02:45', retArr3: '07:15'
      },
      { 
        price: 890, 
        duration1: 240, duration2: 480, duration3: 70, 
        airline: 'LATAM',
        airlineCode: 'LA',
        imageUrl: 'https://img.wway.io/pics/root/LA@png?exar=1&rs=fit:200:200',
        dep1: '06:00', arr1: '10:00',
        dep2: '18:45', arr2: '02:45',
        dep3: '05:30', arr3: '06:40',
        // Vuelo de regreso
        retDep1: '07:30', retArr1: '08:40',
        retDep2: '13:20', retArr2: '21:20',
        retDep3: '00:10', retArr3: '05:30'
      },
      { 
        price: 620, 
        duration1: 200, duration2: 460, duration3: 85, 
        airline: 'Copa Airlines',
        airlineCode: 'CM',
        imageUrl: 'https://img.wway.io/pics/root/CM@png?exar=1&rs=fit:200:200',
        dep1: '11:20', arr1: '14:40',
        dep2: '17:15', arr2: '01:55',
        dep3: '04:20', arr3: '05:45',
        // Vuelo de regreso
        retDep1: '09:40', retArr1: '11:05',
        retDep2: '15:45', retArr2: '00:25',
        retDep3: '03:10', retArr3: '08:05'
      },
      { 
        price: 550, 
        duration1: 190, duration2: 440, duration3: 95, 
        airline: 'Iberia',
        airlineCode: 'IB',
        imageUrl: 'https://img.wway.io/pics/root/IB@png?exar=1&rs=fit:200:200',
        dep1: '08:30', arr1: '11:40',
        dep2: '15:20', arr2: '22:40',
        dep3: '01:15', arr3: '02:50',
        // Vuelo de regreso
        retDep1: '06:50', retArr1: '08:25',
        retDep2: '12:10', retArr2: '19:30',
        retDep3: '22:15', retArr3: '03:20'
      },
    ];

    const data = mockData[index - 1] || mockData[0];

    return {
      flights: [
        {
          flightItems: [
            {
              airlineName: data.airline,
              airlineCode: `${data.airlineCode}001`,
              arrivalTime: `${departureDateStr}T${data.arr1}:00`,
              arrival: 'MIA',
              departure: 'BOG',
              departureTime: `${departureDateStr}T${data.dep1}:00`,
              duration: data.duration1,
              tripClass: 'Economy',
              imageUrl: data.imageUrl,
            },
            {
              airlineName: data.airline,
              airlineCode: `${data.airlineCode}002`,
              arrivalTime: `${nextDayStr}T${data.arr2}:00`,
              arrival: 'LIS',
              departure: 'MIA',
              departureTime: `${departureDateStr}T${data.dep2}:00`,
              duration: data.duration2,
              tripClass: 'Economy',
              imageUrl: data.imageUrl,
            },
            {
              airlineName: data.airline,
              airlineCode: `${data.airlineCode}003`,
              arrivalTime: `${nextDayStr}T${data.arr3}:00`,
              arrival: 'MAD',
              departure: 'LIS',
              departureTime: `${nextDayStr}T${data.dep3}:00`,
              duration: data.duration3,
              tripClass: 'Economy',
              imageUrl: data.imageUrl,
            },
          ],
        },
        {
          flightItems: [
            {
              airlineName: data.airline,
              airlineCode: `${data.airlineCode}101`,
              arrivalTime: `${returnDateStr}T${data.retArr1}:00`,
              arrival: 'LIS',
              departure: 'MAD',
              departureTime: `${returnDateStr}T${data.retDep1}:00`,
              duration: 80,
              tripClass: 'Economy',
              imageUrl: data.imageUrl,
            },
            {
              airlineName: data.airline,
              airlineCode: `${data.airlineCode}102`,
              arrivalTime: `${returnNextDayStr}T${data.retArr2}:00`,
              arrival: 'MIA',
              departure: 'LIS',
              departureTime: `${returnDateStr}T${data.retDep2}:00`,
              duration: 485,
              tripClass: 'Economy',
              imageUrl: data.imageUrl,
            },
            {
              airlineName: data.airline,
              airlineCode: `${data.airlineCode}103`,
              arrivalTime: `${returnNextDayStr}T${data.retArr3}:00`,
              arrival: 'BOG',
              departure: 'MIA',
              departureTime: `${returnNextDayStr}T${data.retDep3}:00`,
              duration: 245,
              tripClass: 'Economy',
              imageUrl: data.imageUrl,
            },
          ],
        },
      ],
      maxStops: 2,
      maxStopDuration: 240,
      price: data.price,
      currency: 'USD',
      isDirect: false,
      mrPrice: { min: 200, max: 200, currency: 'USD' },
      aePrice: { min: 50, max: 100, currency: 'USD' },
      psPrice: { min: 0, max: 0, currency: 'USD' },
      total: { min: data.price * 2 + 200, max: data.price * 2 + 400, currency: 'USD' },
    };
  }
}
