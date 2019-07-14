import { Data, IdNamePair, KeyValuePair, DataViewSubComponent} from '../../../@recolinline-generic/recolinline-generic';
import { Component } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MovementComponent } from './movement.component';

@Component ({
   template: `
   <div id="movement" class="card border-outline">
           <div class="card-header" style="font-family:'cursive', cursive;padding:5px 5px 5px 5px;font-size:80%;text-align:left">
              <span i18n="@@movementComponentTitle">Déplacement</span>
           </div>
           <div class="card-body" style="padding:5px 5px 5px 5px;font-size:80%;" >
               <p>TYPE REF: {{type}}</p>
               <p>POINTS REF : {{Stringify(points)}}</p>
               <p>COMMENT REF: {{comment}}</p>
           </div> 
  </div>`
})
export class ReadOnlyMovementComponent  extends MovementComponent { 

    constructor(){
       super(); 
    }
}