import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth-service/auth.service';
import { EndpointService } from 'src/app/services/endpoint-service/endpoint.service';
import { Observable, from } from 'rxjs';
import { of } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PublicInformationService {
  private ticketSizes = [];
  private investorTypes = [];
  private investmentPhases = [];
  private countries = [];
  private continents = [];
  private industries = [];
  private corporateBodies = [];
  private support = [];

  private loaded = false;

  constructor(private httpClient: HttpClient,
    private EndpointService: EndpointService) { 
  }

  hasLoaded = new Observable(observer => {
    if(this.loaded) {
      observer.next(true);
    } else {
      observer.next(false);

      this.httpClient.get<[]>(this.EndpointService.getUrl() + "public").subscribe(data => {
        this.ticketSizes = (data as any).ticketSizes;
        this.countries = (data as any).countries;
        this.continents = (data as any).continents;
        this.investmentPhases = (data as any).investmentPhases;
        this.investorTypes = (data as any).investorTypes;
        this.corporateBodies = (data as any).corporateBodies;
        this.industries = (data as any).industries;
        this.support = (data as any).support;

        this.loaded = true;
        observer.next(true);
      });
    }

  });

  /**
   * Fetch all public data from server
   */
  loadFromBackend() {
    this.httpClient.get<[]>(this.EndpointService.getUrl() + "public").subscribe(data => {
      this.ticketSizes = (data as any).ticketSizes;
      this.countries = (data as any).countries;
      this.continents = (data as any).continents;
      this.investmentPhases = (data as any).investmentPhases;
      this.investorTypes = (data as any).investorTypes;
      this.corporateBodies = (data as any).corporateBodies;
      this.industries = (data as any).industries;
      this.support = (data as any).support;

      this.loaded = true;
    });
  }

  getCountries() { return this.countries; }
  getContinents() { return this.continents; }
  getTicketSizes() { return this.ticketSizes; }
  getInvestorTypes() { return this.investorTypes; }
  getInvestmentPhases() { return this.investmentPhases; }

  getCountry(id) {
    return this.getCountries().find((country) => {
      return country.id == id;
    });
  }

  getContinent(id) {
    return this.continents.find((continent) => {
      return continent.id == id;
    });
  }

  getInvestorType(id) {
    return this.investorTypes.find((type) => {
      return type.id == id;
    });
  }

  getTicketSize(id) {
    console.log("searching for id " + id);
    let size =  this.ticketSizes.find((ticket) => {
      return ticket.id == id;
    });

    console.log(size);
    return size;
  }

  getInvestmentPhase(id) {
    return this.investmentPhases.find((phase) => {
      return phase.id == id;
    });
  }

  getIndustries(id) {
    return this.industries.find((industry) => {
      return industry.id == id;
    });
  }

  getCorporateBodies(id) {
    return this.corporateBodies.find((body) => {
      return body.id == id;
    });
  }

  getIndustry(id) {
    return this.industries.find((industry) => {
      return industry.id == id;
    });
  }

  getSupport(id) {
    return this.support.find((support) => {
      return support.id == id;
    });
  }
}
