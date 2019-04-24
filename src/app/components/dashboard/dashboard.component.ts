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

    constructor(

        private apiService: ApiService,
        private router: RouterExtensions,
        private locationService: LocationService,
        private route: ActivatedRoute,
        private dataShareService: DataShareService,
        private clService: ContinuousLengthService,
        private conversionService: ConversionService
        ) {

            this.county = dataShareService.serviceCounty;
            this.road = dataShareService.serviceRoad;
            this.destination = dataShareService.serviceDestination;
            this.direction = dataShareService.serviceDirection;

         }

    ngOnInit() {
        //TEST-data
        //När det funkar byt ut hårdkodad data mot "this.county" och "this.road";
        this.selectedRoad = new SelectedRoad();
        this.selectedRoad.county = this.county;
        this.selectedRoad.countyId = 23;
        this.selectedRoad.road = this.road;
        this.selectedRoad.roadId = 14;
        this.selectedRoad.direction = this.direction;
        this.selectedRoad.subroadId=0;

        //updates current location and asks device permission if not granted
        //this.locationService.updateCurrentLocation();


    }
    ngOnDestroy(): void {
        this.endCurrentSession();
        }

    public async checkIfOnSelectedRoad(){
        //Checks users current coordinates
        let currentLocation: Location;
        await this.locationService.getDeviceLocation().then(result => {
            currentLocation = new Location();
            currentLocation.latitude = result.latitude;
            currentLocation.longitude = result.longitude;
        }, error => {
            console.error(error);
        });

        try{
            //Checks with API if on selected road, gets current CL if true
            const startupCl = await this.clService.getContinuousLengthForStartup(currentLocation);

            //starts the stream of location service to connected child components
            this.locationService.startWatchingLocation();
            //Starts service to get continuous length to connected child components
            this.clService.startWatchingContinuousLength(Number(startupCl));
            this.isOnSelectedRoad = true;
        }
        catch(error){
            console.log(error);
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
}
