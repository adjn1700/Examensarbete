import { Component, OnInit } from '@angular/core';
import { ListPicker } from "tns-core-modules/ui/list-picker";
import { RouterExtensions } from 'nativescript-angular/router';

let countyList = ["Hallands", "Jämtlands", "Jönköpings", "Kalmars"];

@Component({
  selector: 'ns-start-screen',
  templateUrl: './start-screen.component.html',
  styleUrls: ['./start-screen.component.css'],
  moduleId: module.id,
})
export class StartScreenComponent implements OnInit {
    public countys: Array<string> = [];
    public picked: string;

    constructor(private router: RouterExtensions) {
    for (let county of countyList) {
        this.countys.push(county);
    }


  }

    public selectedIndexChanged(args) {
    let picker = <ListPicker>args.object;
    this.picked = this.countys[picker.selectedIndex];
    }

  ngOnInit() {
  }

  toDashboard(){
      this.router.navigate(['/dashboard'], {clearHistory: true});
  }

}
