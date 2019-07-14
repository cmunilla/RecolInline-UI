import { Component } from '@angular/core';

@Component ({
   template: `<div class="container" style="padding: 0.5rem;margin:0.1rem;">
    <div class="row">   
        <div class="col-md-12" role="main">
            <div style="display:flex;">     
                <div class="card border-outline" style="padding:0.2rem;margin:0.2rem;width:100%;height:3rem;">
                    <div style="width:100%;text-align:center;"><span style="font-size:3em;" i18n="@@pageNotFoundErrorLabel">404 - Page non trouvée</span></div>
                    <div style="width:100%;text-align:center;"><a [routerLink] = "['/']"><span style="font-size:2.2em;" i18n="@@homeLabel">Accueil</span></a></div>
                </div>
            </div>
        </div>      
    </div>`
})
export class PageNotFound {
}