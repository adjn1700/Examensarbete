import { Injectable } from '@angular/core';
import { ContinuousLengthService } from './continuous-length.service';
import { Subscription, BehaviorSubject, timer, empty } from 'rxjs';
import { ApiService } from './api.service';
import { GraphData } from '../models/graphData';
import { getNumber, getBoolean } from 'tns-core-modules/application-settings/application-settings';
import { switchMap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GraphService {

  public isCurrentAndNextActivated: boolean = false;

  private apiCallIsActive: boolean;
  private graphDataFromApi: GraphData[];
  private graphDataInterval: number;
  private graphValues: GraphData[];
  private clSubscription: Subscription;
  private graphSubscription: Subscription;
  private apiCallSubscription: Subscription;
  private currentContinuousLength: number;
  private nextGraphApiCal: number;

  private graphDataSource = new BehaviorSubject<GraphData[]>([]);
  public graphValues$ = this.graphDataSource.asObservable();

  public currentSlideService: number = 0;
  public isGraphDataAvailable: boolean = false;
  public iriRightCurrent: number;
  public crossfallRutBottomCurrent: number;
  public rutDepthMax17Current: number;
  public edgeDepthCurrent: number;
  public graphDataStartingLengthCurrent: number;
  public graphDataEndLengthCurrent: number;

  constructor(
    private clService: ContinuousLengthService,
    private apiService: ApiService
    ) {
    this.graphDataInterval = getNumber("graphIntervalValue", 500);
    this.isCurrentAndNextActivated = getBoolean("isOfflineGraphDataActivated", false)
    this.clSubscription = this.clService.continuousLength$.subscribe(cl => {
        this.currentContinuousLength = cl;
        if(this.checkIfPassedThreshold()){
            this.graphDataStartingLengthCurrent = null;
            this.graphDataEndLengthCurrent = null;
            this.setGraphData();
        }
        if(this.graphValues && this.graphValues.length){
            this.getCurrentGraphValues();
        }
    });
  }

  private getCurrentGraphValues(){
    for (let index = 0; index < this.graphValues.length; index++) {

        if(this.currentContinuousLength >= this.graphValues[index].StartContinuousLength && this.graphValues[index].EndContinuousLength >= this.currentContinuousLength){
            this.graphDataStartingLengthCurrent = this.graphValues[index].StartContinuousLength;
            this.graphDataEndLengthCurrent = this.graphValues[index].EndContinuousLength;
            this.iriRightCurrent = this.graphValues[index].IRIRight;
            this.crossfallRutBottomCurrent = this.graphValues[index].CrossfallRutBottom;
            this.rutDepthMax17Current = this.graphValues[index].RutDepthMax17;
            this.edgeDepthCurrent =  Math.round(this.graphValues[index].EdgeDepth * 100) / 100;
            this.graphValues.splice(index, 1);
            break;
        }
      }
  }


  private checkIfPassedThreshold(){
    if(this.currentContinuousLength > this.nextGraphApiCal){
        return true;
    }
    else{
        return false;
    }
  }

  private setNextApiThreshold(){
    this.nextGraphApiCal = this.graphValues[this.graphValues.length - 1].EndContinuousLength;
  }

  private getGraphInterval(){
      let totalInterval = this.graphDataInterval;
      if(this.isCurrentAndNextActivated){
        totalInterval = (totalInterval * 2);
      }
      return totalInterval;
  }

  private setGraphDataFromApi(data: GraphData[]){
      this.graphDataFromApi = data;
  }

  private setCurrentGraphData(){
     if(this.isCurrentAndNextActivated){
        let numberOfValuesRequired = (this.graphDataInterval / 20)
        this.graphValues = this.graphDataFromApi.splice(0, numberOfValuesRequired);
     }
     else{
         this.graphValues = this.graphDataFromApi;
         this.graphDataFromApi = [];
     }
     this.graphDataSource.next(this.graphValues);
  }

  private setNextGraphDataOfflineIfPossible(){
    if(this.graphDataFromApi && this.graphDataFromApi.length){
        this.graphValues = this.graphDataFromApi;
        this.graphDataSource.next(this.graphValues);
        this.graphDataFromApi = [];
        this.setNextApiThreshold();
        this.isGraphDataAvailable = true;
        this.cancelActiveApiRequest();
    }
    else{
        this.isGraphDataAvailable = false;
    }
  }

  private cancelActiveApiRequest(){
    this.apiCallSubscription.unsubscribe();
    this.apiCallIsActive = false;
  }

  public setGraphData(){
      if(!this.apiCallIsActive){
        this.apiCallIsActive = true;
        this.apiCallSubscription = timer(0, 3000).pipe(
            switchMap(() => {
                return this.apiService.getGraphData(this.currentContinuousLength, this.getGraphInterval()).pipe(
                    catchError((error) => {
                        this.isGraphDataAvailable = false;
                        this.setNextGraphDataOfflineIfPossible();
                        console.log("Grafdata kunde inte hämtas");
                        return empty();
                    }));
            }))
                .subscribe(data => {
                    if(data.length > 0){
                        console.log("Ett api-anrop gjordes och lyckades för graf")
                        this.setGraphDataFromApi(data);
                        this.setCurrentGraphData();
                        this.setNextApiThreshold();
                        this.isGraphDataAvailable = true;
                    }
                    else{
                        this.isGraphDataAvailable = false;
                    }
                    this.apiCallIsActive = false;
                    this.apiCallSubscription.unsubscribe();

                }, error => {
                    this.isGraphDataAvailable = false;
                    this.setNextGraphDataOfflineIfPossible();
                    //this.isGraphDataAvailable = false
                    console.error(error);
                    throw error;
                });
      }

    }

    public setNewGraphDataInterval(value: number){
        this.graphDataInterval = value;
    }

    public endCurrentSession(){
        this.cancelActiveApiRequest();
        this.graphDataFromApi = [];
        this.graphDataSource.next([]);
        this.graphValues = [];
    }
}
