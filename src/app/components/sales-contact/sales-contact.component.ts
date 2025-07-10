import { Component, Input } from '@angular/core';
import { SalesPersonData } from '../../layouts/nav/class/navbarResponse';


@Component({
  selector: 'app-sales-contact',
  standalone: true,
  imports: [],
  templateUrl: './sales-contact.component.html',
  styleUrl: './sales-contact.component.scss'
})
export class SalesContactComponent {
  @Input() salesPersonData: SalesPersonData | null = null;

  isSalesPersonDataEmpty(): boolean {
    if (!this.salesPersonData) return true;
    
    return !this.salesPersonData.salesPersonName?.trim() &&
           !this.salesPersonData.salesPersonDesignation?.trim() &&
           !this.salesPersonData.salesPersonContact?.trim() &&
           !this.salesPersonData.salesPersonEmail?.trim() &&
           !this.salesPersonData.salesPersonImage?.trim();
  }
}
