import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from '~/app/services/api.service';
import { PavementData } from '~/app/models/pavementData';
import { SelectedRoad } from '~/app/models/selectedRoad';

@Component({
  selector: 'ns-paving',
  templateUrl: './paving.component.html',
  styleUrls: ['./paving.component.css'],
  moduleId: module.id,
})
export class PavingComponent implements OnInit {
  @Input() selectedRoad: SelectedRoad;
  public pavings: PavementData[] = [];
  public test: string;

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.apiService.getPavementDataForRoad(this.selectedRoad).subscribe(
        data => {
            this.pavings = data["PavementData"];
            console.log(this.pavings)
        },
        (error) => {console.log(error)}
        );
  }

  testTap(){
      console.log(this.pavings[0])
  }
}
