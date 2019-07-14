import  { Component } from '@angular/core';
import  { FormsModule } from '@angular/forms';
import { ClientHttpService } from '../../@recolinline-service/recolinline-service';

export interface Slide {
    title:string;
    subtitle:string;
    content:string;
}

@Component({
  template: `<div style="padding-top:7em;">
    <carousel>
      <slide *ngFor="let slide of getSlides()">
          <div class="text-center py-5 bg-dark text-white">
              <h2>{{slide.title}}</h2>
              <div class="lead">
                <h3>{{slide.subtitle}}</h3>
                <p>{{slide.content}}</p>
              </div>
          </div>
      </slide>
    </carousel>
    </div>
    <router-outlet></router-outlet>`
})
export class Home {
    
  private slides:Slide[];

  constructor(private restfulClient:ClientHttpService){      
  }
  
  getSlides():Slide[] { 
     if(!this.slides || this.slides === null){
         this.slides=[];
     }
     if(this.slides.length >0){
         return this.slides;
     }        
     this.restfulClient.get('/api/presentation').subscribe(d => {
         (<Array<any>>d).forEach(s => {
              this.slides.push(s);
         })
     });
     return this.slides;
  }
}