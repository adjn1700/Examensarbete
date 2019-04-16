import { Component, OnInit } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular/router';
import { ApiService } from '~/app/services/api.service';
import { confirm, ConfirmOptions } from "tns-core-modules/ui/dialogs";
import {SelectedRoad} from '../../models/selectedRoad'
import { Observable } from 'tns-core-modules/ui/page/page';
import { LocationService } from '../../services/location.service';

@Component({
  selector: 'ns-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  moduleId: module.id
})
export class DashboardComponent implements OnInit {
    public selectedRoad: SelectedRoad;
    constructor(
        private myapiService: ApiService,
        private router: RouterExtensions,
        private locationService: LocationService
        ) { }

    ngOnInit() {
        //TEST-data
        this.selectedRoad = new SelectedRoad();
        this.selectedRoad.county = "Jämtlands län";
        this.selectedRoad.countyId = 1;
        this.selectedRoad.road = "Väg 84";
        this.selectedRoad.roadId = 84;
        this.selectedRoad.direction = "med";
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
