import { Injectable, Inject, Injector, Component, Type, OnInit, AfterViewInit, ChangeDetectorRef, AfterViewChecked, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders, HttpEventType, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { UserService, ThemeConfigurationService } from '../@recolinline-service/recolinline-service';
import { UserRef } from '../@recolinline-service/recolinline-service';
import { ANONYMOUS } from '../@recolinline-service/recolinline-service';
import { Observable, of} from 'rxjs';
import { shareReplay, catchError,  delay, tap, map } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Md5 } from 'ts-md5/dist/md5';
import { Router, CanActivate, CanActivateChild, CanDeactivate, CanLoad, Route, 
UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Data, IdNamePair } from '../@recolinline-generic/recolinline-generic';
import { ModalDirective, ModalOptions} from 'ngx-bootstrap/modal';
//import { JwtHelperService } from '@auth0/angular-jwt';
import * as moment from "moment";

export interface ExpectingValidationItf {
    expectValidation: (redirection:string) => boolean;
}

@Injectable({
    providedIn: 'root',
})
export class HttpRequestTokenInjector implements HttpInterceptor {
    
    constructor(private injector: Injector) {  
    }
    
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {        
        const idToken = localStorage.getItem("access_token");  
        if (idToken && idToken!==null) {
            const cloned = request.clone({
                headers: request.headers.set("Authorization","Bearer " + idToken)
            });            
            return next.handle(cloned);
        } else { 
            return next.handle(request).pipe(tap(n => {
                if(n.type!==HttpEventType.Response){
                    return;
                }
                let tokenHeader:string = n.headers.get('X-Auth-Token');
                if(!tokenHeader || tokenHeader===null){
                    return;
                }
//                const helper = new JwtHelperService();
                tokenHeader = tokenHeader.substring(7);
//                const decodedToken = helper.decodeToken(tokenHeader);
//                const expirationDate = helper.getTokenExpirationDate(tokenHeader); 
//                const isExpired = helper.isTokenExpired(tokenHeader);
//                
//                const result:HttpResponse<any> = <HttpResponse<any>>n
//                const expiresAt = moment().add(result.body.expiresIn,'second');
                localStorage.setItem('access_token', tokenHeader);
                }));;
        }
    }
}

@Injectable({
    providedIn: 'root',
})
export class ExpectingValidationGuard implements CanDeactivate<ExpectingValidationItf> {
    
    constructor(private router:Router){
    }

    canDeactivate(component: ExpectingValidationItf, currentRoute: ActivatedRouteSnapshot, currentState: RouterStateSnapshot, nextState?: RouterStateSnapshot) {
        let deactivable:boolean = true;
        if(component.expectValidation){            
            let initialUrl:string|UrlTree = this.router.getCurrentNavigation().initialUrl;
            let url:string = (initialUrl instanceof UrlTree)?(<UrlTree>initialUrl).toString():<string>initialUrl;
            let expectation:boolean = component.expectValidation(nextState?nextState.url:url);
            deactivable = !expectation;
        }
        return deactivable;
    }
}

@Injectable({
    providedIn: 'root',
})
export class AuthService {

    redirectUrl: string;
    
    constructor(private http: HttpClient, private userService:UserService, private router: Router) {
        this.redirectUrl='/';
    }
      
    login(login:string, password:string ): Observable<boolean>{     
       let content:any = {login:`${login}`,password:`${password}`};
       this.http.post<any>('/api/login', content, {observe:'response'}
        ).subscribe(resp => {
            if(resp['status'] === 202){ 
                let userRef:UserRef = <UserRef> resp.body; 
                this.userService.updateUser(userRef);  
            }
       });
       return of(this.userService.getUserId()!==ANONYMOUS.id);
    }

    logout(): void {
       this.router.navigate(['/logout']);       
    }
}

@Injectable({
  providedIn: 'root',
})
export class AuthenticationGuard implements CanActivate, CanLoad {
  
  constructor(private authService:AuthService, private userService:UserService,
          private router: Router ){
  }

  canActivate(next:ActivatedRouteSnapshot, state:RouterStateSnapshot):Observable<boolean | UrlTree> | boolean | UrlTree {
    let url: string = state.url;
    return this.checkLogin(url);
  }
  
  canLoad(route:Route):Observable<boolean> | boolean {
    let url = `/${route.path}`;
    return this.checkLogin(url);
  }

  checkLogin(url: string): boolean {
    if (this.userService.getUserId()!==ANONYMOUS.id) { 
        return true; 
    }
    // Store the attempted URL for redirecting
    this.authService.redirectUrl = url;

    // Navigate to the login page with extras
    this.router.navigate(['/login']);
    return true;
  }
}

@Component({
  selector: 'login',
  template: `
    <div class="row">        
        <div bsModal #childModal="bs-modal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="dialog-child-name">
          <div class="modal-dialog" style="width:45%">
            <div class="modal-content">
              <div class="modal-body">
                <form [formGroup]="form">
                    <fieldset>
                        <legend>Login</legend>
                        <div class="form-field">
                            <label i18n="@@emailLabel">Courriel:</label>
                            <input name="email" formControlName="email">
                        </div>
                        <div class="form-field">
                            <label i18n="@@passwordLabel">Mot de passe:</label>
                            <input name="password" formControlName="password" type="password">
                        </div>
                    </fieldset>
                    <div class="form-buttons">
                        <button class="button button-primary" (click)="login()">Login</button>
                    </div>
                </form>
              </div>
            </div> 
          </div>
        </div>    
    </div>`
 })
export class LoginComponent implements AfterViewInit {
    
    form:FormGroup;

    @ViewChild('childModal', { static: true }) 
    childModal: ModalDirective;
    
    private visible:boolean = false;
    private resolve: (value?: boolean | PromiseLike<boolean>) => void;
    private reject:  (reason?: any) => void;
    private promise:Promise<boolean>;
    
    constructor(private fb:FormBuilder, 
                 private authService: AuthService, 
                 private router: Router) {
        this.form = this.fb.group({
            email: ['',Validators.required],
            password: ['',Validators.required]
        });
    }
    
    ngAfterViewInit() {
      this.childModal.config.ignoreBackdropClick=true;
      this.showChildModal();
    }

    showChildModal(): Promise<boolean> {
      if(this.visible) {
          return this.promise;
      }
      this.visible = true;
      this.childModal.show();

      this.promise = new Promise<boolean>((resolve, reject) => {
          this.resolve = resolve;
          this.reject  = reject;
        }); 
      return this.promise;
    }
    
    hideChildModal(toBeSaved:boolean): void {
      if(!this.visible) {
          return;
      }
      this.visible = false;
      this.childModal.hide();
      this.resolve(toBeSaved);
    }

    login() {
        const val = this.form.value;
        if (val.email && val.password) {
            this.authService.login(val.email, val.password
                ).subscribe((n) => {
                    if(n === true){
                        this.router.navigateByUrl(this.authService.redirectUrl);
                        this.authService.redirectUrl = '/';
                    } else {
                        this.router.navigateByUrl('/login/error');
                        this.authService.redirectUrl = '/';
                    }
              });
        }
    }
}

@Component({
  selector: 'logout',
  template: ``
 })
export class LogoutComponent implements OnInit, AfterViewInit {

    constructor(private router: Router, private userService:UserService) {
    }
    
    ngOnInit(){
        localStorage.setItem('access_token',null);
        this.userService.updateUser(ANONYMOUS);
    }
    
    ngAfterViewInit(){
        this.router.navigate(['/']);
    }
}

@Component ({
    selector: 'login-error',
    template: `
    <div class="container" style="padding: 0.5rem;margin:0.1rem;">
        <div class="row">   
            <div class="col-md-12" role="main">
                <div style="display:flex;">     
                    <div class="card border-outline" style="padding:0.2rem;margin:0.2rem;width:100%;height:3rem;">
                        <div style="width:100%;text-align:center;"><span style="font-size:3em;" i18n="@@loginErrorLabel">401 - Utilisateur non authentifié</span></div>
                        <div style="width:100%;text-align:center;">
                            <a [routerLink] = "['/']">
                                <span style="font-size:2.2em;" i18n="@@homeLabel">Accueil</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>      
        </div>
    </div>`
})
export class LoginErrorComponent {
}
