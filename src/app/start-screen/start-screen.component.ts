import { Component, OnInit, NgModule } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular/router';
import { Routes, NavigationExtras } from "@angular/router";
import { NativeScriptFormsModule } from "nativescript-angular/forms";

import * as dialogs from "tns-core-modules/ui/dialogs";

import { ObservableArray } from "tns-core-modules/data/observable-array";
import { TokenModel } from "nativescript-ui-autocomplete";
import { County } from '../models/county'
import { Observable } from 'tns-core-modules/ui/page/page';

import { DataShareService } from '../services/data-share.service';

import {knownFolders} from "tns-core-modules/file-system";
//import countys from './countys.json'

const countyList = ["Stockholm (AB)", "Uppsala (C)", "Södermanland (D)", "Östergötland (E)", "Jönköping (F)", "Kronoberg (G)", "Kalmar (H)", "Gotland (I)", "Blekinge (K)", "Skåne (M)", "Halland (N)", "Västra Götaland (O)", "Värmland (S)", "Örebro (T)", "Västmanland (U)", "Dalarna (W)", "Gävleborg (X)", "Västernorrland (Y)", "Jämtland (Z)", "Västerbotten (AC)", "Norrbotten (BD)"];
const roadList = ["101", "1002", "230", "122", "722", "522", "562"];
//const countyCollection = countys;

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

    autocompleteCounties: ObservableArray<TokenModel>;
    autocompleteRoads: ObservableArray<TokenModel>;
    autocounty: ObservableArray<TokenModel>;

    destination: number;
    county = "";
    road = "";
    direction = "";

    constructor(private router: RouterExtensions, public dataShareService: DataShareService) {

        this.autocompleteCounties = new ObservableArray<TokenModel>();
        countyList.forEach((county) => {
            this.autocompleteCounties.push(new TokenModel(county, undefined));
        });

        this.autocompleteRoads = new ObservableArray<TokenModel>();
        roadList.forEach((road) => {
            this.autocompleteRoads.push(new TokenModel(road, undefined));
        });
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
            this.router.navigate(['/dashboard'], {clearHistory: true});
        }else if(result == "Mot"){
            this.dataShareService.serviceDirection = "Mot";
            this.router.navigate(['/dashboard'], {clearHistory: true});
        }
    });
  }
}
