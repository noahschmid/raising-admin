import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import {Router, ActivatedRoute, NavigationEnd} from "@angular/router";
import { AuthService } from '../services/auth-service/auth.service';
import { PublicInformationService } from '../services/public-information-service/public-information.service';
import {MenuItem} from 'primeng/api';
import { isNullOrUndefined } from 'util';
import {filter} from 'rxjs/operators';

/**
 * This class creates and manages the items for the breadcrumb menue
 */


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  constructor(authService: AuthService, 
    public router: Router, 
    public Information : PublicInformationService,
    public activatedRoute : ActivatedRoute) {
    if(!authService.isLoggedIn())
      router.navigate(['login']);
  }

  activePage="dashboard";
  readonly home = {icon: 'pi pi-home', url: '/admin'};
  menuItems: MenuItem[];

  /**
   * Get current route and pass it to createBreadcrumbs
   */
  ngOnInit(): void {
    this.menuItems = [
  { 
    label:"Dashboard"}];
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => this.menuItems = this.createBreadcrumbs(this.activatedRoute.root));
  }

  /**
   * Parse current route and automatically create breadcrumb items
   * @param route the current route
   * @param url the current url
   * @param breadcrumbs the current breadcrumb items
   */
  private createBreadcrumbs(route: ActivatedRoute, url: string = '#', breadcrumbs: MenuItem[] = []): MenuItem[] {
    const children: ActivatedRoute[] = route.children;

    if (children.length === 0) {
      return breadcrumbs;
    }

    for (const child of children) {
      const routeURL: string = child.snapshot.url.map(segment => segment.path).join('/');
      if (routeURL !== '') {
        url += `/${routeURL}`;
      }

      const label = child.snapshot.data["breadcrumb"];
      if (!isNullOrUndefined(label)) {
        breadcrumbs.push({label, url});
      }

      return this.createBreadcrumbs(child, url, breadcrumbs);
    }
  }

}
