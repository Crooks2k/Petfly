import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';

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
export class InputSelectComponent implements ControlValueAccessor {
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

  private onChange = (value: unknown) => {};
  private onTouched = () => {};

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
