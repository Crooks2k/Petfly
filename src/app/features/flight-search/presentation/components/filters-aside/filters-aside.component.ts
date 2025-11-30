import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { PetType } from '@flight-search/core/types';
import { I18nService } from '@core/i18n/i18n.service';
import { Subject, takeUntil } from 'rxjs';
import { FiltersAsideConfig, ResolvedFiltersAsideTexts } from './filters-aside.config';

@Component({
  selector: 'app-filters-aside',
  templateUrl: './filters-aside.component.html',
  styleUrl: './filters-aside.component.scss',
  standalone: false,
})
export class FiltersAsideComponent implements OnInit, OnDestroy {
  @Input() filtersForm!: FormGroup;
  @Input() selectedPetType: PetType = null;
  @Input() today!: Date;
  @Input() showUpdateButton = true; // Controla si se muestra el botón "Actualizar"

  public texts: ResolvedFiltersAsideTexts = {} as ResolvedFiltersAsideTexts;
  public readonly config = FiltersAsideConfig;

  private readonly destroy$ = new Subject<void>();

  @Output() petTypeSelected = new EventEmitter<Exclude<PetType, null>>();
  @Output() certificateToggled = new EventEmitter<string>();
  @Output() filtersApplied = new EventEmitter<void>();

  constructor(private readonly i18nService: I18nService) {}

  public ngOnInit(): void {
    if (!this.filtersForm) {
      throw new Error('filtersForm is required');
    }
    this.setupReactiveTexts();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public selectPetType(type: Exclude<PetType, null>): void {
    this.petTypeSelected.emit(type);
  }

  public toggleCertificate(certificate: string): void {
    this.certificateToggled.emit(certificate);
  }

  public isCertificateSelected(certificate: string): boolean {
    const certificates = this.filtersForm.get('certificados')?.value || [];
    return certificates.includes(certificate);
  }

  public getMinReturnDate(): Date {
    const departureDate = this.filtersForm.get('fechaSalida')?.value;
    if (departureDate && departureDate instanceof Date) {
      return departureDate;
    }
    return this.today;
  }

  public onUpdateFilters(): void {
    this.filtersApplied.emit();
  }

  private setupReactiveTexts(): void {
    this.i18nService
      .getReactiveTexts(this.config)
      .pipe(takeUntil(this.destroy$))
      .subscribe(resolvedTexts => {
        this.texts = resolvedTexts as unknown as ResolvedFiltersAsideTexts;
      });
  }
}
