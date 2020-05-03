import { Component, OnInit, Input } from '@angular/core';
import { EndpointService } from 'src/app/services/endpoint-service/endpoint.service';
import { AccountService } from 'src/app/services/account-service/account.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-investor-account',
  templateUrl: './investor-account.component.html',
  styleUrls: ['./investor-account.component.scss'],
  providers:[MessageService]
})
export class InvestorAccountComponent implements OnInit {
  @Input()
  investor: any;

  @Input()
  editMode: boolean = false;
  
  constructor(public accountService: AccountService,
    private messageService : MessageService,
    public endpointService : EndpointService) { }

  ngOnInit(): void {
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
}
