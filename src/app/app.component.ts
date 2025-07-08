import { Component, inject } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './layouts/footer/footer.component';
import { NavComponent } from "./layouts/nav/nav.component";
import { SalesPersonData } from './layouts/nav/class/navbarResponse';
import { ModalService } from './Services/modal/modal.service';
import { Title } from '@angular/platform-browser';
import { filter } from 'rxjs';
import { SalesContactComponent } from "./components/sales-contact/sales-contact.component";
import { ModalComponent } from "./components/modal/modal.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FooterComponent, NavComponent, SalesContactComponent, ModalComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'recruiter-registration';
  modalService = inject(ModalService);
  salesPersonData: SalesPersonData | null = null;

  constructor(private router: Router, private titleService: Title) {}

  ngOnInit(): void {
  

    //local env
    // if (isDevMode()) {
    //   window.localStorage.setItem('CompanyId', 'ZxU0PRC=');
    //   window.localStorage.setItem('UserId', 'ZRd9PxCu');
    // }
  }

  onNavbarDataLoaded(data: SalesPersonData) {
    this.salesPersonData = data;
  }

}
