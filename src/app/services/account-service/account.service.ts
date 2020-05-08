import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../auth-service/auth.service';
import{ EndpointService } from '../../services/endpoint-service/endpoint.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(
    private httpClient: HttpClient,
    private authService: AuthService,
    private EndpointService: EndpointService) { }

    /**
   * Fetches all accounts from the backend
   * @returns an observable with the server response
   */
    getAllAccounts(): Observable<[]>{
      return this.httpClient.get<[]>(this.EndpointService.getUrl() + "account/");
    }

    /**
   * Fetches information of a given account
   * @param id the id of the user
   * @returns an observable with the server response
   */
    getAccount(id) {
      return this.httpClient.get(this.EndpointService.getUrl() + "account/" + `${id}`, {});
    }

    getInvestor(id) {
      return this.httpClient.get(this.EndpointService.getUrl()  + `investor/${id}`)
    }

    getStartup(id) {
      return this.httpClient.get(this.EndpointService.getUrl() + `startup/${id}`)
    }

    deleteAccount(id : String): Observable<[]> {
      return this.httpClient.delete<[]>(this.EndpointService.getUrl() + "account/" + id);
    }

    updateInvestor(investor: any) {
      delete investor.email;
      delete investor.password;
      console.log(investor);
      return this.httpClient.patch(this.EndpointService.getUrl() + "investor/" + investor.accountId, investor);
    }

    updateStartup(startup: any) {
      delete startup.email;
      delete startup.password;
      return this.httpClient.patch(this.EndpointService.getUrl() + "startup/" + startup.accountId, startup);
    }

    updateAccount(account: any) {
      delete account.email;
      delete account.password;
      return this.httpClient.patch(this.EndpointService.getUrl() + "account/" + account.accountId, account);
    }

    addAssignment(accountId : number, table : string, id, accountType : string) {
      let params = [];
      params.push(id);
      return this.httpClient.post(this.EndpointService.getUrl() + accountType + "/" + accountId + "/" + table,
      params);
    }

    deleteAssignment(accountId : number, table : string, id, accountType : string) {
      let params = [];
      params.push(id);
      return this.httpClient.post(this.EndpointService.getUrl() + accountType + "/" + accountId + "/" + table + 
      "/delete", JSON.stringify(params));
    }
  }
