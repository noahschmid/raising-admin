import { Component, OnInit } from '@angular/core';
import { AccountService } from 'src/app/services/account-service/account.service';
import { ActivatedRoute } from '@angular/router';
import { StartupAccountComponent } from 'src/app/components/startup-account/startup-account.component';
import { PublicInformationService } from 'src/app/services/public-information-service/public-information.service';

@Component({
  selector: 'app-startup',
  templateUrl: './startup.component.html',
  styleUrls: ['./startup.component.scss']
})
export class StartupComponent implements OnInit {

  constructor(private accountService : AccountService,
    private publicInformationService: PublicInformationService,
    private route : ActivatedRoute) { }
  startup: any;
  id: number;
  private sub: any;

  ngOnInit(): void {
    this.publicInformationService.hasLoaded.subscribe(loaded => {
      if(loaded) {
        if(!this.startup) {
          this.loadStartup();
          this.populateNames
        } else {
          this.populateNames();
        }
      } else {
        this.loadStartup();
      }
    })
  }

  loadStartup() {
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id'];
      this.accountService.getStartup(this.id).subscribe(data => {
        this.startup = data;

        console.log(this.startup);
      })
   });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  populateNames() {
    let ids = [];
    this.startup.country = this.publicInformationService.getCountry(this.startup.countryId).name;
    if(this.startup.type=='Investor') {
      this.startup.investorType = this.publicInformationService.getInvestorType(this.startup.investorTypeId).name;
      ids = this.startup.investmentPhases;
      this.startup.investmentPhaseNames = [];
      for(let invId in ids) {
        let id = ids[invId];
        this.startup.investmentPhaseNames.push(this.publicInformationService.getInvestmentPhase(id).name);
      }
    } else if(this.startup.type=='Startup') {
      this.startup.investmentPhase = this.publicInformationService.getInvestmentPhase(this.startup.investmentPhaseId).name;
      ids = this.startup.investorTypes;
      this.startup.investorTypeNames = [];
      for(let invId in ids) {
        let id = ids[invId];
        this.startup.investorTypeNames.push(this.publicInformationService.getInvestorType(id).name);
      }
    }
    
    this.startup.ticketMin = this.publicInformationService.getTicketSize(this.startup.ticketMinId).name;
    this.startup.ticketMax = this.publicInformationService.getTicketSize(this.startup.ticketMaxId).name;

    ids = this.startup.support;
    this.startup.supportNames = [];
    for(let invId in ids) {
      let id = ids[invId];
      this.startup.supportNames.push(this.publicInformationService.getSupport(id).name);
    }

    ids = this.startup.continents;
    this.startup.continentNames = [];
    for(let invId in ids) {
      let id = ids[invId];
      this.startup.continentNames.push(this.publicInformationService.getContinent(id).name);
    }

    ids = this.startup.industries;
    this.startup.industryNames = [];
    for(let invId in ids) {
      let id = ids[invId];
      this.startup.industryNames.push(this.publicInformationService.getIndustry(id).name);
    }

    ids = this.startup.countries;
    this.startup.countryNames = [];
    for(let invId in ids) {
      let id = ids[invId];
      this.startup.countryNames.push(this.publicInformationService.getCountry(id).name);
    }
}
}
