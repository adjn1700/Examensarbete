import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
    private apiUrl = 'https://api.trafikinfo.trafikverket.se/v1.3/data.json';

    constructor(private http: HttpClient) {
    }

    //Post data api
    postData() {
        var data = this.createRequestWGS();
        return this.http.post(this.apiUrl, data );
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
