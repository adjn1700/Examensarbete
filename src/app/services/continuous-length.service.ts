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
  private currentOfflineContinuousLength: number;
  private locSubscription: Subscription;
  private clSubscription: Subscription;

  private continuousLengthSource = new BehaviorSubject<number>(0);
  continuousLength$ = this.continuousLengthSource.asObservable();

  constructor(
      private locationService: LocationService,
      private apiService: ApiService
      ) {
        //TEST-data
        this.locSubscription = this.locationService.location$.subscribe(
        loc => {
            this.currentLocation = loc;
        });
        //TEST for offline distance calc, service is NOT connected to api
        this.locationService.startWatchingDistanceTravelled();
        this.clSubscription = this.locationService.distanceTravelled$.subscribe(
            dt =>{
                this.currentOfflineContinuousLength = this.currentOfflineContinuousLength + dt;
                //Only here for test, link to API later
                this.continuousLengthSource.next(dt);
            })
        /*
        //Code for fetching continuous length in intervals
        interval(1000).pipe(
            switchMap(() => this.apiService.getCurrentContinuousLength())
            ).subscribe(cl => this.continuousLengthSource.next(cl));
        */

    }

    ngOnDestroy(): void {
        this.locSubscription.unsubscribe;
        this.clSubscription.unsubscribe;
    }

    /*
    private async getContinuousLengthForStartup(): Promise<number>{
        return this.apiService.getCurrentContinuousLength().toPromise();

    }

    public async startService(){
        const currentCL = await this.getContinuousLengthForStartup();
        this.continuousLengthSource.next(currentCL);
        this.currentOfflineContinuousLength = currentCL;
    }
    */



}
