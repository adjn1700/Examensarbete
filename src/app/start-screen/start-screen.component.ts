import { Component, OnInit } from '@angular/core';
import { ListPicker } from "tns-core-modules/ui/list-picker";
import { RouterExtensions } from 'nativescript-angular/router';

import * as dialogs from "tns-core-modules/ui/dialogs";

let countyList = ["Hallands", "Jämtlands", "Jönköpings", "Kalmars"];

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

    constructor(private router: RouterExtensions) {

    for (let county of countyList) {
        this.countys.push(county);
    }
  }

    public selectedIndexChanged(args) {
    let picker = <ListPicker>args.object;
    this.picked = this.countys[picker.selectedIndex];
    }

  ngOnInit() {
  }

  toDashboard(){

    dialogs.action({
        message: "Your message",
        cancelButtonText: "Cancel text",
        actions: ["Option1", "Option2"]
    }).then(result => {
        console.log("Dialog result: " + result);
        if(result == "Option1"){
            //Do action1
        }else if(result == "Option2"){
            //Do action2
        }
    });

      this.router.navigate(['/dashboard'], {clearHistory: true});
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
