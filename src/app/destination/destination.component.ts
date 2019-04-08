import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ns-destination',
  templateUrl: './destination.component.html',
  styleUrls: ['./destination.component.css'],
  moduleId: module.id,
})
export class DestinationComponent implements OnInit {

    public destinationValue: number;
    constructor() { }

    ngOnInit() {
    }

    isDestinationActive(): boolean{
        if(this.destinationValue)
            return true;
        else
            return false;
    }

    addDestination(): void {
        this.destinationValue = 1280;
    }

}
