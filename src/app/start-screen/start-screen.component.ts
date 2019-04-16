import { Component, OnInit } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular/router';

import * as dialogs from "tns-core-modules/ui/dialogs";

import { ObservableArray } from "tns-core-modules/data/observable-array";
import { TokenModel } from "nativescript-ui-autocomplete";
import { County } from '../county'
import { Observable } from 'tns-core-modules/ui/page/page';

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

    constructor(private router: RouterExtensions) {

        this.autocompleteCounties = new ObservableArray<TokenModel>();
        countyList.forEach((county) => {
            this.autocompleteCounties.push(new TokenModel(county, undefined));
        });

        this.autocompleteRoads = new ObservableArray<TokenModel>();
        roadList.forEach((road) => {
            this.autocompleteRoads.push(new TokenModel(road, undefined));
        });

        /*this.autocounty = new ObservableArray<TokenModel>();
        countyCollection.forEach((count) => {
            this.autocounty.push(new TokenModel(count, undefined));
        });
        console.log(this.autocounty);*/
  }


  ngOnInit() {

  }

  toDashboard(){

    dialogs.action({
        message: "Din riktning",
        cancelButtonText: "Cancel text",
        actions: ["Med", "Mot"]
    }).then(result => {
        if(result == "Med"){
            this.router.navigate(['/dashboard'], {clearHistory: true});
        }else if(result == "Mot"){
            this.router.navigate(['/dashboard'], {clearHistory: true});
        }
    });
  }

  showListCounty(){
    if (this.isVisibleCounty) {
        this.isVisibleCounty = false;
    } else  {
        this.isVisibleCounty = true;
        this.isVisibleRoad = false;
    }
  }
  showListRoad(){
    if (this.isVisibleRoad) {
        this.isVisibleRoad = false;
    } else  {
        this.isVisibleRoad = true;
        this.isVisibleCounty = false;
    }
  }






}
