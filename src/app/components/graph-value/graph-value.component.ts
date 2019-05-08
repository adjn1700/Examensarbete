import { Component, OnInit, Input } from '@angular/core';
import { GraphData } from '../../models/graphData';
import { GraphService } from '~/app/services/graph.service';
import { Subscription } from 'rxjs';
import { DataShareService } from '../../services/data-share.service';

@Component({
  selector: 'ns-graph-value',
  templateUrl: './graph-value.component.html',
  styleUrls: ['./graph-value.component.css'],
  moduleId: module.id,
})
export class GraphValueComponent implements OnInit {
    public currentIRIRight: number =  this.graphService.iriRightCurrent;
    public currentCrossfallRutBottom: number =  this.graphService.crossfallRutBottomCurrent;
    public currentEdgeDepth: number =  this.graphService.edgeDepthCurrent;
    public currentRutDepthMax17: number =  this.graphService.rutDepthMax17Current;
    public displayValue: number;
    public displayName: string;

    @Input() currentSlide: number = 0;
    public currentSlider: number = 0;

    private graphValueSubscription: Subscription;

  constructor(private graphService: GraphService, private dataShareService: DataShareService) { }

  ngOnInit() {
    //this.currentIRIRight = this.graphService.iriRightCurrent;
    //this.displayValue =  this.graphService.iriRightCurrent;
    //this.displayName = "Spårdjup";

    this.currentSlider = this.dataShareService.getData();
    console.log(this.currentSlider);
  }


}
