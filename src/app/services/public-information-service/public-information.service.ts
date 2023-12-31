import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../auth-service/auth.service';
import { EndpointService } from 'src/app/services/endpoint-service/endpoint.service';
import { Observable, from } from 'rxjs';
import { of } from "rxjs";

/**
 * This class manages all public resources. It loads them from the backend and allows for
 * quick searching and updating of icons.
 */
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
  private labels = [];
  private financeTypes = [];
  private revenue = [];

  private loaded = false;

  constructor(private httpClient: HttpClient,
    private EndpointService: EndpointService) { 
  }

  /**
   * Boolean observable that indicates whether resources have been loaded from backend 
   */
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
        this.labels = (data as any).labels;
        this.revenue = (data as any).revenues;
        this.financeTypes = (data as any).financeTypes;

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
      this.financeTypes = (data as any).financeTypes;
      this.revenue = (data as any).revenues;
      this.labels = (data as any).labels;

      this.loaded = true;
    });
  }

  // -- getters for all the arrays --
  getCountries() { return this.countries; }
  getContinents() { return this.continents; }
  getTicketSizes() { return this.ticketSizes; }
  getInvestorTypes() { return this.investorTypes; }
  getInvestmentPhases() { return this.investmentPhases; }
  getSupports() { return this.support; }
  getLabels() { return this.labels; }
  getCorporateBodies() { return this.corporateBodies; }
  getIndustries() { return this.industries; }
  getFinanceTypes() { return this.financeTypes; }
  getRevenues() { return this.revenue; }

  // -- getters for individual resources --
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

  getRevenue(id) {
    return this.getRevenues().find((rv) => {
      return rv.id == id;
    });
  }

  getInvestorType(id) {
    return this.investorTypes.find((type) => {
      return type.id == id;
    });
  }

  getLabel(id) {
    return this.labels.find((type) => {
      return type.id == id;
    });
  }

  getTicketSize(id) {
    let size =  this.ticketSizes.find((ticket) => {
      return ticket.id == id;
    });
    return size;
  }

  getInvestmentPhase(id) {
    return this.investmentPhases.find((phase) => {
      return phase.id == id;
    });
  }

  getCorporateBody(id) {
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

  getFinanceType(id) {
    return this.financeTypes.find((type) => {
      return type.id == id;
    });
  }

  /**
   * Get all icons from backend
   */
  getIcons() {
      return this.httpClient.get<[]>(this.EndpointService.getUrl() + "media/icon");
  }

  /**
   * Update resource icon
   * @param id id of icon
   * @param icon new icon
   */
  patchIcon(id, icon) {
    const formData : FormData = new FormData();
    let headers = new HttpHeaders();
    formData.append('icon', icon, icon.name);
      return this.httpClient.patch<any>(this.EndpointService.getUrl() + "media/icon/" + id, formData, { headers:headers});
  }
}
