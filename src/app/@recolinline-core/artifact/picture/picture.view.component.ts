import { Data, IdNamePair, KeyValuePair, DataViewSubComponent} from '../../../@recolinline-generic/recolinline-generic';
import { FormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { toString, ClientHttpService } from '../../../@recolinline-service/recolinline-service';
import { Component, Inject, EventEmitter, Input, NgZone, OnInit, OnDestroy, Output, ViewChild, Directive } from '@angular/core';
import { LinkedList } from 'ngx-bootstrap/utils';
import { Slide } from '../../home/home.component';
import { PictureComponent } from './picture.component';
import { ModalDirective, ModalOptions} from 'ngx-bootstrap/modal';
  
export enum Direction {
  UNKNOWN,
  NEXT,
  PREV
}

@Directive()
export abstract class PictureViewComponent  extends DataViewSubComponent { 

    //uncomment for i18n generation and re-comment after
//    slides:any;

    @ViewChild('pictureModal', { static: true }) 
    pictureModal: ModalDirective;
        
    @Output()
    activePictureChange: EventEmitter<number> = new EventEmitter<number>(false);
    
    protected _currentActivePicture: number;
    protected _pictures: LinkedList<PictureComponent> = new LinkedList<PictureComponent>();

    constructor(private ngZone: NgZone) {
      super();
    }

    getName():string {
        return 'picture';
    }
    
    getFields():KeyValuePair[] {                
       return [{key:'slides',value:[{title:'', subtitle:'', content:'assets/artifacts/images/small/blank.png'}]}];    
    }

    showPictureModal():void {
      this.pictureModal.show();
    }
    
    hidePictureModal(): void {
      this.pictureModal.hide();
    }
    
    /** Index of currently displayed slide(started for 0) */
    set activePicture(index: number) {
      if (this._pictures.length && index !== this._currentActivePicture) {
        this._select(index);
      }
    }
    
    get activePicture(): number {
      return this._currentActivePicture;
    }
    
    get pictures(): PictureComponent[] {
      return this._pictures.toArray();
    }

    /**
     * Adds new slide. If this slide is first in collection - set it as active
     * and starts auto changing
     * @param slide
     */
    addPicture(picture: PictureComponent): void {
      this._pictures.add(picture);
      if (this._pictures.length === 1) {
        this._currentActivePicture = undefined;
        this.activePicture = 0;
      }
    }

    /**
     * Removes specified slide. If this slide is active - will roll to another
     * slide
     * @param slide
     */
    removePicture(picture: PictureComponent): void {
      const remIndex = this._pictures.indexOf(picture);
      if (this._currentActivePicture === remIndex) {
        let nextPictureIndex: number = undefined;
        if (this._pictures.length > 1) {
          nextPictureIndex = !this.isLast(remIndex)? remIndex:remIndex - 1;
        }
        this._pictures.remove(remIndex);
        setTimeout(() => { this._select(nextPictureIndex);}, 0);
      } else {
        this._pictures.remove(remIndex);
        const currentPictureIndex = this.getCurrentPictureIndex();
        setTimeout(() => {
          // after removing, need to actualize index of current active slide
          this._currentActivePicture = currentPictureIndex;
          this.activePictureChange.emit(this._currentActivePicture);
        }, 0);
      }
    }

    /**
     * Rolling to next slide
     * @param force: {boolean} if true - will ignore noWrap flag
     */
    nextPicture(): void {
      this.activePicture = this.findNextPictureIndex(Direction.NEXT);
    }

    /**
     * Rolling to previous slide
     * @param force: {boolean} if true - will ignore noWrap flag
     */
    previousPicture(): void {
      this.activePicture = this.findNextPictureIndex(Direction.PREV);
    }

    /**
     * Rolling to specified slide
     * @param index: {number} index of slide, which must be shown
     */
    selectPicture(index: number): void {
      this.activePicture = index;
    }
    
    /**
     * Finds and returns index of currently displayed slide
     */
    getCurrentPictureIndex(): number {
      return this._pictures.findIndex((picture: PictureComponent) => picture.active);
    }

    /**
     * Defines, whether the specified index is last in collection
     * @param index
     */
    isLast(index: number): boolean {
      return index + 1 >= this._pictures.length;
    }

    /**
     * Defines next slide index, depending of direction
     * @param direction: Direction(UNKNOWN|PREV|NEXT)
     */
    private findNextPictureIndex(direction: Direction): number {
      this._currentActivePicture = typeof this._currentActivePicture === 'undefined'
            ?this._pictures.length?0:undefined
            :this._currentActivePicture;
      let nextPictureIndex = 0
      if ((this.isLast(this._currentActivePicture) && direction === Direction.NEXT )
          ||(this._currentActivePicture === 0 && direction === Direction.PREV )){
          nextPictureIndex = this._currentActivePicture;
      } else {          
          switch (direction) {
            case Direction.NEXT:
              // if this is last slide, not force, looping is disabled
              // and need to going forward - select current slide, as a next
              nextPictureIndex = this._currentActivePicture + 1;
              break;
            case Direction.PREV:
              // if this is first slide, not force, looping is disabled
              // and need to going backward - select current slide, as a next
              nextPictureIndex = this._currentActivePicture - 1;
              break;
            default:
              throw new Error('Unknown direction');
          }
      }
      return nextPictureIndex;
    }

    /**
     * Sets a slide, which specified through index, as active
     * @param index
     */
    private _select(index: number): void {
     
      const currentPicture = this._pictures.get(this._currentActivePicture);
      if (currentPicture) {
        currentPicture.active = false;
      }
      const nextPicture = this._pictures.get(index);
      if (nextPicture) {
        this._currentActivePicture = index;
        nextPicture.active = true;
        //this.activePicture = index;
        this.activePictureChange.emit(index);
      }
    }

}