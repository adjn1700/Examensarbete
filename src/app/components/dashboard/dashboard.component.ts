import { Component, OnInit } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular/router';
import { ApiService } from '~/app/services/api.service';
import { confirm, ConfirmOptions } from "tns-core-modules/ui/dialogs";
import {SelectedRoad} from '../../models/selectedRoad'
import { Observable } from 'tns-core-modules/ui/page/page';
import { LocationService } from '../../services/location.service';
import {ActivatedRoute} from "@angular/router";
import { DataShareService } from '../../services/data-share.service';

@Component({
  selector: 'ns-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  moduleId: module.id
})
export class DashboardComponent implements OnInit {

    public destination: number;
    public county: string;
    public road: string;
    public selectedRoad: SelectedRoad;
    public direction: string;

    constructor(

        private myapiService: ApiService,
        private router: RouterExtensions,
        private locationService: LocationService,
        private route: ActivatedRoute,
        public dataShareService: DataShareService
        ) {
            /*
            this.county = dataShareService.serviceCounty;
            this.road = dataShareService.serviceRoad;*/
            this.destination = dataShareService.serviceDestination;
            this.direction = dataShareService.serviceDirection;

            this.county = "Jämtlands län";
            this.road = "1002";

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
        this.locationService.updateCurrentLocation();
        //starts the stream of location service to connected child components
        this.locationService.startWatchingLocation();
    }

    //api
    doApi(){
        var testData= `
        <REQUEST>
            <LOGIN authenticationkey="8ccbb37be31d48adbaf3009f14a45141" />
            <QUERY objecttype="Situation" limit="1">

              <FILTER>
                    <WITHIN name="Deviation.Geometry.WGS84" shape="center" value="11.979843 57.696954" radius="500m" />
              </FILTER>
              <INCLUDE>Deviation.Header</INCLUDE>
              <INCLUDE>Deviation.IconId</INCLUDE>
            </QUERY>
        </REQUEST>`
        this.myapiService.postData(testData).subscribe(
            (response) => console.log(response),
            (error) => console.log(error)
    );
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
    this.locationService.stopWatchingLocation();
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
