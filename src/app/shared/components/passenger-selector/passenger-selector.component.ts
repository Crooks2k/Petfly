import { Component, forwardRef, HostListener, Input, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { OverlayPanel } from 'primeng/overlaypanel';

export interface PassengerSelection {
  adults: number;
  children: number;
  childrenAges: number[];
  travelClass: 'economy' | 'business';
}

@Component({
  selector: 'petfly-passenger-selector',
  templateUrl: './passenger-selector.component.html',
  styleUrl: './passenger-selector.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PassengerSelectorComponent),
      multi: true,
    },
  ],
})
export class PassengerSelectorComponent implements ControlValueAccessor, AfterViewInit {
  @Input() placeholder = '';
  @Input() adultsLabel = '';
  @Input() adultsSubLabel = '';
  @Input() childrenLabel = '';
  @Input() childrenSubLabel = '';
  @Input() classLabel = '';
  @Input() economyLabel = '';
  @Input() businessLabel = '';
  @Input() passengerLabel = '';
  @Input() passengersLabel = '';
  @Input() cancelLabel = '';
  @Input() saveLabel = '';
  @Input() childAgeLabel = 'Edad niño';

  @ViewChild('overlayPanel') overlayPanel!: OverlayPanel;

  public value: PassengerSelection = {
    adults: 1,
    children: 0,
    childrenAges: [],
    travelClass: 'economy',
  };

  public tempValue: PassengerSelection = { ...this.value };
  public ageOptions = Array.from({ length: 18 }, (_, i) => ({ label: `${i}`, value: i }));
  public disabled = false;
  public isMobile = false;
  public showMobileDialog = false;

  private onChange: (value: PassengerSelection) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(private cdr: ChangeDetectorRef) {
    this.checkIfMobile();
  }

  ngAfterViewInit(): void {
    // Emitir cambios cuando el overlay se cierre
    if (this.overlayPanel) {
      this.overlayPanel.onHide.subscribe(() => {
        // Usar setTimeout para evitar ExpressionChangedAfterItHasBeenCheckedError
        setTimeout(() => {
          this.emitChange();
        }, 0);
      });
    }
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
      // No emitir cambio, se emitirá al cerrar el overlay
    }
  }

  public decrementAdults(): void {
    const target = this.isMobile && this.showMobileDialog ? this.tempValue : this.value;
    if (target.adults > 1) {
      target.adults--;
      // No emitir cambio, se emitirá al cerrar el overlay
    }
  }

  public incrementChildren(): void {
    const target = this.isMobile && this.showMobileDialog ? this.tempValue : this.value;
    if (target.children < 9) {
      target.children++;
      target.childrenAges.push(0); // Agregar edad por defecto
      // No emitir cambio, se emitirá al cerrar el overlay
    }
  }

  public decrementChildren(): void {
    const target = this.isMobile && this.showMobileDialog ? this.tempValue : this.value;
    if (target.children > 0) {
      target.children--;
      target.childrenAges.pop(); // Remover última edad
      // No emitir cambio, se emitirá al cerrar el overlay
    }
  }

  public updateChildAge(index: number, age: number): void {
    const target = this.isMobile && this.showMobileDialog ? this.tempValue : this.value;
    target.childrenAges[index] = age;
    
    // Usar detectChanges en lugar de markForCheck para forzar actualización inmediata
    this.cdr.detectChanges();
    
    // No emitir cambio inmediatamente para evitar cerrar el overlay
    // El cambio se emitirá cuando se cierre el overlay o en mobile al guardar
  }

  public selectClass(travelClass: 'economy' | 'business'): void {
    const target = this.isMobile && this.showMobileDialog ? this.tempValue : this.value;
    target.travelClass = travelClass;
    // No emitir cambio, se emitirá al cerrar el overlay
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
      this.value = { 
        ...value,
        childrenAges: value.childrenAges || []
      };
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

  public trackByIndex(index: number): number {
    return index;
  }
}
