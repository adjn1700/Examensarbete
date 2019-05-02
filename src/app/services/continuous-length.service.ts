import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, interval, Subscription, timer, empty } from 'rxjs';
import { LocationService } from './location.service';
import { Location } from '../models/location'
import { ApiService } from './api.service';
import { OfflineContinuousLength } from './offline-continuous-length.service';
import { switchMap, catchError } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ContinuousLengthService implements OnDestroy{

  public isOffline: boolean = false;
  private currentLocation: Location;
  private locSentToApi: Location;
  private currentContinuousLength: number;
  public isAdjustingToSpeed: boolean = false;
  private apiCallFrequency: number = 1000;
  private numberOfFailedApiCalls: number = 0;

  private locSubscription: Subscription;
  private apiClSubscription: Subscription;
  private offlineClSubscription: Subscription;
  private distSubscription: Subscription;


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
            this.startSettingOfflineContinuousLength();

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
            this.stopSettingOfflineContinuousLength();
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
        this.apiClSubscription = timer(0, this.apiCallFrequency).pipe(
            switchMap(() => {
                this.locSentToApi = this.currentLocation;
                return this.apiService.getCurrentContinuousLength(this.currentLocation).pipe(
                    catchError((error) => this.handleApiRequestError(error)));
            }))
                .subscribe(result => {
                    this.numberOfFailedApiCalls = 0;
                    this.isOffline = false;
                    this.setCurrentOnlineContinuousLength(Number(result));
                }, error => {console.error(error)});
    }

    private handleApiRequestError(error: HttpErrorResponse){
        console.log("fel vid api-request " + error.message);
        this.numberOfFailedApiCalls++;
        if(this.numberOfFailedApiCalls >= 1){
            this.isOffline = true;
            this.addDeviceMovementForApiFail();
        }
        return empty();
    }

    private addDeviceMovementForApiFail(){
        let currentSpeed = Math.floor(this.locSentToApi.speed);
        this.currentContinuousLength = this.currentContinuousLength + currentSpeed;
        this.continuousLengthSource.next(this.currentContinuousLength);
    }

    private startSettingOfflineContinuousLength(){
        this.offlineClSubscription = this.offlineClService.offlineContinuousLength$.subscribe(cl => {
            this.continuousLengthSource.next(cl);
        });
    }

    private stopSettingOfflineContinuousLength(){
        this.offlineClService.stopWatchingOfflineContinuousLength();
        this.offlineClSubscription.unsubscribe();
    }



}
