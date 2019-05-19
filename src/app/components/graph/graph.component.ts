import { Component, OnInit, OnDestroy, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

import { ObservableArray } from "tns-core-modules/data/observable-array";
import { observeOn } from 'rxjs/operators';
import { ApiService } from '~/app/services/api.service';
import { ContinuousLengthService } from '~/app/services/continuous-length.service';
import { Subscription } from 'rxjs';
import { GraphData } from '../../models/graphData';
import { GraphService } from '~/app/services/graph.service';
import { DataShareService } from '../../services/data-share.service';
import { Carousel } from 'nativescript-carousel';
import { getNumber } from "tns-core-modules/application-settings";


@Component({
  selector: 'ns-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css'],
  moduleId: module.id,
})
export class GraphComponent implements OnInit, OnDestroy, AfterViewInit {


    @ViewChild('graphCarousel') graphCarousel: ElementRef;

    public graphValues: GraphData[];
    public graphSub: Subscription;
    private clSubscription: Subscription;
    public currentContinuousLength: number;
    //For custom position bar
    //public cuColumns: string = "1*,auto, 99*";



    public sliderCurrent: number;
  constructor(
      private apiService: ApiService,
      private clService: ContinuousLengthService,
      public graphService: GraphService,
      private dataShareService: DataShareService
  ) { }

  ngAfterViewInit(): void {
    //Sets startup graph if has been selected by user
    let userSelectedStartupPage = getNumber("graphStartupPageValue", 0)
    if(userSelectedStartupPage != 0){
        setTimeout(() => {
            if(this.graphService.isGraphDataAvailable){
                let gCarousel = this.graphCarousel.nativeElement as Carousel;
                gCarousel.selectedPage = userSelectedStartupPage;
                this.graphService.currentSlideService = userSelectedStartupPage;
            }

        }, 1000);
    }


  }

  ngOnInit() {
    this.clSubscription = this.clService.continuousLength$.subscribe(cl => {
        this.currentContinuousLength = cl;
        //For custom position bar
        /*
        if(this.graphValues && this.graphValues.length){
            this.setCurrentPositionbarWidth(this.setTraveledPercentages());
        }
        */
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

    //For custom position bar
    /*
    private setTraveledPercentages(): number[]{
        let firstColumnValue: number = 0;
        let secondColumnValue: number = 0;
        let columns: number[] = [];
        let x = this.currentContinuousLength;
        let y = this.graphValues[this.graphValues.length - 1].EndContinuousLength;
        let z = this.graphValues[0].StartContinuousLength;

        let firstColumnPercentage = (x - z)/(y - z);
        firstColumnValue = firstColumnPercentage * 100;

        columns.push(firstColumnValue);

        secondColumnValue = (100 - firstColumnValue)
        columns.push(secondColumnValue);

        return columns;
    }


    private setCurrentPositionbarWidth(columns) {
      this.cuColumns = columns[0] + "*," + "auto," + columns[1] + "*";
    }
    */
}


