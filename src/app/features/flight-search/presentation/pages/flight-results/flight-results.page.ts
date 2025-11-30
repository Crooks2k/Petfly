import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { I18nService } from '@core/i18n/i18n.service';
import { Subject, takeUntil } from 'rxjs';
import { FlightResultsViewModel } from './view-model/flight-results.view-model';
import { PetType } from '@flight-search/core/types';
import { FlightResultsConfig, ResolvedFlightResultsTexts } from './flight-results.config';

@Component({
  selector: 'app-flight-results',
  templateUrl: './flight-results.page.html',
  styleUrl: './flight-results.page.scss',
  standalone: false,
  providers: [FlightResultsViewModel],
})
export class FlightResultsPage implements OnInit, OnDestroy {
  public filtersForm!: FormGroup;
  public readonly config = FlightResultsConfig;
  public texts: ResolvedFlightResultsTexts = {} as ResolvedFlightResultsTexts;
  public isFiltersModalOpen = false;

  private readonly destroy$ = new Subject<void>();

  constructor(
    public readonly viewModel: FlightResultsViewModel,
    private readonly i18nService: I18nService
  ) {
    this.filtersForm = this.viewModel.filtersForm;
  }

  public ngOnInit(): void {
    this.setupReactiveTexts();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.viewModel.destroy();
  }

  public selectPetType(type: Exclude<PetType, null>): void {
    this.viewModel.selectPetType(type);
  }

  public toggleCabinClass(className: string): void {
    this.viewModel.toggleCabinClass(className);
  }

  public toggleCertificate(certificate: string): void {
    this.viewModel.toggleCertificate(certificate);
  }

  public isCabinClassSelected(className: string): boolean {
    return this.viewModel.isCabinClassSelected(className);
  }

  public isCertificateSelected(certificate: string): boolean {
    return this.viewModel.isCertificateSelected(certificate);
  }

  public get selectedPetType(): PetType {
    return this.viewModel.selectedPetType;
  }

  public get today(): Date {
    return this.viewModel.today;
  }

  public getMinReturnDate(): Date {
    return this.viewModel.getMinReturnDate();
  }

  public openFiltersModal(): void {
    this.isFiltersModalOpen = true;
    this.viewModel.autoApplyFilters = false;
    document.body.style.overflow = 'hidden';
  }

  public closeFiltersModal(): void {
    this.isFiltersModalOpen = false;
    this.viewModel.autoApplyFilters = true;
    document.body.style.overflow = '';
  }

  public onFiltersApplied(): void {
    const filters = this.viewModel.getFiltersData();
    console.log('Filtros aplicados manualmente (desktop - botón Actualizar):', filters);
    // TODO: Aquí se llamará al API para aplicar los filtros
  }

  public applyFilters(): void {
    const filters = this.viewModel.getFiltersData();
    console.log('Aplicando filtros (móvil):', filters);
    // TODO: Aquí se llamará al API para aplicar los filtros
    this.closeFiltersModal();
  }

  private setupReactiveTexts(): void {
    this.i18nService
      .getReactiveTexts(this.config)
      .pipe(takeUntil(this.destroy$))
      .subscribe(resolvedTexts => {
        this.texts = resolvedTexts as unknown as ResolvedFlightResultsTexts;
      });
  }
}