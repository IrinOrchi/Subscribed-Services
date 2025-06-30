import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-service-details-modal',
  templateUrl: './service-details-modal.component.html',
  styleUrls: ['./service-details-modal.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class ServiceDetailsModalComponent {
  @Input() service: any; 
  @Output() close = new EventEmitter<void>();

  closeModal() {
    this.close.emit();
  }

 
} 