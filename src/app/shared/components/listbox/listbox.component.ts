import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ListboxModule } from 'primeng/listbox';

@Component({
  selector: 'petfly-listbox',
  standalone: true,
  imports: [CommonModule, FormsModule, ListboxModule],
  templateUrl: './listbox.component.html',
  styleUrl: './listbox.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ListboxComponent),
      multi: true
    }
  ]
})
export class ListboxComponent implements ControlValueAccessor {
  @Input() options: any[] = [];
  @Input() optionLabel: string = 'label';
  @Input() optionValue: string = 'value';
  @Input() optionGroupLabel: string = 'label';
  @Input() optionGroupChildren: string = 'items';
  @Input() optionDisabled: string = 'disabled';
  @Input() disabled: boolean = false;
  @Input() multiple: boolean = false;
  @Input() checkbox: boolean = false;
  @Input() filter: boolean = false;
  @Input() filterBy: string = '';
  @Input() filterPlaceholder: string = 'Buscar...';
  @Input() filterMatchMode: 'contains' | 'startsWith' | 'endsWith' | 'equals' | 'notEquals' | 'in' | 'lt' | 'lte' | 'gt' | 'gte' = 'contains';
  @Input() filterLocale: string = 'es';
  @Input() emptyMessage: string = 'No hay opciones disponibles';
  @Input() emptyFilterMessage: string = 'No se encontraron resultados';
  @Input() group: boolean = false;
  @Input() listStyle: any = { 'max-height': '250px' };
  @Input() styleClass: string = '';
  @Input() listStyleClass: string = '';
  @Input() metaKeySelection: boolean = false;
  @Input() dataKey: string = '';
  @Input() showToggleAll: boolean = true;

  @Output() selectionChange = new EventEmitter<any>();
  @Output() optionClick = new EventEmitter<any>();
  @Output() optionDblClick = new EventEmitter<any>();

  value: any = null;

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

  onSelectionChange(event: any): void {
    this.value = event.value;
    this.onChange(this.value);
    this.onTouched();
    this.selectionChange.emit(event);
  }

  onOptionClick(event: any): void {
    this.optionClick.emit(event);
  }

  onOptionDblClick(event: any): void {
    this.optionDblClick.emit(event);
  }
}