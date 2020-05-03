import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth-service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss']
})
export class PageNotFoundComponent implements OnInit {

  constructor(private authService: AuthService,
    private router: Router) { 
    if(authService.isLoggedIn() && router.url !== '/admin/404')
      router.navigate(["/admin/404"]);
  }

  ngOnInit(): void {
  }

}
