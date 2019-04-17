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
        });
  }

  testTap(){
      console.log(this.pavings[0]);
      console.log(this.currentContinuousLength);
      console.log(this.currentPaving);
  }
}
