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
    public tickIntervalHorizontalAxis: number;

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
    this.setTickIntervalForHorizontalLine();
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
}


