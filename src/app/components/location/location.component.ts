import { Component, OnInit, NgZone, OnDestroy } from '@angular/core';
import * as Geolocation from "nativescript-geolocation";
import { Subscription } from 'rxjs';
import { LocationService } from '../../services/location.service';
import { Location } from '../../models/location'


@Component({
  selector: 'ns-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css'],
  moduleId: module.id,
})
export class LocationComponent implements OnInit, OnDestroy {

    public currentContinuousLength: number;
    public location: Location;
    subscription: Subscription;

    public constructor(
        private zone: NgZone,
        private locationService: LocationService
        )
        {
            this.subscription = this.locationService.location$.subscribe(
                loc => {
                    this.location = loc;
                }
            )
        }

    ngOnInit(){
    }
    ngOnDestroy(){
        this.subscription.unsubscribe();
    }

}
