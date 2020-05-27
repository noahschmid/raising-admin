import {
  Component,
  OnInit
} from '@angular/core';
import {
  AccountService
} from 'src/app/services/account-service/account.service';
import {
  ActivatedRoute
} from '@angular/router';
import {
  StartupAccountComponent
} from 'src/app/components/startup-account/startup-account.component';
import {
  PublicInformationService
} from 'src/app/services/public-information-service/public-information.service';

/**
 * Populate investor account with public resources so the additional information can be displayed
 */
@Component({
  selector: 'app-startup',
  templateUrl: './startup.component.html',
  styleUrls: ['./startup.component.scss']
})
export class StartupComponent implements OnInit {

  constructor(private accountService: AccountService,
    private publicInformationService: PublicInformationService,
    private route: ActivatedRoute) {}
  startup: any;
  id: number;
  private sub: any;

  /**
   * Subscribe to public information service and refresh startup if needed
   */
  ngOnInit(): void {
    this.publicInformationService.hasLoaded.subscribe(loaded => {
      if (loaded) {
        if (!this.startup) {
          this.loadStartup();
          this.populateStartup();
        } else {
          this.populateStartup();
        }
      } else {
        this.publicInformationService.loadFromBackend();
        this.loadStartup();
      }
    })
  }

  /**
   * Load startup from backend
   */
  loadStartup() {
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id'];
      this.accountService.getStartup(this.id).subscribe(data => {
        this.startup = data;
      })
    });
  }

  /**
   * Unsubscribe from observers
   */
  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  /**
   * Populate startup with public resources
   */
  populateStartup() {
    let ids = [];
    this.startup.country = this.publicInformationService.getCountry(this.startup.countryId).name;

    this.startup.investmentPhase = this.publicInformationService.getInvestmentPhase(this.startup.investmentPhaseId).name;
    ids = this.startup.investorTypes;
    this.startup.investorTypeObj = [];
    for (let invId in ids) {
      let id = ids[invId];
      this.startup.investorTypeObj.push(this.publicInformationService.getInvestorType(id));
    }

    this.startup.ticketMin = this.publicInformationService.getTicketSize(this.startup.ticketMinId).name;
    this.startup.ticketMax = this.publicInformationService.getTicketSize(this.startup.ticketMaxId).name;

    this.startup.financeType = this.publicInformationService.getFinanceType(this.startup.financeTypeId).name;

    this.startup.ticketRange = [];

    this.startup.ticketSizes = this.publicInformationService.getTicketSizes();

    for (let i = 0; i < this.startup.ticketSizes.length; ++i) {
      if (this.startup.ticketSizes[i].id == this.startup.ticketMinId) {
        this.startup.ticketRange.push(i);
      }
      if (this.startup.ticketSizes[i].id == this.startup.ticketMaxId) {
        this.startup.ticketRange.push(i);
        break;
      }
    }

    this.startup.revenueMin = this.publicInformationService.getRevenue(this.startup.revenueMinId).name;
    this.startup.revenueMax = this.publicInformationService.getRevenue(this.startup.revenueMaxId).name;
    this.startup.revenueRange = [];

    this.startup.closingTimeDate = new Date(this.startup.closingTime);

    this.startup.revenue = this.publicInformationService.getRevenues();

    for (let i = 0; i < this.startup.revenue.length; ++i) {
      if (this.startup.revenue[i].id == this.startup.revenueMinId) {
        this.startup.revenueRange.push(i);
      }
      if (this.startup.revenue[i].id == this.startup.revenueMaxId) {
        this.startup.revenueRange.push(i);
        break;
      }
    }

    ids = this.startup.support;
    this.startup.supportObj = [];
    for (let invId in ids) {
      let id = ids[invId];
      this.startup.supportObj.push(this.publicInformationService.getSupport(id));
    }

    ids = this.startup.continents;
    this.startup.continentObj = [];
    for (let invId in ids) {
      let id = ids[invId];
      this.startup.continentObj.push(this.publicInformationService.getContinent(id));
    }

    ids = this.startup.industries;
    this.startup.industryObj = [];
    for (let invId in ids) {
      let id = ids[invId];
      this.startup.industryObj.push(this.publicInformationService.getIndustry(id));
    }

    ids = this.startup.countries;
    this.startup.countryObj = [];
    for (let invId in ids) {
      let id = ids[invId];
      this.startup.countryObj.push(this.publicInformationService.getCountry(id));
    }

    ids = this.startup.labels;
    this.startup.labelObj = [];
    for (let invId in ids) {
      let id = ids[invId];
      this.startup.labelObj.push(this.publicInformationService.getLabel(id));
    }
  }
}
