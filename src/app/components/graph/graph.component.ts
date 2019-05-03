import { Component, OnInit } from '@angular/core';

import { ObservableArray } from "tns-core-modules/data/observable-array";
import { observeOn } from 'rxjs/operators';
import { ApiService } from '~/app/services/api.service';
import { ContinuousLengthService } from '~/app/services/continuous-length.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ns-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css'],
  moduleId: module.id,
})
export class GraphComponent implements OnInit {

    private _iriData: ObservableArray<any>;
    private clSubscription: Subscription;
    public currentContinuousLength: number;
    public Iri: any[];

  constructor(
      private apiService: ApiService,
      private clService: ContinuousLengthService
  ) { }

  ngOnInit() {
    this.clSubscription = this.clService.continuousLength$.subscribe(cl => {
        this.currentContinuousLength = cl;
    });

    //Hämta grafdata fron api
    //this.setGraphData();

    this._iriData = new ObservableArray(this.getIri());
  }

  get dateIri(): ObservableArray<any> {
    return this._iriData;
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

    private setGraphData(){
        this.apiService.getGraphData(this.currentContinuousLength).toPromise().then(data => {
            if(data.length > 0){
                this.Iri = data;
                console.log(this.Iri);
            }
        }, error => {
            console.error(error);
        });
    }

}
