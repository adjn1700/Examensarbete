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
    public extraGraphValues: GraphData[];
    public graphSub: Subscription;
    private clSubscription: Subscription;
    public currentContinuousLength: number;
    public tickIntervalHorizontalAxis: number;
    private graphDataInterval: number;

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
    this.graphDataInterval = getNumber("graphIntervalValue", 500);
    this.setTickIntervalForHorizontalLine();
    this.clSubscription = this.clService.continuousLength$.subscribe(cl => {
        this.currentContinuousLength = cl;
    });


    //Update graphdata every 500 meter
    this.graphSub = this.graphService.graphValues$.subscribe(gs => {
        if(gs.length > 0){
            this.graphValues = gs;

            //Fix later to show dual graph lines for old + new measurement data
            /*
            this.resetGraphDataArrays();
            if(this.checkForUnexpectedDataLength(gs.length)){
                this.setGraphDataToSeperateArrays(gs);
            }
            else{
                this.graphValues = gs;
            }
            */

        }
    });

    //Display data in graph
    this.graphService.setGraphData();

  }

  ngOnDestroy(): void {
    this.graphSub.unsubscribe();
    this.clSubscription.unsubscribe();
    this.graphService.endCurrentSession();
    }

    /** sets custom tick interval to always show three values on x axis in graph  */
    private setTickIntervalForHorizontalLine(){
        let graphDataInterval = getNumber("graphIntervalValue", 500);
        console.log("graphdatainterval från settings är " + graphDataInterval)
        switch(graphDataInterval){
            case 250: {
                this.tickIntervalHorizontalAxis = 5;
                console.log("tick för interval 250")
                break;
            }
            case 500: {
                this.tickIntervalHorizontalAxis = 10;
                console.log("tick för interval 500")
                break;
            }
            case 750: {
                this.tickIntervalHorizontalAxis = 15;
                console.log("tick för interval 750")
                break;
            }
            case 1000: {
                this.tickIntervalHorizontalAxis = 20;
                console.log("tick för interval 1000")
                break;
            }
        }
    }


    public onGraphSwiped(args){
        this.graphService.currentSlideService = args.index;
    }

    private checkForUnexpectedDataLength(dataLength: number){
        //Sorts array when more data posts than expected from database
        let errorMargin = 2;
        let expectedNumberOfData = (this.graphDataInterval / 20) + errorMargin;
        if(dataLength > expectedNumberOfData){
            return true;
        }
        return false;
    }

    //Fix below two methods later to show dual graph lines for old + new measurement data
    /*
    private resetGraphDataArrays(){
        this.graphValues = [];
        this.extraGraphValues = [];
    }

    private setGraphDataToSeperateArrays(data){
        //Timestamp property used for test, change to MeasurementDate when working with API-request
        let timeStampCheck: Date = data[0].TimeStamp;

        let firstGraph: GraphData[] = [];
        let secondGraph: GraphData[] = [];
        //Sorts original array into two, seperated by date when graph data was measured
        for(let i = 1; i < data.length; i++){
            if(timeStampCheck === data[i].TimeStamp){
                firstGraph.push(data[i]);

            }
            else{
                secondGraph.push(data[i]);
            }
        }
        //Makes sure graphValues always gets assigned data from newest data measurement
        if (firstGraph[0].TimeStamp > secondGraph[1].TimeStamp){
            this.graphValues = firstGraph;
            this.extraGraphValues = secondGraph;
        }
        else{
            this.graphValues = secondGraph;
            this.extraGraphValues = firstGraph;
        }

    }*/

}



