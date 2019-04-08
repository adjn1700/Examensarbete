import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

@Component({
  selector: 'ns-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  moduleId: module.id,
})
export class DashboardComponent implements OnInit {

  constructor(private router: Router) { }

  backToStart(){
    this.router.navigate(['/start-screen']);
  }

  ngOnInit() {
  }

}
