import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AccountService } from 'src/app/services/account-service/account.service';
import { EndpointService } from 'src/app/services/endpoint-service/endpoint.service';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { AccountDetailsComponent } from 'src/app/components/account-details/account-details.component';
import { PublicInformationService } from 'src/app/services/public-information-service/public-information.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  id: number;
  private sub: any;
  account;

  devToken;
  prodToken;

  constructor(private route: ActivatedRoute,
    public endpointService: EndpointService,
    private accountService : AccountService,
    private authService: AuthService,
    private publicInformation: PublicInformationService) { }

  ngOnInit(): void {
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id'];
      if(this.id == parseInt(this.authService.getId())) {
        this.devToken = this.authService.getDevToken();
        this.prodToken = this.authService.getProdToken();
      }
      this.accountService.getAccount(this.id).subscribe(data => {
        this.account = data;
        this.account.country = this.publicInformation.getCountry(this.account.countryId).name;
      })
   });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
