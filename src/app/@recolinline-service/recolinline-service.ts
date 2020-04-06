import { Injectable , Injector } from '@angular/core';
import { DOCUMENT } from "@angular/common";
import { ɵBrowserDomAdapter } from "@angular/platform-browser";
import { HttpClient, HttpHeaders , HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap, shareReplay, share } from 'rxjs/operators';

export function toString(o:any):string {
     if(typeof o === 'number'){
         return `${o}`  
     }
     if(typeof o === 'string'){
       return `"${o}"`  
     }
     if(Object.prototype.toString.call(o) === '[object Array]'){
       let s:string='';
       let sep='';
       (<Array<any>>o).forEach(e => {
           s= `${s}${sep}${toString(e)}`;
           sep=',';
       });
       return `[${s}]`;
      } 
      if(Object.prototype.toString.call(o) === '[object Object]'){
         let s:string='';
         let sep='';
         for(let entry of Object.entries(o)){
             let k = entry[0];
             let v = entry[1];
             s = `${s}${sep}"${k}":${toString(v)}`;
             sep =',';               
         };
         return `{${s}}`;
      } 
      return 'null'; 
}

export interface IdentifiableItf {
    getId():any;
}

export interface IdNamePairItf extends IdentifiableItf{
    getName():string;
}

export interface Response {
   id:number;
   message:string;
   statusCode:number;
}

export interface MessageConsumerItf {
    consume(message:string):void;
}

@Injectable({
     providedIn: 'root',
})
export class LogService {
    messages:string[] = [];

    add(message: string) {
        this.messages.push(message);
    }

    clear() {
      this.messages = [];
    }
    
    output(messageConsumer?:MessageConsumerItf){
        let consumer:MessageConsumerItf = messageConsumer;
        if(!messageConsumer){
            consumer = new LogConsumer();
        }
        this.messages.forEach((m) => {
            consumer.consume(m);
        });
        this.clear();
    }
}

const httpOptions = {
   headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
    providedIn: 'root',
})
export class ClientHttpService {
    
    constructor(private http: HttpClient, private logService: LogService) {
    }
    
    /** GET data from the server */
    get<D>(baseURL:string,properties?:{}):Observable<D[]> {
        let url = `${baseURL}`;
        if(properties){  
            let sep="?";
            for(let entry of Object.entries(properties)){
                let key = entry[0];
                let value = entry[1];                
                url = `${url}${sep}${key}=${value}`;
                sep="&"
            }
        }
        return this.http.get<D[]>(url).pipe(
          tap(h =>{ const outcome = h ? `fetched` : `did not find`; console.log(`${outcome} url=${url}`)}),
          catchError(this.handleError<D[]>(`Error getting data at url=${url}`)),
          share());
    }
    
    /** POST: add a new data to the server */
    add<D>(baseURL:string,d: D,properties?:{}): Observable<Response> {
        let url = `${baseURL}`;
        if(properties){  
            let sep="?";
            for(let entry of Object.entries(properties)){
                let key = entry[0];
                let value = entry[1];                
                url = `${url}${sep}${key}=${value}`;
                sep="&"
            }
        }
        return this.http.post(url, d, httpOptions).pipe(
                tap(_ => this.log(`added data '${d}'`)),
                catchError(this.handleError<any>(`Error adding data at url=${url}`)),
                share());
    }
    
    /** DELETE: delete the data from the server */
    delete<D>(baseURL:string,d:IdentifiableItf | number): Observable<Response> {
        let id = (typeof d === "number")? d : (<IdentifiableItf>d).getId();
        let url = `${baseURL}?id=${id}`;     
        return this.http.delete(url, httpOptions).pipe(
           tap(_ => this.log(`deleted data with id=${d}`)),
           catchError(this.handleError<any>(`Error deleting data at url=${url}`)),
           share());
    }
    
    /** PUT: update the data on the server */
    update<D>(baseURL:string, d: D,properties?:{}): Observable<Response> {
        let url = `${baseURL}`;
        if(properties){  
            let sep="?";
            for(let entry of Object.entries(properties)){
                let key = entry[0];
                let value = entry[1];                
                url = `${url}${sep}${key}=${value}`;
                sep="&"
            }
        }
        return this.http.put(url, d, httpOptions).pipe(
           tap(_ => this.log(`updated data ${d}`)),
           catchError(this.handleError<any>(`Error updating data at url=${url}`)),
           share());
    }
    
    /**
     * Handle Http operation that failed.
     * Let the app continue.
     * @param operation - name of the operation that failed
     * @param result - optional value to return as the observable result
     */
    private handleError<T> (operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            console.error(error); // log to console instead
            console.log(`${operation} failed: ${error.message}`);
            return of(result as T).pipe(shareReplay());
        };
    }
    
    /** Log a  message with the LogService */
    private log(message: string) {
        this.logService.add(`DataProvider: ${message}`);
    }
}

@Injectable({
    providedIn: 'root',
})
export class ThemeConfigurationService
{
  private browserDomAdapter: ɵBrowserDomAdapter = new ɵBrowserDomAdapter();
  private theme:string = "cerulean";
  
  public constructor(){
    this.browserDomAdapter.setCookie("setCookie", "true");
  }  

  getDocument() : HTMLDocument {
      return <HTMLDocument>this.browserDomAdapter.getDefaultDocument();
  }
  
  getTheme():string {
      return this.theme;
  }
  
  enableTheme(name:string) {
      if(this.theme === name){
          console.log("Not updating theme '" + name +"'");
          return;
      }
      let document : HTMLDocument = this.getDocument();
      const links = document.head.getElementsByTagName('LINK');
      
      let index:number = -1;
      let link : any = null;
      for (let i = 0; i < links.length; i++) {
          if(links[i].getAttribute("href")==="assets/css/bootstrap/bootstrap_"+this.theme+".css"){
              link = links[i];  
              break;
          }
      }
      if(link !==  null){
          var node:HTMLElement = document.createElement("link");
          node.setAttribute("rel","stylesheet");
          node.setAttribute("type","text/css");
          node.setAttribute("href","assets/css/bootstrap/bootstrap_"+name+".css");
          document.head.replaceChild(node,link);
          this.theme=name;
      }
  }
}

export interface UserRef {
    id:number;
    login:string;
    theme:string;
}

export const ANONYMOUS:UserRef = {
    id:0,  
    login:undefined,
    theme:"cerulean"
}

class LogConsumer implements  MessageConsumerItf {
    consume(message:string):void {
        console.log(message);
    }
}

@Injectable({
    providedIn: 'root',
})
export class UserService
{  
  private currentUser:UserRef;

  public constructor(private themeUpdateService:ThemeConfigurationService){
      this.currentUser=ANONYMOUS;
  }  

  getUserId() : number {
      return this.currentUser && this.currentUser!==null?this.currentUser.id:ANONYMOUS.id;
  }
  
  getTheme():string {
      return this.currentUser && this.currentUser!==null?this.currentUser.theme:ANONYMOUS.theme;
  }

  getLogin():string {
      return this.currentUser && this.currentUser!==null?this.currentUser.login:ANONYMOUS.login;
  }
  
  updateUser(user:UserRef) {
      this.currentUser = user;
      this.themeUpdateService.enableTheme(this.getTheme());
  }
}