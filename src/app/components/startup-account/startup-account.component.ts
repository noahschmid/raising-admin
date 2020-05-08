import { Component, OnInit, Input } from '@angular/core';
import { EndpointService } from 'src/app/services/endpoint-service/endpoint.service';
import { MessageService } from 'primeng/api';
import { AccountService } from 'src/app/services/account-service/account.service';
import { DialogService } from 'primeng/dynamicdialog';
import { PublicInformationService } from 'src/app/services/public-information-service/public-information.service';
import { PickerComponent } from '../picker/picker.component';

@Component({
  selector: 'app-startup-account',
  templateUrl: './startup-account.component.html',
  styleUrls: ['./startup-account.component.scss'],
  providers:[MessageService, DialogService]
})
export class StartupAccountComponent implements OnInit {
  @Input()
  startup: any;

  editMode: boolean = false;

  constructor(private accountService: AccountService,
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
    this.startup.ticketMin = this.startup.ticketSizes[event.values[0]].name;
    this.startup.ticketMax = this.startup.ticketSizes[event.values[1]].name;
    this.startup.ticketMinId = this.startup.ticketSizes[event.values[0]].id;
    this.startup.ticketMaxId = this.startup.ticketSizes[event.values[1]].id;
  }

  handleRevenueChange(event : any) {
    this.startup.revenueMin = this.startup.revenue[event.values[0]].name;
    this.startup.revenueMax = this.startup.revenue[event.values[1]].name;
    this.startup.revenueMinId = this.startup.revenue[event.values[0]].id;
    this.startup.revenueMaxId = this.startup.revenue[event.values[1]].id;
  }

  toggleEdit() {
    if(this.editMode) {
      this.accountService.updateInvestor(this.startup).subscribe(data => {
        this.messageService.add({severity:'success', summary:'Startup updated'});
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
      this.startup.countryId = result.id;
      this.startup.country = result.name;
    });
  }

  changeInvestmentPhase() {
    const ref = this.dialogService.open(PickerComponent, {
      header: 'Choose an Investment Phase',
      data:this.publicInformationService.getInvestmentPhases()
    });
    
    ref.onClose.subscribe((result) => { 
      this.startup.investmentPhaseId = result.id;
      this.startup.investmentPhase = result.name;
    });
  }

  changeFinanceType() {
    const ref = this.dialogService.open(PickerComponent, {
      header: 'Choose a Finance Type',
      data:this.publicInformationService.getFinanceTypes()
    });
    
    ref.onClose.subscribe((result) => { 
      this.startup.financeTypeId = result.id;
      this.startup.financeType = result.name;
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

  formatRevenue(tSize : number) {
    let unit = "";
    let val = tSize;
    let i = 0;
    let units = ["k", "M", "B"];

    while(Math.log10(val) >= 3 && i < units.length) {
        val /= 1000;
        unit = units[i];
        ++i;
    }

    if(tSize % 10 == 1) {
      unit = unit + "+";
      val = Math.floor(val);
    }

    return "CHF " + val + unit;
  }

  addInvolvement() {
    const ref = this.dialogService.open(PickerComponent, {
      header: 'Choose an Involvement',
      data:this.publicInformationService.getSupports()
    });
    
    ref.onClose.subscribe((result) => { 
      this.accountService.addAssignment(this.startup.accountId, "support", result.id,  "account").subscribe(data => {
        this.startup.support.push(result.id);
        this.startup.supportObj.push(result);
        this.showSuccessToast("Involvement added");
      }, err => {
        this.showErrorToast();
      });
      
    });
  }

  deleteInvolvement(id) {
    console.log("delete assignment " + id);
    this.accountService.deleteAssignment(this.startup.accountId, "support", id, "account")
    .subscribe(data => {
      this.startup.support.splice()
      this.showSuccessToast("Involvement deleted");
      this.startup.supportObj = this.startup.supportObj.filter(function(value, index, arr){ return value.id != id;});
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
      this.accountService.addAssignment(this.startup.accountId, "industry", result.id,  "account").subscribe(data => {
        this.startup.industries.push(result.id);
        this.startup.industryObj.push(result);
        this.showSuccessToast("Industry added");
      }, err => {
        this.showErrorToast();
      });
    });
  }

  deleteIndustry(id) {
    console.log("delete assignment " + id);
    this.accountService.deleteAssignment(this.startup.accountId, "industry", id, "account")
    .subscribe(data => {
      this.showSuccessToast("Industry deleted");
      this.startup.industryObj = this.startup.industryObj.filter(function(value, index, arr){ return value.id != id;});
    },
    err => {
      this.showErrorToast();
    });
  }


  addInvestorType() {
    const ref = this.dialogService.open(PickerComponent, {
      header: 'Choose an Investor Type',
      data:this.publicInformationService.getInvestorTypes()
    });
    
    ref.onClose.subscribe((result) => { 
      this.accountService.addAssignment(this.startup.accountId, "investortype", result.id,  "startup")
        .subscribe(data => {
        this.startup.investorTypes.push(result.id);
        this.startup.investorTypeObj.push(result);
        this.showSuccessToast("Investor Type added");
      }, err => {
        this.showErrorToast();
      });
      
    });
  }

  deleteInvestorType(id) {
    this.accountService.deleteAssignment(this.startup.accountId, "investortype", id, "startup")
    .subscribe(data => {
      this.showSuccessToast("Investor Type deleted");
      this.startup.investorTypeObj = this.startup.investorTypeObj
        .filter(function(value, index, arr){ return value.id != id;});
    },
    err => {
      this.showErrorToast();
    });
  }

  makeAdmin() {
    let inv = this.startup;
    inv.roles = "ROLE_ADMIN"
    this.accountService.updateAccount(inv).subscribe(data => {
      this.startup.roles="ROLE_ADMIN";
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
      this.accountService.addAssignment(this.startup.accountId, "continent", result.id,  "account")
        .subscribe(data => {
        this.startup.continents.push(result.id);
        this.startup.continentObj.push(result);
        this.showSuccessToast("Continent added");
      }, err => {
        this.showErrorToast();
      });
      
    });
  }

  deleteContinent(id) {
    this.accountService.deleteAssignment(this.startup.accountId, "continent", id, "account")
    .subscribe(data => {
      this.showSuccessToast("Continent deleted");
      this.startup.continentObj = this.startup.continentObj
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
      this.accountService.addAssignment(this.startup.accountId, "country", result.id,  "account")
        .subscribe(data => {
        this.startup.countries.push(result.id);
        this.startup.countryObj.push(result);
        this.showSuccessToast("Country added");
      }, err => {
        this.showErrorToast();
      });
      
    });
  }

  deleteCountry(id) {
    this.accountService.deleteAssignment(this.startup.accountId, "country", id, "account")
    .subscribe(data => {
      this.showSuccessToast("Country deleted");
      this.startup.countryObj = this.startup.countryObj
        .filter(function(value, index, arr){ return value.id != id;});
    },
    err => {
      this.showErrorToast();
    });
  }

  addLabel() {
    const ref = this.dialogService.open(PickerComponent, {
      header: 'Choose a Country',
      data:this.publicInformationService.getCountries()
    });
    
    ref.onClose.subscribe((result) => { 
      this.accountService.addAssignment(this.startup.accountId, "label", result.id,  "startup")
        .subscribe(data => {
        this.startup.countries.push(result.id);
        this.startup.countryObj.push(result);
        this.showSuccessToast("Label added");
      }, err => {
        this.showErrorToast();
      });
      
    });
  }

  deleteLabel(id) {
    this.accountService.deleteAssignment(this.startup.accountId, "label", id, "startup")
    .subscribe(data => {
      this.showSuccessToast("Label deleted");
      this.startup.labelObj = this.startup.labelObj
        .filter(function(value, index, arr){ return value.id != id;});
    },
    err => {
      this.showErrorToast();
    });
  }
}
