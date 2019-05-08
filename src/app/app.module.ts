import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { HttpClientModule } from '@angular/common/http'
import { NativeScriptHttpClientModule } from "nativescript-angular/http-client";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from "~/app/app-routing.module";
import { AppComponent } from "~/app/app.component";
import { LocationComponent } from '~/app/components/location/location.component';
import { DashboardComponent } from '~/app/components/dashboard/dashboard.component';
import { StartScreenComponent } from '~/app/components/start-screen/start-screen.component';
import { DestinationComponent } from '~/app/components/destination/destination.component';
import { PavingComponent } from './components/paving/paving.component';
import { TestpageComponent } from './components/testpage/testpage.component';

import { ApiService } from "~/app/services/api.service";
import { DataShareService } from './services/data-share.service';
import { ConversionService } from './services/conversion.service';
import { InternetConnectionService } from './services/internet-connection.service';
import { NativeScriptUISideDrawerModule } from 'nativescript-ui-sidedrawer/angular/side-drawer-directives'
import { DropDownModule } from "nativescript-drop-down/angular";
import { NativeScriptUIChartModule } from "nativescript-ui-chart/angular";

import { NativeScriptUIAutoCompleteTextViewModule } from "nativescript-ui-autocomplete/angular";
import { DestinationAddComponent } from './components/destination-add/destination-add.component';
import { ContinuousLengthComponent } from './components/continuous-length/continuous-length.component';
import { GraphValueComponent } from './components/graph-value/graph-value.component';
import { GraphComponent } from './components/graph/graph.component';
import { SideDrawerComponent } from './components/side-drawer/side-drawer.component';


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
        NativeScriptFormsModule,
        NativeScriptUISideDrawerModule,
        DropDownModule,
        NativeScriptUIChartModule,
        CommonModule
    ],
    declarations: [
        AppComponent,
        LocationComponent,
        DashboardComponent,
        StartScreenComponent,
        DestinationComponent,
        DestinationAddComponent,
        PavingComponent,
        ContinuousLengthComponent,
        GraphValueComponent,
        GraphComponent,
        TestpageComponent,
        SideDrawerComponent
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
