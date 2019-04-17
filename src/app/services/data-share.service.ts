import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
  })

export class DataShareService {
    serviceCounty: string;
    serviceRoad: string;
    serviceDestination: number;
    serviceDirection: string;
}
