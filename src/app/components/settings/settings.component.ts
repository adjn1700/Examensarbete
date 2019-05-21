import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import {
    getBoolean, setBoolean, getNumber,
    setNumber, getString, setString,
    hasKey, remove, clear
} from "tns-core-modules/application-settings";
import { Switch } from 'tns-core-modules/ui/switch/switch';
import { ValueList } from 'nativescript-drop-down';
import { ContinuousLengthService } from '~/app/services/continuous-length.service';
import { GraphService } from '~/app/services/graph.service';

@Component({
  selector: 'ns-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
  moduleId: module.id,
})
export class SettingsComponent implements OnInit, AfterViewInit {


@ViewChild('graphValueDD') graphValueDropDown: ElementRef;
@ViewChild('graphIntervalDD') graphIntervalDropDown: ElementRef;

  public isOfflineGraphDataActivated: boolean;
  public isDarkModeTurnedOn: boolean;
  public isGraphComponentActivated: boolean;
  public isPavingsComponentActivated: boolean;
  public isSpeedCalcActivated: boolean;

  public graphValueList: ValueList<string>;
  public graphIntervalList: ValueList<string>;

  constructor(
      private clService: ContinuousLengthService,
      private graphService: GraphService
      ) { }

  ngOnInit() {
    //sets selected values if any, else defaults
    this.isDarkModeTurnedOn = getBoolean("isDarkModeTurnedOn", false);
    this.isGraphComponentActivated = getBoolean("isGraphComponentActivated", true);
    this.isPavingsComponentActivated = getBoolean("isPavingsComponentActivated", true);
    this.isSpeedCalcActivated = getBoolean("isSpeedCalcActivated", true)
    this.isOfflineGraphDataActivated = getBoolean("isOfflineGraphDataActivated", false);
    console.log("graph activated: " + this.isGraphComponentActivated);
    console.log("pavings activated: " + this.isPavingsComponentActivated)
     }

     ngAfterViewInit(): void {
         //Sets items for dropdown after view init
        this.setItemsToGraphValueDropDown();
        this.setStartupForGraphValueDropDown();
        this.setItemsToGraphIntervalDropDown();
        this.setStartupForGraphIntervalDropDown();
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

  public onGraphIntervalChanged(args){
    let graphIntervalDD = this.graphIntervalDropDown.nativeElement;
    let selectedIndex = graphIntervalDD.selectedIndex;
    let selectedValue = this.graphIntervalList.getValue(selectedIndex);
    this.graphService.setNewGraphDataInterval(Number(selectedValue));
    setNumber("graphIntervalValue", Number(selectedValue));
  }

  public setOfflineGraphDataActivation(args){
    let oSwitch = <Switch>args.object;
    if (oSwitch.checked){
        this.isOfflineGraphDataActivated = true;
        setBoolean("isOfflineGraphDataActivated", true);
        this.graphService.isCurrentAndNextActivated = true;
    }
    else{
        this.isOfflineGraphDataActivated = false;
        setBoolean("isOfflineGraphDataActivated", false);
        this.graphService.isCurrentAndNextActivated = false;
    }
  }

  private setItemsToGraphIntervalDropDown(){
      let graphIntervalDD = this.graphIntervalDropDown.nativeElement;
      this.graphIntervalList = new ValueList<string>();
      this.graphIntervalList.push([
          {value:"250", display:"250m"},
          {value:"500", display:"500m"},
          {value:"750", display:"750m"},
          {value:"1000", display:"1000m"}
        ]);
      graphIntervalDD.items = this.graphIntervalList;
    }

    private setStartupForGraphIntervalDropDown(){
        let graphIntervalDD = this.graphIntervalDropDown.nativeElement;
        let preSelectedValue = getNumber("graphIntervalValue", 500);
        let preselectedIndex = this.graphIntervalList.getIndex(String(preSelectedValue));
        graphIntervalDD.selectedIndex = preselectedIndex;
    }

  private setItemsToGraphValueDropDown(){
    let graphValueDD = this.graphValueDropDown.nativeElement;
    this.graphValueList = new ValueList<string>();
    this.graphValueList.push([
        {value:"0", display:"Spårdjup"},
        {value:"1", display:"IRI"},
        {value:"2", display:"Kantdjup"},
        {value:"3", display:"Spårbottentvärfall"}
    ]);
    graphValueDD.items = this.graphValueList;
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
        this.clService.isAdjustingToSpeed = true;
    }
    else{
        this.isSpeedCalcActivated = false;
        setBoolean("isSpeedCalcActivated", false);
        this.clService.isAdjustingToSpeed = false;
    }
  }

}
