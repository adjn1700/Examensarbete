import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ApiService } from '~/app/services/api.service';
import { PavementData } from '~/app/models/pavementData';
import { SelectedRoad } from '~/app/models/selectedRoad';
import { ContinuousLengthService } from '~/app/services/continuous-length.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ns-paving',
  templateUrl: './paving.component.html',
  styleUrls: ['./paving.component.css'],
  moduleId: module.id,
})
export class PavingComponent implements OnInit, OnDestroy {

  @Input() selectedRoad: SelectedRoad;
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
        console.log(cl);
        this.currentContinuousLength = cl;
        if(this.pavings){
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

          if(numberOfPavings === 2){
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

  private setNewPavementDataForRoad(){
    this.apiService.getPavementDataForRoad(this.selectedRoad, this.currentContinuousLength).toPromise().then(data => {
        if(data.length > 0){
            console.log(data);
            this.pavings = data;
            this.setCurrentAndNextPaving();
        }
    }, error => {
        console.error(error);
    });
  }

  private checkIfPavingEnded(percent: number){
      if(percent >= 100){
          this.setNewPavementDataForRoad()
          console.log("paving ended!")
      }
  }

  setTraveledPercentage(){
      let x = this.currentContinuousLength;
      let y = this.currentPaving.EndContinuousLength;
      let currentPerc = x/y;
      return currentPerc * 100;
  }
  setProgressbarWidth(percent) {
    this.checkIfPavingEnded(percent);
    this.pbColumns = percent + "*," + (100 - percent) + "*";
  }

  testTap(){
      console.log(this.pavings[0]);
      console.log(this.currentContinuousLength);
      console.log(this.currentPaving);
  }
}
