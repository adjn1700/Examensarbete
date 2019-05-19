import { Injectable } from '@angular/core';
import { ContinuousLengthService } from './continuous-length.service';
import { Subscription, BehaviorSubject } from 'rxjs';
import { ApiService } from './api.service';
import { GraphData } from '../models/graphData';

@Injectable({
  providedIn: 'root'
})
export class GraphService {

  private graphValues: GraphData[];
  private clSubscription: Subscription;
  private graphSubscription: Subscription;
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

    this.clSubscription = this.clService.continuousLength$.subscribe(cl => {
        this.currentContinuousLength = cl;
        if(this.checkIfPassedThreshold()){
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

  public setGraphData(){
    if(!this.clService.isOffline){
        this.apiService.getGraphData(this.currentContinuousLength).toPromise().then(data => {
            if(data.length > 0){
                this.graphValues = data;
                this.graphDataSource.next(data);
                this.setNextApiThreshold();
                this.isGraphDataAvailable = true;
            }
            else{
                this.isGraphDataAvailable = false;
            }
        }, error => {
            this.isGraphDataAvailable = false
            console.error(error);
            });
        }
        else{
            this.isGraphDataAvailable = false;
        }
    }
}
