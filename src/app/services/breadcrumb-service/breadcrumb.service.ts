import { Injectable } from '@angular/core';
import { MenuItem } from 'primeng/api/menuitem';
import { Subject, Observable } from 'rxjs';

/**
 * Set and update breadcrumb menu
 */
@Injectable({
  providedIn: 'root'
})
export class BreadcrumbService {
  private crumbs: Subject<MenuItem[]>;
  crumbs$: Observable<MenuItem[]>;

  constructor() {
    this.crumbs = new Subject<MenuItem[]>();
    this.crumbs$ = this.crumbs.asObservable();
  }

  /**
   * Update breadcrumb menu
   * @param items items for the breadcrumb menu
   */
  setCrumbs(items: MenuItem[]) {
    this.crumbs.next(
      (items || []).map(item =>
          Object.assign({}, item, {
            routerLinkActiveOptions: { exact: true }
          })
        )
    );
  }
}