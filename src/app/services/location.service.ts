import { Injectable, NgZone } from '@angular/core';
import * as Geolocation from "nativescript-geolocation";
import { BehaviorSubject } from 'rxjs';
import { Location } from '../models/location';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
    //observable location source
    private locationSource = new BehaviorSubject<Location>(new Location({longitude:0, latitude:0}));
    private locations = [];
    private watchId: number;

    //observable location stream
    location$ = this.locationSource.asObservable();

    public constructor(private zone: NgZone) {
    }

    //Sets a single updated location and adds it to the stream
    public updateCurrentLocation() {
        this.getDeviceLocation().then(result => {
            let loc = new Location();
            loc.latitude = result.latitude;
            loc.longitude = result.longitude;
            this.locationSource.next(loc);
        }, error => {
            console.error(error);
        });
    }

    private getDeviceLocation(): Promise<any> {
        return new Promise((resolve, reject) => {
            Geolocation.enableLocationRequest().then(() => {
                Geolocation.getCurrentLocation({timeout: 10000}).then(location => {
                    resolve(location);
                    console.log(location);
                }).catch(error => {
                    reject(error);
                });
            });
        });
    }

    public startWatchingLocation() {
        this.watchId = Geolocation.watchLocation(location => {
            if(location) {
                this.zone.run(() => {
                    let loc = new Location();
                    loc.latitude = location.latitude;
                    loc.longitude = location.longitude;
                    this.locationSource.next(loc);
                });
            }
        }, error => {
            //console.dump(error);
        }, { updateDistance: 1, minimumUpdateTime: 1000 });
    }

    public stopWatchingLocation() {
        if(this.watchId) {
            Geolocation.clearWatch(this.watchId);
            this.watchId = null;

        }
    }
}
