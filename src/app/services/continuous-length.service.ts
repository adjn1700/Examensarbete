import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, interval, Subscription, timer, empty } from 'rxjs';
import { LocationService } from './location.service';
import { Location } from '../models/location'
import { ApiService } from './api.service';
import { OfflineContinuousLength } from './offline-continuous-length.service';
import { switchMap, catchError } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { getBoolean } from "tns-core-modules/application-settings";

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
  private distanceSinceLastApiCall: number = 0;

  private locSubscription: Subscription;
  private apiClSubscription: Subscription;
  private offlineClSubscription: Subscription;


  private continuousLengthSource = new BehaviorSubject<number>(0);
  continuousLength$ = this.continuousLengthSource.asObservable();

  constructor(
      private locationService: LocationService,
      private apiService: ApiService,
      private offlineClService: OfflineContinuousLength
      ) {
        this.isAdjustingToSpeed = getBoolean("isSpeedCalcActivated", true);
      }

    ngOnDestroy(): void {
    }

    public getContinuousLengthForStartup(currentLocation: Location): Promise<number>{
        return this.apiService.getCurrentContinuousLength(currentLocation).toPromise();
    }

    /** For testing only */
    public startContinuousLengthServiceOfflineForTest(startupCl: number){
            this.currentContinuousLength = startupCl;
            this.offlineClService.startWatchingOfflineContinuousLength(startupCl);
            this.startSettingOfflineContinuousLength();

            this.locSubscription = this.locationService.location$.subscribe(
                loc => {
                    this.currentLocation = loc;
                });
    }

    public startContinuousLengthServiceWithApiConnection(startupCl: number){
        this.currentContinuousLength = startupCl;
        this.locSubscription = this.locationService.location$.subscribe(
            loc => {
                this.currentLocation = loc;
            });

        this.startGettingOnlineContinuousLength();
    }

    stopWatchingContinuousLength(){
        this.isOffline = false;
        this.currentContinuousLength = 0;
        this.continuousLengthSource.next(0);
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


    private getDifferenceInSeconds(startDate:Date, endDate:Date): number{
        let diff = endDate.getTime() - startDate.getTime();
        //console.log("timediff " + diff);
        let diffInSeconds = diff / 1000;
        //console.log("diffInSeconds " + diffInSeconds)
        return diffInSeconds;
    }

    /** Checks differrence in time between location sent to API and response,
     * then adds decvice movement passed since then (for accuracy) */
    private addSpeedAdjustment(input: number): number{
        //console.log("Location skickad för speed adjust");
        //console.log(this.locSentToApi);
        let currentSpeed = this.locSentToApi.speed;
        let locTimeStamp = this.locSentToApi.timestamp;
        let currentTimeStamp = new Date();
        let timeDiff = this.getDifferenceInSeconds(locTimeStamp, currentTimeStamp);

        let adjustment = Math.floor(currentSpeed * timeDiff * 0.66667);
        //console.log("justerad siffra " + adjustment);
        let total = adjustment + input;
        return total;
    }

    private setCurrentOnlineContinuousLength(input: number){
        if(this.isAdjustingToSpeed && this.locSentToApi && this.locSentToApi.speed >= 10){
            let adjustedCl = this.addSpeedAdjustment(input);
            //console.log("justerat utifrån speed " + adjustedCl);

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
                return this.apiService.getCurrentContinuousLength(this.currentLocation, true).pipe(
                    catchError((error) => this.handleApiRequestError(error)));
            }))
                .subscribe(result => {
                    this.isOffline = false;
                    this.setCurrentOnlineContinuousLength(Number(result));
                    this.numberOfFailedApiCalls = 0;
                    this.distanceSinceLastApiCall = 0;
                }, error => {console.error(error)});
    }

    private handleApiRequestError(error: HttpErrorResponse){
        console.log("fel vid api-request ");
        this.numberOfFailedApiCalls++;
        //Allows three failed attempts before switching to offline mode
        if(this.numberOfFailedApiCalls >= 3){
            this.isOffline = true;
            this.addDeviceMovementForApiFail();
        }
        else{
            this.storeDistanceTravelledForApiFail();
        }
        return empty();
    }

    private storeDistanceTravelledForApiFail(){
        let currentSpeed = Math.round(this.locSentToApi.speed);
        this.distanceSinceLastApiCall += currentSpeed;
        ("Distance since last api call: " + this.distanceSinceLastApiCall);
    }

    /**In case of API response fail, adds current meters per second travelled as backup until regained connection */
    private addDeviceMovementForApiFail(){
        //First method call will result in adding distance travelled since latest successful api call
        if(this.distanceSinceLastApiCall > 0){
            this.currentContinuousLength = this.currentContinuousLength + this.distanceSinceLastApiCall;
            this.continuousLengthSource.next(this.currentContinuousLength);
            this.distanceSinceLastApiCall = 0;
        }
        else{
            let currentSpeed = Math.round(this.locSentToApi.speed);
            this.currentContinuousLength = this.currentContinuousLength + currentSpeed;
            this.continuousLengthSource.next(this.currentContinuousLength);
        }

    }

    private startSettingOfflineContinuousLength(){
        this.locationService.isWatchingDistance = true;
        this.offlineClSubscription = this.offlineClService.offlineContinuousLength$.subscribe(cl => {
            this.continuousLengthSource.next(cl);
        });
    }

    private stopSettingOfflineContinuousLength(){
        this.locationService.isWatchingDistance = false;
        this.offlineClService.stopWatchingOfflineContinuousLength();
        this.offlineClSubscription.unsubscribe();
    }



}
