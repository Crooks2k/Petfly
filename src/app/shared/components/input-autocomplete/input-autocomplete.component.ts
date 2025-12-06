import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AutoCompleteModule } from 'primeng/autocomplete';

@Component({
  selector: 'petfly-input-autocomplete',
  standalone: true,
  imports: [CommonModule, FormsModule, AutoCompleteModule],
  templateUrl: './input-autocomplete.component.html',
  styleUrl: './input-autocomplete.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputAutocompleteComponent),
      multi: true,
    },
  ],
})
export class InputAutocompleteComponent implements ControlValueAccessor {
  @Input() suggestions: any[] = [];
  @Input() field: string = 'label';
  @Input() placeholder: string = 'Buscar...';
  @Input() disabled: boolean = false;
  @Input() forceSelection: boolean = true;
  @Input() optionValue: string = 'value';
  @Input() minLength: number = 2;
  @Input() delay: number = 300;
  @Input() styleClass: string = '';

  @Output() completeMethod = new EventEmitter<{ query: string }>();
  @Output() selectionChange = new EventEmitter<any>();

  public value: any = null;

  private onChange = (value: any) => {};
  private onTouched = () => {};

  writeValue(value: any): void {
    // Si el valor es un string (código), buscar el objeto completo en suggestions
    if (value && typeof value === 'string' && this.suggestions.length > 0) {
      const found = this.suggestions.find(item => 
        item && typeof item === 'object' && item[this.optionValue] === value
      );
      this.value = found || null;
    } else if (value && typeof value === 'object') {
      this.value = value;
    } else {
      this.value = null;
    }
  }

  registerOnChange(fn: (value: any) => void): void {
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

  onSelect(event: any): void {
    // Extraer el valor para el formulario
    const selectedValue = event && typeof event === 'object' && this.optionValue 
      ? event[this.optionValue] 
      : event;
    
    this.onChange(selectedValue);
    this.onTouched();
    this.selectionChange.emit(event);
  }
}
