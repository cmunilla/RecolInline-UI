import { ViewRef, NgZone, ViewChild, ViewContainerRef, Type, ChangeDetectorRef,  ChangeDetectionStrategy, 
ComponentRef, EventEmitter, OnInit, AfterViewInit, Injectable, ComponentFactoryResolver, ComponentFactory, 
Component, Injector, Inject, Output} from '@angular/core';
import { IdentifiableItf, IdNamePairItf, ClientHttpService, LogService, UserService, toString, Response } from '../@recolinline-service/recolinline-service';
import { ExpectingValidationItf , AuthService } from '../@recolinline-auth/auth';
import { CanDeactivate, Router  } from '@angular/router';
import { Observable, of, Subscription  } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { ModalDirective, ModalOptions} from 'ngx-bootstrap/modal';

export interface KeyValuePair {
    key:string;
    value:any;
}

export class EventProvider<E> {
  
  refChange: EventEmitter<E> = new EventEmitter();
  
  emitChangeEvent(obj:E) {
    this.refChange.emit(obj);
  }
  
  getRefChangeEmitter() {
    return this.refChange;
  }
}

export class IdNamePair implements IdNamePairItf {
    
    private id:number;
    private name:string;

    constructor(obj:{}){
        this.id = <number>obj['id'];
        this.name = <string>obj['name'];
    }

    getName():string {
        return this.name;
    }
    
    setName(name:string):void {
        this.name = name;
    }
    
    getId():number{
        return this.id;
    }
}

export class Fragment {
    
    private _fragment_:string;
    private elements: {};
    
    constructor(name:string){
        this.elements = {};
        this._fragment_ = name;
    }
    
    getName():string{
        return this._fragment_;
    }
    
    set(key:string , value:any):boolean {
       let old:any = this.elements[key];
       if(old === value){
           return false;
       }
       this.elements[key]=value;
       return true;
    }
    
    get(key:string):any{
        return this.elements[key];
    }
    
    toString():string {
        let s:string = `"${this.getName()}":${toString(this.elements)}`;
        return s;
    }
}

export class Data implements IdNamePairItf{

    protected idNamePair:IdNamePair;
    protected changed:boolean;
    protected fragments:{};
    protected json:{};

    constructor(idNamePair:IdNamePair,json:{}){
        this.fragments = {};
        this.idNamePair = idNamePair;
        this.json = json;
        this.changed = false;
    }
    
    reset():void {        
        let name:string;        
        for(let entry of Object.entries(this.json)){
           if(entry[0] === 'name'){
              name = <string>entry[1]; 
           } else if(Object.prototype.toString.call(entry[1]) === '[object Object]'){
              for(let subEntry of Object.entries(entry[1])){
                this.set(entry[0], subEntry[0], subEntry[1]);
              }
           }
        }       
        if(name){
            this.idNamePair.setName(name);
        }
        this.changed=false;
    }
    
    isNew():boolean {
        return this.getId()===0;
    }
    
    saved():void {
        this.changed = false;
    }
    
    hasChanged():boolean {
        return this.changed;
    }
    
    getIdNamePair():IdNamePair {
        return this.idNamePair;
    }
    
    getId():number {
        return this.idNamePair.getId();
    }

    getName():string {
        return this.idNamePair.getName();
    }
    
    get(fragment:string,key:string):any{
        let frag:Fragment=this.fragments[fragment];
        if(frag){
            return frag.get(key);
        }
        return undefined;
    }
    
    set(fragment:string, key:string, value:any):boolean{
        let changed:boolean = false;
        let frag:Fragment=this.fragments[fragment];
        if(frag){
            changed = frag.set(key, value);
            if(changed){
                this.changed = true;
            }
        }
        return changed;
    }
    
    addFragment(fragment:Fragment){
        if(!fragment){
            return;
        }
        this.fragments[fragment.getName()] = fragment;
    }

    toString():string {
        let sep:string = ',';
        let s:string = `{"id":${this.getId()}${sep}"name":"${this.getName()}"`;
        for(let entry of Object.entries(this.fragments)){
            let fragment = entry[1];  
            s = `${s}${sep}${(<Fragment>fragment).toString()}`;
        }
        s = `${s}}`;
        return s;
    }
}

export class UnregisteredData extends Data {

    constructor(idNamePair:IdNamePair,json:{}){
        super(idNamePair,json);
    }

    setId(id:number, name:string):number {
        this.idNamePair = new IdNamePair({id:id, name: name});
        this.json['id']=id;
        this.json['name']=name;        
        return this.idNamePair.getId();
    }
}

export class DataProvider {

    ref:IdNamePair = null;
    refs:IdNamePair[];
    protected selectEventProvider:EventProvider<IdNamePair>;

    constructor(
       protected restfulClient:ClientHttpService, 
       protected baseUrl:string, 
       protected parameters?:ParameterHandler){
        this.selectEventProvider = new EventProvider();
    }
   
    getList():IdNamePair[]{
        return this.refs;
    }
    
    getBaseUrl():string {
        return this.baseUrl;
    }

    selectRef(obj : IdNamePair){
      if(this.ref && obj && obj.getId() == this.ref.getId()){
          return;
      }
      this.ref = obj;
      this.selectEventProvider.emitChangeEvent(this.ref);
    }
    
    buildRefs():void {
      this.refs=[];
      let refs:{}[]=[];
      
      this.restfulClient.get<{}>(this.getBaseUrl(), 
          this.parameters?this.parameters.getParameters():{}
              ).subscribe(d => refs = d);
      
      refs.forEach(ref => {
          this.refs.push(new IdNamePair(ref));
      });
    }
    
    getEventProvider():EventProvider<IdNamePair> {
        return this.selectEventProvider;
    }
}

export abstract class DataConsumer<D extends IdentifiableItf> {
    
    protected eventProvider:EventProvider<D>
    protected subscriptionRef:Subscription;
    protected ref:D;
    
    ngOnDestroy() {
        if(this.subscriptionRef){
            this.subscriptionRef.unsubscribe();
        }
    }
    
    setEventProvider(eventProvider:EventProvider<D>):void {
        this.eventProvider = eventProvider;
        this.subscriptionRef = this.eventProvider.getRefChangeEmitter(
        ).subscribe(ref => this.selectedRef(ref));
    }
    
    selectedRef(ref : D){
      if(!this.ref || this.ref===null ||(ref && ref!==null && this.ref.getId()!=ref.getId())){
          this.ref = ref;
      }
    }
}

export class ParameterHandler {
    
    private parameters:{}={};
        
    setParameter(key:string,value:any){
        this.parameters[key]=value;
    }
    
    clear():void{
       this.parameters={}; 
    }
    
    getParameters():{}{
        return this.parameters;
    }
}

@Component ({    
    template: `
            <div style="position:relative;display:flex;border:0 0 0 0;padding:0.1rem 0.1rem 0.1rem 0.1rem;width:100%;height:5rem;">           
                <button type="button" class="btn btn-outline-success" style="margin:1rem 1rem 1rem 1rem;width:20%;" (click)="isValidatePossible()?onValidation():false" [class.disabled]="!isValidatePossible()">
                    <span i18n="@@savingButtonLabel" style="text-size:80%;">Enregistrer</span>
                </button>
                <button type="button" class="btn btn-outline-warning" style="margin:1rem 1rem 1rem 1rem;width:25%;" (click)="isCancelPossible()?onCancellation():false" [class.disabled]="!isCancelPossible()">
                    <span i18n="@@cancellationButtonLabel" style="text-size:80%;">Annuler</span>
                </button>
            </div>`
})
export class DataValidatorComponent extends DataConsumer<Data> {
    
    safeUrl:string;
    restfulClient:ClientHttpService;

    constructor(){
        super();
    }
    
    isCreatePossible():boolean {
        return false; 
    }

    isValidatePossible():boolean {
        return this.ref && this.ref!==null && this.ref.hasChanged();
    }
    
    isCancelPossible():boolean {
        return this.isValidatePossible();
    }
    
    onValidation(){
       if(!this.isValidatePossible()){ 
           return;
       }
       let resp:Observable<Response>;       
       resp = this.restfulClient.update(this.safeUrl, this.ref.toString());
       resp.subscribe(r => { 
          if(r.statusCode === 200){
             this.ref.saved();
          }
       });
    }
    
    onCancellation(){
        if(!this.isCancelPossible()){
            return;
        }
        this.ref.reset();
    }
}

@Component ({    
    template: `
            <div style="position:relative;display:flex;border:0 0 0 0;padding:0.1rem 0.1rem 0.1rem 0.1rem;width:100%;height:5rem;">           
                <button type="button" class="btn btn-outline-info" style="margin:1rem 1rem 1rem 1.5rem;width:20%;" (click)="isCreatePossible()?onCreation():false" [class.disabled]="!isCreatePossible()">
                    <span i18n="@@creationButtonLabel" style="text-size:80%;">Nouveau</span>
                </button>
                <button type="button" class="btn btn-outline-success" style="margin:1rem 1rem 1rem 1rem;width:20%;" (click)="isValidatePossible()?onValidation():false" [class.disabled]="!isValidatePossible()">
                    <span i18n="@@savingButtonLabel" style="text-size:80%;">Enregistrer</span>
                </button>
                <button type="button" class="btn btn-outline-warning" style="margin:1rem 1rem 1rem 1rem;width:25%;" (click)="isCancelPossible()?onCancellation():false" [class.disabled]="!isCancelPossible()">
                    <span i18n="@@cancellationButtonLabel" style="text-size:80%;">Annuler</span>
                </button>
            </div>`
})
export class DataCreatorAndValidatorComponent extends DataValidatorComponent {
    
    @Output() 
    saved = new EventEmitter<IdNamePair>(); 

    constructor(){
        super();
    }
    
    isCreatePossible():boolean {
        return !this.ref || this.ref===null || !this.ref.hasChanged(); 
    }

    onCreation(){
        if(!this.isCreatePossible()){
            return;
        }
        this.saved.emit(new IdNamePair({id:0,name:'...'}));
    }
    
    onValidation(){
       if(!this.isValidatePossible()){ 
           return;
       }
       let resp:Observable<Response>;
       if(this.ref.isNew()){
           resp = this.restfulClient.add(this.safeUrl, this.ref);        
           resp.subscribe(r => {
               if(r.statusCode === 201){
                   (<UnregisteredData>this.ref).setId(r.id,r.message);
                   console.log(this.ref.toString());
                   this.ref.saved();
                   this.saved.emit(this.ref.getIdNamePair());
               }
           });
       } else {
           resp = this.restfulClient.update(this.safeUrl, this.ref.toString());
           resp.subscribe(r => { 
              if(r.statusCode === 200){
                  this.ref.saved();
              }
           });
       }
    }
}

@Component ({    
    template: `    
    <div class="row">        
        <div bsModal #childModal="bs-modal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="dialog-child-name">
          <div class="modal-dialog" style="width:45%">
            <div class="modal-content">
              <div class="modal-header">
                <h4 id="dialog-child-name" class="modal-title pull-left" i18n="@@confirmCancellationLabel">Enregistrer vos modifications&#32;?</h4>
              </div>
              <div class="modal-body">
                <button type="button" class="close pull-left" style="margin:0.3rem;" aria-label="Enregistrer" (click)="hideChildModal(true)">
                  <span aria-hidden="true" i18n="@@confirmSavingButtonLabel">Enregistrer</span>
                </button>
                <button type="button" class="close pull-right" style="margin:0.3rem;" aria-label="Annuler" (click)="hideChildModal(false)">
                  <span aria-hidden="true" i18n="@@confirmCancellationButtonLabel">Annuler</span>
                </button>
              </div>
            </div> 
          </div>
        </div>    
    </div>`
})
export class ExpectingValidationComponent implements AfterViewInit{
    
    @ViewChild('childModal') 
    childModal: ModalDirective;
    
    private visible:boolean = false;
    private resolve: (value?: boolean | PromiseLike<boolean>) => void;
    private reject:  (reason?: any) => void;
    private promise:Promise<boolean>;
    
    ngAfterViewInit() {
      this.childModal.config.ignoreBackdropClick=true;
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
}

export abstract class DataViewSubComponent extends DataConsumer<Data> {

    abstract getFields():KeyValuePair[];
    abstract getName():string;
}

export abstract class DataView extends DataConsumer<IdNamePair>
implements ExpectingValidationItf, OnInit, AfterViewInit {
    
    abstract getBaseUrl():string;
    abstract getName():string;
    abstract getDataSpecificSubComponent(data:Data,level:number):Type<DataViewSubComponent>;
    
    protected locale:string;
    /* comment accessibility for i18n generation and uncomment after */
    protected dataProvider:DataProvider;
    protected reference:Data;
    protected expectingValidationComponent:ExpectingValidationComponent;
    protected subComponents:{};
    protected levels:{};
    protected names:{};
    
        
    constructor(
        protected resolver:ComponentFactoryResolver,
        protected injector:Injector,
        protected ngZone:NgZone,
        protected router:Router,
        protected restfulClient:ClientHttpService, 
        protected userService:UserService){
       super();
       this.dataProvider = new DataProvider(this.restfulClient, `${this.getBaseUrl()}/${this.getName()}`, this.getDataProviderParameters());
       this.setEventProvider(this.dataProvider.getEventProvider());
    }
    
    ngOnInit() {
        this.dataProvider.buildRefs();
        this.subComponents = {};
        this.levels = {};
        this.names = {};
        
        this.getSubComponents().forEach(sc => {
           let v:ViewContainerRef = this.getContainer(sc);
           if(v){
               let level:number = this.getLevel(sc);
               let cr:ComponentRef<DataViewSubComponent> = this.createComponent(v,sc,level);
               if(cr && cr!==null){              
                   let dataViewSubComponent:DataViewSubComponent = cr.instance;
                   let _self_ = this;
                   
                   dataViewSubComponent.getFields().forEach( keyValuePair => { 
                       Object.defineProperty(dataViewSubComponent, `${keyValuePair.key}`, {
                           get: function() { 
                               if(!level || level < 1 ||!_self_.reference || _self_.reference === null) {
                                   return undefined;
                               } 
                               return _self_.reference.get(`${sc}`,`${keyValuePair.key}`);
                           },
                           set: function(x) { 
                               if(!level || level < 2 || !_self_.reference || _self_.reference === null) {
                                   return;
                               } 
                               _self_.reference.set(`${sc}`,`${keyValuePair.key}`,x);
                           }
                       });
                   });
                   this.subComponents[sc] = cr;
              }
           }
        });
        let level:number = this.getLevel(undefined);
        if(level < 1){
            return;
        }        
        let containerName:string = "dataCreatorValidator";
        let container:ViewContainerRef=this.getContainer(containerName);
        if(!container){
            return;
        }        
        let factory : ComponentFactory<DataValidatorComponent> ;
        let cr : ComponentRef<DataValidatorComponent>;
        if(level == 2){
            factory = this.resolver.resolveComponentFactory(DataCreatorAndValidatorComponent);
        } else {
            factory = this.resolver.resolveComponentFactory(DataValidatorComponent);
        }
        cr = factory.create(this.injector);
        cr.instance.restfulClient = this.restfulClient;
        cr.instance.safeUrl= `${this.getBaseUrl()}/${this.getName()}`;
        container.insert(cr.hostView);   
        if(level == 2){
            (<DataCreatorAndValidatorComponent>cr.instance).saved.subscribe(idNamePair => {
                if(idNamePair.getId() === 0){
                    this.selectedRef(idNamePair);
                } else {
                    this.dataProvider.refs.push(idNamePair);
                }
            }); 
        }
        this.subComponents['dataCreatorAndValidatorComponent']=cr;
                
        containerName = 'validationExpector';
        container = this.getContainer(containerName);
        if(!container){
            return;
        }        
        let expectorFactory : ComponentFactory<ExpectingValidationComponent> ;
        let ecr : ComponentRef<ExpectingValidationComponent>;        
        expectorFactory = this.resolver.resolveComponentFactory(ExpectingValidationComponent)
        ecr = expectorFactory.create(this.injector);
        container.insert(ecr.hostView);
        this.expectingValidationComponent = ecr?ecr.instance:undefined;
    }

    ngAfterViewInit(){
    }
        
    getLevel(subComponent:string):number {
       
       let id:number = this.userService.getUserId();
       let level:number;
    
       if(subComponent){
           let componentLevels:{} = this.levels[subComponent];
           if(componentLevels){
               level = componentLevels[id];
               if(level){
                   return level;
               }
           } else {
               this.levels[subComponent]={};
           }
       }       
       let url:string;
       let properties:{};
       
       if(subComponent){
           url = `${this.getBaseUrl()}/${this.getName()}/level`;
           properties = {id: `${id}`, component: `${subComponent}`};
       } else {
           url = `${this.getBaseUrl()}/level`;
           properties = {id: `${id}`, component: `${this.getName()}`};
       }
       this.restfulClient.get<number>(url,properties).subscribe(
          data => {  level=data[0]; },
          error => { console.log(`${url}` + " : " +error);}
       );
       if(subComponent){
           this.levels[subComponent][id]=level;
       }
       return level;
    }
    
    getLocalName(subComponent:string, locale:string):string {
        let name:string;
        if(subComponent && locale){
           let componentNames:{} = this.names[subComponent];
           if(componentNames){
               name = componentNames[locale];
               if(name){
                   return name;
               }
           } else {
               this.names[subComponent]={};
           }              
           let url:string = `${this.getBaseUrl()}/${this.getName()}/name`;        
           this.restfulClient.get<string>(url,{component:`${subComponent}`,locale:`${locale}`}
              ).subscribe(
                 data => { name = data[0];console.log(data); },
                 error => { console.log(`${url}` + " : " +error);});
           this.names[subComponent][locale]=name;
        }
        console.log(this.names);
        return name;
    }
    
    getLocale():string {
        if(this.locale!=null){
            return this.locale;
        }
        this.restfulClient.get<string>(`${this.getBaseUrl()}/locale`).subscribe(data => {
             this.locale=data[0];
        })
        return this.locale
    }
    
   
    public expectValidation = (redirection:IdNamePair|string) => {
        if(this.subComponents['dataCreatorAndValidatorComponent']){
            let dataCreatorAndValidatorComponent:DataCreatorAndValidatorComponent = 
            <DataCreatorAndValidatorComponent>this.subComponents['dataCreatorAndValidatorComponent'].instance;
            let validationExpected:boolean = dataCreatorAndValidatorComponent.isValidatePossible();
            if(validationExpected){
                this.confirmValidation(redirection);
                return true;
            }
        }
        return false;
    }
    
    private confirmValidation(ref : IdNamePair|string){
        let promise:Promise<boolean> = this.expectingValidationComponent.showChildModal();            
        let save:boolean = false;
        (<Promise<boolean>>promise).then((res) => {
            if(res){
                (<ComponentRef<DataCreatorAndValidatorComponent>>
                this.subComponents['dataCreatorAndValidatorComponent']).instance.onValidation();
            } else {
                (<ComponentRef<DataCreatorAndValidatorComponent>>
                this.subComponents['dataCreatorAndValidatorComponent']).instance.onCancellation()
            }
            if(!ref || ref instanceof IdNamePair){
                this.selectedRef(!ref?undefined:<IdNamePair>ref);
            } else {
                this.router.navigate([<string>ref]);
            }
            
        }).catch((err) => {
            console.error(err);
        });
    }
    
    selectedRef(ref : IdNamePair):boolean { 
      if(this.expectValidation(ref)){
         return false;
      }          
      this.clearSpecific();     
      if(!ref){
          this.reference = undefined;
      } else if(ref.getId()===0){
          this.reference = this.newInstance(ref);
          this.dataProvider.ref = ref;  
      } else {
          this.restfulClient.get(`${this.getBaseUrl()}/${this.getName()}`, 
          {'id':ref.getId()}).subscribe(d => {
              let data:Data;
              let json:{} = d[0];
              data = new Data(new IdNamePair({id:json['id'],name:json['name']}), json);              
              for(let entry of Object.entries(json)){
                 if(Object.prototype.toString.call(entry[1]) === '[object Object]'){
                    let fragment:Fragment = new Fragment(entry[0])
                    data.addFragment(fragment);
                    for(let subEntry of Object.entries(entry[1])){
                        fragment.set(subEntry[0],subEntry[1]);                      
                    }
                 }
              }
              this.loadSpecific(data);
              this.reference = data;
          });
      }
      for(let entry of Object.entries(this.subComponents)){
          if(entry[1]!==null){
              (<ComponentRef<DataConsumer<Data>>>entry[1]).instance.selectedRef(this.reference);
          }
      }
      return true;
    }
    
    loadSpecific(data:Data):void{
        let specific:string = 'specific';
        let v:ViewContainerRef = this.getContainer(specific);
        if(v){
            let level:number = this.getLevel(specific);
            let factory : ComponentFactory<DataViewSubComponent> ;
            let cr : ComponentRef<DataViewSubComponent>;
            let type:Type<DataViewSubComponent> = this.getDataSpecificSubComponent(data,level);
            if(!type || type===null){
                return;
            }
            factory = this.resolver.resolveComponentFactory(type);
            cr = factory.create(this.injector);
            v.insert(cr.hostView);
            let dataViewSubComponent:DataViewSubComponent = cr.instance;
            let _self_ = this;
            dataViewSubComponent.getFields().forEach( keyValuePair => { 
                Object.defineProperty(dataViewSubComponent, `${keyValuePair.key}`, {
                    get: function() { 
                        if(!_self_.reference || _self_.reference === null) {
                            return undefined;
                        } 
                        return _self_.reference.get(`${specific}`,`${keyValuePair.key}`);
                    },
                    set: function(x) {
                        if(level < 2){
                            return;
                        }
                        if(!_self_.reference || _self_.reference === null) {
                            return;
                        } 
                        _self_.reference.set(`${specific}`,`${keyValuePair.key}`,x);
                    }
                });
            });
            this.subComponents[specific] = cr;
        }  
    }

    clearSpecific():void{
        let specific:string = 'specific';
        this.subComponents[specific]=null;
        let v:ViewContainerRef = this.getContainer(specific);
        if(v){
            v.clear();
        }      
    }
    
    createComponent(entry:ViewContainerRef, selector:string, level:number):ComponentRef<DataViewSubComponent> {
        entry.clear();
        let factory : ComponentFactory<DataViewSubComponent> ;
        let cr : ComponentRef<DataViewSubComponent>;
        let type:Type<DataViewSubComponent> = this.getSubComponent(selector,level);
        if(!type || type === null){
            return undefined;
        }        
        factory = this.resolver.resolveComponentFactory(type);
        cr = factory.create(this.injector); 
        if(cr){
            entry.insert(cr.hostView);
        }
        return cr;
    }

    setParameters(parameters:{}):void{
        let handler:ParameterHandler = this.getDataProviderParameters();
        if(handler){
            handler.clear();
            if(parameters){
                for(let entry of Object.entries(parameters)){  
                    handler.setParameter(<string>entry[0],entry[1]);
                }
            }
            this.dataProvider.buildRefs();
        }
        //this.ngZone.run(() => null);
    }

    newInstance(idNamePair:IdNamePair):Data {
        let json:{} = {};
        json['id']=idNamePair.getId();
        json['name']=idNamePair.getName();
        for(let entry of Object.entries(this.subComponents)){
            if(entry[1]!==null){
                let subjson:{} = {};
                let componentRef:ComponentRef<any> = <ComponentRef<any>>entry[1];
                let instance:any = componentRef.instance;
                if(instance instanceof DataViewSubComponent){
                    (<DataViewSubComponent> instance).getFields().forEach(field => {
                        subjson[field.key] = field.value;
                    });
                    json[entry[0]]=subjson;
                }
            }
        }
        let data:Data = new UnregisteredData(idNamePair,json);
        for(let entry of Object.entries(json)){
            if(Object.prototype.toString.call(entry[1]) === '[object Object]'){
               let fragment:Fragment = new Fragment(entry[0])
               data.addFragment(fragment);
               for(let subEntry of Object.entries(entry[1])){
                   fragment.set(subEntry[0],subEntry[1]);                      
               }
            }
        }
        return data;
    }
    
    getDataProviderParameters():ParameterHandler{
        //to be overridden
        return undefined;    
    };

    getSubComponents():string[] {
        //to be overridden
        return [];
    }
    
    getSubComponent(componentName:string,level:number):Type<DataViewSubComponent>{
        //to be overridden
        return undefined;
    }
    
    getContainer(componentName:string):ViewContainerRef{
        //to be overridden
        return undefined;
    }
}