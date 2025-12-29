import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { I18nService } from '@core/i18n/i18n.service';
import { I18N_CONSTANTS } from '@core/i18n/config';
import { CurrencyService, Currency } from '@shared/services/currency/currency.service';
import { Subject, takeUntil } from 'rxjs';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { HeaderConfig, HeaderTexts } from './header.config';

interface LanguageOption {
  code: string;
  name: string;
  flag: string;
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  standalone: true,
  imports: [CommonModule, OverlayPanelModule],
})
export class HeaderComponent implements OnInit, OnDestroy {
  public currentLanguage: string = I18N_CONSTANTS.DEFAULT_LANGUAGE;
  public languages: LanguageOption[] = [...I18N_CONSTANTS.AVAILABLE_LANGUAGES];
  public currentCurrency!: Currency;
  public currencies: Currency[] = [];
  public texts: HeaderTexts = {} as HeaderTexts;

  public readonly config = HeaderConfig;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly i18nService: I18nService,
    private readonly currencyService: CurrencyService,
    private readonly router: Router
  ) {}

  public ngOnInit(): void {
    this.setupLanguageSubscription();
    this.setupCurrencySubscription();
    this.setupCurrenciesListSubscription();
    this.setupReactiveTexts();
  }

  private setupLanguageSubscription(): void {
    this.i18nService.currentLanguage$.pipe(takeUntil(this.destroy$)).subscribe(lang => {
      this.currentLanguage = lang;
    });
  }

  private setupCurrencySubscription(): void {
    this.currencyService.currentCurrency$.pipe(takeUntil(this.destroy$)).subscribe(currency => {
      this.currentCurrency = currency;
    });
  }

  private setupCurrenciesListSubscription(): void {
    this.currencyService.currencies$.pipe(takeUntil(this.destroy$)).subscribe(currencies => {
      this.currencies = currencies;
    });
  }

  private setupReactiveTexts(): void {
    this.i18nService
      .getReactiveTexts(this.config)
      .pipe(takeUntil(this.destroy$))
      .subscribe(resolvedTexts => {
        this.texts = resolvedTexts as unknown as HeaderTexts;
      });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public changeLanguage(languageCode: string): void {
    this.i18nService.setLanguage(languageCode);
  }

  public getCurrentLanguageName(): string {
    const language = this.languages.find(lang => lang.code === this.currentLanguage);
    return language?.name || this.config.defaults.languageName;
  }

  public getCurrentLanguageFlag(): string {
    const language = this.languages.find(lang => lang.code === this.currentLanguage);
    return language?.flag || this.config.defaults.languageFlag;
  }

  public getOtherLanguages(): LanguageOption[] {
    return this.languages.filter(lang => lang.code !== this.currentLanguage);
  }

  public changeCurrency(currencyCode: string): void {
    this.currencyService.setCurrency(currencyCode);
  }

  public getOtherCurrencies(): Currency[] {
    return this.currencies.filter(curr => curr.code !== this.currentCurrency.code);
  }

  public navigateToHome(): void {
    this.router.navigate(['']);
  }

  public openWhatsApp(): void {
    const message = this.getWhatsAppMessage();
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${this.config.whatsapp.phoneNumber}?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');
  }

  private getWhatsAppMessage(): string {
    const languageCode = this.currentLanguage as 'es' | 'en';
    return this.config.whatsapp.messages[languageCode] || this.config.whatsapp.messages.es;
  }
}
