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
          this.populateInvestor();
        } else {
          this.populateInvestor();
        }
      } else {
        this.loadInvestor();
        this.publicInformation.loadFromBackend();
      }
    })
  }

  populateInvestor() {
        this.investor.country = this.publicInformation.getCountry(this.investor.countryId).name;
        this.investor.investorType = this.publicInformation.getInvestorType(this.investor.investorTypeId).name;
        this.investor.ticketMin = this.publicInformation.getTicketSize(this.investor.ticketMinId).name;
        this.investor.ticketMax = this.publicInformation.getTicketSize(this.investor.ticketMaxId).name;

        this.investor.ticketRange = [];
        
        this.investor.ticketSizes = this.publicInformation.getTicketSizes();

        console.log(this.investor.ticketSizes);

        for(let i = 0; i < this.investor.ticketSizes.length; ++i) {
          if(this.investor.ticketSizes[i].id == this.investor.ticketMinId) {
            this.investor.ticketRange.push(i);
          }
          if(this.investor.ticketSizes[i].id == this.investor.ticketMaxId) {
            this.investor.ticketRange.push(i);
            break;
          }
        }

        let ids = this.investor.investmentPhases;
        this.investor.investmentPhaseObj = [];
        for(let invId in ids) {
          let id = ids[invId];
          this.investor.investmentPhaseObj.push(this.publicInformation.getInvestmentPhase(id));
        }

        ids = this.investor.support;
        this.investor.supportObj = [];
        for(let invId in ids) {
          let id = ids[invId];
          this.investor.supportObj.push(this.publicInformation.getSupport(id));
        }

        ids = this.investor.continents;
        this.investor.continentObj = [];
        for(let invId in ids) {
          let id = ids[invId];
          this.investor.continentObj.push(this.publicInformation.getContinent(id));
        }

        ids = this.investor.industries;
        this.investor.industryObj = [];
        for(let invId in ids) {
          let id = ids[invId];
          this.investor.industryObj.push(this.publicInformation.getIndustry(id));
        }

        ids = this.investor.countries;
        this.investor.countryObj = [];
        for(let invId in ids) {
          let id = ids[invId];
          this.investor.countryObj.push(this.publicInformation.getCountry(id));
        }
  }

  loadInvestor() {
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id'];
      this.accountService.getInvestor(this.id).subscribe(data => {
        this.investor = data;
      })
   });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
