import { Component, OnInit, Input } from '@angular/core';
import { EndpointService } from 'src/app/services/endpoint-service/endpoint.service';
import { MessageService } from 'primeng/api';
import { AccountService } from 'src/app/services/account-service/account.service';

@Component({
  selector: 'app-startup-account',
  templateUrl: './startup-account.component.html',
  styleUrls: ['./startup-account.component.scss'],
  providers:[MessageService]
})
export class StartupAccountComponent implements OnInit {
  @Input()
  startup: any;

  editMode: boolean = false;

  constructor(public endpointService: EndpointService,
    private accountService: AccountService,
    private messageService: MessageService) { }

  ngOnInit(): void {
  }

  toggleEdit() {
    if(this.editMode) {
      this.accountService.updateInvestor(this.startup).subscribe(data => {
        this.messageService.add({severity:'success', summary:'Startup updated'});
      }, err => {
        this.messageService.add({severity:'error', summary:'Action failed'});
      });
    }
    this.editMode = !this.editMode;
  }

}
