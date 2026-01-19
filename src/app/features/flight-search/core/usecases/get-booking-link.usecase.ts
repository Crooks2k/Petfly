import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BookingLinkRepository } from '../repositories/booking-link.repository';
import { BookingLinkEntity } from '../entities';

@Injectable({
  providedIn: 'root',
})
export class GetBookingLinkUseCase {
  constructor(private readonly bookingLinkRepository: BookingLinkRepository) {}

  execute(searchId: string, termsUrl: string): Observable<BookingLinkEntity> {
    return this.bookingLinkRepository.getBookingLink(searchId, termsUrl);
  }
}
