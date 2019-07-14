import {
  Component,
  HostBinding,
  OnDestroy,
  Input,
  OnInit
} from '@angular/core';

import { PictureViewComponent } from './picture.view.component';

@Component({
  selector: 'picture',
  template: `
    <div [class.active]="active" class="item">
      <ng-content></ng-content>
    </div>
  `,
  host: {
    '[attr.aria-hidden]': '!active'
  }
})
export class PictureComponent implements OnInit, OnDestroy {

  @HostBinding('class.active')
  @Input()
  active: boolean;

  /** Wraps element by appropriate CSS classes */
  @HostBinding('class.item')
  @HostBinding('class.carousel-item')
  addClass = true;

  /** Link to Parent(container-collection) component */
  @Input()
  carousel: PictureViewComponent;

  /** Fires changes in container collection after adding a new slide instance */
  ngOnInit(): void {
    this.carousel.addPicture(this);
  }

  /** Fires changes in container collection after removing of this slide instance */
  ngOnDestroy(): void {
    this.carousel.removePicture(this);
  }
}
