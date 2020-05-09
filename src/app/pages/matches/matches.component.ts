import { Component, OnInit } from '@angular/core';
import { MatchService } from 'src/app/services/match-service/match.service';

@Component({
  selector: 'app-matches',
  templateUrl: './matches.component.html',
  styleUrls: ['./matches.component.scss']
})
export class MatchesComponent implements OnInit {

  constructor(private matchService : MatchService) { }

  matchList = [];

  account: any = {};

  selectedRelatinship: any;

  first = 0;
  cols: any[];
  rows = 10;

  ngOnInit(): void {
    this.matchService.getAllRelationships().subscribe(data => {
      this.matchList = data;
    })
  }

  formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear(),
        hour = d.getHours(),
        minute = d.getMinutes(),
        seconds = d.getSeconds();


    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [day, month, year].join('.') + " " + [hour, minute, seconds].join(':');
}
}
