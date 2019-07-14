import { Data, IdNamePair, KeyValuePair, DataViewSubComponent} from '../../../@recolinline-generic/recolinline-generic';
import { Component } from '@angular/core';
import { Observable, of } from 'rxjs';
import { LocationComponent } from './location.component';

@Component ({
   template:`<div id="location" class="card border-outline">
               <div class="card-header" style="font-family:'cursive', cursive;padding:5px 5px 5px 5px;font-size:80%;text-align:left">
                   <span i18n="@@locationComponentTitle">Localisation</span>
               </div>
               <div class="card-body" style="padding:0.1rem 0.1rem 0.1rem 0.1rem;font-size:80%;">
                   <div class="form-group">
                       <div class="custom-control custom-radio">
                           <input type="radio" class="custom-control-input" name="LocationSwitch" value="locatedInMuseum" [(ngModel)]="located" id="insideMuseumLocationSwitch">
                           <label class="custom-control-label" for="insideMuseumLocationSwitch" i18n="@@insideMuseumLocationLabel">
                           Dans le musée</label>
                       </div>
                       <div class="custom-control custom-radio">
                           <input type="radio" class="custom-control-input" name="LocationSwitch" value="locatedInStorage" [(ngModel)]="located" id="storedMuseumLocationSwitch">
                           <label class="custom-control-label" for="storedMuseumLocationSwitch" i18n="@@storedMuseumLocationLabel">
                           Dans les réserves</label>
                       </div>
                       <div class="custom-control custom-radio">
                           <input type="radio" class="custom-control-input" name="LocationSwitch" value="locatedInSharing" [(ngModel)]="located" id="sharedMuseumLocationSwitch">
                           <label class="custom-control-label" for="sharedMuseumLocationSwitch" i18n="@@sharedMuseumLocationLabel">
                           En prêt</label>
                       </div>
                  </div> 
                  <div class="form-group has-success has-danger" >
                      <label class="form-control-label" for="inputLocationComment" 
                      style="font-family:'cursive', cursive;font-size:80%;" i18n="@@inputLocationCommentLabel">Commentaire</label>
                      <textarea 
                       style="min-height:2rem;font-family:'cursive', cursive;font-size:80%;"
                       rows="3"
                       columns="60"
                       [(ngModel)]="comment"
                       class="form-control" 
                       id="inputLocationComment"
                       [class.is-valid]="validInputLocationComment(this.value)"
                       [class.is-invalid]="invalidInputLocationComment(this.value)"></textarea>
                      <div class="valid-feedback"></div>
                      <div class="invalid-feedback"></div>
                   </div>
               </div>
           </div>`
})
export class ReadWriteLocationComponent  extends LocationComponent { 

    constructor(){
       super(); 
    }
    
    validInputLocationComment(comment:string):boolean {
        return false;
    }

    invalidInputLocationComment(comment:string):boolean {
        return false;
    }
}