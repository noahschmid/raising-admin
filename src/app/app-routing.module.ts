import {
  NgModule
} from '@angular/core';
import {
  Routes,
  RouterModule
} from '@angular/router';
import {
  DashboardComponent
} from './pages/dashboard/dashboard.component';
import {
  LoginComponent
} from './pages/login/login.component';
import {
  AppComponent
} from './app.component';
import {
  AdminComponent
} from './admin/admin.component';
import {
  AccountsComponent
} from './pages/accounts/accounts.component';

import {
  PageNotFoundComponent
} from './page-not-found/page-not-found.component';
import {
  AccountComponent
} from './pages/account/account.component';
import { StartupComponent } from './pages/startup/startup.component';
import { InvestorComponent } from './pages/investor/investor.component';

const routes: Routes = [{
    path: '',
    redirectTo:'admin/dashboard',
    pathMatch: 'full',
    data: {
      breadcrumb:"Dashboard"
    }
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'admin',
    redirectTo: 'admin/dashboard',
    pathMatch: 'full',
    data: {
      breadcrumb:"Dashboard"
    }
  },
  {
    path: 'admin',
    component: AdminComponent,
    data: {
      breadcrumb:'Home'
    },
    children: [{
        path: 'dashboard',
        component: DashboardComponent,
        data: {
          breadcrumb:'Dashboard'
        }
      },
      {
        path: 'accounts',
        component: AccountsComponent,
        data: {
          breadcrumb:'Accounts'
        }
      },
      {
        path: 'account/:id',
        component: AccountComponent,
        data:{
          breadcrumb:'Account'
        }
      },
      {
        path: 'investor/:id',
        component: InvestorComponent,
        data:{
          breadcrumb:'Investor'
        }
      },
      {
        path: 'startup/:id',
        component: StartupComponent,
        data:{
          breadcrumb:'Startup'
        }
      },
      {
        path: '404',
        component:PageNotFoundComponent
      }
    ]
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
