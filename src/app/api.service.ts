import { Injectable } from '@angular/core';
import { request, getFile, getImage, getJSON, getString } from "tns-core-modules/http";
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
    private apiUrl = 'http://api.trafikinfo.trafikverket.se/v1.3/data.json';

    constructor(private http: HttpClient) { }

    //Get data api
    getData(){
        let headers = this.createRequestHeader();
        return this.http.get(this.apiUrl, { headers: headers });
    }
    private createRequestHeader() {
        // set headers here e.g.
        let headers = new HttpHeaders({
            "AuthKey": "my-key",
            "AuthToken": "my-token",
            "Content-Type": "application/json",
         });

        return headers;
    }

    //Post data api
    postData(data: any) {
        let options = this.createRequestOptions();
        return this.http.post(this.apiUrl, { data }, { headers: options });
    }

    private createRequestOptions() {
        let headers = new HttpHeaders({
            "Content-Type": "application/json"
        });
        return headers;
    }
}
