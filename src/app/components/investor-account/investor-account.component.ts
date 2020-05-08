import { Component, OnInit, Input } from '@angular/core';
import { EndpointService } from 'src/app/services/endpoint-service/endpoint.service';
import { AccountService } from 'src/app/services/account-service/account.service';
import { MessageService } from 'primeng/api';
import { PickerComponent } from '../picker/picker.component';
import { DialogService } from 'primeng/dynamicdialog/';
import { PublicInformationService } from 'src/app/services/public-information-service/public-information.service';

@Component({
  selector: 'app-investor-account',
  templateUrl: './investor-account.component.html',
  styleUrls: ['./investor-account.component.scss'],
  providers:[MessageService, DialogService]
})
export class InvestorAccountComponent implements OnInit {
  @Input()
  investor: any;

  @Input()
  editMode: boolean = false;

  ticketSizes = [];
  
  constructor(public accountService: AccountService,
    private messageService : MessageService,
    public endpointService : EndpointService,
    private dialogService : DialogService,
    private publicInformationService : PublicInformationService) { }

  ngOnInit(): void {
  }

  showErrorToast() {
    this.messageService.add({severity:'error', summary:'Action failed'});
  }

  showSuccessToast(text : string) {
    this.messageService.add({severity:'success', summary:text});
  }

  handleSliderChange(event : any) {
    this.investor.ticketMin = this.investor.ticketSizes[event.values[0]].name;
    this.investor.ticketMax = this.investor.ticketSizes[event.values[1]].name;
    this.investor.ticketMinId = this.investor.ticketSizes[event.values[0]].id;
    this.investor.ticketMaxId = this.investor.ticketSizes[event.values[1]].id;
  }

  toggleEdit() {
    if(this.editMode) {
      this.accountService.updateInvestor(this.investor).subscribe(data => {
        this.messageService.add({severity:'success', summary:'Investor updated'});
      }, err => {
        this.messageService.add({severity:'error', summary:'Action failed'});
        console.log(err);
      });
    }
    this.editMode = !this.editMode;
  }

  changeCountry() {
    const ref = this.dialogService.open(PickerComponent, {
      header: 'Choose a Country',
      data:this.publicInformationService.getCountries()
    });
    
    ref.onClose.subscribe((result) => { 
      this.investor.countryId = result.id;
      this.investor.country = result.name;
    });
  }

  changeInvestorType() {
    const ref = this.dialogService.open(PickerComponent, {
      header: 'Choose an Investor Type',
      data:this.publicInformationService.getInvestorTypes()
    });
    
    ref.onClose.subscribe((result) => { 
      this.investor.investorTypeId = result.id;
      this.investor.investorType = result.name;
    });
  }

  formatTicketSize(tSize : number) {
    let unit = "";
    let val = tSize;
    let i = 0;
    let units = ["k", "M", "B"];

    while(Math.log10(val) >= 3 && i < units.length) {
        val /= 1000;
        unit = units[i];
        ++i;
    }

    return "CHF " + val + unit;
  }

  addInvolvement() {
    const ref = this.dialogService.open(PickerComponent, {
      header: 'Choose an Involvement',
      data:this.publicInformationService.getSupports()
    });
    
    ref.onClose.subscribe((result) => { 
      this.accountService.addAssignment(this.investor.accountId, "support", result.id,  "account").subscribe(data => {
        this.investor.support.push(result.id);
        this.investor.supportObj.push(result);
        this.showSuccessToast("Involvement added");
      }, err => {
        this.showErrorToast();
      });
      
    });
  }

  deleteInvolvement(id) {
    console.log("delete assignment " + id);
    this.accountService.deleteAssignment(this.investor.accountId, "support", id, "account")
    .subscribe(data => {
      this.investor.support.splice()
      this.showSuccessToast("Involvement deleted");
      this.investor.supportObj = this.investor.supportObj.filter(function(value, index, arr){ return value.id != id;});
    },
    err => {
      this.showErrorToast();
    });
  }

  addIndustry() {
    const ref = this.dialogService.open(PickerComponent, {
      header: 'Choose an Industry',
      data:this.publicInformationService.getIndustries()
    });
    
    ref.onClose.subscribe((result) => { 
      this.accountService.addAssignment(this.investor.accountId, "industry", result.id,  "account").subscribe(data => {
        this.investor.industries.push(result.id);
        this.investor.industryObj.push(result);
        this.showSuccessToast("Industry added");
      }, err => {
        this.showErrorToast();
      });
    });
  }

  deleteIndustry(id) {
    console.log("delete assignment " + id);
    this.accountService.deleteAssignment(this.investor.accountId, "industry", id, "account")
    .subscribe(data => {
      this.showSuccessToast("Industry deleted");
      this.investor.industryObj = this.investor.industryObj.filter(function(value, index, arr){ return value.id != id;});
    },
    err => {
      this.showErrorToast();
    });
  }


  addInvestmentPhase() {
    const ref = this.dialogService.open(PickerComponent, {
      header: 'Choose an Investment Phase',
      data:this.publicInformationService.getInvestmentPhases()
    });
    
    ref.onClose.subscribe((result) => { 
      this.accountService.addAssignment(this.investor.accountId, "investmentphase", result.id,  "investor")
        .subscribe(data => {
        this.investor.investmentPhases.push(result.id);
        this.investor.investmentPhaseObj.push(result);
        this.showSuccessToast("Investment Phase added");
      }, err => {
        this.showErrorToast();
      });
      
    });
  }

  deleteInvestmentPhase(id) {
    console.log("delete assignment " + id);
    this.accountService.deleteAssignment(this.investor.accountId, "investmentphase", id, "investor")
    .subscribe(data => {
      this.showSuccessToast("Investment Phase deleted");
      this.investor.investmentPhaseObj = this.investor.investmentPhaseObj
        .filter(function(value, index, arr){ return value.id != id;});
    },
    err => {
      this.showErrorToast();
    });
  }

  makeAdmin() {
    let inv = this.investor;
    inv.roles = "ROLE_ADMIN"
    this.accountService.updateAccount(inv).subscribe(data => {
      this.investor.roles="ROLE_ADMIN";
      this.showSuccessToast("User is now admin");
    }, err => {
      this.showErrorToast();
    });
  }

  
  addContinent() {
    const ref = this.dialogService.open(PickerComponent, {
      header: 'Choose a Continent',
      data:this.publicInformationService.getContinents()
    });
    
    ref.onClose.subscribe((result) => { 
      this.accountService.addAssignment(this.investor.accountId, "continent", result.id,  "account")
        .subscribe(data => {
        this.investor.continents.push(result.id);
        this.investor.continentObj.push(result);
        this.showSuccessToast("Continent added");
      }, err => {
        this.showErrorToast();
      });
      
    });
  }

  deleteContinent(id) {
    this.accountService.deleteAssignment(this.investor.accountId, "continent", id, "account")
    .subscribe(data => {
      this.showSuccessToast("Continent deleted");
      this.investor.continentObj = this.investor.continentObj
        .filter(function(value, index, arr){ return value.id != id;});
    },
    err => {
      this.showErrorToast();
    });
  }

  addCountry() {
    const ref = this.dialogService.open(PickerComponent, {
      header: 'Choose a Country',
      data:this.publicInformationService.getCountries()
    });
    
    ref.onClose.subscribe((result) => { 
      this.accountService.addAssignment(this.investor.accountId, "country", result.id,  "account")
        .subscribe(data => {
        this.investor.countries.push(result.id);
        this.investor.countryObj.push(result);
        this.showSuccessToast("Country added");
      }, err => {
        this.showErrorToast();
      });
      
    });
  }

  deleteCountry(id) {
    this.accountService.deleteAssignment(this.investor.accountId, "country", id, "account")
    .subscribe(data => {
      this.showSuccessToast("Country deleted");
      this.investor.countries = this.investor.countries
        .filter(function(value, index, arr){ return value.id != id;});
    },
    err => {
      this.showErrorToast();
    });
  }
}
