import { Data, IdNamePair, KeyValuePair, DataViewSubComponent} from '../../../@recolinline-generic/recolinline-generic';
import { Component, NgZone, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { PictureViewComponent } from './picture.view.component';

@Component ({
   template: 
       `<div id="picture" class="card border-outline">
            <div class="carousel slide">
              <ol class="carousel-indicators" *ngIf="pictures.length > 1">
                <li *ngFor="let picturez of pictures; let i = index;" [class.active]="picturez.active === true" (click)="selectPicture(i)"></li>
              </ol>
              <div class="carousel-inner" *ngIf="slides">
                 <picture [carousel]="this" *ngFor="let slide of slides">
                      <div class="text-center py-4 bg-dark text-white" style="width:100%;padding-bottom: 2.5rem !important;">
                         <h6>{{slide.title}}</h6>
                         <div class="lead">
                           <a (click)="showPictureModal()"><img [src]="slide.content" alt="{{slide.subtitle}}" height="150px"></a>
                         </div>
                      </div>
                 </picture>
            </div>
            <a class="left carousel-control carousel-control-prev" [class.disabled]="activePicture === 0" (click)="previousPicture()" *ngIf="pictures.length > 1">
                <span class="icon-prev carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="sr-only">Previous</span>
            </a>
            <a class="right carousel-control carousel-control-next" (click)="nextPicture()"  [class.disabled]="isLast(activePicture)" *ngIf="pictures.length > 1">
                <span class="icon-next carousel-control-next-icon" aria-hidden="true"></span>
                <span class="sr-only">Next</span>
            </a>
       </div>
        <div bsModal #pictureModal="bs-modal" class="modal fade" tabindex="-1" role="dialog">
            <div *ngIf="slides" class="modal-dialog">
              <div class="modal-content" style="align:center;width:800px;">
                <div class="modal-body">
                    <a (click)="hidePictureModal()">
                        <img src="{{!activePicture?(slides.length?slides[0].content:''):slides[activePicture].content}}" 
                        alt="{{!activePicture?(slides.length?slides[0].title:''):slides[activePicture].title}}"
                        width="100%">
                    </a>
                </div>
              </div> 
            </div>
       </div>`
 })
export class ReadOnlyPictureViewComponent  extends PictureViewComponent { 

    constructor(@Inject(NgZone) ngZone: NgZone) {
      super(ngZone);
    }    
}