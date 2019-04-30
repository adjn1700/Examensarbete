import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, interval, Subscription, timer } from 'rxjs';
import { LocationService } from './location.service';
import { Location } from '../models/location'
import { ApiService } from './api.service';
import { OfflineContinuousLength } from './offline-continuous-length.service';
import * as Geolocation from "nativescript-geolocation";
import { switchMap } from 'rxjs/operators';
import { Observable } from 'tns-core-modules/ui/page/page';
import { formatDate } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ContinuousLengthService implements OnDestroy{

  public isOffline: boolean = false;
  private currentLocation: Location;
  private locSentToApi: Location;
  private currentContinuousLength: number;
  public isAdjustingToSpeed: boolean = false;

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
            this.currentContinuousLength = startupCl;
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

    public testContinuousLengthServiceWithApiConnection(startupCl: number){
        this.currentContinuousLength = startupCl;
        this.locSubscription = this.locationService.location$.subscribe(
            loc => {
                this.currentLocation = loc;
            });

        this.startGettingOnlineContinuousLength();
    }

    stopWatchingContinuousLength(){
        this.currentContinuousLength = 0;
        if(this.locSubscription){
            this.locSubscription.unsubscribe();
        }
        if(this.apiClSubscription){
            this.apiClSubscription.unsubscribe();
        }
        if(this.offlineClSubscription){
            this.stopGettingOfflineContinuousLength();
        }
    }

    //Currently not working, fix later

    private getDifferenceInSeconds(startDate:Date, endDate:Date): number{

        let diff = endDate.getTime() - startDate.getTime();
        console.log("timediff " + diff);
        let diffInSeconds = diff / 1000;
        console.log("diffInSeconds " + diffInSeconds)
        return diffInSeconds;
    }


    private addSpeedAdjustment(input: number): number{
        //Adjusts continuous length according to current speed and then sets value, fix later
        console.log("Location skickad för speed adjust");
        console.log(this.locSentToApi);
        let currentSpeed = this.locSentToApi.speed;
        let locTimeStamp = this.locSentToApi.timestamp;
        let currentTimeStamp = new Date();
        let timeDiff = this.getDifferenceInSeconds(locTimeStamp, currentTimeStamp);

        let adjustment = Math.floor(currentSpeed * timeDiff);
        console.log("justerad siffra " + adjustment);
        let total = adjustment + input;
        return total;
    }

    private setCurrentOnlineContinuousLength(input: number){
        if(this.isAdjustingToSpeed && this.locSentToApi && this.locSentToApi.speed >= 30){
            let adjustedCl = this.addSpeedAdjustment(input);
            console.log("justerat utifrån speed " + adjustedCl);

            this.currentContinuousLength = adjustedCl;
            this.continuousLengthSource.next(this.currentContinuousLength);
        }
        else{
            this.currentContinuousLength = input;
            this.continuousLengthSource.next(this.currentContinuousLength);
        }

    }

    private startGettingOnlineContinuousLength(){
        this.apiClSubscription = timer(0, 1000).pipe(
            switchMap(() => {
                this.locSentToApi = this.currentLocation;
                return this.apiService.getCurrentContinuousLength(this.currentLocation);
            }))
                .subscribe(result => {
                    this.setCurrentOnlineContinuousLength(Number(result));
                }, error => {console.error(error)});
    }

    private startGettingOfflineContinuousLength(){
        this.offlineClSubscription = this.offlineClService.offlineContinuousLength$.subscribe(cl => {
            this.continuousLengthSource.next(cl);
        });
    }

    private stopGettingOfflineContinuousLength(){
        this.offlineClService.stopWatchingOfflineContinuousLength();
        this.offlineClSubscription.unsubscribe();
    }



}
