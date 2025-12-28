import {
  Component,
  Input,
  Output,
  EventEmitter,
  forwardRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { INPUT_AUTOCOMPLETE_CONSTANTS } from '../../constants';

@Component({
  selector: 'petfly-input-autocomplete',
  standalone: true,
  imports: [CommonModule, FormsModule, AutoCompleteModule],
  templateUrl: './input-autocomplete.component.html',
  styleUrl: './input-autocomplete.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputAutocompleteComponent),
      multi: true,
    },
  ],
})
export class InputAutocompleteComponent implements ControlValueAccessor {
  @Input() suggestions: unknown[] = [];
  @Input() field = INPUT_AUTOCOMPLETE_CONSTANTS.DEFAULT_FIELD;
  @Input() placeholder = 'Buscar...';
  @Input() disabled = false;
  @Input() forceSelection = true;
  @Input() optionValue = INPUT_AUTOCOMPLETE_CONSTANTS.DEFAULT_OPTION_VALUE;
  @Input() minLength = INPUT_AUTOCOMPLETE_CONSTANTS.DEFAULT_MIN_LENGTH;
  @Input() delay = INPUT_AUTOCOMPLETE_CONSTANTS.DEFAULT_DELAY;
  @Input() styleClass = '';

  @Output() completeMethod = new EventEmitter<{ query: string }>();
  @Output() selectionChange = new EventEmitter<unknown>();

  public value: unknown = null;

  private onChange = (value: unknown) => {};
  private onTouched = () => {};

  writeValue(value: unknown): void {
    if (value && typeof value === 'string' && this.suggestions.length > 0) {
      const found = this.suggestions.find(
        item =>
          item &&
          typeof item === 'object' &&
          (item as Record<string, unknown>)[this.optionValue] === value
      );
      this.value = found || null;
    } else if (value && typeof value === 'object') {
      this.value = value;
    } else {
      this.value = null;
    }
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

  onComplete(event: { query: string }): void {
    this.completeMethod.emit(event);
  }

  onSelect(event: unknown): void {
    const selectedValue =
      event && typeof event === 'object' && this.optionValue
        ? (event as Record<string, unknown>)[this.optionValue]
        : event;

    this.onChange(selectedValue);
    this.onTouched();
    this.selectionChange.emit(event);
  }
}
