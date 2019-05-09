import { Component, OnInit, Input } from '@angular/core';
import { GraphData } from '../../models/graphData';
import { GraphService } from '~/app/services/graph.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ns-graph-value',
  templateUrl: './graph-value.component.html',
  styleUrls: ['./graph-value.component.css'],
  moduleId: module.id,
})
export class GraphValueComponent implements OnInit {

    private graphValueSubscription: Subscription;

  constructor(private graphService: GraphService) { }

  ngOnInit() {

  }


}
