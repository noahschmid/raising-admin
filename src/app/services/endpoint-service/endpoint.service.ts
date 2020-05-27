import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

/**
 * Manages the current enpoint. This Service is what decides to which server
 * we are sending the requests (prod or dev) and returns the proper url.
 */
@Injectable({
  providedIn: 'root'
})
export class EndpointService {
  constructor() {
        if(Boolean(localStorage.getItem("devMode"))) {
            this.devMode = JSON.parse(localStorage.getItem("devMode"));
            console.log(this.devMode);
        } else {
            this.devMode = false;
        }

        this.devAllowed = JSON.parse(localStorage.getItem("devAllowed"));
        this.prodAllowed = JSON.parse(localStorage.getItem("prodAllowed"));
    }

    private devMode: boolean;
    private devAllowed: boolean; 
    private prodAllowed: boolean;

    private apiUrl: string = "https://33383.hostserv.eu:";

    public observeDevMode = new Subject<boolean>();

    /**
     * Whether or not the server toggle should be shown
     */
    public showSlider() {
        return this.devAllowed && this.prodAllowed;
    }
    
    /**
     * Set whether or not user has access to server instances
     * @param dev whether user has access to dev server
     * @param prod whether user has access to prod server
     */
    public setAllowed(dev, prod) {
        this.devAllowed = dev;
        this.prodAllowed = prod;
        if(this.devMode && !dev) {
            this.devMode = false;
        }
        if(!this.devMode && !prod) {
            this.devMode = true;
        }

        localStorage.setItem("devAllowed", JSON.stringify(this.devAllowed));
        localStorage.setItem("prodAllowed", JSON.stringify(this.prodAllowed));
        localStorage.setItem("devMode", JSON.stringify(this.devMode));
     }

     /**
      * Get base url for endpoints
      */
    public getUrl() {
        return (this.devMode ? 
            this.apiUrl + "8081/" : 
            this.apiUrl + "8080/");
    }

    /**
     * Get dev base url
     */
    public getDevUrl() {
        return this.apiUrl + "8081/";
    }

    /**
     * Get prod base url
     */
    public getProdUrl() {
        return this.apiUrl + "8080/";
    }

    /**
     * Set current server mode
     * @param mode whether or not we're in dev mode
     */
    public setDevMode(mode: boolean) { 
        this.devMode = mode;
        localStorage.setItem("devMode", JSON.stringify(mode));
        this.observeDevMode.next(mode); 
        console.log("setDevMode: " + this.devMode);
    }

    /**
     * Whether we're currently in dev or prod mode
     */
    public isInDevMode() {
        return this.devMode;
    }
}
