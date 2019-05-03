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
    this._dateTimeSource = new ObservableArray(this.getIri());
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

getIri(): any[] {
    return [
        { Value: 6, LopandeLangd: 1000},
        { Value: 6.4, LopandeLangd: 1100},
        { Value: 7, LopandeLangd: 1200},
        { Value: 8, LopandeLangd: 1300},
        { Value: 8.1, LopandeLangd: 1400},
        { Value: 7.5, LopandeLangd: 1500},
        { Value: 7, LopandeLangd: 1600},
        { Value: 7, LopandeLangd: 1700},
        { Value: 7.6, LopandeLangd: 1800},
        { Value: 7, LopandeLangd: 1900},
        { Value: 6, LopandeLangd: 2000}

    ];

    }
}
