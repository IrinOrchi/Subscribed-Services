import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ServiceHistoryResponse } from '../../Models/SubscribedService/subscribed';
import { LocalstorageService } from '../shared/essentials/localstorage.service';

@Injectable({
  providedIn: 'root'
})
export class SubscribedServiceService {
  private apiUrl = 'https://api.bdjobs.com/employeer-subscribservices/api/ServiceHistory/GetServiceHistory';

  constructor(
    private http: HttpClient,
    private localStorageService: LocalstorageService
  ) { }

  getServiceHistory(startDate?: string, endDate?: string, v_type?: number): Observable<ServiceHistoryResponse> {
    const companyId = this.localStorageService.getItem('CompanyId');
    if (!companyId) {
      return throwError(() => new Error('Company ID not found in localStorage'));
    }
    
    let url = `${this.apiUrl}?companyId=${companyId}`;
    
    url += `&startDate=${startDate || ''}`;
    url += `&endDate=${endDate || ''}`;
    url += `&v_type=${v_type !== undefined && v_type !== null ? v_type : ''}`;
    
    return this.http.get<ServiceHistoryResponse>(url);
  } 
}
