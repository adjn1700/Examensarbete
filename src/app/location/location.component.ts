import { Component, OnInit } from '@angular/core';
import * as Geolocation from "nativescript-geolocation";
import { LocationService } from './location.service';

@Component({
  selector: 'ns-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css'],
  moduleId: module.id,
})
export class LocationComponent implements OnInit {

    public latitude: number = 0;
    public longitude: number = 0;

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

    ngOnInit(){}

}
