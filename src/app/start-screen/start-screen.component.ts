import { Component, OnInit } from '@angular/core';
import { ListPicker } from "tns-core-modules/ui/list-picker";
import { RouterExtensions } from 'nativescript-angular/router';

import * as dialogs from "tns-core-modules/ui/dialogs";

import { ObservableArray } from "tns-core-modules/data/observable-array";
import { TokenModel } from "nativescript-ui-autocomplete";

const countyList = ["Hallands", "Jämtlands", "Jönköpings", "Kalmars"];
const roadList = ["101", "1002", "230", "122"];

@Component({
  selector: 'ns-start-screen',
  templateUrl: './start-screen.component.html',
  styleUrls: ['./start-screen.component.css'],
  moduleId: module.id,
})
export class StartScreenComponent implements OnInit {
    public countys: Array<string> = [];
    public picked: string;
    public isVisibleCounty: boolean = false;
    public isVisibleRoad: boolean = false;

    autocompleteCounties: ObservableArray<TokenModel>;
    autocompleteRoads: ObservableArray<TokenModel>;

    constructor(private router: RouterExtensions) {

        this.autocompleteCounties = new ObservableArray<TokenModel>();
        countyList.forEach((county) => {
            this.autocompleteCounties.push(new TokenModel(county, undefined));
        });

        this.autocompleteRoads = new ObservableArray<TokenModel>();
        roadList.forEach((road) => {
            this.autocompleteRoads.push(new TokenModel(road, undefined));
        });
  }

    public selectedIndexChanged(args) {
    let picker = <ListPicker>args.object;
    this.picked = this.countys[picker.selectedIndex];
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
