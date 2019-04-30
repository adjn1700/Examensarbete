import { Component, OnInit, NgModule, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular/router';
import { SelectedIndexChangedEventData, itemsProperty } from "nativescript-drop-down";
import { ValueList } from "nativescript-drop-down";
import { allowSleepAgain } from "nativescript-insomnia";

import * as dialogs from "tns-core-modules/ui/dialogs";
import { County } from '../../models/county'

import { DataShareService } from '../../services/data-share.service';
import countysFromFile from './countys.json'
import roadsFromFile from './roads.json';
import { Road } from '~/app/models/road';
import { SelectedRoad } from '~/app/models/selectedRoad';

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

    private selectedDestination: number;
    private selectedCounty: string;
    private selectedCountyId: number;
    private selectedRoadId: number;
    private selectedSubRoadId: number;
    private selectedDirection: string;
    private selectedDirectionId: number;

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
    public countyItemSource = new ValueList<string>();
    public roadItemSource: ValueList<string>;

    constructor(
        private dataShareService: DataShareService,
        private router: RouterExtensions
        ){
            this.countyItems = countysFromFile;
            this.roadItems = roadsFromFile;
        }

    ngOnInit() {
        allowSleepAgain().then(function() {
            console.log("Insomnia is inactive, good night!");
        });
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

        let roadDD = this.roadDropDown.nativeElement;
        let filteredRoads = this.roadItems.filter(road => road.CountyCode === selectedCountyCode);
        this.roadItemSource = new ValueList<string>();
        this.roadItemSource.push([{value:"0", display:"Välj vägnummer"}]);
        filteredRoads.forEach(filteredRoad => {
            this.roadItemSource.push([{value:this.getCombinedNumbersForMainAndSubroadForDropDown(filteredRoad),
                display:this.getNameForMainAndSubroad(filteredRoad)}]);
        });
        roadDD.items = this.roadItemSource;
        roadDD.selectedIndex = 0;
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
    decodeCombinedNumbersForMainAndSubroad(value: string): number[]{
        let resultArray = value.split(" ", 2);
        let convertedArray: number[] = [];
        resultArray.forEach(roadId => {
            convertedArray.push(Number(roadId));
        });
        return convertedArray;
    }


    public onCountyChange(args: SelectedIndexChangedEventData) {
        let selectedCountyIndex = this.countyDropDown.nativeElement.selectedIndex;
        let selectedCountyCode = Number(this.countyItemSource.getValue(selectedCountyIndex));
        let selectedCountyName = this.countyItemSource.getDisplay(selectedCountyIndex);

        this.setCountyFromSelection(selectedCountyName, selectedCountyCode);
        this.setRoadsToDropDown(selectedCountyCode);
    }

    public onRoadChange(args: SelectedIndexChangedEventData) {
        let selectedRoadIndex = this.roadDropDown.nativeElement.selectedIndex;
        let selectedRoadValues = this.roadItemSource.getValue(selectedRoadIndex);

        let decodedRoadValues = this.decodeCombinedNumbersForMainAndSubroad(selectedRoadValues);
        this.setRoadFromSelection(decodedRoadValues[0], decodedRoadValues[1]);

    }

    private setCountyFromSelection(countyName: string, countyId: number){
        this.selectedCounty = countyName;
        this.selectedCountyId = countyId;
    }

    private setRoadFromSelection(roadNumber: number, roadSubNumber:number){
        this.selectedRoadId = roadNumber;
        this.selectedSubRoadId = roadSubNumber;
    }


    toDashboard(){

        this.dataShareService.selectedDestination = this.selectedDestination;

        dialogs.action({
            message: "Din riktning",
            cancelButtonText: "Avbryt",
            actions: ["Med", "Mot"]
        }).then(direction => {
            if(direction == "Med"){
                this.selectedDirection = direction;
                this.selectedDirectionId = 1;
                this.setSelectedRoadToService();
            }else if(direction == "Mot"){
                this.selectedDirection = direction;
                this.selectedDirectionId = 2;
                this.setSelectedRoadToService();
            }
        });
    }

    toDashboardWithTestValues(){
        let sr = new SelectedRoad();
        sr.county = "Jämtland (Z)";
        sr.countyId = 23;
        sr.roadId = 605;
        sr.subroadId=0;
        sr.direction = "Mot";
        sr.directionId = 2;

        this.dataShareService.selectedRoad = sr;
        this.router.navigate(['/dashboard'], {clearHistory: true});
    }

    private setSelectedRoadToService(){
        if(this.selectedRoadId  && this.selectedRoadId != 0){
            let sr = new SelectedRoad;
            sr.county = this.selectedCounty;
            sr.countyId = this.selectedCountyId;
            sr.roadId = this.selectedRoadId;
            sr.subroadId = this.selectedSubRoadId;
            sr.direction = this.selectedDirection;
            sr.directionId = this.selectedDirectionId;
            this.dataShareService.selectedRoad = sr;
            console.log(sr);
            this.router.navigate(['/dashboard'], {clearHistory: true});
        }
        else{
           this.showErrorMessage();
        }
    }

        private showErrorMessage(){
            let alertOptions = {
                title: "Ett fel uppstod",
                message:"Välj län och väg innan du går vidare",
                okButtonText: "OK"
            };
            alert(alertOptions);



    }
}
