import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { DateRangePickerModalComponent } from '../../components/date-range-picker-modal/date-range-picker-modal.component';
import { SubscribedServiceService } from '../../Services/SubscribedServices/subscribed-service.service';
import { ServiceHistoryData, ServiceItem } from '../../Models/SubscribedService/subscribed';

@Component({
  selector: 'app-subscribed-services',
  imports: [CommonModule, HttpClientModule, DateRangePickerModalComponent],
  standalone: true,
  templateUrl: './subscribed-services.component.html',
  styleUrl: './subscribed-services.component.scss'
})
export class SubscribedServicesComponent implements OnInit {
  showDatePicker = false;
  startDate: Date | null = null;
  endDate: Date | null = null;
  
  // Data properties
  serviceData: ServiceHistoryData | null = null;
  loading = true;
  error: string | null = null;
  
  // Tab management
  activeTab: 'all' | 'cm' | 'job' | 'sms' | 'cv' = 'all';
  
  // Pagination
  currentPage = 1;
  itemsPerPage = 10;

  constructor(private subscribedService: SubscribedServiceService) {}

  ngOnInit() {
    this.loadServiceHistory();
  }

  loadServiceHistory() {
    this.loading = true;
    this.error = null;
    
    this.subscribedService.getServiceHistory().subscribe({
      next: (response) => {
        if (response && response.data) {
          this.serviceData = response.data;
        } else {
          this.error = 'Invalid response format from server';
        }
        this.loading = false;
      },
      error: (error) => {
        this.error = error.message || 'Failed to load service history';
        this.loading = false;
        console.error('Error loading service history:', error);
      }
    });
  }

  // Tab methods
  setActiveTab(tab: 'all' | 'cm' | 'job' | 'sms' | 'cv') {
    this.activeTab = tab;
    this.currentPage = 1; // Reset to first page when changing tabs
  }

  // Get data based on active tab - updated mapping
  getTabData(): ServiceItem[] {
    if (!this.serviceData) return [];
    
    // Since the API returns counts instead of arrays, we return empty array
    // The actual counts are displayed in the tab badges and summary cards
    return [];
  }

  // Get count for tab badges - updated mapping
  getTabCount(tab: 'all' | 'cm' | 'job' | 'sms' | 'cv'): number {
    if (!this.serviceData) return 0;
    
    switch (tab) {
      case 'all':
        return this.serviceData.allPurchase || 0;
      case 'cm':
        return this.serviceData.fullAccess || 0;
      case 'job':
        return this.serviceData.jobAccess || 0;
      case 'sms':
        return this.serviceData.smsAccess || 0;
      case 'cv':
        return this.serviceData.cvAccess || 0;
      default:
        return 0;
    }
  }

  // Pagination methods
  getPaginatedData(): ServiceItem[] {
    const data = this.getTabData();
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return data.slice(startIndex, endIndex);
  }

  getTotalPages(): number {
    const data = this.getTabData();
    return Math.ceil(data.length / this.itemsPerPage);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.getTotalPages()) {
      this.currentPage = page;
    }
  }

  // Generate page numbers for pagination
  getPageNumbers(): (number | string)[] {
    const totalPages = this.getTotalPages();
    const currentPage = this.currentPage;
    const pages: (number | string)[] = [];

    if (totalPages <= 7) {
      // Show all pages if total is 7 or less
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show first page
      pages.push(1);

      if (currentPage > 4) {
        pages.push('...');
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 3) {
        pages.push('...');
      }

      // Show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  }

  // Helper method to safely navigate to page
  navigateToPage(page: number | string) {
    if (typeof page === 'number') {
      this.goToPage(page);
    }
  }

  // Date picker methods
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
    
    // Format dates for API call
    const startDateStr = this.startDate ? this.startDate.toISOString().split('T')[0] : '';
    const endDateStr = this.endDate ? this.endDate.toISOString().split('T')[0] : '';
    
    // Reload data with date filters
    this.loadServiceHistoryWithFilters(startDateStr, endDateStr);
  }

  loadServiceHistoryWithFilters(startDate?: string, endDate?: string) {
    this.loading = true;
    this.error = null;
    
    this.subscribedService.getServiceHistory(startDate, endDate).subscribe({
      next: (response) => {
        if (response && response.data) {
          this.serviceData = response.data;
        } else {
          this.error = 'Invalid response format from server';
        }
        this.loading = false;
        this.currentPage = 1; // Reset to first page when filtering
      },
      error: (error) => {
        this.error = error.message || 'Failed to load service history';
        this.loading = false;
        console.error('Error loading service history:', error);
      }
    });
  }

  clearDateFilters() {
    this.startDate = null;
    this.endDate = null;
    this.loadServiceHistory(); // Reload without date filters
  }
}
