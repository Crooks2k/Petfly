import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { I18nService } from '@core/i18n/i18n.service';
import { Subject, takeUntil } from 'rxjs';
import {
  FlightTicketEntity,
  FlightGroupEntity,
  FlightItemEntity,
} from '@flight-search/core/entities';
import { FlightCardMobileConfig, ResolvedFlightCardMobileTexts } from './flight-card-mobile.config';
import { PetflyInteractor } from '@flight-search/core/interactor/petfly.interactor';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'petfly-flight-card-mobile',
  templateUrl: './flight-card-mobile.component.html',
  styleUrl: './flight-card-mobile.component.scss',
  standalone: false,
})
export class FlightCardMobileComponent implements OnInit, OnDestroy {
  @Input() flightTicket!: FlightTicketEntity;
  @Input() isRoundTrip: boolean = false;

  public texts: ResolvedFlightCardMobileTexts = {} as ResolvedFlightCardMobileTexts;
  public isExpanded = false;
  public isLoadingBooking = false;
  public readonly config = FlightCardMobileConfig;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly i18nService: I18nService,
    private readonly petflyInteractor: PetflyInteractor,
    private readonly messageService: MessageService
  ) {}

  public ngOnInit(): void {
    this.setupReactiveTexts();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public toggleExpanded(): void {
    this.isExpanded = !this.isExpanded;
  }

  public onSelectFlight(event: Event): void {
    event.stopPropagation();
    
    const agencyLink = this.flightTicket.flights[0]?.flightItems[0]?.agencyLink;
    
    if (!agencyLink) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo obtener el enlace de reserva. Por favor, intenta de nuevo.',
      });
      return;
    }

    this.isLoadingBooking = true;

    this.petflyInteractor
      .getBookingLink(agencyLink)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: response => {
          this.isLoadingBooking = false;
          window.open(response.url, '_blank');
        },
        error: () => {
          this.isLoadingBooking = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo obtener el enlace de reserva. Por favor, intenta de nuevo.',
          });
        },
      });
  }

  public get outboundFlight() {
    return this.flightTicket.flights[0];
  }

  public get returnFlight() {
    return this.isRoundTrip && this.flightTicket.flights.length > 1
      ? this.flightTicket.flights[1]
      : null;
  }

  public formatTime(isoString: string): string {
    const date = new Date(isoString);
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  }

  public formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}min`;
  }

  public getStopsText(): string {
    if (this.flightTicket.maxStops === 0) {
      return this.texts.direct;
    }
    return `${this.flightTicket.maxStops} ${this.flightTicket.maxStops === 1 ? this.texts.stop : this.texts.stops}`;
  }

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

  public getTotalDuration(flight: FlightGroupEntity): number {
    if (!flight || !flight.flightItems) return 0;
    return flight.flightItems.reduce(
      (total: number, item: FlightItemEntity) => total + item.duration,
      0
    );
  }

  public getArrivalDayOffset(departureTime: string, arrivalTime: string): string {
    const departure = new Date(departureTime);
    const arrival = new Date(arrivalTime);

    const dayDiff = Math.floor((arrival.getTime() - departure.getTime()) / (1000 * 60 * 60 * 24));

    return dayDiff > 0 ? `+${dayDiff}` : '';
  }

  public formatPrice(price: number): string {
    return new Intl.NumberFormat('es-ES').format(Math.round(price));
  }

  public get hasMRPrice(): boolean {
    return this.flightTicket.mrPrice !== null;
  }

  public get isAENotAccepted(): boolean {
    return this.flightTicket.aePrice === null;
  }

  public get isPSNotAccepted(): boolean {
    return this.flightTicket.psPrice === null;
  }

  public get isMRNotAccepted(): boolean {
    return this.flightTicket.mrPrice === null;
  }

  public get hasAEPrice(): boolean {
    return this.flightTicket.aePrice !== null;
  }

  public get hasPSPrice(): boolean {
    return this.flightTicket.psPrice !== null;
  }

  public getPetPriceMin(): number {
    return this.flightTicket.totalPetPrice?.min ?? 0;
  }

  public getPetPriceMax(): number {
    return this.flightTicket.totalPetPrice?.max ?? 0;
  }

  public get hasTotalPetPrice(): boolean {
    return this.flightTicket.totalPetPrice !== null;
  }

  private setupReactiveTexts(): void {
    this.i18nService
      .getReactiveTexts(this.config)
      .pipe(takeUntil(this.destroy$))
      .subscribe(resolvedTexts => {
        this.texts = resolvedTexts as unknown as ResolvedFlightCardMobileTexts;
      });
  }
}
