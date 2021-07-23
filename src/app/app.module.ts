import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToggleComponent } from './component/toggle/toggle.component';
import { CalBodyComponent } from './component/cal-body/cal-body.component';

@NgModule({
  declarations: [
    AppComponent,
    ToggleComponent,
    CalBodyComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
   
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
