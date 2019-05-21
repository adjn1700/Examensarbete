import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Response } from '@angular/http';
import { map, catchError, timeout } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { SelectedRoad } from '../models/selectedRoad';
import { PavementData } from '../models/pavementData';
import { Location } from '~/app/models/location';
import { ConversionService } from './conversion.service';
import { DataShareService } from './data-share.service';
import { GraphData } from '~/app/models/graphData';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
    private apiUrl = 'https://api.trafikinfo.trafikverket.se/v2/data.json';
    private authKey = '8ccbb37be31d48adbaf3009f14a45141'
    public defaultApiTimeoutValue: number = 5000;
    public customApiTimeOutValue: number = 990;

    constructor(
        private http: HttpClient,
        private conversionService: ConversionService,
        private dataShareService: DataShareService
        ) {

    }

    //Post data api
    postData(request:string) {
        return this.http.post(this.apiUrl, request );
    }


    public getPavementDataForRoad(currentContinuousLength: number): Observable<PavementData[]>{
        let selectedRoad = this.dataShareService.selectedRoad;
        let customRequest = `
        <REQUEST>
        <LOGIN authenticationkey="${this.authKey}" />
            <QUERY objecttype="PavementData" schemaversion="1" limit="2">
                <FILTER>
                    <AND>
                        <EQ name="County" value="${selectedRoad.countyId}" />
                        <EQ name="RoadMainNumber" value="${selectedRoad.roadId}" />
                        <EQ name="RoadSubNumber" value="${selectedRoad.subroadId}" />
                        <EQ name="Direction.Value" value="${selectedRoad.direction}" />
                        <GT name="EndContinuousLength" value="${currentContinuousLength}" />
                    </AND>
                </FILTER>
                <INCLUDE>StartContinuousLength</INCLUDE>
                <INCLUDE>EndContinuousLength</INCLUDE>
                <INCLUDE>Length</INCLUDE>
                <INCLUDE>PavementDate</INCLUDE>
                <INCLUDE>PavementType</INCLUDE>
                <INCLUDE>MaxStoneSize</INCLUDE>
                <INCLUDE>Thickness</INCLUDE>
            </QUERY>
        </REQUEST>`
    return this.postData(customRequest)
        .pipe(
            map(res => res["RESPONSE"].RESULT[0].PavementData),
                catchError(this.handleError)
            );
    }

    getCurrentContinuousLength(currentLocation: Location, setQuickTimeout?: boolean): Observable<number>{
       let selectedRoad = this.dataShareService.selectedRoad;
       //Use this code later to send correct coordinates
        /*
        let currentSwerefCoordinatesArray = this.conversionService.convertWgsToSweref(currentLocation.latitude, currentLocation.longitude);

       let customRequest = `
            <REQUEST>
                <LOGIN authenticationkey="${this.authKey}" />
                <QUERY objecttype="PavementData" schemaversion="1">
                    <FILTER>
                            <AND>
                                <EQ name="County" value="0" />
                            </AND>
                    </FILTER>
                    <EVAL alias="LopandeLangd" function="$function.PMS_v1.CalcContinousLengthFromCoordinate(23, 14, 0, 1, ${currentSwerefCoordinatesArray[0]}, ${currentSwerefCoordinatesArray[1]}" />
                </QUERY>
            </REQUEST>`
            */


            let currentSwerefCoordinatesArray = this.conversionService.convertWgsToSweref(currentLocation.latitude, currentLocation.longitude);
            let coordinateNorthSouth = currentSwerefCoordinatesArray[0];
            let coordinateEastWest = currentSwerefCoordinatesArray[1];
            let timeoutValue: number;

            if(setQuickTimeout === true){
                timeoutValue = this.customApiTimeOutValue;
            }
            else{
                timeoutValue = this.defaultApiTimeoutValue;
            }


            let customRequest = `
            <REQUEST>
                <LOGIN authenticationkey="${this.authKey}" />
                <QUERY objecttype="PavementData" schemaversion="1">
                    <FILTER>
                            <AND>
                                <EQ name="County" value="0" />
                            </AND>
                    </FILTER>
                    <EVAL alias="LopandeLangd" function="$function.PMS_v1.CalcContinousLengthFromCoordinate(${selectedRoad.countyId}, ${selectedRoad.roadId}, ${selectedRoad.subroadId}, ${selectedRoad.directionId}, ${coordinateEastWest}, ${coordinateNorthSouth})" />
                </QUERY>
            </REQUEST>`

        return this.postData(customRequest)
            .pipe(
                map(res => Number(res["RESPONSE"].RESULT[0].INFO.EVALRESULT[0].LopandeLangd)),
                    timeout(timeoutValue),
                        catchError(this.handleError)
                );
    }

    public getGraphData(currentContinuousLength: number, graphDataInterval: number): Observable<GraphData[]>{
        let selectedRoad = this.dataShareService.selectedRoad;
        let startLength = currentContinuousLength;
        let endLength = currentContinuousLength + graphDataInterval;

        let customRequest = `
        <REQUEST>
            <LOGIN authenticationkey="${this.authKey}" />
            <QUERY objecttype="MeasurementData20" schemaversion="1">
                <FILTER>
                  <AND>
                        <EQ name="County" value="${selectedRoad.countyId}" />
                        <EQ name="RoadMainNumber" value="${selectedRoad.roadId}" />
                        <EQ name="RoadSubNumber" value="${selectedRoad.subroadId}" />
                        <EQ name="Direction.Value" value="${selectedRoad.direction}" />
                        <GTE name="StartContinuousLength" value="${startLength}" />
                        <LTE name="EndContinuousLength" value="${endLength}" />
                  </AND>
                </FILTER>
                <INCLUDE>StartContinuousLength</INCLUDE>
                <INCLUDE>EndContinuousLength</INCLUDE>
                <INCLUDE>IRIRight</INCLUDE>
                <INCLUDE>EdgeDepth</INCLUDE>
                <INCLUDE>RutDepthMax17</INCLUDE>
                <INCLUDE>CrossfallRutBottom</INCLUDE>
            </QUERY>
        </REQUEST>`

    return this.postData(customRequest)
        .pipe(
            map(res => res["RESPONSE"].RESULT[0].MeasurementData20),
            timeout(2000),
            catchError(this.handleError)
            );
    }

    private createRequest() {
        var xmlRequest = `
        <REQUEST>
            <LOGIN authenticationkey="8ccbb37be31d48adbaf3009f14a45141" />
            <QUERY objecttype="Situation" limit="1">

              <FILTER>
                    <WITHIN name="Deviation.Geometry.SWEREF99TM" shape="center" value="320011 6398983" radius="10000" />
              </FILTER>
              <INCLUDE>Deviation.Header</INCLUDE>
              <INCLUDE>Deviation.IconId</INCLUDE>
            </QUERY>
        </REQUEST>`
        return xmlRequest;
    }
    private createRequestWGS() {
        var xmlRequest = `
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
        return xmlRequest;
    }

    handleError(error) {
        let errorMessage = '';
        if (error instanceof HttpErrorResponse) {
            if(error.status === 0){
                errorMessage = `Servern kunde inte kontaktas. Vänligen kontrollera din internetuppkoppling och försök igen`;
            }
            else{
                errorMessage = `Felkod: ${error.status}\nMeddelande: ${error.message}`;
            }

        }
        error.message = errorMessage
        return throwError(error);
    }

    //Get graph value on Current ContinuousLength
    public getCurrentGraphData(currentContinuousLength: number): Observable<GraphData[]>{
        let selectedRoad = this.dataShareService.selectedRoad;

        let customRequest = `
        <REQUEST>
            <LOGIN authenticationkey="${this.authKey}" />
            <QUERY objecttype="MeasurementData20" schemaversion="1">
                <FILTER>
                  <AND>
                        <EQ name="County" value="${selectedRoad.countyId}" />
                        <EQ name="RoadMainNumber" value="${selectedRoad.roadId}" />
                        <EQ name="RoadSubNumber" value="${selectedRoad.subroadId}" />
                        <EQ name="Direction.Value" value="${selectedRoad.direction}" />
                        <LTE name="StartContinuousLength" value="${currentContinuousLength}" />
                        <GTE name="EndContinuousLength" value="${currentContinuousLength}" />
                  </AND>
                </FILTER>
                <INCLUDE>StartContinuousLength</INCLUDE>
                <INCLUDE>EndContinuousLength</INCLUDE>
                <INCLUDE>IRIRight</INCLUDE>
                <INCLUDE>EdgeDepth</INCLUDE>
                <INCLUDE>RutDepthMax17</INCLUDE>
                <INCLUDE>CrossfallRutBottom</INCLUDE>
            </QUERY>
        </REQUEST>`

    return this.postData(customRequest)
        .pipe(
            map(res => res["RESPONSE"].RESULT[0].MeasurementData20),
                catchError(this.handleError)
                );
    }



}
