import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Response } from '@angular/http';
import { map, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { SelectedRoad } from '../models/selectedRoad';
import { PavementData } from '../models/pavementData';
import { Location } from '~/app/models/location';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
    private apiUrl = 'https://api.trafikinfo.trafikverket.se/v1.3/data.json';
    private authKey = '8ccbb37be31d48adbaf3009f14a45141'

    constructor(private http: HttpClient) {
    }

    //Post data api
    postData(request:string) {
        return this.http.post(this.apiUrl, request );
    }


    public getPavementDataForRoad(selectedRoad: SelectedRoad, currentContinuousLength: number): Observable<PavementData[]>{
        let customRequest = `<REQUEST>
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
        .pipe(map(res => res["RESPONSE"].RESULT[0].PavementData));
    }

    getCurrentContinuousLength(currentLocation: Location): Observable<number>{
        //Not done, returns predefined continuous length of 18000
        let customRequest = `
        <REQUEST>
            <LOGIN authenticationkey="${this.authKey}" />
            <QUERY objecttype="PavementData" schemaversion="1">
                <FILTER>
                        <AND>
                            <EQ name="County" value="0" />
                        </AND>
                </FILTER>
                <EVAL alias="LopandeLangd" function="$function.PMS_v1.CalcContinousLengthFromCoordinate(23, 14, 0, 1, 521405.8, 6957743.1)" />
            </QUERY>
        </REQUEST>`
        return this.postData(customRequest)
            .pipe(map(res => res["RESPONSE"].RESULT[0].INFO.EVALRESULT[0].LopandeLangd));;
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


}
