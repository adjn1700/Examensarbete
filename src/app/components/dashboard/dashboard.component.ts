import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular/router';
import { ApiService } from '~/app/services/api.service';
import { confirm, ConfirmOptions } from "tns-core-modules/ui/dialogs";
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

@Component({
  selector: 'ns-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  moduleId: module.id
})
export class DashboardComponent implements OnInit, OnDestroy {


    public destination: number;
    public county: string;
    public road: string;
    public selectedRoad: SelectedRoad;
    public direction: string;
    public isOnSelectedRoad: boolean = false;
    public isBusy = false;

    public testResponse: number;

    constructor(

        private apiService: ApiService,
        private router: RouterExtensions,
        private locationService: LocationService,
        private route: ActivatedRoute,
        private dataShareService: DataShareService,
        private clService: ContinuousLengthService,
        private conversionService: ConversionService
        ) {
            //Add later when startup lists works correctly
            /*
            this.county = dataShareService.serviceCounty;
            this.road = dataShareService.serviceRoad;
            this.destination = dataShareService.serviceDestination;
            this.direction = dataShareService.serviceDirection;
            */
         }

    ngOnInit() {
        //TEST-data
        //När det funkar byt ut hårdkodad data mot "this.county" och "this.road";
        this.selectedRoad = new SelectedRoad();
        this.selectedRoad.county = "Jämtland (Z)";
        this.selectedRoad.countyId = 23;
        this.selectedRoad.road = "605";
        this.selectedRoad.roadId = 605;
        this.selectedRoad.subroadId=0;
        this.selectedRoad.direction = "Mot";
        this.selectedRoad.directionId = 2;

        this.dataShareService.selectedRoad = this.selectedRoad;

        //updates current location and asks device permission if not granted
        //this.locationService.updateCurrentLocation();


    }
    ngOnDestroy(): void {
        this.endCurrentSession();
        }

    public async testGetFromApi(){
        //Checks users current coordinates
        let currentLocation: Location = new Location();
        this.isBusy = true;
        try{
            let result = await this.locationService.getDeviceLocation();
            console.log(result);
            currentLocation.latitude = result.latitude;
            currentLocation.longitude = result.longitude;

            //Checks with API if on selected road, gets current CL if true
            const startupCl = await this.clService.getContinuousLengthForStartup(currentLocation);

            //starts the stream of location service to connected child components
            this.locationService.updateCurrentLocation();
            this.locationService.startWatchingLocation();
            //Starts service to get continuous length to connected child components
            this.clService.testContinuousLengthServiceWithApiConnection(Number(startupCl));
            this.isOnSelectedRoad = true;
            this.isBusy = false;
        }
        catch(error){
            console.error(error);
            this.isBusy = false;
        }
    }

    public async checkIfOnSelectedRoad(){
        //Checks users current coordinates
        let currentLocation: Location = new Location();
        this.isBusy = true;
        try{
            let result = await this.locationService.getDeviceLocation();
            currentLocation.latitude = result.latitude;
            currentLocation.longitude = result.longitude;

            //Checks with API if on selected road, gets current CL if true, ADD LATER
            //const startupCl = await this.clService.getContinuousLengthForStartup(currentLocation);
            const startupCl = 18000;

            //starts the stream of location service to connected child components
            this.locationService.startWatchingLocation();
            //Starts service to get continuous length to connected child components
            this.clService.startContinuousLengthService(Number(startupCl));
            this.isOnSelectedRoad = true;
            this.isBusy = false;
        }
        catch(error){
            console.error(error);
            this.isBusy = false;
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

  onDrawerButtonTap(): void {
    const sideDrawer = <RadSideDrawer>app.getRootView();
    sideDrawer.showDrawer();
}

}
