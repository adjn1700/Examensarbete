import { Injectable } from '@angular/core';
import { SelectedRoad } from '../models/selectedRoad'

@Injectable({
    providedIn: 'root'
  })

export class DataShareService {
    selectedDestination: number;
    selectedRoad: SelectedRoad;
}
