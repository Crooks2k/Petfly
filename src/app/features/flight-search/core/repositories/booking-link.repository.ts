import { Observable } from 'rxjs';
import { BookingLinkEntity } from '../entities';

export abstract class BookingLinkRepository {
  abstract getBookingLink(searchId: string, termsUrl: string): Observable<BookingLinkEntity>;
}
