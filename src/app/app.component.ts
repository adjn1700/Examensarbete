import { Component, AfterViewInit, OnInit, ViewChild, ChangeDetectorRef  } from "@angular/core";
import { CardView } from 'nativescript-cardview';
import { registerElement } from 'nativescript-angular';
import { confirm, ConfirmOptions } from "tns-core-modules/ui/dialogs";
import { RouterExtensions } from 'nativescript-angular/router';

import { LocationService } from './services/location.service';
import{ ContinuousLengthService } from './services/continuous-length.service'

import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import * as app from "tns-core-modules/application";
import { Carousel, CarouselItem } from 'nativescript-carousel';


registerElement('CardView', () => CardView as any);
registerElement('Carousel', () => Carousel);
registerElement('CarouselItem', () => CarouselItem);

@Component({
    selector: "ns-app",
    moduleId: module.id,
    templateUrl: "./app.component.html"
})

export class AppComponent implements AfterViewInit{

    constructor(
        private router: RouterExtensions,
        private locationService: LocationService,
        private clService: ContinuousLengthService
    ){
    }

    ngAfterViewInit(){

    }

    cancelAlert(){
        let options: ConfirmOptions = {
            title: "Avsluta",
            message: "Är du säker att du vill avsluta och gå till förstasidan?",
            okButtonText: "Ja",
            cancelButtonText: "Avbryt"
        };
        confirm(options).then((result: boolean) => {
            if (result === true){
                this.backToStart();
            }
        });
    }

    backToStart(){
        this.endCurrentSession();
        this.closeDrawer();
        this.router.navigate(['/start-screen'], {
            clearHistory: true,
            animated: true, transition: {
                name: "slideRight",
                duration: 200,
                curve: "easeIn"
            }
        } );
    }

    private endCurrentSession(){
        this.locationService.stopWatchingLocation();
        this.clService.stopWatchingContinuousLength();
    }

    closeDrawer(): void {
        const sideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.closeDrawer();
    }

    toSettings(){
        this.closeDrawer();
        this.router.navigate(['/settings'], {
            animated: true, transition: {
                name: "slideLeft",
                duration: 200,
                curve: "easeIn"
            }
        } );
    }

}
