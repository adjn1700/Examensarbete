import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ContinuousLengthService } from '~/app/services/continuous-length.service';
import { getBoolean } from "tns-core-modules/application-settings";

@Component({
  selector: 'ns-continuous-length',
  templateUrl: './continuous-length.component.html',
  styleUrls: ['./continuous-length.component.css'],
  moduleId: module.id,
})
export class ContinuousLengthComponent implements OnInit, OnDestroy {

    private clSubscription: Subscription;
    public currentContinuousLength: number;
    public isDarkModeActivated: boolean;

  constructor(public clService: ContinuousLengthService) {
    this.clSubscription = this.clService.continuousLength$.subscribe(
        cl => {
            this.currentContinuousLength = cl;
        });

  }

  ngOnInit() {
    this.isDarkModeActivated = getBoolean("isDarkModeTurnedOn", false);
  }

  ngOnDestroy(){
    this.clSubscription.unsubscribe();
  }

}
