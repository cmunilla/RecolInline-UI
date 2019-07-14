import { Data, IdNamePair, KeyValuePair, DataViewSubComponent} from '../../../@recolinline-generic/recolinline-generic';
import { Component } from '@angular/core';
import { Observable, of } from 'rxjs';

export abstract class IdentityComponent  extends DataViewSubComponent { 
   
    //uncomment for i18n generation and re-comment after
//    name:any; 
//    museum_id:any; 
//    description:any; 
//    inventory_id:any; 
    
    constructor(){
       super(); 
    }
    
    getName():string {
        return 'identity';
    }
    
    getFields():KeyValuePair[] {
       return [{key:'name', value:'...'}, 
               {key:'description',value:'...'},
               {key:'inventory_id', value:'...'}, 
               {key:'museum_id', value:1}];    
    }
}