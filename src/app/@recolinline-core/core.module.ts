import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BsDropdownModule, TabsModule, ButtonsModule, CarouselModule, ModalModule } from 'ngx-bootstrap';
import { ReadOnlyIdentityComponent } from './artifact/identity/identity-r.component';
import { ReadWriteIdentityComponent } from './artifact/identity/identity-rw.component';
import { ReadOnlyLocationComponent } from './artifact/location/location-r.component';
import { ReadWriteLocationComponent } from './artifact/location/location-rw.component';
import { ReadOnlyMovementComponent } from './artifact/movement/movement-r.component';
import { ReadWriteMovementComponent } from './artifact/movement/movement-rw.component';
import { PictureComponent } from './artifact/picture/picture.component';
import { ReadOnlyPictureViewComponent } from './artifact/picture/picture-r.component';
import { ReadWritePictureViewComponent } from './artifact/picture/picture-rw.component';

@NgModule({
  declarations: [
      ReadOnlyIdentityComponent,
      ReadWriteIdentityComponent,
      ReadOnlyLocationComponent,
      ReadWriteLocationComponent,
      ReadOnlyMovementComponent,
      ReadWriteMovementComponent,
      ReadOnlyPictureViewComponent,
      ReadWritePictureViewComponent,
      PictureComponent
  ],
  imports: [
    CommonModule, 
    FormsModule,
    CarouselModule, 
    ModalModule
  ],
  entryComponents:[
     ReadOnlyIdentityComponent,
     ReadWriteIdentityComponent,
     ReadOnlyLocationComponent,
     ReadWriteLocationComponent,
     ReadOnlyMovementComponent,
     ReadWriteMovementComponent,
     ReadOnlyPictureViewComponent,
     ReadWritePictureViewComponent,
     PictureComponent
  ]
})
export class CoreModule { }
