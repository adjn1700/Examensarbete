import { Component, OnInit, Input } from '@angular/core';
import { GraphData } from '../../models/graphData';
import { GraphService } from '~/app/services/graph.service';
import { Subscription } from 'rxjs';
import { getBoolean } from "tns-core-modules/application-settings";

@Component({
  selector: 'ns-graph-value',
  templateUrl: './graph-value.component.html',
  styleUrls: ['./graph-value.component.css'],
  moduleId: module.id,
})
export class GraphValueComponent implements OnInit {

    public isDarkModeActivated: boolean;

    private graphValueSubscription: Subscription;

  constructor(private graphService: GraphService) { }

  ngOnInit() {
    //Check if darkmode is activated
    this.isDarkModeActivated = getBoolean("isDarkModeTurnedOn", false);

  }


}
