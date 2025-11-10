import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { I18nService } from '@core/i18n/i18n.service';
import { I18N_CONSTANTS } from '@core/i18n/config';
import { Subject, takeUntil } from 'rxjs';
import { OverlayPanelModule } from 'primeng/overlaypanel';

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
  imports: [CommonModule, OverlayPanelModule]
})
export class HeaderComponent implements OnInit, OnDestroy {
  public currentLanguage: string = I18N_CONSTANTS.DEFAULT_LANGUAGE;
  public languages: LanguageOption[] = [...I18N_CONSTANTS.AVAILABLE_LANGUAGES];
  
  private readonly destroy$ = new Subject<void>();

  constructor(private readonly i18nService: I18nService) {}

  public ngOnInit(): void {
    this.i18nService.currentLanguage$
      .pipe(takeUntil(this.destroy$))
      .subscribe(lang => {
        this.currentLanguage = lang;
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
    return language?.name || 'Español';
  }

  public getCurrentLanguageFlag(): string {
    const language = this.languages.find(lang => lang.code === this.currentLanguage);
    return language?.flag || '🇪🇸';
  }

  public getOtherLanguages(): LanguageOption[] {
    return this.languages.filter(lang => lang.code !== this.currentLanguage);
  }

  public openWhatsApp(): void {
    window.open('https://wa.me/1234567890?text=Hola, necesito información sobre viajes con mascotas', '_blank');
  }
}
