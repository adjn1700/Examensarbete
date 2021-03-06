import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular/router';
import { ApiService } from '~/app/services/api.service';
import { confirm, ConfirmOptions, alert } from "tns-core-modules/ui/dialogs";
import {SelectedRoad} from '../../models/selectedRoad'
import { Observable } from 'tns-core-modules/ui/page/page';
import { LocationService } from '../../services/location.service';
import {ActivatedRoute} from "@angular/router";
import { DataShareService } from '../../services/data-share.service';
import { ContinuousLengthService } from '~/app/services/continuous-length.service';
import { ConversionService } from '~/app/services/conversion.service';
import { Location } from '~/app/models/location';
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import * as app from "tns-core-modules/application";
import { keepAwake } from "nativescript-insomnia";
import { InternetConnectionService } from '../../services/internet-connection.service';
import { TextField } from "tns-core-modules/ui/text-field";
import { getBoolean } from "tns-core-modules/application-settings";
import {LoadingIndicator} from "nativescript-loading-indicator";

@Component({
  selector: 'ns-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  moduleId: module.id
})
export class DashboardComponent implements OnInit, OnDestroy {

    public isGraphComponentActivated: boolean;
    public isDarkModeActivated: boolean;
    public isPavingsComponentActivated: boolean;
    public selectedRoad: SelectedRoad;
    public isOnSelectedRoad: boolean = false;
    //public isBusy = false;
    public isOnline: boolean = true;
    connection$;
    public startupClForTest: number = 86250;
    public loader = new LoadingIndicator();
    public loadingOptions = {
        message: 'Laddar...'
    }


    public testResponse: number;

    enteredSlider: number;

    constructor(

        private apiService: ApiService,
        private router: RouterExtensions,
        private locationService: LocationService,
        private route: ActivatedRoute,
        public dataShareService: DataShareService,
        public clService: ContinuousLengthService,
        private conversionService: ConversionService,
        public internetConnectionService: InternetConnectionService

        ) {
         }

    ngOnInit() {
        this.isGraphComponentActivated = getBoolean("isGraphComponentActivated", true);
        this.isPavingsComponentActivated = getBoolean("isPavingsComponentActivated", true);
        this.isDarkModeActivated = getBoolean("isDarkModeTurnedOn", false);
        this.selectedRoad = this.dataShareService.selectedRoad;

        //Keeps phone awake
        keepAwake().then(function() {
            console.log("Insomnia is active");
        });

        this.connection$ = this.internetConnectionService.connectionStatus$.subscribe(data => {
            this.isOnline = data.valueOf();
            console.log(this.isOnline);
            console.log("connection ändrad")
        });
    }
    ngOnDestroy(): void {
        this.endCurrentSession();
        }

    private showErrorMessage(errorMessage: string){
        console.log("felmeddelandet för alert är " + errorMessage);
        let alertOptions = {
            title: "Ett fel uppstod",
            message: errorMessage,
            okButtonText: "OK"
        };
        alert(alertOptions).then(() => {
            console.log("Fel vid vidareskickning")
        })

        if (this.connection$){
            this.connection$.unsubscribe();
        }
    }

    public onTestTextChange(args) {
        let textField = <TextField>args.object;
        this.startupClForTest = Number(textField.text);
    }


    public async startUsingDashboard(){
        //Checks users current coordinates
        let currentLocation: Location = new Location();
        this.loader.show(this.loadingOptions);
        try{
            let result = await this.locationService.getAndSetDeviceLocation();
            console.log(result);
            currentLocation.latitude = result.latitude;
            currentLocation.longitude = result.longitude;

            //Gets current CL
            const startupCl = await this.clService.getContinuousLengthForStartup(currentLocation);

            //starts the stream of location service to connected child components
            this.locationService.startWatchingLocation();

            //Speed calc activation
            //this.clService.isAdjustingToSpeed = true;

            //Starts service to get continuous length to connected child components
            this.clService.startContinuousLengthServiceWithApiConnection(startupCl);
            this.isOnSelectedRoad = true;
            this.loader.hide()
        }
        catch(error){
            console.error(error);
            this.showErrorMessage(error.message);
            this.loader.hide();
        }
    }

    public async startUsingDashboardWithOfflineContinuousLength(){
        //Checks users current coordinates
        let currentLocation: Location = new Location();
        this.loader.show(this.loadingOptions);
        try{
            let result = await this.locationService.getAndSetDeviceLocation();
            currentLocation.latitude = result.latitude;
            currentLocation.longitude = result.longitude;

            //Checks with API if on selected road, gets current CL if true, ADD LATER
            //const startupCl = await this.clService.getContinuousLengthForStartup(currentLocation);
            const startupCl = this.startupClForTest;

            //starts the stream of location service to connected child components
            this.locationService.startWatchingLocation();
            //Starts service to get continuous length to connected child components
            this.clService.startContinuousLengthServiceOfflineForTest(startupCl);
            this.loader.hide();
            this.isOnSelectedRoad = true;
            console.log("dashboard startad med speedcalc satt till: " + this.clService.isAdjustingToSpeed)

        }
        catch(error){
            console.error(error);
            this.showErrorMessage(error.message);
            this.loader.hide();
        }
    }

    private endCurrentSession(){
        this.locationService.stopWatchingLocation();
        this.clService.stopWatchingContinuousLength();
    }

    //Alert
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

  //Navigering
  backToStart(){
    this.endCurrentSession();
    this.router.navigate(['/start-screen'], {
        clearHistory: true,
        animated: true, transition: {
            name: "slideRight",
            duration: 200,
            curve: "easeIn"
        }
    } );
  }

  //Opens side drawer
  onDrawerButtonTap(): void {
    const sideDrawer = <RadSideDrawer>app.getRootView();
    sideDrawer.showDrawer();
    }


}
