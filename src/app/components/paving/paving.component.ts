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
  public pbColumns;
  public pavings: PavementData[];
  public currentContinuousLength: number;
  public currentPaving: PavementData;
  public nextPaving: PavementData;
  public test: string;
  private clSubscription: Subscription;

  constructor(
      private apiService: ApiService,
      private clService: ContinuousLengthService
      ) { }

  ngOnInit() {
      //Test-data
      /*
        this.currentPaving = new PavementData({
        StartContinuousLength:80,
        EndContinuousLength:1000,
        Length:20,
        PavementType:"Y1B - Enkel ytbehandling på bituminöst underlag",
        PavementDate:"2008-07-20T00:00:00"
        })
        */
     //Starts reading stream of current continuous length
     this.clSubscription = this.clService.continuousLength$.subscribe(cl => {
        console.log(cl);
        this.currentContinuousLength = cl;
        if(this.pavings){
            this.setProgressbarWidth(this.setTraveledPercentage());
        }
    });

    //Gets array of pavement data for selected road
    this.apiService.getPavementDataForRoad(this.selectedRoad).subscribe(
        data => {
            this.pavings = data;
            this.setCurrentAndNextPaving();
        },
        (error) => {console.log(error)}
        );

  }

  ngOnDestroy(): void {
      this.clSubscription.unsubscribe();
  }

  private setCurrentAndNextPaving(){
      //Fix later
      this.currentPaving = this.pavings[0];
      this.nextPaving = this.pavings[1];
  }

  private checkIfPavingEnded(percent: number){
      if(percent >= 100){
          //this.setCurrentAndNextPaving()
          //Set new paving object here later
          this.currentPaving = this.pavings[1];
          this.nextPaving = this.pavings[2];
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
