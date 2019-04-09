import { Component, OnInit } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular/router';
import { ApiService } from '~/app/api.service';
import { confirm, ConfirmOptions } from "tns-core-modules/ui/dialogs";
import {SelectedRoad} from '../selectedRoad'

@Component({
  selector: 'ns-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  moduleId: module.id
})
export class DashboardComponent implements OnInit {

    //Till hämta api
    public host: string;
    public userAgent: string;
    public origin: string;
    public url: string;

    public selectedRoad: SelectedRoad;

  constructor(private myapiService: ApiService, private router: RouterExtensions) { }

  ngOnInit() {
    //console.log(this.extractData());
}
    //Api Get
    extractData() {
        this.myapiService.getData()
            .subscribe((result) => {
                this.onGetDataSuccess(result);
            }, (error) => {
                console.log(error);
            });
    }

    private onGetDataSuccess(res) {
        this.host = res.headers.Host;
        this.userAgent = res.headers["User-Agent"];
        this.origin = res.origin;
        this.url = res.url;
    }
    //Api Post
    public user: string;
    public pass: string;
    public message: string = "";


    public submit() {
        this.makePostRequest();
    }

    private makePostRequest() {
        this.myapiService
            .postData({ username: this.user, password: this.pass })
            .subscribe(res => {
                this.message = (<any>res).json.data.username;
            });
    }

    //Alert
  cancelAlert(){
    let options: ConfirmOptions = {
        title: "Avsluta",
        message: "Är du säker att du vill avsluta och gå till förstasidan?",
        okButtonText: "Ja",
        cancelButtonText: "Avbryt"
    };
    confirm(options).then((result: boolean) => {
        if (result === true){
            this.backToStart();
        }
    });
  }

  //Navigering
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
}
