import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BookingLinkRepository } from '@flight-search/core/repositories/booking-link.repository';
import { BookingLinkEntity } from '@flight-search/core/entities';
import { BookingLinkMapper, BookingLinkApiResponse } from '../mappers/booking-link.mapper';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BookingLinkRepositoryImpl extends BookingLinkRepository {
  private readonly baseUrl = environment.API_SERVICES.TRAVELPAYOUTS_API_URL;

  constructor(private readonly http: HttpClient) {
    super();
  }

  getBookingLink(searchId: string, termsUrl: string): Observable<BookingLinkEntity> {
    const url = `${this.baseUrl}flight_searches/${searchId}/clicks/${termsUrl}.json`;
    
    const headers = new HttpHeaders({
      'Accept-Encoding': 'gzip,deflate,sdch',
    });

    return this.http
      .get<BookingLinkApiResponse>(url, { headers })
      .pipe(map(response => BookingLinkMapper.toDomain(response)));
  }
}
