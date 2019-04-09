import { Component, OnInit } from '@angular/core';
import { confirm, ConfirmOptions } from "tns-core-modules/ui/dialogs";

@Component({
  selector: 'ns-destination',
  templateUrl: './destination.component.html',
  styleUrls: ['./destination.component.css'],
  moduleId: module.id,
})
export class DestinationComponent implements OnInit {

    public destinationValue: number;
    constructor() {
        this.destinationValue = 1280;
    }

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
