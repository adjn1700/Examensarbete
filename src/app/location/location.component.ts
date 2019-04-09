import { Component, OnInit } from '@angular/core';
import { LocationService } from './location.service';


@Component({
  selector: 'ns-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css'],
  moduleId: module.id,
})
export class LocationComponent implements OnInit {

    public latitude: number;
    public longitude: number;

    public constructor(private locationService : LocationService ) {
    }

    public updateLocation() {
        this.locationService.getDeviceLocation()
        .then(result => {
            this.latitude = result.latitude;
            this.longitude = result.longitude;
        }, error => {
            console.error(error);
        });
    }

    ngOnInit(){
        this.updateLocation();
    }

}
