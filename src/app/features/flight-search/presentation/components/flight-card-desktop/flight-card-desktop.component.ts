import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { I18nService } from '@core/i18n/i18n.service';
import { Subject, takeUntil } from 'rxjs';
import {
  FlightTicketEntity,
  FlightGroupEntity,
  FlightItemEntity,
} from '@flight-search/core/entities';
import {
  FlightCardDesktopConfig,
  ResolvedFlightCardDesktopTexts,
} from './flight-card-desktop.config';
import { PetflyInteractor } from '@flight-search/core/interactor/petfly.interactor';
import { MessageService } from 'primeng/api';
import { CurrencyService } from '@shared/services/currency/currency.service';

@Component({
  selector: 'petfly-flight-card-desktop',
  templateUrl: './flight-card-desktop.component.html',
  styleUrl: './flight-card-desktop.component.scss',
  standalone: false,
})
export class FlightCardDesktopComponent implements OnInit, OnDestroy {
  @Input() flightTicket!: FlightTicketEntity;
  @Input() isRoundTrip: boolean = false;
  @Input() displayCurrency: string | null = null;

  public texts: ResolvedFlightCardDesktopTexts = {} as ResolvedFlightCardDesktopTexts;
  public isExpanded = false;
  public isLoadingBooking = false;
  public readonly config = FlightCardDesktopConfig;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly i18nService: I18nService,
    private readonly petflyInteractor: PetflyInteractor,
    private readonly messageService: MessageService,
    private readonly currencyService: CurrencyService
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
        summary: this.texts.bookingLinkErrorSummary,
        detail: this.texts.bookingLinkErrorDetail,
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
          this.messageService.add({
            severity: 'info',
            summary: this.texts.bookingRedirectSummary,
            detail: this.texts.bookingRedirectDetail,
            life: 3500,
          });
          setTimeout(() => {
            window.open(response.url, '_blank');
          }, 3000);
        },
        error: () => {
          this.isLoadingBooking = false;
          this.messageService.add({
            severity: 'error',
            summary: this.texts.bookingLinkErrorSummary,
            detail: this.texts.bookingLinkErrorDetail,
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

  public get airlineComment(): string | null {
    for (const flight of this.flightTicket.flights || []) {
      for (const item of flight.flightItems || []) {
        if (item.comments != null && item.comments.trim() !== '') {
          return item.comments;
        }
      }
    }
    return null;
  }

  public formatTime(isoString: string): string {
    const date = new Date(isoString);
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  }

  public formatDate(isoString: string): string {
    const date = new Date(isoString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  }

  public formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}min`;
  }

  public getLayoverDuration(arrivalTime: string, departureTime: string): string {
    const arrival = new Date(arrivalTime);
    const departure = new Date(departureTime);
    const diffMinutes = Math.floor((departure.getTime() - arrival.getTime()) / (1000 * 60));
    return this.formatDuration(diffMinutes);
  }

  public getAirportName(code: string): string {
    const airports: { [key: string]: string } = {
      BOG: 'Bogotá',
      MAD: 'Madrid Barajas',
      MIA: 'Miami Internacional',
      LIS: 'Lisboa',
    };
    return airports[code] || '';
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
    const currencyCode =
      this.displayCurrency ?? this.currencyService.getCurrentCurrencyCode() ?? 'USD';
    const locale = this.i18nService.getCurrentLanguage() === 'en' ? 'en-US' : 'es-ES';
    const formatter = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyCode,
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
    });
    const parts = formatter.formatToParts(Math.round(price));
    const result = parts
      .map(p => (p.type === 'currency' && p.value === currencyCode ? '$' : p.value))
      .join('');
    return result;
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
        this.texts = resolvedTexts as unknown as ResolvedFlightCardDesktopTexts;
      });
  }
}
