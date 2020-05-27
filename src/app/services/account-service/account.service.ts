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

    /**
     * Fetches an investor from the backend
     * @param id id of the corresponding investor
     */
    getInvestor(id) {
      return this.httpClient.get(this.EndpointService.getUrl()  + `investor/${id}`)
    }

    /**
     * Fetches a startup from the backend
     * @param id id of the corresponding startup
     */
    getStartup(id) {
      return this.httpClient.get(this.EndpointService.getUrl() + `startup/${id}`)
    }

    /**
     * Delete account
     * @param id id of account to delete
     */
    deleteAccount(id : String): Observable<[]> {
      return this.httpClient.delete<[]>(this.EndpointService.getUrl() + "account/" + id);
    }

    /**
     * Update investor
     * @param investor investor instance
     */
    updateInvestor(investor: any) {
      delete investor.email;
      delete investor.password;
      return this.httpClient.patch(this.EndpointService.getUrl() + "investor/" + investor.accountId, investor);
    }

    /**
     * Update startup
     * @param startup startup instance
     */
    updateStartup(startup: any) {
      delete startup.email;
      delete startup.password;
      return this.httpClient.patch(this.EndpointService.getUrl() + "startup/" + startup.accountId, startup);
    }

    /**
     * Upadte account
     * @param account account instance
     */
    updateAccount(account: any) {
      delete account.email;
      delete account.password;
      return this.httpClient.patch(this.EndpointService.getUrl() + "account/" + account.accountId, account);
    }

    /**
     * 
     * @param accountId id of the desired account
     * @param table name of the table that's being assigned
     * @param id id of the table entry that should be assigned
     * @param accountType type of the account (investor or startup)
     */
    addAssignment(accountId : number, table : string, id, accountType : string) {
      let params = [];
      params.push(id);
      return this.httpClient.post(this.EndpointService.getUrl() + accountType + "/" + accountId + "/" + table,
      params);
    }

    /**
     * Deletes an assignment 
     * @param accountId id of the corresponding account
     * @param table name of the table that's assigned
     * @param id id of the assignment
     * @param accountType type of account (investor or startup)
     */
    deleteAssignment(accountId : number, table : string, id, accountType : string) {
      let params = [];
      params.push(id);
      return this.httpClient.post(this.EndpointService.getUrl() + accountType + "/" + accountId + "/" + table + 
      "/delete", JSON.stringify(params));
    }
  }
