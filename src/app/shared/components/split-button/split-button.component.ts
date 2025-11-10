import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SplitButtonModule } from 'primeng/splitbutton';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'petfly-split-button',
  standalone: true,
  imports: [CommonModule, SplitButtonModule],
  templateUrl: './split-button.component.html',
  styleUrl: './split-button.component.scss'
})
export class SplitButtonComponent {
  @Input() label: string = '';
  @Input() icon: string = '';
  @Input() model: MenuItem[] = [];
  @Input() disabled: boolean = false;
  @Input() style: any = null;
  @Input() styleClass: string = '';
  @Input() menuStyle: any = null;
  @Input() menuStyleClass: string = '';
  @Input() tabindex: number = 0;
  @Input() severity: 'success' | 'info' | 'warning' | 'danger' | 'help' | 'primary' | 'secondary' | 'contrast' | null = null;
  @Input() raised: boolean = false;
  @Input() rounded: boolean = false;
  @Input() text: boolean = false;
  @Input() outlined: boolean = false;
  @Input() size: 'small' | 'large' | null = null;
  @Input() plain: boolean = false;
  @Input() appendTo: any = null;
  @Input() dir: string = 'ltr';
  @Input() expandAriaLabel: string = 'Mostrar más opciones';
  @Input() showTransitionOptions: string = '.12s cubic-bezier(0, 0, 0.2, 1)';
  @Input() hideTransitionOptions: string = '.1s linear';

  @Output() onClick = new EventEmitter<Event>();
  @Output() onDropdownClick = new EventEmitter<Event>();

  onButtonClick(event: Event): void {
    this.onClick.emit(event);
  }

  onDropdownButtonClick(event: Event): void {
    this.onDropdownClick.emit(event);
  }
}