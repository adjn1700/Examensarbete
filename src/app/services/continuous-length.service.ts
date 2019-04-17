import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContinuousLengthService {
  private continuousLengthSource = new BehaviorSubject<number>(0);

  continuousLength$ = this.continuousLengthSource.asObservable();
  constructor() {
      //TEST-data
      this.continuousLengthSource.next(3100);
  }
}
