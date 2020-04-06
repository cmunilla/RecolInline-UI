import { Component, NgZone, Output, Inject, ViewChild, AfterViewInit, Type, OnInit, ComponentFactoryResolver, ComponentFactory, ComponentRef, Injector, ViewContainerRef } from '@angular/core';
import { Router  } from '@angular/router';
import { ClientHttpService , UserService} from '../../@recolinline-service/recolinline-service';
import { Data, DataView, IdNamePair, DataConsumer, DataViewSubComponent } from '../../@recolinline-generic/recolinline-generic';
import { Observable, of } from 'rxjs';

@Component ({
   templateUrl: './config-museum-view.component.html'
})
export class ConfigMuseumView extends DataView {

  @ViewChild('dataCreatorValidator', { read: ViewContainerRef, static: true }) 
  private dataCreatorValidator: ViewContainerRef;

  @ViewChild('validationExpector', { read: ViewContainerRef, static: true }) 
  private validationExpector: ViewContainerRef;
  
  @ViewChild('identity', { read: ViewContainerRef, static: true }) 
  private identity: ViewContainerRef;
    
  constructor(
          protected resolver:ComponentFactoryResolver,
          protected injector:Injector,
          protected ngZone:NgZone,
          protected router:Router,
          protected restfulClient:ClientHttpService, 
          protected userService:UserService){
     super(resolver, injector, ngZone,router, restfulClient, userService);
  }
  
  getName():string {
      return "museum";
  }; 
  
  getBaseUrl():string {
      return "/api";
  };  

  getContainer(componentName:string):ViewContainerRef{
      switch(componentName){
          case 'dataCreatorValidator': return this.dataCreatorValidator;
          case 'identity'            : return this.identity;
          case 'validationExpector'  : return this.validationExpector;
      }
      return undefined;
  };    

  getSubComponents():string[] {
      return ['identity'];
  }
  
  getSubComponent(selector:string,level:number):Type<DataViewSubComponent>{
      switch(selector){
          case 'identity':
              switch(level){
                  default : 
                      return undefined;
              }
      }
      return undefined;
  }

  getDataSpecificSubComponent(data:Data,level:number):Type<DataViewSubComponent>{
      return null;
  }

//  this.zone.runOutsideAngular(() => {
//      // STEP 2: Re-compute internal attributes
//
//      this.attribute1 = calculate(/* ... */);
//      this.attribute2 = calculate(/* ... */);
//      
//      // STEP 3: Force Angular 2 to update the view!
//      this.zone.run(() => {
//          // Optional line, however, the callback is necessary
//          // So the bare minimum would look like "this.zone.run(() => null);"
//          console.log('Update done!');
//      });
//});
}