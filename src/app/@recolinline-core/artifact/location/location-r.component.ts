import { Data, IdNamePair, KeyValuePair, DataViewSubComponent} from '../../../@recolinline-generic/recolinline-generic';
import { Component } from '@angular/core';
import { Observable, of } from 'rxjs';
import { LocationComponent } from './location.component';

@Component ({
   template: 
       `<div id="location" class="card border-outline">
             <div class="card-header" style="font-family:'cursive', cursive;padding:5px 5px 5px 5px;font-size:80%;text-align:left">
                   <span i18n="@@locationComponentTitle">Localisation</span>
             </div>
             <div class="card-body" style="padding:0.1rem 0.1rem 0.1rem 0.1rem;font-size:80%;">
               <p>TYPE REF: {{type}}</p>
               <p>POINTS REF : {{Stringify(points)}}</p>
               <p>COMMENT REF: {{comment}}</p>
             </div>
        </div>`
})
export class ReadOnlyLocationComponent  extends LocationComponent { 

    constructor(){
       super(); 
    }
}