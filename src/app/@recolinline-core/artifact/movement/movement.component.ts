import { Data, IdNamePair, KeyValuePair, DataViewSubComponent} from '../../../@recolinline-generic/recolinline-generic';
import { Component } from '@angular/core';
import { Observable, of } from 'rxjs';
import { toString } from '../../../@recolinline-service/recolinline-service';

export abstract class MovementComponent  extends DataViewSubComponent { 

    //uncomment for i18n generation and re-comment after
//    type:any;
//    points:any;
//    comment:any;
//    located:any;
//    value:any;
    
    constructor(){
       super(); 
    }
    
    getName():string {
        return 'movement';
    }
    
    getFields():KeyValuePair[] {                
       return [{key:'type', value:'point'}, 
               {key:'located', value:'locatedInMuseum'}, 
               {key:'points',value:'[]'},
               {key:'comment', value:undefined}];    
    }
    
    Stringify(arg:any):string{
        if(!arg){
            return undefined;
        }
        return toString(arg);
    }
}