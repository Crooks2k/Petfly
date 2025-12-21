import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { I18nService } from '@core/i18n/i18n.service';
import { Subject, takeUntil } from 'rxjs';
import {
  FlightTicketEntity,
  FlightGroupEntity,
  FlightItemEntity,
} from '@flight-search/core/entities';
import { FlightCardConfig, ResolvedFlightCardTexts } from './flight-card.config';

@Component({
  selector: 'petfly-flight-card',
  templateUrl: './flight-card.component.html',
  styleUrl: './flight-card.component.scss',
  standalone: false,
})
export class FlightCardComponent implements OnInit, OnDestroy {
  @Input() flightTicket: FlightTicketEntity = this.getMockFlightTicket();
  @Input() isRoundTrip: boolean = false;

  public texts: ResolvedFlightCardTexts = {} as ResolvedFlightCardTexts;
  public isExpanded = false;
  public readonly config = FlightCardConfig;

  private readonly destroy$ = new Subject<void>();

  constructor(private readonly i18nService: I18nService) {}

  public ngOnInit(): void {
    this.setupReactiveTexts();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Datos mock por defecto para desarrollo
   */
  private getMockFlightTicket(): FlightTicketEntity {
    const today = new Date();
    const departureDate = new Date(today);
    departureDate.setDate(today.getDate() + 15);

    const returnDate = new Date(departureDate);
    returnDate.setDate(departureDate.getDate() + 7);

    const departureDateStr = departureDate.toISOString().split('T')[0];
    const returnDateStr = returnDate.toISOString().split('T')[0];

    return {
      flights: [
        // Vuelo de ida: BOG → MIA → LIS → MAD (2 escalas)
        {
          flightItems: [
            {
              airlineName: 'TAP Air Portugal',
              airlineCode: 'TP7316',
              arrivalTime: `${departureDateStr}T12:30:00`,
              arrival: 'MIA',
              departure: 'BOG',
              departureTime: `${departureDateStr}T07:45:00`,
              duration: 220, // 3h 40min
              tripClass: 'Economy',
              imageUrl: 'https://img.wway.io/pics/root/TP@png?exar=1&rs=fit:200:200',
            },
            {
              airlineName: 'TAP Air Portugal',
              airlineCode: 'TP224',
              arrivalTime: `${departureDateStr}T05:50:00+1`,
              arrival: 'LIS',
              departure: 'MIA',
              departureTime: `${departureDateStr}T16:30:00`,
              duration: 500, // 8h 20min
              tripClass: 'Economy',
              imageUrl: 'https://img.wway.io/pics/root/TP@png?exar=1&rs=fit:200:200',
            },
            {
              airlineName: 'TAP Air Portugal',
              airlineCode: 'TP224',
              arrivalTime: `${departureDateStr}T10:15:00+1`,
              arrival: 'MAD',
              departure: 'LIS',
              departureTime: `${departureDateStr}T07:55:00+1`,
              duration: 80, // 1h 20min
              tripClass: 'Economy',
              imageUrl: 'https://img.wway.io/pics/root/TP@png?exar=1&rs=fit:200:200',
            },
          ],
        },
        // Vuelo de regreso: MAD → LIS → MIA → BOG (2 escalas)
        {
          flightItems: [
            {
              airlineName: 'TAP Air Portugal',
              airlineCode: 'TP7316',
              arrivalTime: `${returnDateStr}T12:30:00`,
              arrival: 'LIS',
              departure: 'MAD',
              departureTime: `${returnDateStr}T07:40:00`,
              duration: 80, // 1h 20min
              tripClass: 'Economy',
              imageUrl: 'https://img.wway.io/pics/root/TP@png?exar=1&rs=fit:200:200',
            },
            {
              airlineName: 'TAP Air Portugal',
              airlineCode: 'TP224',
              arrivalTime: `${returnDateStr}T16:30:00`,
              arrival: 'MIA',
              departure: 'LIS',
              departureTime: `${returnDateStr}T14:35:00`,
              duration: 485, // 8h 05min
              tripClass: 'Economy',
              imageUrl: 'https://img.wway.io/pics/root/TP@png?exar=1&rs=fit:200:200',
            },
            {
              airlineName: 'TAP Air Portugal',
              airlineCode: 'TP7316',
              arrivalTime: `${returnDateStr}T21:59:00`,
              arrival: 'BOG',
              departure: 'MIA',
              departureTime: `${returnDateStr}T18:50:00`,
              duration: 245, // 4h 05min
              tripClass: 'Economy',
              imageUrl: 'https://img.wway.io/pics/root/TP@png?exar=1&rs=fit:200:200',
            },
          ],
        },
      ],
      maxStops: 2,
      maxStopDuration: 240, // 4 horas
      price: 715,
      currency: 'USD',
      isDirect: false,
      mrPrice: { min: 200, max: 200, currency: 'USD' },
      aePrice: { min: 50, max: 100, currency: 'USD' },
      psPrice: { min: 0, max: 0, currency: 'USD' },
      total: { min: 1430, max: 1630, currency: 'USD' },
    };
  }

  public toggleExpanded(): void {
    this.isExpanded = !this.isExpanded;
  }

  public onSelectFlight(event: Event): void {
    event.stopPropagation(); // Evitar que se cierre el acordeón
    // TODO: Implementar lógica de selección
    console.log('Flight selected:', this.flightTicket);
  }

  /**
   * Obtiene el vuelo de ida (primer grupo de vuelos)
   */
  public get outboundFlight() {
    return this.flightTicket.flights[0];
  }

  /**
   * Obtiene el vuelo de regreso (segundo grupo de vuelos si existe)
   */
  public get returnFlight() {
    return this.isRoundTrip && this.flightTicket.flights.length > 1
      ? this.flightTicket.flights[1]
      : null;
  }

  /**
   * Formatea la hora desde un string ISO
   */
  public formatTime(isoString: string): string {
    const date = new Date(isoString);
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  }

  /**
   * Formatea la fecha completa desde un string ISO
   */
  public formatDate(isoString: string): string {
    const date = new Date(isoString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  }

  /**
   * Formatea la duración en minutos a formato "Xh Ymin"
   */
  public formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}min`;
  }

  /**
   * Calcula la duración de la escala entre dos vuelos
   */
  public getLayoverDuration(arrivalTime: string, departureTime: string): string {
    const arrival = new Date(arrivalTime);
    const departure = new Date(departureTime);
    const diffMinutes = Math.floor((departure.getTime() - arrival.getTime()) / (1000 * 60));
    return this.formatDuration(diffMinutes);
  }

  /**
   * Obtiene el nombre del aeropuerto (placeholder - se puede mejorar con un servicio)
   */
  public getAirportName(code: string): string {
    const airports: { [key: string]: string } = {
      BOG: 'Bogotá',
      MAD: 'Madrid Barajas',
      MIA: 'Miami Internacional',
      LIS: 'Lisboa',
    };
    return airports[code] || '';
  }

  /**
   * Obtiene el texto de escalas
   */
  public getStopsText(): string {
    if (this.flightTicket.maxStops === 0) {
      return this.texts.direct;
    }
    return `${this.flightTicket.maxStops} ${this.flightTicket.maxStops === 1 ? this.texts.stop : this.texts.stops}`;
  }

  /**
   * Obtiene los códigos de aeropuertos de las escalas
   */
  public getStopsCodes(flight: FlightGroupEntity): string {
    if (!flight || !flight.flightItems || flight.flightItems.length <= 1) {
      return '';
    }

    const stops: string[] = [];
    for (let i = 0; i < flight.flightItems.length - 1; i++) {
      stops.push(flight.flightItems[i].arrival);
    }
    return stops.join(', ');
  }

  /**
   * Calcula la duración total del vuelo
   */
  public getTotalDuration(flight: FlightGroupEntity): number {
    if (!flight || !flight.flightItems) return 0;
    return flight.flightItems.reduce(
      (total: number, item: FlightItemEntity) => total + item.duration,
      0
    );
  }

  /**
   * Obtiene el día siguiente si el vuelo llega al día siguiente
   */
  public getArrivalDayOffset(departureTime: string, arrivalTime: string): string {
    const departure = new Date(departureTime);
    const arrival = new Date(arrivalTime);

    const dayDiff = Math.floor((arrival.getTime() - departure.getTime()) / (1000 * 60 * 60 * 24));

    return dayDiff > 0 ? `+${dayDiff}` : '';
  }

  /**
   * Formatea el precio con separadores de miles
   */
  public formatPrice(price: number): string {
    return new Intl.NumberFormat('es-ES').format(Math.round(price));
  }

  /**
   * Verifica si el precio MR está disponible
   */
  public get hasMRPrice(): boolean {
    return this.flightTicket.mrPrice !== null;
  }

  /**
   * Verifica si AE no está aceptado
   */
  public get isAENotAccepted(): boolean {
    return this.flightTicket.aePrice.min === 0 && this.flightTicket.aePrice.max === 0;
  }

  private setupReactiveTexts(): void {
    this.i18nService
      .getReactiveTexts(this.config)
      .pipe(takeUntil(this.destroy$))
      .subscribe(resolvedTexts => {
        this.texts = resolvedTexts as unknown as ResolvedFlightCardTexts;
      });
  }
}
