import { Injectable } from '@angular/core';
import { ContinuousLengthService } from './continuous-length.service';
import { Subscription, BehaviorSubject } from 'rxjs';
import { ApiService } from './api.service';
import { GraphData } from '../models/graphData';

@Injectable({
  providedIn: 'root'
})
export class GraphService {
  public graphValues: GraphData[];
  private clSubscription: Subscription;
  private currentContinuousLength: number;
  private nextGraphApiCal: number;

  private graphDataSource = new BehaviorSubject<GraphData[]>([]);
  public graphValues$ = this.graphDataSource.asObservable();

  constructor(
    private clService: ContinuousLengthService,
    private apiService: ApiService
    ) {
    this.clSubscription = this.clService.continuousLength$.subscribe(cl => {
        this.currentContinuousLength = cl;
    });
  }

  private checkIfPassedThreshold(){

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
