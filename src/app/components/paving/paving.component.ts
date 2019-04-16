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
  private pavings: PavementData[];

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    //funkar ej
    /*
    this.apiService.getPavementDataForRoad(this.selectedRoad).subscribe((pavings:PavementData[]) => {
        this.pavings = pavings;
        console.dir(this.pavings);
        });
    */
  }

  createPavingApiRequest(){



  }

}
