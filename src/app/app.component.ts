import { Component, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ɵBrowserDomAdapter } from '@angular/platform-browser';
import { AuthService } from './@recolinline-auth/recolinline-auth';
import { UserService } from './@recolinline-service/recolinline-service';
import { UserRef } from './@recolinline-service/recolinline-service';
import { ANONYMOUS } from './@recolinline-service/recolinline-service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: []
})
export class AppComponent implements AfterViewChecked {
       
    /* comment accessibility for i18n generation and uncomment after */
    private  IMPORTED_ANONYMOUS:UserRef = ANONYMOUS;
    
    /* uncomment for i18n generation and re-comment after 
    userService:UserService*/

    constructor(private authenticationService:AuthService, 
        /* comment accessibility for i18n generation and uncomment after */
        private userService:UserService, 
        private changeDetectorRef:ChangeDetectorRef){
        /* uncomment for i18n generation and re-comment after 
        this.userService = userService*/
    }
    
    ngAfterViewChecked(){
        this.changeDetectorRef.detach();
        this.changeDetectorRef.detectChanges();
        this.changeDetectorRef.reattach();
    }
}
