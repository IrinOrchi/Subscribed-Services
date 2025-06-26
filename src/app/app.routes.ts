import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { SubscribedServicesComponent } from './pages/subscribed-services/subscribed-services.component';

export const routes: Routes = [
    {
        path:"",
        redirectTo: 'SubscribedServices',
        pathMatch: 'full'
    },
  
    {
        path: "SubscribedServices",
        component: SubscribedServicesComponent,
        // canActivate: [AuthGuard]
    },
   
];