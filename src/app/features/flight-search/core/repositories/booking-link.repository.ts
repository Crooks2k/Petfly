import { Observable } from 'rxjs';
import { BookingLinkEntity } from '../entities';

export abstract class BookingLinkRepository {
  abstract getBookingLink(agencyLink: string): Observable<BookingLinkEntity>;
}
