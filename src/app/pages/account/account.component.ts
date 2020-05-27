import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AccountService } from 'src/app/services/account-service/account.service';
import { EndpointService } from 'src/app/services/endpoint-service/endpoint.service';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { AccountDetailsComponent } from 'src/app/components/account-details/account-details.component';
import { PublicInformationService } from 'src/app/services/public-information-service/public-information.service';

/**
 * Get information about a single account
 */
@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  id: number;
  private sub: any;
  account;

  constructor(private route: ActivatedRoute,
    public endpointService: EndpointService,
    private accountService : AccountService,
    private authService: AuthService,
    private publicInformation: PublicInformationService) { }

    /**
     * Get account
     */
  ngOnInit(): void {
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id'];

      this.accountService.getAccount(this.id).subscribe(data => {
        this.account = data;
        this.account.country = this.publicInformation.getCountry(this.account.countryId).name;
      })
   });
  }

  /**
   * Unsubscribe from observable
   */
  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
