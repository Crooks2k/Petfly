import {
  Component,
  forwardRef,
  HostListener,
  Input,
  ViewChild,
  AfterViewInit,
  ChangeDetectorRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { OverlayPanel } from 'primeng/overlaypanel';
import { PASSENGER_SELECTOR_CONSTANTS, TRAVEL_CLASS, TravelClass } from '../../constants';
import { PassengerSelectionEntity } from '../../core/entities';

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

  public value: PassengerSelectionEntity = {
    adults: PASSENGER_SELECTOR_CONSTANTS.MIN_ADULTS,
    children: PASSENGER_SELECTOR_CONSTANTS.MIN_CHILDREN,
    childrenAges: [],
    travelClass: TRAVEL_CLASS.ECONOMY,
  };

  public tempValue: PassengerSelectionEntity = { ...this.value };
  public ageOptions = Array.from(
    { length: PASSENGER_SELECTOR_CONSTANTS.MAX_CHILD_AGE + 1 },
    (_, i) => ({ label: `${i}`, value: i })
  );
  public disabled = false;
  public isMobile = false;
  public showMobileDialog = false;

  private onChange: (value: PassengerSelectionEntity) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(private cdr: ChangeDetectorRef) {
    this.checkIfMobile();
  }

  ngAfterViewInit(): void {
    if (this.overlayPanel) {
      this.overlayPanel.onHide.subscribe(() => {
        setTimeout(() => {
          this.emitChange();
        }, PASSENGER_SELECTOR_CONSTANTS.CHANGE_DETECTION_DELAY);
      });
    }
  }

  @HostListener('window:resize')
  onResize(): void {
    this.checkIfMobile();
  }

  private checkIfMobile(): void {
    this.isMobile = window.innerWidth < PASSENGER_SELECTOR_CONSTANTS.MOBILE_BREAKPOINT;
  }

  public get displayLabel(): string {
    const total = this.value.adults + this.value.children;
    const passengerText = total === 1 ? this.passengerLabel : this.passengersLabel;
    const classText =
      this.value.travelClass === TRAVEL_CLASS.ECONOMY ? this.economyLabel : this.businessLabel;
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
    const target = this.getTargetValue();
    if (target.adults < PASSENGER_SELECTOR_CONSTANTS.MAX_ADULTS) {
      target.adults++;
    }
  }

  public decrementAdults(): void {
    const target = this.getTargetValue();
    if (target.adults > PASSENGER_SELECTOR_CONSTANTS.MIN_ADULTS) {
      target.adults--;
    }
  }

  public incrementChildren(): void {
    const target = this.getTargetValue();
    if (target.children < PASSENGER_SELECTOR_CONSTANTS.MAX_CHILDREN) {
      target.children++;
      target.childrenAges.push(PASSENGER_SELECTOR_CONSTANTS.DEFAULT_CHILD_AGE);
    }
  }

  public decrementChildren(): void {
    const target = this.getTargetValue();
    if (target.children > PASSENGER_SELECTOR_CONSTANTS.MIN_CHILDREN) {
      target.children--;
      target.childrenAges.pop();
    }
  }

  public updateChildAge(index: number, age: number): void {
    const target = this.getTargetValue();
    target.childrenAges[index] = age;
    this.cdr.detectChanges();
  }

  public selectClass(travelClass: TravelClass): void {
    const target = this.getTargetValue();
    target.travelClass = travelClass;
  }

  private getTargetValue(): PassengerSelectionEntity {
    return this.isMobile && this.showMobileDialog ? this.tempValue : this.value;
  }

  public get currentValue(): PassengerSelectionEntity {
    return this.getTargetValue();
  }

  private emitChange(): void {
    this.onChange(this.value);
  }

  public writeValue(value: PassengerSelectionEntity): void {
    if (value) {
      this.value = {
        ...value,
        childrenAges: value.childrenAges || [],
      };
    }
  }

  public registerOnChange(fn: (value: PassengerSelectionEntity) => void): void {
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
