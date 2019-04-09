import { Component, OnInit } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular/router';
<<<<<<< HEAD
import { ApiService } from '~/app/api.service';
=======
import { confirm, ConfirmOptions } from "tns-core-modules/ui/dialogs";
>>>>>>> 90c44530a1903b7250f0d99b36dcb7f7fdc30d80


@Component({
  selector: 'ns-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  moduleId: module.id,
})
export class DashboardComponent implements OnInit {

  constructor(myapiService: ApiService, private router: RouterExtensions) { }

  ngOnInit() {

}



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
