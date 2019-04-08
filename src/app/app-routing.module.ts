import { NgModule } from "@angular/core";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { Routes } from "@angular/router";

import { StartScreenComponent } from './start-screen/start-screen.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
    { path: "", redirectTo: "/start-screen", pathMatch: "full" },
    { path: "start-screen", component: StartScreenComponent },
    { path: "dashboard", component: DashboardComponent }
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }
