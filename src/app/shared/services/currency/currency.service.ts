import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { PetflyInteractor } from '@flight-search/core/interactor/petfly.interactor';

export interface Currency {
  code: string;
  symbol: string;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class CurrencyService {
  private currenciesSubject = new BehaviorSubject<Currency[]>([]);
  public currencies$: Observable<Currency[]> = this.currenciesSubject.asObservable();

  private readonly currentCurrencySubject = new BehaviorSubject<Currency>({
    code: 'USD',
    symbol: 'USD',
    name: 'United States Dollar',
  });

  public currentCurrency$: Observable<Currency> = this.currentCurrencySubject.asObservable();

  constructor(private readonly petflyInteractor: PetflyInteractor) {
    this.loadCurrenciesFromApi();
  }

  public getCurrencies(): Currency[] {
    return this.currenciesSubject.value;
  }

  public getCurrentCurrency(): Currency {
    return this.currentCurrencySubject.value;
  }

  public getCurrentCurrencyCode(): string {
    return this.currentCurrencySubject.value.symbol;
  }

  public setCurrency(currencyCode: string): void {
    const currencies = this.currenciesSubject.value;
    const currency = currencies.find(c => c.code === currencyCode);
    if (currency) {
      this.currentCurrencySubject.next(currency);
      localStorage.setItem('selectedCurrency', currencyCode);
    }
  }

  public loadCurrenciesFromApi(): void {
    this.petflyInteractor.getCurrencies({}).subscribe({
      next: response => {
        // Transformar la respuesta del API al formato del servicio
        // El response es un array directo de CurrencyEntity[]
        const currencies: Currency[] = response.map(curr => ({
          code: curr.symbol,
          symbol: curr.symbol,
          name: curr.name,
        }));

        this.currenciesSubject.next(currencies);

        // Restaurar la moneda guardada o usar la primera
        const savedCurrency = localStorage.getItem('selectedCurrency');
        if (savedCurrency) {
          const currency = currencies.find(c => c.code === savedCurrency);
          if (currency) {
            this.currentCurrencySubject.next(currency);
          } else {
            this.currentCurrencySubject.next(currencies[0]);
          }
        } else {
          this.currentCurrencySubject.next(currencies[0]);
        }
      },
      error: error => {
        console.error('Error loading currencies from API:', error);
        // Fallback a monedas por defecto
        const fallbackCurrencies: Currency[] = [
          { code: 'USD', symbol: 'USD', name: 'United States Dollar' },
          { code: 'EUR', symbol: 'EUR', name: 'Euro' },
          { code: 'COP', symbol: 'COP', name: 'Colombian Peso' },
        ];
        this.currenciesSubject.next(fallbackCurrencies);
        this.currentCurrencySubject.next(fallbackCurrencies[0]);
      },
    });
  }
}
