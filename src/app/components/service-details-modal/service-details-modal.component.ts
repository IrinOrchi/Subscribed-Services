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

  get listings() {
    return [
      {
        name: 'Standard Listing',
        limit: 15,
        used: 10,
        color: ''
      },
      {
        name: 'Premium Listing',
        limit: 15,
        used: 10,
        color: 'border-blue-300 bg-blue-50'
      },
      {
        name: 'Premium Plus',
        limit: 15,
        used: 10,
        color: 'border-yellow-200 bg-yellow-50'
      }
    ];
  }
} 