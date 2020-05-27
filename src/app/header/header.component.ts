import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from '../services/auth-service/auth.service';
import { AccountService } from '../services/account-service/account.service';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faPowerOff } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { EndpointService } from '../services/endpoint-service/endpoint.service';
import { PublicInformationService } from '../services/public-information-service/public-information.service';
import { MessageService } from 'primeng/api';

/**
 * This class watches out that all global data is available such as the current endpoint and
 * the public resources as well as the logged in user account.
 */
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  providers:[MessageService]
})
export class HeaderComponent implements OnInit {
  @ViewChild('profile') profile: ElementRef;

  constructor(private authService: AuthService,
    private accountService : AccountService,
    public endpointService: EndpointService,
    private router : Router,
    private publicInformationService: PublicInformationService,
    private messageService: MessageService) { 
    }
  toggle = false;
  username = "";
  powerOffIcon = faPowerOff;
  userIcon = faUser;
  profilePictureId;
  pictureLink = "";
  accountId;

  prodMode = true;

  /**
   * Observe endpoint service and set prodMode accordinly. Also observes the publicInformationService
   * so the resources get loaded from backend
   */
  ngOnInit(): void {
    this.prodMode = !this.endpointService.isInDevMode();
      this.endpointService.observeDevMode.subscribe(data => {
      this.prodMode = !data;
      this.getAccount();
    });

    this.getAccount();

    this.publicInformationService.hasLoaded.subscribe(data => {});
  }

  /**
   * Get account of logged in user
   */
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

  /**
   * Toggle between enabling and disabling the server toggle button
   */
  toggleProfile() {
    this.toggle = !this.toggle;
  }

  /**
   * Disable the server toggle button
   */
  profileOff() {
    this.toggle = false;
  }

  /**
   * Log the current user out
   */
  logout() {
    this.authService.logout();
    this.router.navigate(['login']);
  }

  /**
   * Toggles between dev and prod server mode
   */
  toggleServerMode() {
    this.endpointService.setDevMode(!this.prodMode);
  }

  /**
   * Copies the current access token to the clipboard
   */
  copyToken() {
    if(!this.prodMode)
      this.copyToClipboard(this.authService.getDevToken());
    else
      this.copyToClipboard(this.authService.getProdToken());
  }

  /**
   * Copies a string to the clipboard
   * @param item the string to copy 
   */
  copyToClipboard(item) {
    document.addEventListener('copy', (e: ClipboardEvent) => {
      e.clipboardData.setData('text/plain', (item));
      e.preventDefault();
      document.removeEventListener('copy', null);
    });
    document.execCommand('copy');
    this.messageService.add({severity:'success', summary:'Token copied to clipboard'});
  }
}
