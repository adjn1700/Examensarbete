import { Component } from "@angular/core";
import { CardView } from 'nativescript-cardview';
import { registerElement } from 'nativescript-angular';
import { confirm, ConfirmOptions } from "tns-core-modules/ui/dialogs";

registerElement('CardView', () => CardView as any);

@Component({
    selector: "ns-app",
    moduleId: module.id,
    templateUrl: "./app.component.html"
})
export class AppComponent {

}
