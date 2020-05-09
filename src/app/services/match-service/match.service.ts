import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EndpointService } from 'src/app/services/endpoint-service/endpoint.service';
import { AuthService } from '../auth-service/auth.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MatchService {

  constructor(
    private httpClient: HttpClient,
    private authService: AuthService,
    private EndpointService: EndpointService) { }

    /**
   * Fetches all accounts from the backend
   * @returns an observable with the server response
   */
    getAllHandshakes(): Observable<[]>{
      return this.httpClient.get<[]>(this.EndpointService.getUrl() + "admin/handshake/");
    }

    /**
   * Fetches all accounts from the backend
   * @returns an observable with the server response
   */
    getAllRelationships(): Observable<[]>{
      return this.httpClient.get<[]>(this.EndpointService.getUrl() + "admin/relationship/");
    }
}
