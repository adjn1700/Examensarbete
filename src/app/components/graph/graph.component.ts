import { Component, OnInit } from '@angular/core';

import { ObservableArray } from "tns-core-modules/data/observable-array";
import { observeOn } from 'rxjs/operators';
import { ApiService } from '~/app/services/api.service';
import { ContinuousLengthService } from '~/app/services/continuous-length.service';
import { Subscription } from 'rxjs';
import { GraphData } from '../../models/graphData';

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
    public graphValues: GraphData[];
    public nextGraphApiCal: number;

  constructor(
      private apiService: ApiService,
      private clService: ContinuousLengthService
  ) { }

  ngOnInit() {
    this.clSubscription = this.clService.continuousLength$.subscribe(cl => {
        this.currentContinuousLength = cl;
    });

    //Hämta grafdata fron api
    this.setGraphData();
    //console.log(this.graphValues[this.graphValues.length - 1].EndContinuousLength);

    //this._iriData = new ObservableArray(this.graphValues);
  }

    private setGraphData(){
        this.apiService.getGraphData(this.currentContinuousLength).toPromise().then(data => {
            if(data.length > 0){
                this.graphValues = data;
                this.nextGraphApiCal = this.graphValues[this.graphValues.length - 1].EndContinuousLength;
                console.log(this.nextGraphApiCal);
            }
        }, error => {
            console.error(error);
        });
    }

}
