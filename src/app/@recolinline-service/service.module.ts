import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientHttpService, ThemeConfigurationService, UserService, LogService } from './recolinline-service';

@NgModule({
  declarations: [],
  imports: [
      CommonModule
  ],
  providers:[
      LogService,
      ClientHttpService,
      ThemeConfigurationService,
      UserService
  ]
})
export class ServiceModule { }
