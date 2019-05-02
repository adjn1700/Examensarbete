import { Injectable } from '@angular/core';
import { connectionType, getConnectionType, startMonitoring, stopMonitoring }from "tns-core-modules/connectivity";
import { Observable } from "rxjs/internal/Observable";
import { Subject } from "rxjs/internal/Subject";
import { BehaviorSubject } from "rxjs/internal/BehaviorSubject";

@Injectable({
    providedIn: 'root'
  })

export class InternetConnectionService {
    private _connectionStatusSubject$: BehaviorSubject<boolean>;

    constructor() {
        this._connectionStatusSubject$ = new BehaviorSubject<boolean>(getConnectionType() != 0);
        startMonitoring(connectionType => {
            if (connectionType == 0) {
                this._connectionStatusSubject$.next(false);
            }
            else
                this._connectionStatusSubject$.next(true);
        });
    }

    get connectionStatus$(): Observable<boolean> {
        return this._connectionStatusSubject$.asObservable();
    }
}
