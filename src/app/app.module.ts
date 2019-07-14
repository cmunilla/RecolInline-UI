import { BrowserModule} from '@angular/platform-browser';
import { NgModule, NgZone, ComponentFactoryResolver, ChangeDetectorRef, Injector } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { BsDropdownModule, TabsModule, ButtonsModule, CarouselModule, ModalModule } from 'ngx-bootstrap';
import { ServiceModule } from './@recolinline-service/service.module';
import { GenericModule } from './@recolinline-generic/generic.module';
import { AuthModule } from './@recolinline-auth/auth.module';
import { CoreModule } from './@recolinline-core/core.module';


@NgModule( { 
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    ButtonsModule.forRoot(),
    CarouselModule.forRoot(),
    ModalModule.forRoot(),
    ServiceModule,
    GenericModule,
    AuthModule,
    CoreModule
  ],
  entryComponents: [],
  exports: [],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
