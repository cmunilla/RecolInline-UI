import { NgModule, NgZone, ChangeDetectorRef, ComponentFactoryResolver, Injector  } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { MediationView } from './@recolinline-core/mediation/mediation-view.component';
import { ConfigView } from './@recolinline-core/config/config-view.component';
import { ArtifactView } from './@recolinline-core/artifact/artifact-view.component';
import { Home } from './@recolinline-core/home/home.component';
import { ConfigMuseumView } from './@recolinline-core/museum/config-museum-view.component';
import { ConfigUserView } from './@recolinline-core/config/user/config-user-view.component';
import { ConfigAccountView } from './@recolinline-core/config/account/config-account-view.component';
import { ConfigRmtView } from './@recolinline-core/config/rmt/config-rmt-view.component';
import { PageNotFound } from './@recolinline-core/home/page-not-found.component';
import { Routes, RouterModule } from '@angular/router';

import { BsDropdownModule, TabsModule, ButtonsModule, CarouselModule, ModalModule } from 'ngx-bootstrap';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CoreModule } from './@recolinline-core/core.module';
import { ServiceModule } from './@recolinline-service/service.module';
import { GenericModule } from './@recolinline-generic/generic.module';
import { AuthModule } from './@recolinline-auth/auth.module';

import { UserService } from './@recolinline-service/recolinline-service';
import { DataProvider } from './@recolinline-generic/recolinline-generic';
import { ParameterHandler, EventProvider, IdNamePair, Fragment,  Data, ExpectingValidationComponent, DataValidatorComponent, DataCreatorAndValidatorComponent } from './@recolinline-generic/recolinline-generic';
import { ExpectingValidationGuard, AuthenticationGuard, LoginComponent, LogoutComponent, LoginErrorComponent, AuthService } from './@recolinline-auth/recolinline-auth';

const routes: Routes = [
  { path: '', component: Home },
  { path: 'config', component: ConfigView },
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LogoutComponent },
  { path: 'login/error', component: LoginErrorComponent },
  { path: 'config/museum', canDeactivate: [ExpectingValidationGuard], canActivate: [AuthenticationGuard], canLoad: [AuthenticationGuard], component: ConfigMuseumView },
  { path: 'config/user', canDeactivate: [ExpectingValidationGuard], canActivate: [AuthenticationGuard], canLoad: [AuthenticationGuard], component: ConfigUserView },
  { path: 'config/account', canDeactivate: [ExpectingValidationGuard], canActivate: [AuthenticationGuard], canLoad: [AuthenticationGuard], component: ConfigAccountView },
  { path: 'config/application', canDeactivate: [ExpectingValidationGuard], canActivate: [AuthenticationGuard], canLoad: [AuthenticationGuard], component: ConfigRmtView },
  { path: 'artifact', canDeactivate: [ExpectingValidationGuard], canActivate: [AuthenticationGuard], canLoad: [AuthenticationGuard], component: ArtifactView },
  { path: 'mediation', canDeactivate: [ExpectingValidationGuard], canActivate: [AuthenticationGuard], canLoad: [AuthenticationGuard], component: MediationView },
  { path: '**', component: PageNotFound }
];

@NgModule({
  declarations: [Home,
     ConfigView, 
     MediationView, 
     ArtifactView,
     ConfigAccountView, 
     ConfigUserView, 
     ConfigMuseumView,
     ConfigRmtView,
     PageNotFound,
     LoginComponent,
     LogoutComponent,
     LoginErrorComponent,
     ExpectingValidationComponent, 
     DataValidatorComponent,
     DataCreatorAndValidatorComponent],
  imports: [BrowserModule, 
     HttpClientModule, 
     BsDropdownModule,
     FormsModule,
     ReactiveFormsModule,
     TabsModule, 
     ButtonsModule, 
     CarouselModule,
     ModalModule,
     ServiceModule,
     AuthModule,
     CoreModule,
     RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
