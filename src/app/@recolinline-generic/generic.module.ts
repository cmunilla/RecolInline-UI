import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
    EventProvider,
    IdNamePair, 
    Fragment, 
    ParameterHandler,
    Data, 
    DataProvider, 
    DataConsumer, 
    DataValidatorComponent,
    DataCreatorAndValidatorComponent,
    ExpectingValidationComponent,
    DataView } from './recolinline-generic';    
import { 
    IdentifiableItf,
    IdNamePairItf,
    ClientHttpService,
    LogService, 
    toString, 
    Response} from '../@recolinline-service/service';
import { ExpectingValidationItf, AuthService} from '../@recolinline-auth/auth'; 
    
@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  entryComponents: [
    DataValidatorComponent,
    DataCreatorAndValidatorComponent,
    ExpectingValidationComponent]
})
export class GenericModule { }
