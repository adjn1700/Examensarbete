import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { HttpClientModule } from '@angular/common/http'
import { NativeScriptHttpClientModule } from "nativescript-angular/http-client";
import { NativeScriptFormsModule } from "nativescript-angular/forms";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { LocationComponent } from './components/location/location.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { StartScreenComponent } from './start-screen/start-screen.component';
import { DestinationComponent } from './components/destination/destination.component';
import { ApiService } from "~/app/services/api.service";

import { NativeScriptUIAutoCompleteTextViewModule } from "nativescript-ui-autocomplete/angular";
import { DestinationAddComponent } from './components/destination-add/destination-add.component';
import { PavingComponent } from './components/paving/paving.component';


// Uncomment and add to NgModule imports if you need to use two-way binding
// import { NativeScriptFormsModule } from "nativescript-angular/forms";

// Uncomment and add to NgModule imports if you need to use the HttpClient wrapper
// import { NativeScriptHttpClientModule } from "nativescript-angular/http-client";

@NgModule({
    bootstrap: [
        AppComponent
    ],
    imports: [
        NativeScriptModule,
        AppRoutingModule,
        HttpClientModule,
        NativeScriptHttpClientModule,
        NativeScriptUIAutoCompleteTextViewModule,
        NativeScriptFormsModule
    ],
    declarations: [
        AppComponent,
        LocationComponent,
        DashboardComponent,
        StartScreenComponent,
        DestinationComponent,
        DestinationAddComponent,
        PavingComponent
    ],
    providers: [],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
/*
Pass your application module to the bootstrapModule function located in main.ts to start your app
*/
export class AppModule { }
