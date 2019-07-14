import { Data, IdNamePair, KeyValuePair, DataViewSubComponent} from '../../../@recolinline-generic/recolinline-generic';
import { Component } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MovementComponent } from './movement.component';

@Component ({
   template: 
       `<div id="movement" class="card border-outline">
               <div class="card-header" style="font-family:'cursive', cursive;padding:5px 5px 5px 5px;font-size:80%;text-align:left">
                   <span i18n="@@movementComponentTitle">Déplacement</span>
               </div>
               <div class="card-body" style="padding:5px 5px 5px 5px;font-size:80%;">
                   <div class="form-group">
                       <div class="custom-control custom-radio">
                           <input type="radio" class="custom-control-input" name="MovementSwitch" value="locatedInMuseum" [(ngModel)]="located" id="insideMuseumMovementSwitch">
                           <label class="custom-control-label" for="insideMuseumMovementSwitch" i18n="@@insideMuseumLocationLabel">
                           Dans le musée</label>
                       </div>
                       <div class="custom-control custom-radio">
                           <input type="radio" class="custom-control-input" name="MovementSwitch" value="locatedInStorage" [(ngModel)]="located" id="storedMuseumMovementSwitch">
                           <label class="custom-control-label" for="storedMuseumMovementSwitch" i18n="@@storedMuseumLocationLabel">
                           Dans les réserves</label>
                       </div>
                       <div class="custom-control custom-radio">
                           <input type="radio" class="custom-control-input" name="MovementSwitch" value="locatedInSharing" [(ngModel)]="located" id="sharedMuseumMovementSwitch">
                           <label class="custom-control-label" for="sharedMuseumMovementSwitch" i18n="@@sharedMuseumLocationLabel">
                           En prêt</label>
                       </div>
                  </div> 
                  <div class="form-group has-success has-danger" >
                      <label class="form-control-label" for="inputMovementComment" 
                      style="font-family:'cursive', cursive;font-size:80%;" i18n="@@inputLocationCommentLabel">Commentaire</label>
                      <textarea 
                       style="min-height:2rem;font-family:'cursive', cursive;font-size:80%;"
                       rows="3"
                       columns="60"
                       [(ngModel)]="comment"
                       class="form-control" 
                       id="inputMovementComment"
                       [class.is-valid]="validInputMovementComment(this.value)"
                       [class.is-invalid]="invalidInputMovementComment(this.value)"></textarea>
                      <div class="valid-feedback"></div>
                      <div class="invalid-feedback"></div>
                   </div>
               </div>
           </div>`
})
export class ReadWriteMovementComponent  extends MovementComponent { 

    constructor(){
       super(); 
    }
    
    validInputMovementComment(comment:string):boolean {
        return false;
    }

    invalidInputMovementComment(comment:string):boolean {
        return false;
    }
}