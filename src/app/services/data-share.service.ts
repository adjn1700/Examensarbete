import { Injectable } from '@angular/core';
import { SelectedRoad } from '../models/selectedRoad'

@Injectable({
    providedIn: 'root'
  })

export class DataShareService {
    serviceCounty: string;
    serviceRoad: string;
    serviceDestination: number;
    serviceDirection: string;
    selectedRoad: SelectedRoad;
}
