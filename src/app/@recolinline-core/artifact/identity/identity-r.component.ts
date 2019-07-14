import { Data, IdNamePair, KeyValuePair, DataViewSubComponent} from '../../../@recolinline-generic/recolinline-generic';
import { Component } from '@angular/core';
import { Observable, of } from 'rxjs';
import { IdentityComponent } from './identity.component';

@Component ({
   template: `
    <div id="identity" class="card border-outline">
         <div class="card-header" style="font-family:'cursive', cursive;padding:5px 5px 5px 5px;font-size:80%;text-align:left">
            <span i18n="@@identityComponentTitle">Identité</span>
         </div>
         <div  class="card body" style="font-family:'cursive',cursive;font-size:80%;">
           <p>NAME REF: {{name}}</p>
           <p>MUSEUM ID REF : {{museum_id}}</p>
           <p>DESCRIPTION REF: {{description}}</p>
           <p>INVENTORY ID REF: {{inventory_id}}</p>
        </div>
    </div>`
})
export class ReadOnlyIdentityComponent  extends IdentityComponent { 

    constructor(){
       super(); 
    }
}