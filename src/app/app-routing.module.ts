import { NgModule } from "@angular/core";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { Routes, NavigationExtras } from "@angular/router";

import { StartScreenComponent } from './components/start-screen/start-screen.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DestinationAddComponent } from './components/destination-add/destination-add.component';
import { TestpageComponent } from "./components/testpage/testpage.component";

const routes: Routes = [
    { path: "", redirectTo: "/start-screen", pathMatch: "full" },
    { path: "start-screen", component: StartScreenComponent },
    { path: "dashboard", component: DashboardComponent },
    { path: "destibation-add", component: DestinationAddComponent },
    { path: "testpage", component: TestpageComponent}
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }
