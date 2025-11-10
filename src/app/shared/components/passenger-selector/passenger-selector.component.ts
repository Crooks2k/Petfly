import { Component, forwardRef, HostListener, Input, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { OverlayPanel } from 'primeng/overlaypanel';

export interface PassengerSelection {
  adults: number;
  children: number;
  travelClass: 'economy' | 'business';
}

@Component({
  selector: 'petfly-passenger-selector',
  templateUrl: './passenger-selector.component.html',
  styleUrls: ['./passenger-selector.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PassengerSelectorComponent),
      multi: true,
    },
  ],
})
export class PassengerSelectorComponent implements ControlValueAccessor {
  @Input() placeholder = 'Seleccionar pasajeros';
  @Input() adultsLabel = 'Adultos';
  @Input() adultsSubLabel = '18 años o más';
  @Input() childrenLabel = 'Niños';
  @Input() childrenSubLabel = '0 a 17 años';
  @Input() classLabel = 'Clase';
  @Input() economyLabel = 'Económica';
  @Input() businessLabel = 'Negocios';
  @Input() passengerLabel = 'Pasajero';
  @Input() passengersLabel = 'Pasajeros';
  @Input() cancelLabel = 'Cancelar';
  @Input() saveLabel = 'Guardar';

  @ViewChild('overlayPanel') overlayPanel!: OverlayPanel;

  public value: PassengerSelection = {
    adults: 1,
    children: 0,
    travelClass: 'economy',
  };

  public tempValue: PassengerSelection = { ...this.value };
  public disabled = false;
  public isMobile = false;
  public showMobileDialog = false;

  private onChange: (value: PassengerSelection) => void = () => {};
  private onTouched: () => void = () => {};

  constructor() {
    this.checkIfMobile();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.checkIfMobile();
  }

  private checkIfMobile(): void {
    this.isMobile = window.innerWidth < 768;
  }

  public get displayLabel(): string {
    const total = this.value.adults + this.value.children;
    const passengerText = total === 1 ? this.passengerLabel : this.passengersLabel;
    const classText = this.value.travelClass === 'economy' ? this.economyLabel : this.businessLabel;
    return `${total} ${passengerText}, ${classText}`;
  }

  public toggleOverlay(event: Event): void {
    if (!this.disabled) {
      if (this.isMobile) {
        this.tempValue = { ...this.value };
        this.showMobileDialog = true;
      } else {
        this.overlayPanel.toggle(event);
      }
      this.onTouched();
    }
  }

  public closeMobileDialog(): void {
    this.showMobileDialog = false;
  }

  public saveMobileSelection(): void {
    this.value = { ...this.tempValue };
    this.emitChange();
    this.showMobileDialog = false;
  }

  public incrementAdults(): void {
    const target = this.isMobile && this.showMobileDialog ? this.tempValue : this.value;
    if (target.adults < 9) {
      target.adults++;
      if (!this.isMobile || !this.showMobileDialog) {
        this.emitChange();
      }
    }
  }

  public decrementAdults(): void {
    const target = this.isMobile && this.showMobileDialog ? this.tempValue : this.value;
    if (target.adults > 1) {
      target.adults--;
      if (!this.isMobile || !this.showMobileDialog) {
        this.emitChange();
      }
    }
  }

  public incrementChildren(): void {
    const target = this.isMobile && this.showMobileDialog ? this.tempValue : this.value;
    if (target.children < 9) {
      target.children++;
      if (!this.isMobile || !this.showMobileDialog) {
        this.emitChange();
      }
    }
  }

  public decrementChildren(): void {
    const target = this.isMobile && this.showMobileDialog ? this.tempValue : this.value;
    if (target.children > 0) {
      target.children--;
      if (!this.isMobile || !this.showMobileDialog) {
        this.emitChange();
      }
    }
  }

  public selectClass(travelClass: 'economy' | 'business'): void {
    const target = this.isMobile && this.showMobileDialog ? this.tempValue : this.value;
    target.travelClass = travelClass;
    if (!this.isMobile || !this.showMobileDialog) {
      this.emitChange();
    }
  }

  public get currentValue(): PassengerSelection {
    return this.isMobile && this.showMobileDialog ? this.tempValue : this.value;
  }

  private emitChange(): void {
    this.onChange(this.value);
  }

  // ControlValueAccessor implementation
  public writeValue(value: PassengerSelection): void {
    if (value) {
      this.value = { ...value };
    }
  }

  public registerOnChange(fn: (value: PassengerSelection) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
