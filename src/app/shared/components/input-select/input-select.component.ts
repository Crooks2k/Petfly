import { Component, Input, Output, EventEmitter, forwardRef, OnInit, OnDestroy } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { TranslateService } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'petfly-input-select',
  standalone: true,
  imports: [CommonModule, FormsModule, DropdownModule],
  templateUrl: './input-select.component.html',
  styleUrl: './input-select.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputSelectComponent),
      multi: true,
    },
  ],
})
export class InputSelectComponent implements ControlValueAccessor, OnInit, OnDestroy {
  @Input() options: unknown[] = [];
  @Input() optionLabel: string = 'label';
  @Input() optionValue: string = 'value';
  @Input() placeholder: string = 'Seleccionar...';
  @Input() disabled: boolean = false;
  @Input() showClear: boolean = false;
  @Input() filter: boolean = false;
  @Input() filterBy: string = '';
  @Input() styleClass: string = '';
  @Input() panelStyleClass: string = '';
  @Input() size: 'small' | 'normal' | 'large' = 'normal';
  @Input() filterPlaceholder: string = 'Buscar...';

  @Output() selectionChange = new EventEmitter<unknown>();

  public value: unknown = null;
  public noResultsText: string = 'No se encontraron resultados';
  public emptyMessageText: string = 'No hay opciones disponibles';

  private readonly destroy$ = new Subject<void>();

  private onChange = (value: unknown) => {};
  private onTouched = () => {};

  constructor(private readonly translateService: TranslateService) {}

  ngOnInit(): void {
    this.loadTranslations();
    this.translateService.onLangChange.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.loadTranslations();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadTranslations(): void {
    this.translateService.get('inputSelect.noResultsFound').subscribe(text => {
      this.noResultsText = text;
    });
    this.translateService.get('inputSelect.emptyFilterMessage').subscribe(text => {
      this.emptyMessageText = text;
    });
  }

  writeValue(value: unknown): void {
    this.value = value;
  }

  registerOnChange(fn: (value: unknown) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onSelectionChange(event: { value: unknown }): void {
    this.value = event?.value;
    this.onChange(this.value);
    this.onTouched();
    this.selectionChange.emit(event);
  }

  getSizeClass(): string {
    switch (this.size) {
    case 'small':
      return 'compact';
    case 'large':
      return 'large';
    default:
      return '';
    }
  }

  getFilterBy(): string {
    return this.filterBy || this.optionLabel;
  }
}
