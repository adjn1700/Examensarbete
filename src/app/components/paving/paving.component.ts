import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ApiService } from '~/app/services/api.service';
import { PavementData } from '~/app/models/pavementData';
import { ContinuousLengthService } from '~/app/services/continuous-length.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ns-paving',
  templateUrl: './paving.component.html',
  styleUrls: ['./paving.component.css'],
  moduleId: module.id,
})
export class PavingComponent implements OnInit, OnDestroy {

  public pbColumns: string = "0";
  public pavings: PavementData[];
  public currentContinuousLength: number;
  public currentPaving: PavementData;
  public nextPaving: PavementData;
  public test: string;
  private clSubscription: Subscription;
  public isDataAvailable: boolean = false;

  constructor(
      private apiService: ApiService,
      private clService: ContinuousLengthService
      ) { }

  ngOnInit() {
     this.clSubscription = this.clService.continuousLength$.subscribe(cl => {
        this.currentContinuousLength = cl;
        if(this.pavings){
            this.checkIfPavingEnded();
            this.setProgressbarWidth(this.setTraveledPercentage());
        }
    });
    this.setNewPavementDataForRoad();

  }

  ngOnDestroy(): void {
      this.clSubscription.unsubscribe();
  }

  private setCurrentAndNextPaving(){
      let numberOfPavings = this.pavings.length;

          if(numberOfPavings >= 2){
            this.currentPaving = this.pavings[0];
            this.nextPaving = this.pavings[1];
            this.isDataAvailable = true;

          }
          else if(numberOfPavings === 1){
              this.currentPaving = this.pavings[0];
              this.nextPaving = null;
              this.isDataAvailable = true;
          }
          else{
              this.currentPaving = null;
              this.nextPaving = null;
              this.isDataAvailable = false;
          }
  }

  private setNextPavingAsCurrent(){
      let numberOfPavings = this.pavings.length;
      if(numberOfPavings >= 2){
          this.currentPaving = this.pavings[1];
          this.nextPaving = null;
      }
  }

  private setNewPavementDataForRoad(){
    if(this.pavings){
    //Sets next paving before calling api, for performance and backup if api fails
    this.setNextPavingAsCurrent();
    }
    if(!this.clService.isOffline){
        this.apiService.getPavementDataForRoad(this.currentContinuousLength).toPromise().then(data => {
            if(data.length > 0){
                this.pavings = data;
                this.setCurrentAndNextPaving();
            }
        }, error => {
            console.error(error);
        });
    }
  }

  private checkIfPavingEnded(){
      if(this.currentContinuousLength >= this.currentPaving.EndContinuousLength){
          this.setNewPavementDataForRoad()
      }
  }

  setTraveledPercentage(){
      let x = this.currentContinuousLength;
      let y = this.currentPaving.EndContinuousLength;
      let z = this.currentPaving.StartContinuousLength;
      let currentPerc = (x-z)/(y-z);
      return currentPerc * 100;
  }
  setProgressbarWidth(percent) {
    this.pbColumns = percent + "*," + (100 - percent) + "*";
  }
}
