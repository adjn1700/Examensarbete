import { Component, OnInit, NgZone, OnDestroy } from '@angular/core';
import * as Geolocation from "nativescript-geolocation";
import { Subscription } from 'rxjs';
import { LocationService } from '../../services/location.service';
import { Location } from '../../models/location'
import { ContinuousLengthService } from '~/app/services/continuous-length.service';


@Component({
  selector: 'ns-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css'],
  moduleId: module.id,
})
export class LocationComponent implements OnInit, OnDestroy {

    public currentContinuousLength: number;
    public location: Location;
    loSubscription: Subscription;
    clSubscription: Subscription;

    public constructor(
        private zone: NgZone,
        private locationService: LocationService,
        private clService: ContinuousLengthService
        )
        {
            this.loSubscription = this.locationService.location$.subscribe(
                loc => {
                    this.location = loc;
                });
            this.clSubscription = this.clService.continuousLength$.subscribe(
                cl => {
                    this.currentContinuousLength = cl;
                });
        }

    ngOnInit(){
    }
    ngOnDestroy(){
        this.clSubscription.unsubscribe();
        this.loSubscription.unsubscribe();

    }

}
