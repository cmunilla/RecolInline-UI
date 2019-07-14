import  { Component, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import  { FormsModule } from '@angular/forms';
import  { ɵBrowserDomAdapter } from '@angular/platform-browser';
import  { AuthService } from '../src/app/@recolinline-auth/recolinline-auth';
import  { UserService } from '../src/app/@recolinline-service/recolinline-service';
import  { UserRef } from '../src/app/@recolinline-service/recolinline-service';
import { ANONYMOUS } from '../src/app/@recolinline-service/recolinline-service';


@Component({
  selector: 'app-root',
  templateUrl: '../src/app/app.component.html',
  styleUrls: []
})
export class AppMockComponent implements AfterViewChecked {
       
    private IMPORTED_ANONYMOUS:UserRef = ANONYMOUS;
    
    constructor(private authenticationService:AuthService, 
        private userService:UserService, 
        private changeDetectorRef:ChangeDetectorRef){
    }
    
    ngAfterViewChecked(){
        this.changeDetectorRef.detach();
        this.changeDetectorRef.detectChanges();
        this.changeDetectorRef.reattach();
    }
}

