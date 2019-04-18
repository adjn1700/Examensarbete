import { Injectable } from '@angular/core';
import { BehaviorSubject, interval } from 'rxjs';
import { LocationService } from './location.service';
import { Location } from '../models/location'
import { ApiService } from './api.service';
import * as Geolocation from "nativescript-geolocation";
import { switchMap } from 'rxjs/operators';
import { Observable } from 'tns-core-modules/ui/page/page';

@Injectable({
  providedIn: 'root'
})
export class ContinuousLengthService {
  public isOffline: boolean = false;
  private currentLocation: Location;
  private locations: Location[];

  private continuousLengthSource = new BehaviorSubject<number>(0);
  continuousLength$ = this.continuousLengthSource.asObservable();

  constructor(
      private locationService: LocationService,
      private apiService: ApiService
      ) {
      //TEST-data
      //this.continuousLengthSource.next(3100);
      this.locationService.location$.subscribe(
          loc => {
              this.currentLocation = loc;
            });
        /*
        //Code for fetching continuous length in intervals
       interval(1000).pipe(
           switchMap(() => this.apiService.getCurrentContinuousLength())
           ).subscribe(cl => this.continuousLengthSource.next(cl));
       */
      this.apiService.getCurrentContinuousLength().subscribe(data => this.continuousLengthSource.next(data));
    }


}
