import { Component, OnInit } from '@angular/core';
import { AccountService } from 'src/app/services/account-service/account.service';
import { ActivatedRoute } from '@angular/router';
import { PublicInformationService } from 'src/app/services/public-information-service/public-information.service';
import { InvestorAccountComponent } from 'src/app/components/investor-account/investor-account.component';
@Component({
  selector: 'app-investor',
  templateUrl: './investor.component.html',
  styleUrls: ['./investor.component.scss']
})
export class InvestorComponent implements OnInit {

  constructor(private accountService : AccountService,
    private route : ActivatedRoute,
    private publicInformation: PublicInformationService) { }
  investor: any;
  id: number;
  private sub: any;

  ngOnInit(): void {
    this.publicInformation.hasLoaded.subscribe(loaded => {
      if(loaded) {
        if(!this.investor) {
          this.loadInvestor();
          this.populateNames
        } else {
          this.populateNames();
        }
      } else {
        this.loadInvestor();
      }
    })
  }

  populateNames() {
        this.investor.country = this.publicInformation.getCountry(this.investor.countryId).name;
        this.investor.investorType = this.publicInformation.getInvestorType(this.investor.investorTypeId).name;
        this.investor.ticketMin = this.publicInformation.getTicketSize(this.investor.ticketMinId).name;
        this.investor.ticketMax = this.publicInformation.getTicketSize(this.investor.ticketMaxId).name;

        let ids = this.investor.investmentPhases;
        this.investor.investmentPhaseNames = [];
        for(let invId in ids) {
          let id = ids[invId];
          this.investor.investmentPhaseNames.push(this.publicInformation.getInvestmentPhase(id).name);
        }

        ids = this.investor.support;
        this.investor.supportNames = [];
        for(let invId in ids) {
          let id = ids[invId];
          this.investor.supportNames.push(this.publicInformation.getSupport(id).name);
        }

        ids = this.investor.continents;
        this.investor.continentNames = [];
        for(let invId in ids) {
          let id = ids[invId];
          this.investor.continentNames.push(this.publicInformation.getContinent(id).name);
        }

        ids = this.investor.industries;
        this.investor.industryNames = [];
        for(let invId in ids) {
          let id = ids[invId];
          this.investor.industryNames.push(this.publicInformation.getIndustry(id).name);
        }

        ids = this.investor.countries;
        this.investor.countryNames = [];
        for(let invId in ids) {
          let id = ids[invId];
          this.investor.countryNames.push(this.publicInformation.getCountry(id).name);
        }
  }

  loadInvestor() {
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id'];
      this.accountService.getInvestor(this.id).subscribe(data => {
        this.investor = data;

        console.log(this.investor);
      })
   });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
