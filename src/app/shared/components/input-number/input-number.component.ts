import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
  selector: 'petfly-input-number',
  standalone: true,
  imports: [CommonModule, FormsModule, InputNumberModule],
  templateUrl: './input-number.component.html',
  styleUrl: './input-number.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputNumberComponent),
      multi: true
    }
  ]
})
export class InputNumberComponent implements ControlValueAccessor {
  @Input() format: boolean = true;
  @Input() showButtons: boolean = false;
  @Input() buttonLayout: string = 'stacked';
  @Input() incrementButtonClass: string = '';
  @Input() decrementButtonClass: string = '';
  @Input() incrementButtonIcon: string = 'pi pi-angle-up';
  @Input() decrementButtonIcon: string = 'pi pi-angle-down';
  @Input() locale: string = 'es-ES';
  @Input() localeMatcher: string = 'best fit';
  @Input() mode: string = 'decimal';
  @Input() currency: string = 'EUR';
  @Input() currencyDisplay: string = 'symbol';
  @Input() useGrouping: boolean = true;
  @Input() minFractionDigits: number | undefined = undefined;
  @Input() maxFractionDigits: number | undefined = undefined;
  @Input() min: number | undefined = undefined;
  @Input() max: number | undefined = undefined;
  @Input() step: number = 1;
  @Input() allowEmpty: boolean = true;
  @Input() placeholder: string = '';
  @Input() disabled: boolean = false;
  @Input() readonly: boolean = false;
  @Input() size: number | undefined = undefined;
  @Input() maxlength: number | null = null;
  @Input() tabindex: number | undefined = undefined;
  @Input() title: string = '';
  @Input() ariaLabel: string = '';
  @Input() ariaRequired: boolean = false;
  @Input() name: string = '';
  @Input() autocomplete: string = '';
  @Input() inputId: string = '';
  @Input() styleClass: string = '';
  @Input() style: any = null;
  @Input() inputStyle: any = null;
  @Input() inputStyleClass: string = '';
  @Input() suffix: string = '';
  @Input() prefix: string = '';

  @Output() valueChange = new EventEmitter<number | null>();
  @Output() onInput = new EventEmitter<any>();
  @Output() onFocus = new EventEmitter<Event>();
  @Output() onBlur = new EventEmitter<Event>();
  @Output() onKeyDown = new EventEmitter<KeyboardEvent>();

  value: number | null = null;

  // ControlValueAccessor implementation
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

  onValueChange(event: any): void {
    this.value = event.value;
    this.onChange(this.value);
    this.valueChange.emit(this.value);
  }

  onInputEvent(event: any): void {
    this.onInput.emit(event);
  }

  onFocusEvent(event: Event): void {
    this.onFocus.emit(event);
  }

  onBlurEvent(event: Event): void {
    this.onTouched();
    this.onBlur.emit(event);
  }

  onKeyDownEvent(event: KeyboardEvent): void {
    this.onKeyDown.emit(event);
  }
}