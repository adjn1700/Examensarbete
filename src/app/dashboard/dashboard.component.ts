import { Component, OnInit } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular/router';

@Component({
  selector: 'ns-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  moduleId: module.id,
})
export class DashboardComponent implements OnInit {

  constructor(private router: RouterExtensions) { }

  backToStart(){
    this.router.navigate(['/start-screen'], {
        clearHistory: true,
        animated: true, transition: {
            name: "slideRight",
            duration: 200,
            curve: "easeIn"
        }
    } );
  }

  ngOnInit() {
  }

}
