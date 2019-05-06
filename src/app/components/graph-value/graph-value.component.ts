import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ns-graph-value',
  templateUrl: './graph-value.component.html',
  styleUrls: ['./graph-value.component.css'],
  moduleId: module.id,
})
export class GraphValueComponent implements OnInit {
    public currentIRIRight: number;
    public currentCrossfallRutBottom: number;
    public currentEdgeDepth: number;
    public currentRutDepthMax17: number;
    public displayValue: number;
    public displayName: string;

  constructor() { }

  ngOnInit() {
    this.currentIRIRight = 2.6;
    this.displayValue =  this.currentIRIRight;
    this.displayName = "IRI Höger";
  }

}
