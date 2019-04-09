import { Injectable, NgZone } from '@angular/core';
import * as Geolocation from "nativescript-geolocation";

@Injectable({
  providedIn: 'root'
})
export class LocationService {

    private latitude: number;
    private longitude: number;
    private watchId: number;

    public constructor(private zone: NgZone) {
    }

    public getDeviceLocation(): Promise<any> {
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
                    this.latitude = location.latitude;
                    this.longitude = location.longitude;
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
