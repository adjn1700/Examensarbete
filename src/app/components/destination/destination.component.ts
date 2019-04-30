import { Component, OnInit } from '@angular/core';
import { confirm, ConfirmOptions } from "tns-core-modules/ui/dialogs";
import { DataShareService } from '../../services/data-share.service';
import { ContinuousLengthService } from '~/app/services/continuous-length.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'ns-destination',
  templateUrl: './destination.component.html',
  styleUrls: ['./destination.component.css'],
  moduleId: module.id,
})
export class DestinationComponent implements OnInit {

    public destinationValue: number;
    public distanceLeft: number;
    private currentContinuousLength: number;
    private subscription: Subscription;

    constructor(
        private dataShareService: DataShareService,
        private clService: ContinuousLengthService
        ) {
        this.destinationValue = this.dataShareService.selectedDestination;
        this.isDestinationActive();
        this.subscription = this.clService.continuousLength$.subscribe(cl => {
            this.currentContinuousLength = cl
            this.calcDistanceLeft(cl);
        });
    }

    ngOnInit() {
    }

    calcDistanceLeft(cl:number){
        let x = cl;
        let y = this.destinationValue;
        let result = y - x;
        this.distanceLeft = result;
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

    showAlert(): void {
        let options: ConfirmOptions = {
            title: "Avsluta navigation",
            message: "Är du säker?",
            okButtonText: "Ja",
            cancelButtonText: "Avbryt"
        };
        confirm(options).then((result: boolean) => {
            if (result === true){
                this.destinationValue = null;
            }
        });
    }

}
