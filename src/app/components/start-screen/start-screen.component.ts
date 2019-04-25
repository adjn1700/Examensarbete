import { Component, OnInit, NgModule } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular/router';
import { Routes, NavigationExtras } from "@angular/router";
import { NativeScriptFormsModule } from "nativescript-angular/forms";

import * as dialogs from "tns-core-modules/ui/dialogs";

import { ObservableArray } from "tns-core-modules/data/observable-array";
import { TokenModel } from "nativescript-ui-autocomplete";
import { County } from '../../models/county'
import { Observable } from 'tns-core-modules/ui/page/page';

import { DataShareService } from '../../services/data-share.service';

import {knownFolders} from "tns-core-modules/file-system";
import { ConversionService } from '~/app/services/conversion.service';
import countys from './countys.json'
import roadnumbers from './roadnumbers.json';

const countyList = ["Stockholm (AB)", "Uppsala (C)", "Södermanland (D)", "Östergötland (E)", "Jönköping (F)", "Kronoberg (G)", "Kalmar (H)", "Gotland (I)", "Blekinge (K)", "Skåne (M)", "Halland (N)", "Västra Götaland (O)", "Värmland (S)", "Örebro (T)", "Västmanland (U)", "Dalarna (W)", "Gävleborg (X)", "Västernorrland (Y)", "Jämtland (Z)", "Västerbotten (AC)", "Norrbotten (BD)"];
const roadList = ["101.00", "1002.01", "230.00", "122.10", "722.01", "522.01", "562.00"];
const countyCollection = countys;

@Component({
  selector: 'ns-start-screen',
  templateUrl: './start-screen.component.html',
  styleUrls: ['./start-screen.component.css'],
  moduleId: module.id,
})
export class StartScreenComponent implements OnInit {

    public picked: string;
    public isVisibleCounty: boolean = false;
    public isVisibleRoad: boolean = false;

    public allcounty: County[];

    autocompleteCounties: ObservableArray<TokenModel>;
    autocompleteRoads: ObservableArray<TokenModel>;
    autocounty: ObservableArray<TokenModel>;

    destination: number;
    county = "";
    road = "";
    direction = "";

    constructor(private router: RouterExtensions, public dataShareService: DataShareService, public coversionService: ConversionService) {

        this.autocompleteCounties = new ObservableArray<TokenModel>();
        countyList.forEach((county) => {
            this.autocompleteCounties.push(new TokenModel(county, undefined));
        });

        this.autocompleteRoads = new ObservableArray<TokenModel>();
        roadList.forEach((road) => {
            this.autocompleteRoads.push(new TokenModel(road, undefined));
        });

    }

    onDidAutoCompleteCounty({ text }) {
        this.county = text;
    }
    onDidAutoCompleteRoad({ text }) {
        this.road = text;
        console.log(this.road);
    }

  ngOnInit() {

  }

  toDashboard(){

    this.dataShareService.serviceDestination = this.destination;

    dialogs.action({
        message: "Din riktning",
        cancelButtonText: "Cancel text",
        actions: ["Med", "Mot"]
    }).then(result => {
        if(result == "Med"){
            this.dataShareService.serviceDirection = "Med";
            this.dataShareService.serviceCounty = this.county;
            this.dataShareService.serviceRoad = this.road;
            this.router.navigate(['/dashboard'], {clearHistory: true});
        }else if(result == "Mot"){
            this.dataShareService.serviceDirection = "Mot";
            this.dataShareService.serviceCounty = this.county;
            this.dataShareService.serviceRoad = this.road;
            this.router.navigate(['/dashboard'], {clearHistory: true});
        }
    });
  }
}
