import { Injectable } from '@angular/core';
import { request, getFile, getImage, getJSON, getString } from "tns-core-modules/http";
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
    private apiUrl = 'http://api.trafikinfo.trafikverket.se/v1.3/data.json';

    constructor(private http: HttpClient) {
     }


    //Post data api Fungerar inte
    postData() {
        var data = this.createRequest();
        return this.http.post(this.apiUrl, { data });
    }
    private createRequest() {
        var xmlRequest = `<REQUEST>
        <LOGIN authenticationkey="8ccbb37be31d48adbaf3009f14a45141" />
        <QUERY objecttype="Situation">
              <FILTER>
                    <WITHIN name="Deviation.Geometry.SWEREF99TM" shape="center" value="320011 6398983" radius="10000" />
              </FILTER>
              <INCLUDE>Deviation.Header</INCLUDE>
              <INCLUDE>Deviation.IconId</INCLUDE>
              <INCLUDE>Deviation.Message</INCLUDE>
              <INCLUDE>Deviation.MessageCode</INCLUDE>
              <INCLUDE>Deviation.MessageType</INCLUDE>
        </QUERY>
  </REQUEST>`
        return xmlRequest;
    }



}
