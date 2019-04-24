import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, interval, Subscription } from 'rxjs';
import { LocationService } from './location.service';
import { Location } from '../models/location'
import { ApiService } from './api.service';
import * as Geolocation from "nativescript-geolocation";
import { switchMap } from 'rxjs/operators';
import { Observable } from 'tns-core-modules/ui/page/page';

@Injectable({
  providedIn: 'root'
})
export class ContinuousLengthService implements OnDestroy{

  public isOffline: boolean = false;
  private currentLocation: Location;
  private startupContinuousLength: number;
  private currentOfflineContinuousLength: number;

  private locSubscription: Subscription;
  private distSubscription: Subscription;

  private continuousLengthSource = new BehaviorSubject<number>(0);
  continuousLength$ = this.continuousLengthSource.asObservable();

  constructor(
      private locationService: LocationService,
      private apiService: ApiService
      ) {
        //TEST-data


        /*
        //Code for fetching continuous length in intervals
        interval(1000).pipe(
            switchMap(() => this.apiService.getCurrentContinuousLength())
            ).subscribe(cl => this.continuousLengthSource.next(cl));
        */

    }

    ngOnDestroy(): void {
        this.locSubscription.unsubscribe;
        this.distSubscription.unsubscribe;
    }

    private setCurrentOfflineContinuousLength(distance: number){
        this.currentOfflineContinuousLength = this.currentOfflineContinuousLength + distance;
        //Only here for test, link to API later
        this.continuousLengthSource.next(this.currentOfflineContinuousLength);
    }

    public async getContinuousLengthForStartup(currentLocation: Location): Promise<number>{
        return this.apiService.getCurrentContinuousLength(currentLocation).toPromise();

    }

    public startWatchingContinuousLength(startupCl: number){
            this.startupContinuousLength = startupCl;
            this.currentOfflineContinuousLength = startupCl;
            //TEST for offline distance calc, service is NOT connected to api
            this.locSubscription = this.locationService.location$.subscribe(
                loc => {
                    this.currentLocation = loc;
                });
            this.distSubscription = this.locationService.distanceTravelled$.subscribe(
                dt =>{
                    this.setCurrentOfflineContinuousLength(dt);
                })
    }

    stopWatchingContinuousLength(){
        this.distSubscription.unsubscribe();
        this.locSubscription.unsubscribe();
        this.currentOfflineContinuousLength = null;
    }


}
