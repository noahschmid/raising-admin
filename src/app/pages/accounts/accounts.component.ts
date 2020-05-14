import {
  Component,
  OnInit
} from '@angular/core';
import {
  AccountService
} from 'src/app/services/account-service/account.service';
import {
  AuthService
} from 'src/app/services/auth-service/auth.service';
import {
  MatDialog
} from '@angular/material/dialog';
import {
  ConfirmationDialogComponent
} from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import {
  SortEvent
} from 'primeng/api/sortevent';
import {
  FilterUtils
} from 'primeng/utils';
import {
  EndpointService
} from 'src/app/services/endpoint-service/endpoint.service';
import {
  PublicInformationService
} from 'src/app/services/public-information-service/public-information.service';
import {
  InvestorAccountComponent
} from 'src/app/components/investor-account/investor-account.component';
import {
  StartupAccountComponent
} from 'src/app/components/startup-account/startup-account.component';
import {
  MessageService
} from 'primeng/api';
import { SpinnerComponent } from 'src/app/components/spinner/spinner.component';
import { DialogService } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss'],
  providers: [MessageService, DialogService]
})
export class AccountsComponent implements OnInit {

  constructor(private accountService: AccountService,
    public authService: AuthService,
    public dialog: MatDialog,
    public endpointService: EndpointService,
    private publicInformationService: PublicInformationService,
    private messageService: MessageService,
    private dialogService : DialogService) {}

  ngOnInit(): void {
    this.endpointService.observeDevMode.subscribe(data => {
      this.getAllAccounts();
    });

    this.getAllAccounts();
  }

  /**
   * The list of all accounts
   */
  accountList = [];
  investorList = [];
  startupList = [];

  displayDialog: boolean = false;

  account: any = {};

  selectedAccount: any;

  newAccount: boolean;

  first = 0;
  cols: any[];
  rows = 10;

  loading: boolean = false;

  getAllAccounts() {
    let spinner = this.dialogService.open(SpinnerComponent, {
      showHeader:false,
      closable:false,
      styleClass:"spinner"
    });

    this.accountService.getAllAccounts().subscribe(
      data => {
        this.accountList = [];
        this.investorList = [];
        this.startupList = [];
        this.first = 0;
        this.cols = [];

        let investors = (data as any).investors;
        let startups = (data as any).startups;
        let accounts = (data as any).accounts;

        console.log(data);

        for (let account in (data as any).accounts) {
          (data as any).accounts[account].type = "Account";
          (data as any).accounts[account].link = "/admin/account/";
          this.accountList.push((data as any).accounts[account]);
        }

        for (let investor in investors) {
          investors[investor].type = "Investor";
          investors[investor].link = "/admin/investor/";
          this.accountList.push(investors[investor]);
        }

        for (let startup in startups) {
          startups[startup].type = "Startup";
          startups[startup].link = "/admin/startup/";
          this.accountList.push(startups[startup]);
        }


        this.accountList.sort((a, b) => {
          return (a as any).accountId - (b as any).accountId;
        });


        this.cols = [{
            field: 'accountId',
            header: 'ID'
          },
          {
            field:'companyName',
            header:'Company Name'
          },
          {
            field: 'firstName',
            header: 'First Name'
          },
          {
            field: 'lastName',
            header: 'Last Name'
          },
          {
            field: 'type',
            header: 'type'
          }
        ];

        FilterUtils['custom'] = (value, filter): boolean => {
          if (filter === undefined || filter === null || filter.trim() === '') {
            return true;
          }

          if (value === undefined || value === null) {
            return false;
          }

          return parseInt(filter) > value;
        }

        spinner.close();
      },
      err => {
        spinner.close();
        console.log(err);
      });
  }

  /**
   * Delete an account
   * @param id the id of the account
   */
  deleteAccount(id: String, accountName) {
    this.selectedAccount = {};
    this.displayDialog = false;
    let accountId = id;
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: "Are you sure you want to delete " + accountName + "?"
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.accountService.deleteAccount(accountId).subscribe(
          data => {
            for (let i = 0; i < this.accountList.length; ++i) {
              if (this.accountList[i].accountId == id) {
                this.accountList.splice(i, 1);
                break;
              }
            }
            this.messageService.add({
              severity: 'success',
              summary: 'Account ' + id + ' successfully deleted'
            });
          },
          err => {
            this.messageService.add({
              severity: 'error',
              summary: 'Action failed'
            });
            console.log(err);
          }
        );
      }
    });
  }

  next() {
    this.first = this.first + this.rows;
  }

  prev() {
    this.first = this.first - this.rows;
  }

  reset() {
    this.first = 0;
  }

  isLastPage(): boolean {
    return this.first === (this.accountList.length - this.rows);
  }

  isFirstPage(): boolean {
    return this.first === 0;
  }

  customSort(event: SortEvent) {
    event.data.sort((data1, data2) => {
      let value1 = data1[event.field];
      let value2 = data2[event.field];
      let result = null;

      if (value1 == null && value2 != null)
        result = -1;
      else if (value1 != null && value2 == null)
        result = 1;
      else if (value1 == null && value2 == null)
        result = 0;
      else if (typeof value1 === 'string' && typeof value2 === 'string')
        result = value1.localeCompare(value2);
      else
        result = (value1 < value2) ? -1 : (value1 > value2) ? 1 : 0;

      return (event.order * result);
    });
  }

  showDialogToAdd() {
    this.newAccount = true;
    this.account = {};
    this.displayDialog = true;
  }

  save() {
    let accounts = [...this.accountList];
    if (this.newAccount)
      accounts.push(this.account);
    else
      accounts[this.accountList.indexOf(this.selectedAccount)] = this.account;

    this.accountList = accounts;
    this.account = null;
    this.displayDialog = false;
    this.selectedAccount = {};
  }

  delete() {
    let index = this.accountList.indexOf(this.selectedAccount);
    this.accountList = this.accountList.filter((val, i) => i != index);
    this.account = null;
    this.displayDialog = false;
    this.selectedAccount = {};
  }

  onRowSelect(event) {
    if (event.data.type == 'Investor') {
      this.accountService.getInvestor(event.data.accountId).subscribe(data => {
        this.account = data;
        this.account.type = event.data.type;
        this.populateAccount();
      });
    }

    if (event.data.type == 'Startup') {
      this.accountService.getStartup(event.data.accountId).subscribe(data => {
        this.account = data;
        this.account.type = event.data.type;
        this.populateAccount();
      });
    }
  }

  editAccount() {
    this.newAccount = false;
    this.displayDialog = true;
  }

  showAccount() {
    this.newAccount = false;
    this.displayDialog = true;
  }

  populateAccount() {
    let ids = [];
    this.account.country = this.publicInformationService.getCountry(this.account.countryId).name;
    if (this.account.type == 'Investor') {
      this.account.investorType = this.publicInformationService.getInvestorType(this.account.investorTypeId).name;
      ids = this.account.investmentPhases;
      this.account.investmentPhaseObj = [];
      for (let invId in ids) {
        let id = ids[invId];
        this.account.investmentPhaseObj.push(this.publicInformationService.getInvestmentPhase(id));
      }
    } else if (this.account.type == 'Startup') {
      this.account.investmentPhase = this.publicInformationService.getInvestmentPhase(this.account.investmentPhaseId).name;
      ids = this.account.investorTypes;
      this.account.investorTypeObj = [];
      for (let invId in ids) {
        let id = ids[invId];
        this.account.investorTypeObj.push(this.publicInformationService.getInvestorType(id));
      }

      ids = this.account.labels;
      this.account.labelObj = [];
      for (let invId in ids) {
        let id = ids[invId];
        this.account.labelObj.push(this.publicInformationService.getLabel(id));
      }

      this.account.revenueMin = this.publicInformationService.getRevenue(this.account.revenueMinId).name;
      this.account.revenueMax = this.publicInformationService.getRevenue(this.account.revenueMaxId).name;
      this.account.revenueRange = [];

      this.account.revenue = this.publicInformationService.getRevenues();

      this.account.closingTimeDate = new Date(this.account.closingTime);

      for (let i = 0; i < this.account.revenue.length; ++i) {
        if (this.account.ticketSizes[i].id == this.account.revenueMinId) {
          this.account.revenueRange.push(i);
        }
        if (this.account.ticketSizes[i].id == this.account.revenueMaxId) {
          this.account.revenueRange.push(i);
          break;
        }
      }
    }

    this.account.ticketMin = this.publicInformationService.getTicketSize(this.account.ticketMinId).name;
    this.account.ticketMax = this.publicInformationService.getTicketSize(this.account.ticketMaxId).name;


    this.account.ticketRange = [];

    this.account.ticketSizes = this.publicInformationService.getTicketSizes();

    for (let i = 0; i < this.account.ticketSizes.length; ++i) {
      if (this.account.ticketSizes[i].id == this.account.ticketMinId) {
        this.account.ticketRange.push(i);
      }
      if (this.account.ticketSizes[i].id == this.account.ticketMaxId) {
        this.account.ticketRange.push(i);
        break;
      }
    }

    ids = this.account.support;
    this.account.supportObj = [];
    for (let invId in ids) {
      let id = ids[invId];
      this.account.supportObj.push(this.publicInformationService.getSupport(id));
    }

    ids = this.account.continents;
    this.account.continentObj = [];
    for (let invId in ids) {
      let id = ids[invId];
      this.account.continentObj.push(this.publicInformationService.getContinent(id));
    }

    ids = this.account.industries;
    this.account.industryObj = [];
    for (let invId in ids) {
      let id = ids[invId];
      this.account.industryObj.push(this.publicInformationService.getIndustry(id));
    }

    ids = this.account.countries;
    this.account.countryObj = [];
    for (let invId in ids) {
      let id = ids[invId];
      this.account.countryObj.push(this.publicInformationService.getCountry(id));
    }
  }

  onDialogHide(event) {
    console.log("beforehide");
    this.getAllAccounts();
  }
}
