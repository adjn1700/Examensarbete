import { Injectable, NgZone } from '@angular/core';
import * as Geolocation from "nativescript-geolocation";
import { BehaviorSubject } from 'rxjs';
import { Location } from '../models/location';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
    private locationSource = new BehaviorSubject<Location>(new Location({longitude:0, latitude:0}));
    private distanceTravelledSource = new BehaviorSubject<number>(0);

    private locations = [];
    private watchId: number;
    public isWatchingDistance: boolean = false;

    //observable location streams for location and device movement
    location$ = this.locationSource.asObservable();
    distanceTravelled$ = this.distanceTravelledSource.asObservable();

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

    public async getDeviceLocation(): Promise<any> {
        return new Promise((resolve, reject) => {
            Geolocation.enableLocationRequest().then(() => {
                Geolocation.getCurrentLocation({timeout: 10000}).then(location => {
                    resolve(location);
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
                //For calculating device movement
                    this.locations.push(location)
                    this.calcDistanceTravelled();

                    let loc = new Location();
                    loc.latitude = location.latitude;
                    loc.longitude = location.longitude;
                    //console.log(loc);
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
            this.locations = [];
        }
    }

    private calcDistanceTravelled(){
        let locationCount = this.locations.length;
        if (locationCount >= 2) {
            let previousLocation = this.locations[locationCount - 2]
            let currentLocation = this.locations[locationCount - 1]
            // get the distance between the last two locations
            var distance = Math.round(Geolocation.distance(previousLocation, currentLocation));
            console.log(distance)
            // update observable stream with distance
            this.distanceTravelledSource.next(distance);
            this.reduceDistanceArraySize();
        }
    }

    //Keeps array size minimal for performance
    private reduceDistanceArraySize(){
        if(this.locations.length >= 2){
            this.locations.splice(0,1);
        }
    }

}
