import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-date-range-picker-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './date-range-picker-modal.component.html',
  // styleUrls: ['./date-range-picker-modal.component.scss']
})
export class DateRangePickerModalComponent {
  @Input() initialStartDate: Date | null = null;
  @Input() initialEndDate: Date | null = null;
  @Output() apply = new EventEmitter<{ start: Date | null, end: Date | null }>();
  @Output() cancel = new EventEmitter<void>();

  displayYearLeft: number = 0;
  displayMonthLeft: number = 0;
  displayYearRight: number = 0;
  displayMonthRight: number = 0;

  startDate: Date | null = null;
  endDate: Date | null = null;

  ngOnInit() {
    const now = new Date();
    this.displayYearLeft = now.getFullYear();
    this.displayMonthLeft = now.getMonth();
    if (now.getMonth() === 11) {
      this.displayYearRight = now.getFullYear() + 1;
      this.displayMonthRight = 0;
    } else {
      this.displayYearRight = now.getFullYear();
      this.displayMonthRight = now.getMonth() + 1;
    }
    this.startDate = this.initialStartDate;
    this.endDate = this.initialEndDate;
  }

  get leftMonthDays() {
    return this.generateCalendarDays(this.displayYearLeft, this.displayMonthLeft);
  }
  get rightMonthDays() {
    return this.generateCalendarDays(this.displayYearRight, this.displayMonthRight);
  }

  get startDateString() {
    return this.startDate ? this.formatDate(this.startDate) : '';
  }
  get endDateString() {
    return this.endDate ? this.formatDate(this.endDate) : '';
  }

  generateCalendarDays(year: number, month: number): (number | null)[] {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days: (number | null)[] = [];
    let startOffset = (firstDay.getDay() + 6) % 7;
    for (let i = 0; i < startOffset; i++) days.push(null);
    for (let d = 1; d <= lastDay.getDate(); d++) days.push(d);
    while (days.length % 7 !== 0) days.push(null);
    return days;
  }

  selectDate(day: number | null, which: 'left' | 'right') {
    if (!day) return;
    const year = which === 'left' ? this.displayYearLeft : this.displayYearRight;
    const month = which === 'left' ? this.displayMonthLeft : this.displayMonthRight;
    const date = new Date(year, month, day);
    if (!this.startDate || (this.startDate && this.endDate)) {
      this.startDate = date;
      this.endDate = null;
    } else if (date < this.startDate) {
      this.startDate = date;
      this.endDate = null;
    } else {
      this.endDate = date;
    }
  }

  isSelected(day: number | null, which: 'left' | 'right') {
    if (!day) return false;
    const year = which === 'left' ? this.displayYearLeft : this.displayYearRight;
    const month = which === 'left' ? this.displayMonthLeft : this.displayMonthRight;
    const date = new Date(year, month, day);
    return (
      (this.startDate && this.datesEqual(date, this.startDate)) ||
      (this.endDate && this.datesEqual(date, this.endDate))
    );
  }

  isInRange(day: number | null, which: 'left' | 'right') {
    if (!day || !this.startDate || !this.endDate) return false;
    const year = which === 'left' ? this.displayYearLeft : this.displayYearRight;
    const month = which === 'left' ? this.displayMonthLeft : this.displayMonthRight;
    const date = new Date(year, month, day);
    return date > this.startDate && date < this.endDate;
  }

  isToday(day: number | null, which: 'left' | 'right') {
    if (!day) return false;
    const year = which === 'left' ? this.displayYearLeft : this.displayYearRight;
    const month = which === 'left' ? this.displayMonthLeft : this.displayMonthRight;
    const today = new Date();
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  }

  datesEqual(a: Date, b: Date) {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  }

  formatDate(date: Date) {
    const y = date.getFullYear();
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    const d = date.getDate().toString().padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  prevMonth() {
    if (this.displayMonthLeft === 0) {
      this.displayMonthLeft = 11;
      this.displayYearLeft--;
    } else {
      this.displayMonthLeft--;
    }
    if (this.displayMonthLeft === 11) {
      this.displayMonthRight = 0;
      this.displayYearRight = this.displayYearLeft + 1;
    } else {
      this.displayMonthRight = this.displayMonthLeft + 1;
      this.displayYearRight = this.displayYearLeft;
    }
  }

  nextMonth() {
    if (this.displayMonthRight === 11) {
      this.displayMonthRight = 0;
      this.displayYearRight++;
    } else {
      this.displayMonthRight++;
    }
    if (this.displayMonthRight === 0) {
      this.displayMonthLeft = 11;
      this.displayYearLeft = this.displayYearRight - 1;
    } else {
      this.displayMonthLeft = this.displayMonthRight - 1;
      this.displayYearLeft = this.displayYearRight;
    }
  }

  getMonthName(month: number) {
    return [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ][month];
  }

  onCancel() {
    this.cancel.emit();
  }

  onApply() {
    this.apply.emit({ start: this.startDate, end: this.endDate });
  }
} 