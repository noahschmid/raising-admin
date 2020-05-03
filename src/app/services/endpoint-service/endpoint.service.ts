import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

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

    public showSlider() {
        return this.devAllowed && this.prodAllowed;
    }
    
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

    public getUrl() {
        return (this.devMode ? 
            this.apiUrl + "8081/" : 
            this.apiUrl + "8080/");
    }

    public getDevUrl() {
        return this.apiUrl + "8081/";
    }

    public getProdUrl() {
        return this.apiUrl + "8080/";
    }

    public setDevMode(mode: boolean) { 
        this.devMode = mode;
        localStorage.setItem("devMode", JSON.stringify(mode));
        this.observeDevMode.next(mode); 
        console.log("setDevMode: " + this.devMode);
    }

    public isInDevMode() {
        return this.devMode;
    }
}
