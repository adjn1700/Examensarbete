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
  private graphDataSourceCurrent = new BehaviorSubject<GraphData[]>([]);
  public graphValuesCurrent$ = this.graphDataSourceCurrent.asObservable();
  public graphName;

  private iriSource = new BehaviorSubject<number>(0);
  iri$ = this.iriSource.asObservable();

  public iriRightCurrent: number;
  public crossfallRutBottomCurrent: number;
  public rutDepthMax17Current: number;
  public edgeDepthCurrent: number;

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

            for (let index = 0; index < this.graphValues.length; index++) {

              if(this.currentContinuousLength >= this.graphValues[index].StartContinuousLength && this.graphValues[index].EndContinuousLength >= this.currentContinuousLength){

                  this.iriRightCurrent = this.graphValues[index].IRIRight;
                  this.crossfallRutBottomCurrent = this.graphValues[index].CrossfallRutBottom;
                  this.rutDepthMax17Current = this.graphValues[index].RutDepthMax17;
                  this.edgeDepthCurrent = this.graphValues[index].EdgeDepth;

                  //console.log(this.rutDepthMax17Current);

                  break;
              }

            }
        }

    });

  }


  private checkIfPassedThreshold(){
    if(this.currentContinuousLength > this.nextGraphApiCal){
        return true;
    }
    else{
        return false;
    }
  }


  private isThereAnyData(){
    if(this.graphValues.length == 0){
        console.log("No data");

    }
    else {

    }
}

  private setNextApiThreshold(){
    this.nextGraphApiCal = this.graphValues[this.graphValues.length - 1].EndContinuousLength;
  }

  public setGraphData(){
    this.apiService.getGraphData(this.currentContinuousLength).toPromise().then(data => {
        if(data.length > 0){
            this.graphValues = data;
            this.graphDataSource.next(data);
            this.setNextApiThreshold();
        }
    }, error => {
        console.error(error);
        });
    }

}
