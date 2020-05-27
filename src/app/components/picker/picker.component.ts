import { Component, OnInit, Input } from '@angular/core';
import {DynamicDialogRef} from 'primeng/dynamicdialog';
import {DynamicDialogConfig} from 'primeng/dynamicdialog';

/**
 * This class manages picking an item out of a list and returning
 * the chosen item
 */

@Component({
  selector: 'app-picker',
  templateUrl: './picker.component.html',
  styleUrls: ['./picker.component.scss']
})
export class PickerComponent implements OnInit {

  items: [];

  constructor(public ref: DynamicDialogRef,
    public config: DynamicDialogConfig) { }

  ngOnInit(): void {
    this.items = (this.config as any).data;
  }

  /**
   * Close dialog and return chosen item
   * @param item the item to choose
   */
  selectItem(item) {
    this.ref.close(item);
  }
}
