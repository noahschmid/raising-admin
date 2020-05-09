import { Component, OnInit, Input } from '@angular/core';
import { AccountService } from 'src/app/services/account-service/account.service';
import { MessageService } from 'primeng/api';
import { EndpointService } from 'src/app/services/endpoint-service/endpoint.service';
import { DialogService } from 'primeng/dynamicdialog';
import { PublicInformationService } from 'src/app/services/public-information-service/public-information.service';
import { PickerComponent } from '../picker/picker.component';

@Component({
  selector: 'app-account-details',
  templateUrl: './account-details.component.html',
  styleUrls: ['./account-details.component.scss'],
  providers:[DialogService, MessageService]
})
export class AccountDetailsComponent implements OnInit {

  @Input()
  account: any;

  @Input()
  editMode: boolean = false;

  ticketSizes = [];
  
  constructor(public accountService: AccountService,
    private messageService : MessageService,
    public endpointService : EndpointService,
    private dialogService : DialogService,
    private publicInformationService : PublicInformationService) { }

    ngOnInit() {}

  makeAdmin() {
    let inv = this.account;
    inv.roles = "ROLE_ADMIN"
    this.accountService.updateAccount(inv).subscribe(data => {
      this.account.roles="ROLE_ADMIN";
      this.showSuccessToast("User is now admin");
    }, err => {
      this.showErrorToast();
    });
  }

  toggleEdit() {
    if(this.editMode) {
      this.accountService.updateAccount(this.account).subscribe(data => {
        this.messageService.add({severity:'success', summary:'Account updated'});
      }, err => {
        this.messageService.add({severity:'error', summary:'Action failed'});
        console.log(err);
      });
    }
    this.editMode = !this.editMode;
  }

  showErrorToast() {
    this.messageService.add({severity:'error', summary:'Action failed'});
  }

  showSuccessToast(text : string) {
    this.messageService.add({severity:'success', summary:text});
  }
  changeCountry() {
    const ref = this.dialogService.open(PickerComponent, {
      header: 'Choose a Country',
      data:this.publicInformationService.getCountries()
    });
    
    ref.onClose.subscribe((result) => { 
      this.account.countryId = result.id;
      this.account.country = result.name;
    });
  } 

}
