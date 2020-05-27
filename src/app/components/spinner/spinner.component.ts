import { Component, OnInit } from '@angular/core';

/**
 * This class does nothing. It's just a spinner indicating that something is loading,
 * which is all done via HTML/CSS
 */

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
