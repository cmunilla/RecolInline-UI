import { BrowserModule} from '@angular/platform-browser';
import { NgModule, ChangeDetectorRef, Injector } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from '../src/app/app-routing.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppMockComponent } from './app.mock.component';
import { BsDropdownModule, TabsModule, ButtonsModule, CarouselModule } from 'ngx-bootstrap';
import { CoreModule } from '../src/app/@recolinline-core/core.module';
import { ServiceModule } from '../src/app/@recolinline-service/service.module';
import { GenericModule } from '../src/app/@recolinline-generic/generic.module';
import { AuthModule } from '../src/app/@recolinline-auth/auth.module';
import { HttpRequestInterceptor} from './app.interceptor';


@NgModule( { 
  declarations: [
    AppMockComponent
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
    ServiceModule,
    GenericModule,
    AuthModule,
    CoreModule
  ],
  entryComponents: [],
  exports: [],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: HttpRequestInterceptor,
    multi: true
  }],
  bootstrap: [AppMockComponent]
})
export class AppMockModule { }
