import { Injectable, EventEmitter } from '@angular/core';
import { SelectedRoad } from '../models/selectedRoad';

@Injectable({
    providedIn: 'root'
  })

export class DataShareService {
    selectedDestination: number;
    selectedRoad: SelectedRoad;
    devmode: boolean = true;

    currentSlideService: number = 0;

    setData(slide:number){
        this.currentSlideService = slide;
    }

    getData():any{
        return this.currentSlideService;
    }
}
