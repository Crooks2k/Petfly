import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { I18nService } from '@core/i18n/i18n.service';
import { Subject, takeUntil } from 'rxjs';
import { PageNotFoundConfig, ResolvedPageNotFoundTexts } from './page-not-found.config';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrl: './page-not-found.component.scss',
  standalone: false,
})
export class PageNotFoundComponent implements OnInit, OnDestroy {
  public readonly config = PageNotFoundConfig;
  public texts: ResolvedPageNotFoundTexts = {} as ResolvedPageNotFoundTexts;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly router: Router,
    private readonly location: Location,
    private readonly i18nService: I18nService
  ) {}

  public ngOnInit(): void {
    this.setupReactiveTexts();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public goHome(): void {
    this.router.navigate([this.config.routes.home]);
  }

  public goBack(): void {
    this.location.back();
  }

  private setupReactiveTexts(): void {
    this.i18nService
      .getReactiveTexts(this.config)
      .pipe(takeUntil(this.destroy$))
      .subscribe(resolvedTexts => {
        this.texts = resolvedTexts as unknown as ResolvedPageNotFoundTexts;
      });
  }
}
