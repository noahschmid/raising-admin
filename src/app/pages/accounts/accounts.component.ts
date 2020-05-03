import { Component, OnInit } from '@angular/core';
import { AccountService } from 'src/app/services/account-service/account.service';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { SortEvent } from 'primeng/api/sortevent';
import {FilterUtils} from 'primeng/utils';
import { EndpointService } from 'src/app/services/endpoint-service/endpoint.service';
import { PublicInformationService } from 'src/app/services/public-information-service/public-information.service';
import { InvestorAccountComponent } from 'src/app/components/investor-account/investor-account.component';
import { StartupAccountComponent } from 'src/app/components/startup-account/startup-account.component';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss']
})
export class AccountsComponent implements OnInit {

  constructor(private accountService : AccountService,
    public authService : AuthService,
    public dialog: MatDialog,
    public endpointService: EndpointService,
    private publicInformationService: PublicInformationService) { }

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

    getAllAccounts() {
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

              for(let account in (data as any).accounts) {
                (data as any).accounts[account].type = "Account";
                (data as any).accounts[account].link = "/admin/account/";
                this.accountList.push((data as any).accounts[account]);
              }

              for(let investor in investors) {
                investors[investor].type = "Investor";
                investors[investor].link = "/admin/investor/";
                this.accountList.push(investors[investor]);
              }

              for(let startup in startups) {
                startups[startup].type = "Startup";
                startups[startup].link = "/admin/startup/";
                this.accountList.push(startups[startup]);
              }


              this.accountList.sort((a, b) => {
                  return (a as any).accountId - (b as any).accountId;
              });


              this.cols = [
                { field: 'id', header: 'id' },
                { field: 'firstName', header: 'first name' },
                { field: 'lastName', header: 'last name' },
                { field: 'type', header: 'type' }
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
          },
          err => {
              console.log(err);
          });
        }
  
      /**
       * Delete an account
       * @param id the id of the account
       */
      deleteAccount(id : String, accountName) {
        this.selectedAccount = {};
        this.displayDialog = false;
        let accountId = id;
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          width: '400px',
          data: "Are you sure you want to delete " + accountName + "?"
        });
        dialogRef.afterClosed().subscribe(result => {
          if(result) {
            this.accountService.deleteAccount(accountId).subscribe(
              data => {
                  this.getAllAccounts();
              },
              err => {
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
    if(event.data.type=='Investor') {
      this.accountService.getInvestor(event.data.accountId).subscribe(data => {
        this.account = data;
        this.account.type = event.data.type;
        this.populateNames();
      });
    }

    if(event.data.type=='Startup') {
      this.accountService.getStartup(event.data.accountId).subscribe(data => {
        this.account = data;
        this.account.type = event.data.type;
        this.populateNames();
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

  populateNames() {
    let ids = [];
    this.account.country = this.publicInformationService.getCountry(this.account.countryId).name;
    if(this.account.type=='Investor') {
      this.account.investorType = this.publicInformationService.getInvestorType(this.account.investorTypeId).name;
      ids = this.account.investmentPhases;
      this.account.investmentPhaseNames = [];
      for(let invId in ids) {
        let id = ids[invId];
        this.account.investmentPhaseNames.push(this.publicInformationService.getInvestmentPhase(id).name);
      }
    } else if(this.account.type=='Startup') {
      this.account.investmentPhase = this.publicInformationService.getInvestmentPhase(this.account.investmentPhaseId).name;
      ids = this.account.investorTypes;
      this.account.investorTypeNames = [];
      for(let invId in ids) {
        let id = ids[invId];
        this.account.investorTypeNames.push(this.publicInformationService.getInvestorType(id).name);
      }
    }
    
    this.account.ticketMin = this.publicInformationService.getTicketSize(this.account.ticketMinId).name;
    this.account.ticketMax = this.publicInformationService.getTicketSize(this.account.ticketMaxId).name;

    ids = this.account.support;
    this.account.supportNames = [];
    for(let invId in ids) {
      let id = ids[invId];
      this.account.supportNames.push(this.publicInformationService.getSupport(id).name);
    }

    ids = this.account.continents;
    this.account.continentNames = [];
    for(let invId in ids) {
      let id = ids[invId];
      this.account.continentNames.push(this.publicInformationService.getContinent(id).name);
    }

    ids = this.account.industries;
    this.account.industryNames = [];
    for(let invId in ids) {
      let id = ids[invId];
      this.account.industryNames.push(this.publicInformationService.getIndustry(id).name);
    }

    ids = this.account.countries;
    this.account.countryNames = [];
    for(let invId in ids) {
      let id = ids[invId];
      this.account.countryNames.push(this.publicInformationService.getCountry(id).name);
    }
  }

  onDialogHide(event) {
    console.log("beforehide");
    this.getAllAccounts();
  }
}
