import { Routes } from '@angular/router';
import { EditAccountPageComponent } from './pages/edit-account-page/edit-account-page.component';
import { SuccessfulAccountComponent } from './pages/successful-account/successful-account.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
    {
        path:"",
        redirectTo: 'EditAccount',
        pathMatch: 'full'
    },
    {
        path:'EditAccount',
        component: EditAccountPageComponent,
        // canActivate: [AuthGuard]
    },
    {
        path: "account-updated-successfully",
        component: SuccessfulAccountComponent,
        // canActivate: [AuthGuard]
    },
   
];