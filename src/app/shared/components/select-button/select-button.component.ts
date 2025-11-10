import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SelectButtonModule } from 'primeng/selectbutton';

@Component({
  selector: 'petfly-select-button',
  standalone: true,
  imports: [CommonModule, FormsModule, SelectButtonModule],
  templateUrl: './select-button.component.html',
  styleUrl: './select-button.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectButtonComponent),
      multi: true
    }
  ]
})
export class SelectButtonComponent implements ControlValueAccessor {
  @Input() options: unknown[] = [];
  @Input() optionLabel: string = 'label';
  @Input() optionValue: string = 'value';
  @Input() optionDisabled: string = 'disabled';
  @Input() multiple: boolean = false;
  @Input() disabled: boolean = false;
  @Input() dataKey: string = '';
  
  /** @deprecated Use allowDeselect instead */
  @Input() allowEmpty: boolean = true;
  
  /** 
   * Controls whether the user can deselect all options.
   * When false, at least one option must always be selected.
   * Default: true
   */
  @Input() allowDeselect: boolean = true;
  
  @Input() styleClass: string = '';

  @Output() selectionChange = new EventEmitter<any>();

  value: any = null;

  private onChange = (value: any) => {};
  private onTouched = () => {};

  writeValue(value: any): void {
    this.value = value;
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

  onSelectionChange(event: any): void {
    this.value = event.value;
    this.onChange(this.value);
    this.onTouched();
    this.selectionChange.emit(event);
  }

  get canDeselect(): boolean {
    // Priorizar allowDeselect sobre allowEmpty para mejor UX
    // Si allowDeselect se establece explícitamente, usar ese valor
    if (this.allowDeselect !== true) {
      return this.allowDeselect;
    }
    // Fallback a allowEmpty para compatibilidad hacia atrás
    return this.allowEmpty;
  }
}