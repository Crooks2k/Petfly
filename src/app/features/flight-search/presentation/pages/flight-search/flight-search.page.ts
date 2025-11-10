import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { I18nService } from '@core/i18n/i18n.service';
import { Subject, takeUntil } from 'rxjs';
import { FlightSearchConfig, ResolvedFlightSearchTexts } from './flight-search.config';
import { tripType, PetType } from '@flight-search/core/types';
import { FlightSearchViewModel } from './view-model/flight-search.view-model';

@Component({
  selector: 'app-flight-search',
  templateUrl: './flight-search.page.html',
  styleUrl: './flight-search.page.scss',
  standalone: false,
  providers: [FlightSearchViewModel],
  animations: [FlightSearchConfig.animations.slideInOut],
})
export class FlightSearchPage implements OnInit, OnDestroy {
  public searchForm!: FormGroup;

  public tripType!: tripType[];
  public isSearching = false;
  public readonly config = FlightSearchConfig;
  public texts: ResolvedFlightSearchTexts = {} as ResolvedFlightSearchTexts;

  public readonly ciudades = [...FlightSearchConfig.options.cities];
  public razasOptions: { label: string; value: string }[] = [];

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly router: Router,
    private readonly i18nService: I18nService,
    public readonly viewModel: FlightSearchViewModel
  ) {
    this.searchForm = this.viewModel.searchForm;
  }

  public ngOnInit(): void {
    this.setupReactiveTexts();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.viewModel.destroy();
  }

  public onSearch(): void {
    if (this.viewModel.isFormValid()) {
      this.isSearching = true;

      setTimeout(() => {
        const searchParams = this.viewModel.getFormData();
        this.router.navigate([FlightSearchConfig.routes.flightResults], {
          queryParams: searchParams,
        });
      }, 1500);
    } else {
      this.viewModel.markAllAsTouched();
    }
  }

  public selectPetType(type: Exclude<PetType, null>): void {
    this.viewModel.selectPetType(type);
  }

  public getMinReturnDate(): Date {
    return this.viewModel.getMinReturnDate();
  }

  public get selectedPetType(): PetType {
    return this.viewModel.selectedPetType;
  }

  public get today(): Date {
    return this.viewModel.today;
  }

  private setupReactiveTexts(): void {
    this.i18nService
      .getReactiveTexts(this.config)
      .pipe(takeUntil(this.destroy$))
      .subscribe(resolvedTexts => {
        this.texts = resolvedTexts as unknown as ResolvedFlightSearchTexts;
        this.tripType = [
          { label: this.texts.roundTrip, value: 'roundtrip' },
          { label: this.texts.oneWay, value: 'oneway' },
        ];
        this.loadBreedsOptions();
      });
  }

  private loadBreedsOptions(): void {
    this.razasOptions = FlightSearchConfig.options.breeds.map(option => ({
      label: this.i18nService.translateInstant(option.i18nKey),
      value: option.value,
    }));
  }
}
