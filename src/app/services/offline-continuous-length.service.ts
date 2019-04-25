import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, interval, Subscription, timer } from 'rxjs';
import { LocationService } from './location.service';
import { Location } from '../models/location'
import { ApiService } from './api.service';
import * as Geolocation from "nativescript-geolocation";
import { switchMap } from 'rxjs/operators';
import { Observable } from 'tns-core-modules/ui/page/page';

@Injectable({
  providedIn: 'root'
})
export class OfflineContinuousLength implements OnDestroy{

  private totalOfflineDistanceTravelled: number;
  private distSubscription: Subscription;

  private offlineContinuousLengthSource = new BehaviorSubject<number>(0);
  offlineContinuousLength$ = this.offlineContinuousLengthSource.asObservable();

  constructor( private locationService: LocationService) {}

    ngOnDestroy(): void {
    }
    private setCurrentOfflineContinuousLength(distance: number){
        this.totalOfflineDistanceTravelled = this.totalOfflineDistanceTravelled + distance;
        //Only here for test, link to API later
        this.offlineContinuousLengthSource.next(this.totalOfflineDistanceTravelled);
    }

    private adjustCurrentOfflineContinuousLength(onlineContinuousLength: number){
        //Add later to make adjustments according continuous length collected from api, for precision
    }

    public startWatchingOfflineContinuousLength(startupCl: number){
            //Set starting value which offline distance will be added to
            this.totalOfflineDistanceTravelled = startupCl;
            //TEST for offline distance calc, service is NOT connected to api
            this.distSubscription = this.locationService.distanceTravelled$.subscribe(
                dt =>{
                    this.setCurrentOfflineContinuousLength(dt);
                })
    }

    stopWatchingOfflineContinuousLength(){
        this.distSubscription.unsubscribe();
        this.totalOfflineDistanceTravelled = null;
    }


}
