import { ParameterHandler, Data, DataProvider, DataView, IdNamePair, DataConsumer, DataViewSubComponent} from '../../@recolinline-generic/recolinline-generic';
import { UserService, ClientHttpService } from '../../@recolinline-service/recolinline-service';
import { NgZone, Component, OnInit, AfterContentInit, ViewChild , Type, ComponentFactoryResolver, ComponentFactory, ComponentRef, Injector, Inject, ViewContainerRef } from '@angular/core';
import { Router  } from '@angular/router';
import { Observable, of } from 'rxjs';
import { ReadOnlyIdentityComponent } from './identity/identity-r.component';
import { ReadWriteIdentityComponent } from './identity/identity-rw.component';
import { ReadOnlyLocationComponent } from './location/location-r.component';
import { ReadWriteLocationComponent } from './location/location-rw.component';
import { ReadOnlyMovementComponent } from './movement/movement-r.component';
import { ReadWriteMovementComponent } from './movement/movement-rw.component';
import { ReadOnlyPictureViewComponent } from './picture/picture-r.component';
import { ReadWritePictureViewComponent } from './picture/picture-rw.component';

class MuseumConsumer extends DataConsumer<IdNamePair> {
    
    constructor(private artifactView:ArtifactView){
        super();
    }
    
    selectedRef(ref : IdNamePair){
      if(this.ref==null ||(ref!=null && this.ref.getId()!=ref.getId())){
          this.ref = ref;
          this.artifactView.updateMuseumId(this.ref.getId())
      }
    }
}

@Component ({
   templateUrl: './artifact-view.component.html'
})
export class ArtifactView extends DataView implements AfterContentInit{ 

    @ViewChild('dataCreatorValidator', { read: ViewContainerRef }) 
    private dataCreatorValidator: ViewContainerRef;
    
    @ViewChild('validationExpector', { read: ViewContainerRef }) 
    private validationExpector: ViewContainerRef;
    
    @ViewChild('identity', { read: ViewContainerRef }) 
    private identity: ViewContainerRef;

    @ViewChild('location', { read: ViewContainerRef }) 
    private location: ViewContainerRef;

    @ViewChild('movement', { read: ViewContainerRef }) 
    private movement: ViewContainerRef;

    @ViewChild('picture', { read: ViewContainerRef }) 
    private picture: ViewContainerRef;
    
    @ViewChild('specific', { read: ViewContainerRef }) 
    private specific: ViewContainerRef;
    
    protected currentNav:string;    
    /* comment accessibility for i18n generation and uncomment after */
    protected museumProvider:DataProvider;
    protected museumConsumer:MuseumConsumer;
    protected parameterHandler:ParameterHandler;

    constructor(
            protected resolver:ComponentFactoryResolver,
            protected injector:Injector,
            protected ngZone:NgZone,
            protected router:Router,
            protected restfulClient:ClientHttpService, 
            protected userService:UserService){
       super(resolver, injector, ngZone, router, restfulClient, userService);
       this.museumProvider = new DataProvider(this.restfulClient, `${this.getBaseUrl()}/museum`);
       this.museumConsumer = new MuseumConsumer(this);
       this.museumConsumer.setEventProvider(this.museumProvider.getEventProvider());
       this.museumProvider.buildRefs();
    }
    
    ngAfterContentInit(){
        this.museumProvider.selectRef(this.museumProvider.refs[0]);
        //this.onScrollingMain(0);
    }
    
    updateMuseumId(id:number){
        this.dataProvider.selectRef(undefined);
        this.setParameters({'museum':id})
    }

    getDataProviderParameters():ParameterHandler{
        if(!this.parameterHandler){
            this.parameterHandler = new ParameterHandler();
        }
        return this.parameterHandler;    
    };
    
    getName():string {
       return "artifact";
    }; 
    
    getBaseUrl():string {
       return "/api";
    };    
    
    getContainer(componentName:string):ViewContainerRef{
        switch(componentName){
            case 'dataCreatorValidator' : return this.dataCreatorValidator;
            case 'identity'             : return this.identity;
            case 'location'             : return this.location;
            case 'movement'             : return this.movement;
            case 'picture'              : return this.picture;
            case 'specific'             : return this.specific;
            case 'validationExpector'   : return this.validationExpector;
        }
        return undefined;
    }; 

    newInstance(idNamePair:IdNamePair):Data {
        let data:Data = super.newInstance(idNamePair);
        data.set('identity','museum_id', this.museumProvider.ref.getId())
        return data;
    }
    
    getSubComponents():string[] {
        return ['identity','location','movement','picture'];
    }
    
    getSubComponent(selector:string,level:number):Type<DataViewSubComponent>{
        if(!level || level===null || level<0 || !selector || selector===null){
                return undefined;
        }
        switch(selector){
            case 'identity':
                switch(level){
                    case 0: return undefined;
                    case 1: return ReadOnlyIdentityComponent;
                    case 2:  
                    default : 
                        return ReadWriteIdentityComponent;
                }
            case 'location':
                switch(level){
                    case 0: return undefined;
                    case 1: return ReadOnlyLocationComponent;
                    case 2:  
                    default : 
                        return ReadWriteLocationComponent;
                }
            case 'movement':
                switch(level){
                    case 0: return undefined;
                    case 1: return ReadOnlyMovementComponent;
                    case 2:  
                    default : 
                        return ReadWriteMovementComponent;
                }
            case 'picture':
                switch(level){
                    case 0: return undefined;
                    case 1: return ReadOnlyPictureViewComponent;
                    case 2:  
                    default : 
                        return ReadWritePictureViewComponent;
                }
        }
        return undefined;
    }

    getDataSpecificSubComponent(data:Data,level:number):Type<DataViewSubComponent>{
        return null;
    }
        
    /***************************
    JAVASCRIPT TO HANDLE SCROLLING AND NAV MENU
    ****************************/ 
    /*   
    onScrollingMain(scrollY:any):void{
        let mainNavLinks = document.querySelectorAll("nav#scrollingMainNav ul li a");
        let mainScrollingFrame = document.querySelector("div#mainScrollingFrame");
        let mainOffsetHeight:number =(<HTMLElement>mainScrollingFrame).clientHeight;
        let mainScrollTop:number =(<HTMLElement>mainScrollingFrame).scrollTop;
        let done:boolean = false;
        
        mainNavLinks.forEach(link => {
           let section:Element = document.querySelector("div#"+(<HTMLElement>link).title);
           let initial:Element  = section;
            
           while(section.parentElement !== mainScrollingFrame){
                    section = section.parentElement
           }
           let offsetTop:number =(<HTMLElement>section).offsetTop;
           let offsetHeight:number =(<HTMLElement>initial).offsetHeight;
           
           if (!done 
               && scrollY <= offsetTop
               && (mainOffsetHeight - mainScrollTop) >= offsetHeight) {
             link.classList.add("active");
             done = true;
           } else {
             link.classList.remove("active");
           }
        });
    }
    */
        
    scroll(el: string) {
        this.currentNav = el;
        this.subComponents[el]._view.nodes[0].renderElement.scrollIntoView(
                {behavior: 'smooth'});
    }
}