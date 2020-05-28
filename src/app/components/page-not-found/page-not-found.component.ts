import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth-service/auth.service';
import { Router } from '@angular/router';

/**
 * Displays a 404 Error
 */
@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss']
})
export class PageNotFoundComponent implements OnInit {

  /**
   * Decide whether or not the user should see the standard 404 or the logged in 404 version
   * @param authService reference to authService
   * @param router instance of Router
   */
  constructor(private authService: AuthService,
    private router: Router) { 
    if(authService.isLoggedIn() && router.url !== '/admin/404')
      router.navigate(["/admin/404"]);
  }

  ngOnInit(): void {
  }

}
