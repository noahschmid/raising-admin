import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from '../services/auth-service/auth.service';
import { AccountService } from '../services/account-service/account.service';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faPowerOff } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { EndpointService } from '../services/endpoint-service/endpoint.service';
import { PublicInformationService } from '../services/public-information-service/public-information.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @ViewChild('profile') profile: ElementRef;

  constructor(private authService: AuthService,
    private accountService : AccountService,
    public endpointService: EndpointService,
    private router : Router,
    private publicInformationService: PublicInformationService) { 
    }
  toggle = false;
  username = "";
  powerOffIcon = faPowerOff;
  userIcon = faUser;
  profilePictureId;
  pictureLink = "";
  accountId;

  prodMode = true;

  ngOnInit(): void {
    this.prodMode = !this.endpointService.isInDevMode();
      this.endpointService.observeDevMode.subscribe(data => {
        console.log(data);
      this.prodMode = !data;
      this.getAccount();
    });

    this.getAccount();

    this.publicInformationService.hasLoaded.subscribe(data => {
      console.log("hasloaded: " + data);
    });
  }

  getAccount() {
    this.accountService.getAccount(this.authService.getId()).subscribe(data => {
      this.username = (data as any).firstName;
      this.profilePictureId = (data as any).profilePictureId;
      this.pictureLink = this.endpointService.getUrl() + "media/profilepicture/" + this.profilePictureId;
      this.accountId = (data as any).accountId;
    },
    err => {
      console.log(err);
    });
  }

  toggleProfile() {
    this.toggle = !this.toggle;
  }

  profileOff() {
    this.toggle = false;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['login']);
  }

  toggleServerMode() {
    this.endpointService.setDevMode(!this.prodMode);
  }

}
