import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Exported type for template usage
export type CalendarDay = { day: number | null, type: 'current' | 'next' | 'prev' };

@Component({
  selector: 'app-date-range-picker-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
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

  months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  years: number[] = [];

  ngOnInit() {
    document.body.classList.add('overflow-hidden');
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
    this.years = [];
    for (let y = 1900; y <= 2100; y++) {
      this.years.push(y);
    }
  }

  public get leftMonthDays() {
    return this.generateCalendarDays(this.displayYearLeft, this.displayMonthLeft);
  }
  public get rightMonthDays() {
    return this.generateCalendarDays(this.displayYearRight, this.displayMonthRight);
  }

  public get startDateString() {
    return this.startDate ? this.formatDate(this.startDate) : '';
  }
  public get endDateString() {
    return this.endDate ? this.formatDate(this.endDate) : '';
  }

  generateCalendarDays(year: number, month: number): CalendarDay[] {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days: CalendarDay[] = [];
    let startOffset = (firstDay.getDay() + 6) % 7;
    for (let i = 0; i < startOffset; i++) days.push({ day: null, type: 'prev' });
    for (let d = 1; d <= lastDay.getDate(); d++) days.push({ day: d, type: 'current' });
    let nextDay = 1;
    while (days.length < 42) {
      days.push({ day: nextDay++, type: 'next' });
    }
    return days;
  }

  public selectDate(dayObj: CalendarDay, which: 'left' | 'right') {
    if (!dayObj.day || dayObj.type !== 'current') return;
    const year = which === 'left' ? this.displayYearLeft : this.displayYearRight;
    const month = which === 'left' ? this.displayMonthLeft : this.displayMonthRight;
    const date = new Date(year, month, dayObj.day);
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

  public isSelected(dayObj: CalendarDay, which: 'left' | 'right') {
    if (!dayObj.day || dayObj.type !== 'current') return false;
    const year = which === 'left' ? this.displayYearLeft : this.displayYearRight;
    const month = which === 'left' ? this.displayMonthLeft : this.displayMonthRight;
    const date = new Date(year, month, dayObj.day);
    return (
      (this.startDate && this.datesEqual(date, this.startDate)) ||
      (this.endDate && this.datesEqual(date, this.endDate))
    );
  }

  public isInRange(dayObj: CalendarDay, which: 'left' | 'right') {
    if (!dayObj.day || dayObj.type !== 'current' || !this.startDate || !this.endDate) return false;
    const year = which === 'left' ? this.displayYearLeft : this.displayYearRight;
    const month = which === 'left' ? this.displayMonthLeft : this.displayMonthRight;
    const date = new Date(year, month, dayObj.day);
    return date > this.startDate && date < this.endDate;
  }

  public isToday(dayObj: CalendarDay, which: 'left' | 'right') {
    if (!dayObj.day || dayObj.type !== 'current') return false;
    const year = which === 'left' ? this.displayYearLeft : this.displayYearRight;
    const month = which === 'left' ? this.displayMonthLeft : this.displayMonthRight;
    const today = new Date();
    return (
      dayObj.day === today.getDate() &&
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

  public prevMonthLeft() {
    if (this.displayMonthLeft === 0) {
      this.displayMonthLeft = 11;
      this.displayYearLeft--;
    } else {
      this.displayMonthLeft--;
    }
  }

  public nextMonthLeft() {
    if (this.displayMonthLeft === 11) {
      this.displayMonthLeft = 0;
      this.displayYearLeft++;
    } else {
      this.displayMonthLeft++;
    }
  }

  public prevMonthRight() {
    if (this.displayMonthRight === 0) {
      this.displayMonthRight = 11;
      this.displayYearRight--;
    } else {
      this.displayMonthRight--;
    }
  }

  public nextMonthRight() {
    if (this.displayMonthRight === 11) {
      this.displayMonthRight = 0;
      this.displayYearRight++;
    } else {
      this.displayMonthRight++;
    }
  }

  public getMonthName(month: number) {
    return [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ][month];
  }

  onMonthChange(which: 'left' | 'right', value: number) {
    if (which === 'left') {
      this.displayMonthLeft = +value;
    } else {
      this.displayMonthRight = +value;
    }
  }

  onYearChange(which: 'left' | 'right', value: number) {
    if (which === 'left') {
      this.displayYearLeft = +value;
    } else {
      this.displayYearRight = +value;
    }
  }

  public onCancel() {
    document.body.classList.remove('overflow-hidden');
    this.cancel.emit();
  }

  public onApply() {
    document.body.classList.remove('overflow-hidden');
    this.apply.emit({ start: this.startDate, end: this.endDate });
  }
} 