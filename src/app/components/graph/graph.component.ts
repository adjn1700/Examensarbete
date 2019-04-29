import { Component, OnInit } from '@angular/core';

import { ObservableArray } from "tns-core-modules/data/observable-array";
import { observeOn } from 'rxjs/operators';

@Component({
  selector: 'ns-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css'],
  moduleId: module.id,
})
export class GraphComponent implements OnInit {

    private _dateTimeSource: ObservableArray<any>;

  constructor() { }

  ngOnInit() {
    this._dateTimeSource = new ObservableArray(this.getDateTimeSource());
  }

  get dateTimeSource(): ObservableArray<any> {
    return this._dateTimeSource;
}

  getDateTimeSource(): any[] {
    return [
        { TimeStamp: new Date(2015, 1, 11).getTime(), Amount: 2 },
        { TimeStamp: new Date(2015, 2, 11).getTime(), Amount: 6 },
        { TimeStamp: new Date(2015, 3, 1).getTime(), Amount: 1 },
        { TimeStamp: new Date(2015, 4, 3).getTime(), Amount: 3 },
        { TimeStamp: new Date(2015, 5, 11).getTime(), Amount: 4 },
        { TimeStamp: new Date(2015, 6, 1).getTime(), Amount: 7 },
        { TimeStamp: new Date(2015, 7, 3).getTime(), Amount: 5 },
        { TimeStamp: new Date(2015, 8, 11).getTime(), Amount: 4 },
        { TimeStamp: new Date(2015, 9, 1).getTime(), Amount: 2 },
        { TimeStamp: new Date(2015, 10, 3).getTime(), Amount: 6 },
    ];

    }
}
