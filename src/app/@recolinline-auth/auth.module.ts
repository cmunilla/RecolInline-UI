import { NgModule, ChangeDetectorRef, Injector } from '@angular/core';
import { BrowserModule} from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent, LogoutComponent, LoginErrorComponent } from './recolinline-auth';
import { AuthService, ExpectingValidationGuard, AuthenticationGuard, HttpRequestTokenInjector } from './recolinline-auth';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';


@NgModule({ 
  declarations:[
  ],
  exports:[
  ],
  imports:[
    HttpClientModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: HttpRequestTokenInjector,
    multi: true
  },
  AuthService,
  ExpectingValidationGuard,
  AuthenticationGuard]
})
export class AuthModule { }
