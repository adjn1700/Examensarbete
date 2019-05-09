import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';

import { ObservableArray } from "tns-core-modules/data/observable-array";
import { observeOn } from 'rxjs/operators';
import { ApiService } from '~/app/services/api.service';
import { ContinuousLengthService } from '~/app/services/continuous-length.service';
import { Subscription } from 'rxjs';
import { GraphData } from '../../models/graphData';
import { GraphService } from '~/app/services/graph.service';
import { DataShareService } from '../../services/data-share.service';

@Component({
  selector: 'ns-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css'],
  moduleId: module.id,
})
export class GraphComponent implements OnInit, OnDestroy {

    public Iri: any[];
    public graphValues: GraphData[];
    public nextGraphApiCal: number;
    public graphSub: Subscription;
    private _iriData: ObservableArray<any>;
    private clSubscription: Subscription;
    public currentContinuousLength: number;

    public sliderCurrent: number;
  constructor(
      private apiService: ApiService,
      private clService: ContinuousLengthService,
      private graphService: GraphService,
      private dataShareService: DataShareService
  ) { }

  ngOnInit() {
    this.clSubscription = this.clService.continuousLength$.subscribe(cl => {
        this.currentContinuousLength = cl;
    });


    //Update graphdata every 500 meter
    this.graphSub = this.graphService.graphValues$.subscribe(gs => {
        if(gs.length > 0){
            this.graphValues = gs;
            console.log(this.graphValues);

        }
    });

    //Display data in graph
    this.graphService.setGraphData();

  }

  ngOnDestroy(): void {
    this.graphSub.unsubscribe();
    this.clSubscription.unsubscribe();
    }


    public onGraphSwiped(args){
        this.graphService.currentSlideService = args.index;
    }



}


