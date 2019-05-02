import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular/router';
import { ApiService } from '~/app/services/api.service';
import { confirm, ConfirmOptions, alert } from "tns-core-modules/ui/dialogs";
import {SelectedRoad} from '../../models/selectedRoad'
import { Switch } from "tns-core-modules/ui/switch";
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
import { OfflineContinuousLength } from '~/app/services/offline-continuous-length.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'ns-testpage',
  templateUrl: './testpage.component.html',
  styleUrls: ['./testpage.component.css'],
  moduleId: module.id
})
export class TestpageComponent implements OnInit, OnDestroy {


    public selectedRoad: SelectedRoad;
    public isOnSelectedRoad: boolean = false;
    public isBusy = false;
    public offlineLength: number;
    connectionStatus: boolean = true;
    connection$;
    private offlineClSubscription: Subscription;
    private locSubscription: Subscription;

    private currentLocation: Location;
    public currentSpeed: number;


    public testResponse: number;

    constructor(

        private apiService: ApiService,
        private router: RouterExtensions,
        private locationService: LocationService,
        private route: ActivatedRoute,
        private dataShareService: DataShareService,
        private clService: ContinuousLengthService,
        private conversionService: ConversionService,
        private internetConnectionService: InternetConnectionService,
        private offlineClService: OfflineContinuousLength

        ) {
            this.offlineClSubscription = this.offlineClService.offlineContinuousLength$.subscribe(cl => {
                this.offlineLength = cl;
            });
            this.locSubscription = this.locationService.location$.subscribe(
                loc => {
                    this.currentLocation = loc;
                    this.currentSpeed = Math.floor(loc.speed * 3.6);
                });
            //Add later when startup lists works correctly
            /*
            this.county = dataShareService.serviceCounty;
            this.road = dataShareService.serviceRoad;
            this.destination = dataShareService.serviceDestination;
            this.direction = dataShareService.serviceDirection;
            */
         }

    ngOnInit() {
        this.selectedRoad = this.dataShareService.selectedRoad;

        keepAwake().then(function() {
            console.log("Insomnia is active");
        });

        this.connection$ = this.internetConnectionService.connectionStatus$.subscribe(data => {
            this.connectionStatus = data.valueOf();
        });
    }
    ngOnDestroy(): void {
        this.endCurrentSession();
        }

    public onSwitchChange(args){
        let testSwitch = <Switch>args.object;
        if (testSwitch.checked) {
            this.clService.isAdjustingToSpeed = true;
        } else {
            this.clService.isAdjustingToSpeed = false;
        }
    }

    private showErrorMessage(errorMessage: string){
        let alertOptions = {
            title: "Ett fel uppstod",
            message:"Felkod: " + errorMessage,
            okButtonText: "OK"
        };
        alert(alertOptions).then(() => {
            console.log("Fel vid vidareskickning");
        })

        if (this.connection$){
            this.connection$.unsubscribe();
        }
    }



    public async testCLOnlineAndOffline(){
        //Checks users current coordinates
        let currentLocation: Location = new Location();
        this.isBusy = true;
        try{
            let result = await this.locationService.getAndSetDeviceLocation();
            console.log(result);
            currentLocation.latitude = result.latitude;
            currentLocation.longitude = result.longitude;

            //Checks with API if on selected road, gets current CL if true
            const startupCl = await this.clService.getContinuousLengthForStartup(currentLocation);

            //starts the stream of location service to connected child components
            this.locationService.startWatchingLocation();

            //TEST for speed calc
            this.clService.isAdjustingToSpeed = true;

            //Starts service to get continuous length to connected child components
            this.clService.testContinuousLengthServiceWithApiConnection(startupCl);
            this.offlineClService.startWatchingOfflineContinuousLength(startupCl);
            this.isOnSelectedRoad = true;
            this.isBusy = false;
        }
        catch(error){
            console.error(error);
            this.showErrorMessage(error.message);
            this.isBusy = false;
        }

    }




    private endCurrentSession(){
        this.locationService.stopWatchingLocation();
        this.clService.stopWatchingContinuousLength();
        this.offlineClSubscription.unsubscribe();
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

  onDrawerButtonTap(): void {
    const sideDrawer = <RadSideDrawer>app.getRootView();
    sideDrawer.showDrawer();
}

}
