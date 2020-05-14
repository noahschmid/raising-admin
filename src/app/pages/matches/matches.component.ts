import {
  Component,
  OnInit
} from '@angular/core';
import {
  MatchService
} from 'src/app/services/match-service/match.service';
import {
  EndpointService
} from 'src/app/services/endpoint-service/endpoint.service';
import {
  SortEvent
} from 'primeng/api/sortevent';
import {
  FilterUtils
} from 'primeng/utils';
import { DialogService } from 'primeng/dynamicdialog';
import { SpinnerComponent } from 'src/app/components/spinner/spinner.component';

@Component({
  selector: 'app-matches',
  templateUrl: './matches.component.html',
  styleUrls: ['./matches.component.scss'],
  providers:[DialogService]
})
export class MatchesComponent implements OnInit {

  constructor(private matchService: MatchService,
    private endpointService: EndpointService,
    private dialogService : DialogService) {}

  matchList = [];

  account: any = {};

  selectedRelatinship: any;

  first = 0;
  cols: any[];
  rows = 10;

  loading: boolean = false;

  ngOnInit(): void {
    this.endpointService.observeDevMode.subscribe(data => {
      this.getAllRelationships();
    });

    this.getAllRelationships();
  }

  getAllRelationships() {
    let spinner = this.dialogService.open(SpinnerComponent, {
      showHeader:false,
      closable:false,
      styleClass:"spinner"
    });

    this.matchService.getAllRelationships().subscribe(data => {
        this.loading = false;
        this.matchList = data;
        spinner.close();

        this.cols = [{
            field: 'matchId',
            header: 'id'
          },
          {
            field: 'investor',
            header: 'Investor'
          },
          {
            field: 'startup',
            header: 'Startup'
          },
          {
            field: 'state',
            header: 'State'
          },
          {
            field: 'score',
            header: 'Score'
          },
          {
            field: 'interactions',
            header: 'Interactions'
          },
          {
            field: 'lastChanged',
            header: 'Last Changed'
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
      },
      err => {
        spinner.close();
        console.log(err);
      });
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
    return this.first === (this.matchList.length - this.rows);
  }

  isFirstPage(): boolean {
    return this.first === 0;
  }

  onRowSelect(event) {

  }
}
