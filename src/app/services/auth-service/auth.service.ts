import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Account } from '../../models/account';
import { Router } from '@angular/router';
import decode from 'jwt-decode';
import { Observable } from 'rxjs';
import{ EndpointService } from '../../services/endpoint-service/endpoint.service';

/**
 * Authentication Service handling
 *  - `login`,
 *  - `registration`,
 *  - `verification`,
 *  - `verification email resend`,
 *  - `forgot password`,
 *  - `reset password`
 * communication with backend
 *
 * Sets sessionToken in `localStorage` and reads them to check the login and role of the logged in user
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  /**
   * Assigns two new private variables `httpClient` and `router`
   * @param httpClient Auto injected `HttpClient` used for the commuication with the backend
   * @param router Auto injected `Router` used to redirect user after logout
   */
  constructor(private httpClient: HttpClient, private router: Router, private EndpointService: EndpointService) {}

  /**
   * Standard Http Options for our backend requests
   */
  httpOptions: {
    'Content-Type': 'application/json';
    observe: 'response';
  };

  /**
   * Tries to login with the given email and password
   * @param email the email of the user
   * @param password the password of the user
   * @return an Observable with data as {@link User}
   */
  devLogin(email: string, password: string): Observable<HttpResponse<Account>> {
    console.log("logging into dev server...");
    return this.httpClient
      .post<Account>(
        this.EndpointService.getDevUrl() + 'admin/login',
        { email, password },
        this.httpOptions
      )
      .pipe(
        map(res => {
          this.setDevSession(res);
          return res;
        })
      );
  }

  prodLogin(email: string, password: string): Observable<HttpResponse<Account>> {
    console.log("logging into prod server...");
    return this.httpClient
      .post<Account>(
        this.EndpointService.getProdUrl() + 'admin/login',
        { email, password },
        this.httpOptions
      )
      .pipe(
        map(res => {
          this.setProdSession(res);
          return res;
        })
      );
  }

  /**
   * Send a Password reset email
   * @param email the email as a string
   */
  forgotPassword(email: string) {
    return this.httpClient.post(
      this.EndpointService.getUrl() + 'forgot',
      { email },
      { observe: 'response' }
    );
  }

  /**
   * Resets a password of the user
   * @token the token sent for validation
   * @password the new password
   */
  resetPassword(token: string, password: string) {
    return this.httpClient.patch(
      this.EndpointService.getUrl() + 'reset',
      { token, password },
      { observe: 'response' }
    );
  }

  /**
   * Sets the token to the localStorage
   */
  private setDevSession(authResult) {
    localStorage.setItem('devtoken', authResult.token);
  }


  private setProdSession(authResult) {
    localStorage.setItem('prodtoken', authResult.token);
  }

  /**
   * sets the non-verified-user to the localStorage.
   */
  private setAccount(registrationResult) {
    localStorage.setItem('id', registrationResult.createdUser._id);
    localStorage.setItem('email', registrationResult.createdUser.email);
  }

  /**
   * Removes the token with which a user is logged in and navigates the user to the homepage
   */
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('devtoken');
    localStorage.removeItem('prodtoken');
    this.router.navigate(['/home']);
  }

  /**
   * Checks if the user is logged in. Only checks frontend-side
   * @return the boolean if the user is logged in
   */
  public isLoggedIn(): boolean {
    try {
      if (!Boolean(this.getToken())) {
        return false;
      }

      const payload = decode(this.getToken());
      const expiration = payload.exp;
      const dateNow: number = Math.floor(Date.now() / 1000);
      const expired = expiration - dateNow < 0;
      if (expired) {
        localStorage.removeItem('devtoken');
        localStorage.removeItem('prodToken');
      }
      return !expired;
    } catch (err) {
      return false;
    }
  }

  /**
   * Checks if the user is an Admin. Only checks frontend-side
   * @returns a boolean if the user is admin
   */
  public isAdmin(): boolean {
    if (!Boolean(this.getToken())) {
      return false;
    }
    try {
      const payload = decode(this.getToken());
      return payload.admin;
    } catch (err) {
      return false;
    }
  }

  /**
   * Reads and returns the token from the localStorage
   * @returns the token in the localStorage or null if it doesn't exist
   */
  public getToken(): string {
    if(this.EndpointService.isInDevMode())
      return localStorage.getItem('devtoken');
    return localStorage.getItem('prodtoken');
  }

  public getDevToken(): string {
    return localStorage.getItem('devtoken');
  }

  public getProdToken(): string {
    return localStorage.getItem('prodtoken');
  }

  /**
   * Reads the userId from the decoded token, which is saved in the localStorage
   * @returns the userId as a string
   */
  public getId(): string {
    if (!Boolean(this.getToken())) {
      return null;
    }
    const payload = decode(this.getToken());
    return payload.id;
  }
}
