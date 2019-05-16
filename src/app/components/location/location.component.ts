import { Component, OnInit, NgZone, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { LocationService } from '../../services/location.service';
import { Location } from '../../models/location'
import { ContinuousLengthService } from '~/app/services/continuous-length.service';
import { ConversionService } from '~/app/services/conversion.service';
import { getBoolean } from "tns-core-modules/application-settings";

@Component({
  selector: 'ns-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css'],
  moduleId: module.id,
})
export class LocationComponent implements OnInit, OnDestroy {

    public currentContinuousLength: number;
    public location: Location;
    private loSubscription: Subscription;
    private clSubscription: Subscription;
    public isDarkModeActivated: boolean;

    public constructor(
        private zone: NgZone,
        private locationService: LocationService,
        private clService: ContinuousLengthService,
        private conversionService: ConversionService
        )
        {
            this.loSubscription = this.locationService.location$.subscribe(
                loc => {
                    const convertedLoc = this.conversionService.convertWgsToSweref(loc.latitude, loc.longitude);
                    this.location = new Location({latitude:convertedLoc[0], longitude:convertedLoc[1]});
                    //this.location = loc;
                });
            this.clSubscription = this.clService.continuousLength$.subscribe(
                cl => {
                    this.currentContinuousLength = cl;
                });
        }

    ngOnInit(){
        this.isDarkModeActivated = getBoolean("isDarkModeTurnedOn", false);
    }
    ngOnDestroy(){
        this.clSubscription.unsubscribe();
        this.loSubscription.unsubscribe();

    }

}
