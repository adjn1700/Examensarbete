import { Injectable } from '@angular/core';
import { request, getFile, getImage, getJSON, getString } from "tns-core-modules/http";
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
    private apiUrl = 'http://api.trafikinfo.trafikverket.se/v1.3/data.json';

    constructor(private http: HttpClient) { }

    getData(){

    }

}
