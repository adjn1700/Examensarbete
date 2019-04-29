import { Component, OnInit, NgModule, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular/router';
import { Routes, NavigationExtras } from "@angular/router";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { SelectedIndexChangedEventData, itemsProperty } from "nativescript-drop-down";
import { ValueList } from "nativescript-drop-down";

import * as dialogs from "tns-core-modules/ui/dialogs";

import { ObservableArray } from "tns-core-modules/data/observable-array";
import { TokenModel } from "nativescript-ui-autocomplete";
import { County } from '../../models/county'
import { Observable } from 'tns-core-modules/ui/page/page';

import { DataShareService } from '../../services/data-share.service';

import {knownFolders} from "tns-core-modules/file-system";
import { ConversionService } from '~/app/services/conversion.service';
import countysFromFile from './countys.json'
import roadsFromFile from './roads.json';
import { Road } from '~/app/models/road';

//const countyItems = ["Stockholm (AB)", "Uppsala (C)", "Södermanland (D)", "Östergötland (E)", "Jönköping (F)", "Kronoberg (G)", "Kalmar (H)", "Gotland (I)", "Blekinge (K)", "Skåne (M)", "Halland (N)", "Västra Götaland (O)", "Värmland (S)", "Örebro (T)", "Västmanland (U)", "Dalarna (W)", "Gävleborg (X)", "Västernorrland (Y)", "Jämtland (Z)", "Västerbotten (AC)", "Norrbotten (BD)"];
//const roadItems = ["101.00", "1002.01", "230.00", "122.10", "722.01", "522.01", "562.00"];
//const countyCollection = countys;

@Component({
  selector: 'ns-start-screen',
  templateUrl: './start-screen.component.html',
  styleUrls: ['./start-screen.component.css'],
  moduleId: module.id,
})
export class StartScreenComponent implements OnInit, AfterViewInit {

    private destination: number;
    private county: string;
    private countyId: number;
    private road: string;
    private roadId: number;
    private subRoadId: number;
    private direction: string;
    private directionId: number;

    public countyItems: County[];
    public roadItems: Road[];
    //public countyItems = ["Stockholm (AB)", "Uppsala (C)", "Södermanland (D)", "Östergötland (E)", "Jönköping (F)", "Kronoberg (G)", "Kalmar (H)", "Gotland (I)", "Blekinge (K)", "Skåne (M)", "Halland (N)", "Västra Götaland (O)", "Värmland (S)", "Örebro (T)", "Västmanland (U)", "Dalarna (W)", "Gävleborg (X)", "Västernorrland (Y)", "Jämtland (Z)", "Västerbotten (AC)", "Norrbotten (BD)"];
    //public roadItems = ["101.00", "1002.01", "230.00", "122.10", "722.01", "522.01", "562.00"];

    /*
    public picked: string;
    public isVisibleCounty: boolean = false;
    public isVisibleRoad: boolean = false;

    public allcounty: County[];

    autocompleteCounties: ObservableArray<TokenModel>;
    autocompleteRoads: ObservableArray<TokenModel>;
    autocounty: ObservableArray<TokenModel>;


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
    */

    @ViewChild('countyDD') countyDropDown: ElementRef;
    @ViewChild('roadDD') roadDropDown: ElementRef;


    public selectedCountyIndex = 0;
    public selectedRoadIndex = 0;
    public countyItemSource = new ValueList<String>();
    public roadItemSource = new ValueList<String>();

    constructor(
        private dataShareService: DataShareService,
        private router: RouterExtensions
        ){
            this.countyItems = countysFromFile;
            this.roadItems = roadsFromFile;
        }

    ngOnInit() {

    }

    ngAfterViewInit(): void {
        this.setCountysToDropDown();
        }

    private setCountysToDropDown(){
        let countyDD = this.countyDropDown.nativeElement;
        this.countyItemSource.push([{value:"0", display:"Välj län"}]);
        this.countyItems.forEach(county => {
            this.countyItemSource.push([{value:county.CountyCode.toFixed(), display:county.CountyName}]);
        });
        countyDD.items = this.countyItemSource;
    }

    private setRoadsToDropDown(selectedCountyCode: number){
        console.log("anrop för att uppdatera väglista")
        let roadDD = this.roadDropDown.nativeElement;
        this.countyItemSource.push([{value:"0", display:"Välj vägnummer"}]);
        let filteredRoads = this.roadItems.filter(road => road.CountyCode === selectedCountyCode);
        filteredRoads.forEach(filteredRoad => {
            this.roadItemSource.push([{value:this.getCombinedNumbersForMainAndSubroadForDropDown(filteredRoad),
                display:this.getNameForMainAndSubroad(filteredRoad)}]);
        });
        roadDD.items = this.roadItemSource;
    }

    getNameForMainAndSubroad(road: Road){
        let result = "Vägnummer " + road.RoadMainNumber.toFixed() + " - Undernummer " + road.RoadSubNumber;
        return result;
    }

    /** Combines RoadMainNumber and RoadSubNumber for object, for showing in dropdownlist */
    getCombinedNumbersForMainAndSubroadForDropDown(road: Road){
        let result = road.RoadMainNumber + " " + road.RoadSubNumber;
        return result;
    }
    /** Returns array where 0 is RoadMainNumber and 1 is RoadSubNumber */
    decodeCombinedNumbersForMainAndSubroadForDropDown(value: string): number[]{
        let resultArray = value.split(" ", 2);
        let convertedArray: number[];
        resultArray.forEach(roadId => {
            convertedArray.push(Number(roadId));
        });
        return convertedArray;
    }


    public onCountyChange(args: SelectedIndexChangedEventData) {
        console.log(`Drop Down selected index changed from ${args.oldIndex} to ${args.newIndex}`);
        let selecedCountyNumber = this.countyDropDown.nativeElement.selectedIndex;
        console.log("selected county number:" + selecedCountyNumber)
        console.log(this.countyItemSource.getValue(selecedCountyNumber));
        this.setRoadsToDropDown(selecedCountyNumber);
    }

    public onCountyOpen() {
        console.log("Drop Down opened.");
    }

    public onCountyClose() {
        console.log("Drop Down closed.");
    }

    public onRoadChange(args: SelectedIndexChangedEventData) {
        console.log(`Drop Down selected index changed from ${args.oldIndex} to ${args.newIndex}`);
    }

    public onRoadOpen() {
        console.log("Drop Down opened.");
    }

    public onRoadClose() {
        console.log("Drop Down closed.");
    }


    toDashboard(){

        this.dataShareService.serviceDestination = this.destination;

        dialogs.action({
            message: "Din riktning",
            cancelButtonText: "Avbryt",
            actions: ["Med", "Mot"]
        }).then(direction => {
            if(direction == "Med"){
                this.dataShareService.selectedRoad.direction = direction;
                this.dataShareService.selectedRoad.directionId = 1;
                this.setSelectedRoadToService();
                this.router.navigate(['/dashboard'], {clearHistory: true});
            }else if(direction == "Mot"){
                this.dataShareService.selectedRoad.direction = direction;
                this.dataShareService.selectedRoad.directionId = 2;
                this.setSelectedRoadToService();
                this.router.navigate(['/dashboard'], {clearHistory: true});
            }
        });
    }

    private setSelectedRoadToService(){
        this.dataShareService.selectedRoad.county = this.county;
        this.dataShareService.selectedRoad.countyId = this.countyId;
        this.dataShareService.selectedRoad.road = this.road;
        this.dataShareService.selectedRoad.roadId = this.roadId;
        this.dataShareService.selectedRoad.subroadId = this.subRoadId;
    }
}
