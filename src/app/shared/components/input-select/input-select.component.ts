import {
  Component,
  Input,
  Output,
  EventEmitter,
  forwardRef,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { TranslateService } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { INPUT_SELECT_CONSTANTS, INPUT_SELECT_SIZE, InputSelectSize } from '../../constants';

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
  @Input() optionLabel = INPUT_SELECT_CONSTANTS.DEFAULT_OPTION_LABEL;
  @Input() optionValue = INPUT_SELECT_CONSTANTS.DEFAULT_OPTION_VALUE;
  @Input() placeholder = 'Seleccionar...';
  @Input() disabled = false;
  @Input() showClear = false;
  @Input() filter = false;
  @Input() filterBy = '';
  @Input() styleClass = '';
  @Input() panelStyleClass = '';
  @Input() size: InputSelectSize = INPUT_SELECT_SIZE.NORMAL;
  @Input() filterPlaceholder = 'Buscar...';

  @Output() selectionChange = new EventEmitter<unknown>();

  public value: unknown = null;
  public noResultsText = 'No se encontraron resultados';
  public emptyMessageText = 'No hay opciones disponibles';

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
    case INPUT_SELECT_SIZE.SMALL:
      return 'compact';
    case INPUT_SELECT_SIZE.LARGE:
      return 'large';
    default:
      return '';
    }
  }

  getFilterBy(): string {
    return this.filterBy || this.optionLabel;
  }
}
