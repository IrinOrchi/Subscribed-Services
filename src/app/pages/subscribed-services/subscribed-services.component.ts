import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DateRangePickerModalComponent } from '../../components/date-range-picker-modal/date-range-picker-modal.component';

@Component({
  selector: 'app-subscribed-services',
  imports: [CommonModule, DateRangePickerModalComponent],
  standalone: true,
  templateUrl: './subscribed-services.component.html',
  styleUrl: './subscribed-services.component.scss'
})
export class SubscribedServicesComponent {
  showDatePicker = false;
  startDate: Date | null = null;
  endDate: Date | null = null;

  openDatePicker() {
    this.showDatePicker = true;
  }

  closeDatePicker() {
    this.showDatePicker = false;
  }

  onDateRangeApply(event: { start: Date | null, end: Date | null }) {
    this.startDate = event.start;
    this.endDate = event.end;
    this.showDatePicker = false;
  }
}
