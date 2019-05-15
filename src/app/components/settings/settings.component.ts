import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import {
    getBoolean, setBoolean, getNumber,
    setNumber, getString, setString,
    hasKey, remove, clear
} from "tns-core-modules/application-settings";
import { Switch } from 'tns-core-modules/ui/switch/switch';
import { ValueList } from 'nativescript-drop-down';

@Component({
  selector: 'ns-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
  moduleId: module.id,
})
export class SettingsComponent implements OnInit, AfterViewInit {


@ViewChild('graphValueDD') graphValueDropDown: ElementRef;


  public isDarkModeTurnedOn: boolean;
  public isGraphComponentActivated: boolean;
  public isPavingsComponentActivated: boolean;
  public isSpeedCalcActivated: boolean;

  public selectedGraphValueIndex: number = 0;
  constructor() { }

  ngOnInit() {
    //sets selected values if any, else defaults
    this.isDarkModeTurnedOn = getBoolean("isDarkModeTurnedOn", false);
    this.isGraphComponentActivated = getBoolean("isGraphComponentActivated", true);
    this.isPavingsComponentActivated = getBoolean("isPavingsComponentActivated", true);
    this.isSpeedCalcActivated = getBoolean("isSpeedCalcActivated", true)
    console.log("graph activated: " + this.isGraphComponentActivated);
    console.log("pavings activated: " + this.isPavingsComponentActivated)
     }

     ngAfterViewInit(): void {
         //Sets items for dropdown after view init
        this.setItemsToGraphValueDropDown();
        this.setStartupForGraphValueDropDown();
    }

  //Sets dark theme if true, otherwise light theme as default
  public setDarkMode(args) {
    let dSwitch = <Switch>args.object;
    if (dSwitch.checked){
        this.isDarkModeTurnedOn = true;
        setBoolean("isDarkModeTurnedOn", true);
    }
    else{
        this.isDarkModeTurnedOn = false;
        setBoolean("isDarkModeTurnedOn", false);
    }
  }
  //Sets if graph component should be visible in dashboard
  public setGraphComponentVisibility(args){
    let gSwitch = <Switch>args.object;
    if (gSwitch.checked){
        this.isGraphComponentActivated = true;
        setBoolean("isGraphComponentActivated", true);
    }
    else{
        this.isGraphComponentActivated = false;
        setBoolean("isGraphComponentActivated", false);
    }
  }

  //Sets if pavings component should be visible in dashboard
  public setPavingsComponentVisibility(args){
    let pSwitch = <Switch>args.object;
    if (pSwitch.checked){
        this.isPavingsComponentActivated = true;
        setBoolean("isPavingsComponentActivated", true);
    }
    else{
        this.isPavingsComponentActivated = false;
        setBoolean("isPavingsComponentActivated", false);
    }
  }

  //Sets which graph page should be selected by default in dashboard
  public onGraphValueChanged(args){
    let selectedIndex = Number(this.graphValueDropDown.nativeElement.selectedIndex);
    setNumber("graphStartupPageValue", selectedIndex)
  }

  private setItemsToGraphValueDropDown(){
    let graphValueDD = this.graphValueDropDown.nativeElement;
    let items = new ValueList<string>();
    items.push([{value:"0", display:"Spårdjup"}]);
    items.push([{value:"1", display:"IRI"}]);
    items.push([{value:"2", display:"Kantdjup"}]);
    items.push([{value:"3", display:"Spårbottentvärfall"}]);
    graphValueDD.items = items;
  }
  private setStartupForGraphValueDropDown(){
    let graphValueDD = this.graphValueDropDown.nativeElement;
    graphValueDD.selectedIndex = getNumber("graphStartupPageValue", 0);
  }

  public setSpeedCalcActivation(args){
    let sSwitch = <Switch>args.object;
    if (sSwitch.checked){
        this.isSpeedCalcActivated = true;
        setBoolean("isSpeedCalcActivated", true);
    }
    else{
        this.isSpeedCalcActivated = false;
        setBoolean("isSpeedCalcActivated", false);
    }
  }

}
