import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, interval, Subscription, timer } from 'rxjs';
import { LocationService } from './location.service';
import { Location } from '../models/location'
import { ApiService } from './api.service';
import { OfflineContinuousLength } from './offline-continuous-length.service';
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
  private currentContinuousLength: number;
  private timeReceived: Date;

  private locSubscription: Subscription;
  private apiClSubscription: Subscription;
  private offlineClSubscription: Subscription;

  private continuousLengthSource = new BehaviorSubject<number>(0);
  continuousLength$ = this.continuousLengthSource.asObservable();

  constructor(
      private locationService: LocationService,
      private apiService: ApiService,
      private offlineClService: OfflineContinuousLength
      ) {}

    ngOnDestroy(): void {
    }


    public getContinuousLengthForStartup(currentLocation: Location): Promise<number>{
        return this.apiService.getCurrentContinuousLength(currentLocation).toPromise();
    }

    public startContinuousLengthService(startupCl: number){
            this.startupContinuousLength = startupCl;
            //Starts offline calculation in case of connection loss
            this.offlineClService.startWatchingOfflineContinuousLength(startupCl);

            //Remove when API-connection working
            this.startGettingOfflineContinuousLength();

            //Add when working to get from API
            //this.startGettingOnlineContinuousLength();

            this.locSubscription = this.locationService.location$.subscribe(
                loc => {
                    this.currentLocation = loc;
                });
    }
    stopWatchingContinuousLength(){
        this.locSubscription.unsubscribe();
        this.offlineClService.stopWatchingOfflineContinuousLength();
        if(this.apiClSubscription){
            this.apiClSubscription.unsubscribe();
        }
        if(this.offlineClSubscription){
            this.offlineClSubscription.unsubscribe();
        }
    }

    private setCurrentOnlineContinuousLength(input: number){
        //Adjusts continuous length according to current speed and then sets value
        let currentSpeed = this.currentLocation.speed;
    }

    private startGettingOnlineContinuousLength(){
        this.apiClSubscription = timer(0, 1000).pipe(
            switchMap(() => this.apiService.getCurrentContinuousLength(this.currentLocation)))
                .subscribe(result => {
                    this.setCurrentOnlineContinuousLength(result);
                }, error => {console.error(error)});
    }

    private startGettingOfflineContinuousLength(){
        this.offlineClSubscription = this.offlineClService.offlineContinuousLength$.subscribe(cl => {
            this.continuousLengthSource.next(cl);
        });
    }

    private stopGettingOfflineContinuousLength(){
        this.offlineClSubscription.unsubscribe();
    }



}
