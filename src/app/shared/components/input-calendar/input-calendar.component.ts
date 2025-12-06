import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CalendarModule } from 'primeng/calendar';

@Component({
  selector: 'petfly-input-calendar',
  standalone: true,
  imports: [CommonModule, FormsModule, CalendarModule],
  templateUrl: './input-calendar.component.html',
  styleUrl: './input-calendar.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputCalendarComponent),
      multi: true,
    },
  ],
})
export class InputCalendarComponent implements ControlValueAccessor {
  @Input() placeholder: string = 'Seleccionar fecha...';
  @Input() disabled: boolean = false;
  @Input() readonly: boolean = false;
  @Input() showIcon: boolean = true;
  @Input() iconDisplay: 'button' | 'input' = 'button';
  @Input() showButtonBar: boolean = false;
  @Input() showTime: boolean = false;
  @Input() showSeconds: boolean = false;
  @Input() hourFormat: string = '24';
  @Input() dateFormat: string = 'dd/mm/yy';
  @Input() selectionMode: 'single' | 'multiple' | 'range' = 'single';
  @Input() minDate: Date | null = null;
  @Input() maxDate: Date | null = null;
  @Input() disabledDates: Date[] = [];
  @Input() disabledDays: number[] = [];
  @Input() monthNavigator: boolean = false;
  @Input() yearNavigator: boolean = false;
  @Input() yearRange: string = '';
  @Input() showWeek: boolean = false;
  @Input() styleClass: string = '';
  @Input() inputStyleClass: string = '';
  @Input() panelStyleClass: string = '';
  @Input() appendTo: any = 'body';

  @Output() dateSelect = new EventEmitter<any>();
  @Output() dateChange = new EventEmitter<any>();

  value: Date | Date[] | null = null;

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

  onDateSelect(event: any): void {
    this.value = event;
    this.onChange(this.value);
    this.onTouched();
    this.dateSelect.emit(event);
  }

  onDateChange(event: any): void {
    this.value = event;
    this.onChange(this.value);
    this.dateChange.emit(event);
  }
}
