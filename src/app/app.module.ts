import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import '@angular/compiler';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginComponent } from './pages/login/login.component';
import { AuthService } from './services/auth-service/auth.service';
import { Router } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'; 
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {
  AppAsideModule,
  AppBreadcrumbModule,
  AppHeaderModule,
  AppFooterModule,
  AppSidebarModule,
} from '@coreui/angular';
import { AdminComponent } from './admin/admin.component';
import { HeaderComponent } from './header/header.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { AuthHttpInterceptor } from './authHttpInterceptor';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SidenavComponent } from './sidenav/sidenav.component';
import { AccountsComponent } from './pages/accounts/accounts.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AccountComponent } from './pages/account/account.component';
import {MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import { ConfirmationDialogComponent } from './shared/confirmation-dialog/confirmation-dialog.component';
import { InvestorComponent } from './pages/investor/investor.component';
import { StartupComponent } from './pages/startup/startup.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {BreadcrumbModule} from 'primeng/breadcrumb';
import {TableModule} from 'primeng/table';
import {DialogModule} from 'primeng/dialog';
import {ButtonModule} from 'primeng/button';
import {ChartModule } from 'primeng/chart';
import {InputSwitchModule} from 'primeng/inputswitch';
import { InvestorAccountComponent } from './components/investor-account/investor-account.component';
import { StartupAccountComponent } from './components/startup-account/startup-account.component';
import { CardModule } from 'node_modules/primeng/card';
import {InputTextareaModule} from 'primeng/inputtextarea';
import { PickerComponent } from './components/picker/picker.component';
import {ToastModule} from 'primeng/toast';
import {MessageModule} from 'primeng/message';
import {MessagesModule} from 'primeng/messages';
import {CodeHighlighterModule} from 'primeng/codehighlighter';
import {DataViewModule} from 'primeng/dataview';
import {SliderModule} from 'primeng/slider';
import {CalendarModule} from 'primeng/calendar';
import { AccountDetailsComponent } from './components/account-details/account-details.component';
import { MatchesComponent } from './pages/matches/matches.component';
import { PublicComponent } from './pages/public/public.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    LoginComponent,
    AdminComponent,
    HeaderComponent,
    SidenavComponent,
    AccountsComponent,
    PageNotFoundComponent,
    AccountComponent,
    ConfirmationDialogComponent,
    InvestorComponent,
    StartupComponent,
    InvestorAccountComponent,
    StartupAccountComponent,
    PickerComponent,
    AccountDetailsComponent,
    MatchesComponent,
    PublicComponent,
  ],
  imports: [
    NgbModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatIconModule,
    FontAwesomeModule,
    MatButtonModule,
    MatDialogModule,
    BrowserAnimationsModule,
    MatSlideToggleModule,
    BreadcrumbModule,
    TableModule,
    DialogModule,
    ButtonModule,
    ChartModule,
    InputSwitchModule,
    CardModule,
    InputTextareaModule,
    ToastModule,
    MessageModule,
    MessagesModule,
    CodeHighlighterModule,
    DataViewModule,
    SliderModule,
    CalendarModule
  ],
  providers: [
    {
      provide:HTTP_INTERCEPTORS,
      useClass:AuthHttpInterceptor,
      multi:true
    }
  ],
  bootstrap: [AppComponent],
  entryComponents:[ConfirmationDialogComponent]
})
export class AppModule {
 }
