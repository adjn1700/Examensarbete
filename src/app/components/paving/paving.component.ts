import { Component, OnInit, Input } from '@angular/core';
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
export class PavingComponent implements OnInit {
  @Input() selectedRoad: SelectedRoad;
  public pbColumns;
  public pavings: PavementData[];
  public currentContinuousLength: number = 0;
  public currentPaving: PavementData;
  public nextPaving: PavementData;
  public test: string;
  subscription: Subscription;

  constructor(
      private apiService: ApiService,
      private clService: ContinuousLengthService
      ) { }

  ngOnInit() {
    this.currentPaving = new PavementData({
        StartContinuousLength:80,
        EndContinuousLength:1000,
        Length:20,
        PavementType:"Y1B - Enkel ytbehandling på bituminöst underlag",
        PavementDate:"2008-07-20T00:00:00"

    })
    //Gets array of pavement data for selected road

    this.apiService.getPavementDataForRoad(this.selectedRoad).subscribe(
        data => {
            this.pavings = data;
            console.log(this.pavings)
        },
        (error) => {console.log(error)}
        );
        //Starts reading stream of current continuous length
        this.subscription = this.clService.continuousLength$.subscribe(cl => {
            this.currentContinuousLength = cl;
            this.setProgressbarWidth(this.setTraveledPercentage());

        });
        //Test-data


  }

  private checkIfPavingEnded(percent: number){
      if(percent >= 100){
          //Set new paving object here later
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
