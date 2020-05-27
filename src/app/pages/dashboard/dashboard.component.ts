import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { AccountService } from 'src/app/services/account-service/account.service';
import { MatchService } from 'src/app/services/match-service/match.service';
import { EndpointService } from 'src/app/services/endpoint-service/endpoint.service';
import * as Chart from 'chart.js';

/**
 * Manages statistics retrieved from backend and displays them in a nice way
 */
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(private authService : AuthService,
    private accountService : AccountService,
    private matchesService: MatchService,
    private EndpointService: EndpointService) { }

    data: any;

    /**
     * Get statistics from backend and create dummy data for diagram
     */
  ngOnInit(): void {
    this.EndpointService.observeDevMode.subscribe(data => {
      this.getAllAccounts();
      this.getAllHandshakes();
    });

    this.getAllAccounts();
    this.getAllHandshakes();

    this.data = {
      labels: ['January', 'February', 'March', 'April', 'May'],
      datasets: [
          {
              label: 'Coffee Meetings',
              backgroundColor: '#42A5F5',
              borderColor: '#1E88E5',
              data: [0, 0, 2, 7, 3]
          },
          {
              label: 'Business Plans exchanged',
              backgroundColor: '#00ACED',
              borderColor: '#7CB342',
              data: [0, 4, 3, 14, 0]
          },
          {
              label: 'Phone Calls made',
              backgroundColor: '#9CCC65',
              borderColor: '#7CB342',
              data: [4, 1, 6, 0, 2]
          },
          {
              label: 'Emails sent',
              backgroundColor: '#C69500',
              borderColor: '#7CB342',
              data: [2, 5, 12, 8, 3]
          }, 
      ]
  }
  }

  /**
   * The list of all accounts
   */
  accountList = [];
  investorList = [];
  startupList = [];
  handshakes = [];

  /**
   * Get all accounts from backend
   */
  getAllAccounts() {
    this.accountService.getAllAccounts().subscribe(
        data => {
            this.investorList = [];
            this.startupList = [];
            this.accountList = [];
            let investors = (data as any).investors;
            let startups = (data as any).startups;
            let accounts = (data as any).accounts;

            for(let investor in investors) {
              investors[investor].type = "Investor";
              this.investorList.push(investors[investor]);
            }

            for(let startup in startups) {
              startups[startup].type = "Startup";
              this.startupList.push(startups[startup]);
            }

            for(let account in accounts) {
              accounts[account].type = "Empty";
              this.accountList.push(accounts[account]);
            }

            this.accountList.sort((a, b) => {
                return (b as any).id - (a as any).id;
            });
        },
        err => {
            console.log(err);
        });
      }

      /**
       * Get all handshakes from backend
       */
      getAllHandshakes() {
        this.matchesService.getAllHandshakes().subscribe(data => {
          this.handshakes = data;
        })
      }
}
