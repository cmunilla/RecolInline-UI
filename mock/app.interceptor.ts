import { Injectable , Injector} from '@angular/core';
import { HttpClient, HttpHeaders , HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Md5 } from 'ts-md5/dist/md5';
import { Data, IdNamePair } from '../src/app/@recolinline-generic/recolinline-generic';
import { toString } from '../src/app/@recolinline-service/recolinline-service';
import { catchError, map, tap } from 'rxjs/operators';
import * as jsonwebtoken from 'jsonwebtoken';
import * as moment from 'moment';
import * as crypto from 'crypto';

interface UserItf {
    id:number;
    login:string;
    password:string;
    theme:string;
    name:string;
    surname:string
}

interface UserRefItf {
    id:number;
    login:string;
    theme:string;
}

@Injectable({
    providedIn: 'root',
})
export class HttpRequestInterceptor implements HttpInterceptor {
    
    private privateKey:string = '-----BEGIN RSA PRIVATE KEY-----\n'+
        'MIIEpAIBAAKCAQEA0yBddsyN2jG4LgAzulZtnxw9WIhqtPK1uMYP+TWONOrIuZkc\n'+
        'SwL1MmX9GQfrQ5ysfWMVa4GobbJAbw/QHbXwEnqxNtfAm+QSh7K/fcVEAjQjAaxY\n'+
        'qNU3guHMBoRwgFvcMgHa0KXcjeh8qUilUtxEouB7et4w6/WLTgO2ikBt8U7TVH/p\n'+
        'XMtUb93C13Los5dBMaieNIaYvVEbcZvAJcgH0GmnSx2OTUluX+OC/rqTFHk3d5ID\n'+
        '6bOvHwEWnL253fxmV3ncbHBG9VdpC/jJgxJiMNAhaiwuDm5llmlPsKuX5bVeo1nx\n'+
        'UwdUZAjyosuSd18xzi+PfYew1XsfOoso9Moq0wIDAQABAoIBAEL4sE1AA/tj7C3D\n'+
        'aKVCR1HCjn8n/tlZaGWthmGiKHMGyxd8xynQTWFoUsn+5hUzfM/lf2Tz4y6w7ZmN\n'+
        'ZZIXJYlnHBHujK2mwm4DOJU33yPnz/b26cTcpdhBsgubNWiyOv4t8nBfPMBTMEAu\n'+
        'yCqprqgQF3tZQiGHaWIc8WmXmIiDyiyh0VdMwrGd10jV7WdC21gYqmdza9cp5IIr\n'+
        'lykyA6bLcuoo/5nvd4B+wb022l4gj+Z3W878fBVQ/XgfKtgwEW7GZ8TJTYLpDR2b\n'+
        'XT/UYgYK5+N9Z46huSP5Lo4lBvybk7HoPOgzXy8s9gWOPV1ldrlgHqJ5ZV4n8lIk\n'+
        'C+bi29kCgYEA6b4FxLVk+DELEbGS0Ib5Wtm4PaWN/eEZyvML05yUF/lePr0Xbyxt\n'+
        'YQ1et6yujRBxhyzAGg1wTy4cKtKlYJum0FyHIrw42VR68Q3ZiG4hsa/sKFSLsnre\n'+
        'P5zLZPkJqt/meRvQfGZAi+qpRsS7l05bPeTZ6h+teoFzJFA4QoUzBEcCgYEA5zsI\n'+
        'LPCebU7pPZIgfqnAI1xorkjIRKEDPd/hURisa8KdMypK0CulXyBGCcQkoebI36Cy\n'+
        'MFFquuiRpIm+3JxA87F7zOVpumR6TLAUwIG9n8//cmMHxhCJV2VM9O8gHsbNQU0e\n'+
        'gpnALY3/i1OyYb31NhC6yEtxOSdZ8y5RfuxsJxUCgYB3yIKKQO8iZXentJlpNZI5\n'+
        'pZNOPDYc4atnHtBzvC0EcC2E90A4H8tZzhE5DUxSTBfxztQPRc3FNfsHUvWfIYUG\n'+
        'CDTUbyKu9SUfvRo6WT35Ig9ix5jjeSXF8aMl9p2mrKEedUuNRJVVXocrFgyQSH5n\n'+
        'pIyr91neitInzNhX9oyjZwKBgQCp1BuPFjLlyZ1ZEWg4X2i1D/v6dY5RiYid+z67\n'+
        'l0mb49YdbCSCfGv7T/Lg3WSiXKSQSrBU+JdRK9s8Y8cAtOqnkWWB+cULlxyUEodL\n'+
        'VH73T4codj+RYzfcLpS1GKQYtp6uJXwRI+eYDcDwjcpoK2JcETF+RpqkBZj1GMHW\n'+
        'XMKaeQKBgQCsTyudAQiLXFN/hmfy7hHFUPE5KzEgAk3asLU66ObNVNksMFukWWiJ\n'+
        'xTMeJNP4pwYbgNvhWjPD/q3aTXqKUQ+qT6xvwkv+WxweKB6ZEXBT3WOA6hjkK3Hp\n'+
        'VHp4uRgW9AxkYxevjdu3dTVy/jmRUsBXhXfDpKsjSq6vx1olfBJiXw==\n'+
        '-----END RSA PRIVATE KEY-----\n';
        
    private slides = [{'title':'RecolInline Museum Tools',
        'subtitle':'Integration of museum business logics',
        'content':'Make the link between the public mediation and the artifact collections.'},
       {'title':'RecolInline Museum Tools',
        'subtitle':'From the artifact description to the visitor application',
        'content':'Define the template of the visitors web application and generate it automatcally.'},
       {'title':'RecolInline Museum Tools',
        'subtitle':'Analyze visitors influx and movings',
        'content':'Collect and analyze live data from the application to improve the visitor experience.'}];
    
    private museums =[
        {'id':1,'name':'musée 1',
            'contact':{'commune':'Chambéry', 'cp':'38000'},
            'collections':['ethnographie','archéologie']
        },
        {'id':2,'name':'musée 2',
            'contact':{'commune':'Arras', 'cp':'62000'},
            'collections':['beaux-arts']
        },
        {'id':3,'name':'musée 3',
            'contact':{'commune':'Metz', 'cp':'57000'},
            'collections':['art contemporain']
        }
    ];

    private artifacts =[
        {'id':1,'name':'m0_artifact1',
            'identity':{'name':'m0_artifact1', 'description':'the first artifact of the ethnographic museum',
            'inventory_id':'0123456789AB', 'museum_id':1},
            'location':{'type':'point', points:[{'lat':45.25156584,'lon':5.2487778}], 'located':'locatedInStorage', 'comment':'modern age room'},
            'movement':{'type':'point', points:[{'lat':45.25156584,'lon':5.2487778}], 'located':'locatedInStorage', 'comment':'modern age room'},
            'picture':{'slides':[{title:'nature_5', subtitle:'image de nature numero 5', content:'assets/artifacts/images/nature/5.jpg'},
                                 {title:'nature_3', subtitle:'image de nature numero 1', content:'assets/artifacts/images/nature/3.jpg'}]}
        },
         {'id':2,'name':'m0_artifact2',
            'identity':{'name':'m0_artifact2', 'description':'the second artifact of the ethnographic museum',
            'inventory_id':'0123456789CD', 'museum_id':1},
            'location':{'type':'point', points:[{'lat':45.25156584,'lon':5.2487779}], 'located':'locatedInMuseum',  'comment':'modern age room'},
            'movement':{'type':'point', points:[{'lat':45.25156584,'lon':5.2487778}], 'located':'locatedInStorage', 'comment':'modern age room'},
            'picture':{'slides':[{title:'nature_1', subtitle:'image de nature numero 1', content:'assets/artifacts/images/nature/8.jpg'},
                                 {title:'nature_1', subtitle:'image de nature numero 1', content:'assets/artifacts/images/nature/1.jpg'}]}
        },
        {'id':3,'name':'m0_artifact3',
            'identity':{'name':'m0_artifact3', 'description':'the third artifact of the ethnographic museum',
            'inventory_id':'0123456789EF', 'museum_id':1},
            'location':{'type':'point', points:[{'lat':45.251884,'lon':5.24887}],  'located':'locatedInSharing', 'comment':'classic age room'},
            'movement':{'type':'point', points:[{'lat':45.25156584,'lon':5.2487778}], 'located':'locatedInStorage', 'comment':'modern age room'},
            'picture':{'slides':[{title:'nature_2', subtitle:'image de nature numero 2', content:'assets/artifacts/images/nature/2.jpg'}]}
        },
        {'id':4,'name':'m1_artifact4',
            'identity':{'name':'m1_artifact4', 'description':'the first artifact of the paints museum',
            'inventory_id':'0000000GH', 'museum_id':2},
            'location':{'type':'point', points:[{'lat':45.877757,'lon':5.211123}], 'located':'locatedInMuseum', 'comment':'nineteen century room'},
            'movement':{'type':'point', points:[{'lat':45.25156584,'lon':5.2487778}], 'located':'locatedInStorage', 'comment':'modern age room'},
            'picture':{'slides':[{title:'nature_6', subtitle:'image de nature numero 6', content:'assets/artifacts/images/nature/6.jpg'},
                                 {title:'nature_8', subtitle:'image de nature numero 8', content:'assets/artifacts/images/nature/8.jpg'}]}
        },
         {'id':5,'name':'m1_artifact5',
            'identity':{'name':'m1_artifact5', 'description':'the second artifact of the paints museum',
            'inventory_id':'0000000IJ', 'museum_id':2},
            'location':{'type':'point', points:[{'lat':45.877756,'lon':5.211124}],  'located':'locatedInSharing', 'comment':'fifteen century room'},
            'movement':{'type':'point', points:[{'lat':45.25156584,'lon':5.2487778}], 'located':'locatedInStorage', 'comment':'modern age room'},
            'picture':{'slides':[{title:'nature_7', subtitle:'image de nature numero 7', content:'assets/artifacts/images/nature/7.jpg'},
                                 {title:'nature_5', subtitle:'image de nature numero 5', content:'assets/artifacts/images/nature/5.jpg'}]}
        },
        {'id':6,'name':'m2_artifact6',
            'identity':{'name':'m2_artifact6', 'description':'the first artifact of the modern art museum',
            'inventory_id':'999888KL', 'museum_id':3},
            'location':{'type':'point', points:[{'lat':45.877777,'lon':5.21111}], 'located':'locatedInStorage',  'comment':'black paper movement'},
            'movement':{'type':'point', points:[{'lat':45.25156584,'lon':5.2487778}], 'located':'locatedInStorage', 'comment':'modern age room'},
            'picture':{'slides':[{title:'nature_3', subtitle:'image de nature numero 3', content:'assets/artifacts/images/nature/3.jpg'},
                                 {title:'nature_4', subtitle:'image de nature numero 4', content:'assets/artifacts/images/nature/4.jpg'}]}
        },
        {'id':7,'name':'m2_artifact7',
            'identity':{'name':'m2_artifact7', 'description':'the second artifact of the modern art museum',
            'inventory_id':'999888MN', 'museum_id':3},
            'location':{'type':'point', points:[{'lat':45.877779,'lon':5.21112}], 'located':'locatedInMuseum', 'comment':'steel sculpture'},
            'movement':{'type':'point', points:[{'lat':45.25156584,'lon':5.2487778}], 'located':'locatedInStorage', 'comment':'modern age room'},
            'picture':{'slides':[{title:'nature_4', subtitle:'image de nature numero 4', content:'assets/artifacts/images/nature/4.jpg'},
                                 {title:'nature_2', subtitle:'image de nature numero 2', content:'assets/artifacts/images/nature/2.jpg'}]}
        },
         {'id':8,'name':'m2_artifact8',
            'identity':{'name':'m2_artifact8', 'description':'the third artifact of the modern art museum',
            'inventory_id':'999888OP', 'museum_id':3},
            'location':{'type':'point', points:[{'lat':45.877778,'lon':5.21113}],  'located':'locatedInMuseum', 'comment':'lights'},
            'movement':{'type':'point', points:[{'lat':45.25156584,'lon':5.2487778}], 'located':'locatedInStorage', 'comment':'modern age room'},
            'picture':{'slides':[{title:'nature_5', subtitle:'image de nature numero 5', content:'assets/artifacts/images/nature/5.jpg'},
                                 {title:'nature_6', subtitle:'image de nature numero 6', content:'assets/artifacts/images/nature/6.jpg'}]}
        }
    ];
    
    private users:UserItf[] =[
       {id:12345, login:'user0',password:'fake0',theme:'united',name:'hugo',surname:'boulanger'},
       {id:12346, login:'user1',password:'fake1',theme:'pulse',name:'martin',surname:'raseur'},
       {id:12347, login:'user2',password:'fake2',theme:'yeti',name:'victor',surname:'fleuri'}
    ];

    private nextMuseum:number = 4;
    private getNextMuseum():number{
        let next = this.nextMuseum;
        this.nextMuseum = this.nextMuseum + 1;
        return next;
    }

    private nextArtifact:number = 9;
    private getNextArtifact():number{
        let next = this.nextArtifact;
        this.nextArtifact = this.nextArtifact + 1;
        return next;
    }
    
    private getIdNamePairs(from:string):{}[]{
          let pairs:{}[]=[];
          let collection:{}[] = from === 'museum'?<{}[]>this.museums:<{}[]>this.artifacts;
          collection.forEach(e => {
             pairs.push({'id':e['id'],'name':`${e['name']}`});
          });
          return pairs;
    }

    private getFromId(from:string, id:number):{}{
          let collection:{}[] = from === 'museum'?<{}[]>this.museums:<{}[]>this.artifacts;
          let result:{};
          collection.forEach(e => {
              if(e['id']===id){
                  result = e;
                  return;
              }
          });
          return result;
    }
    
    private findUserIdForLogin(login:string):UserRefItf {
        let user:UserRefItf;
        this.users.forEach(u => {
            if(u.login===login){
               user= {id:u.id,login:u.login,theme:u.theme};
            }
         });
        return user;
    }
    
    private validateEmailAndPassword(login:string,password:string):boolean{
        let found:boolean = false;
        this.users.forEach(u => {
            if(u.login===login){
              found = (u.password===password);
            }
         });
        return found;
    }
    
    private getArtifactsFromMuseum(id:number):{}[]{
            let pairs:{}[]=[];
            this.artifacts.forEach(e => {
               if(e['identity']['museum_id']===id){
                   pairs.push({'id':e['id'],'name':`${e['name']}`});
               }
            });
            return pairs;
    }    
    
    private map:{} = {};
    
    constructor(private injector: Injector) {        
        this.map["/api/login"] = (function(arg:any):HttpResponse<any> {
            const RSA_PRIVATE_KEY = this.privateKey;
            let login = arg['login'];
            let password = arg['password'];
            if (this.validateEmailAndPassword(login,password)===true) {
                const user:UserRefItf = this.findUserIdForLogin(login);
                const jwtBearerToken = jsonwebtoken.sign(user, RSA_PRIVATE_KEY, {
                         algorithm: 'RS256',
                         expiresIn: 120,
                         subject: `user_${user.id}`
                     }
                );
                return new HttpResponse({ status: 202, body: user, 
                    headers: new HttpHeaders({'X-Auth-Token': 'Bearer '+jwtBearerToken})});
            } else {
                return new HttpResponse({ status: 401, body: 'Authentication failed' });
            }
        }).bind(this);
        this.map["/api/presentation"] = (function():string{return this.slides;}).bind(this);
        this.map["/api/locale"] = (function():string{return "fr";}).bind(this);
        this.map["/api/museum"]  = (function(arg0):any {
            if(arg0){
                let arg:{} = JSON.parse(arg0);
                let obj:{} = this.getFromId('museum', arg['id']);
                if(obj){
                    for(let entry of Object.entries(arg)){
                        obj[entry[0]] = arg[entry[0]];               
                    };
                    for(let entry of Object.entries(obj)){
                        if(!arg[entry[0]]){
                            delete obj[entry[0]];
                        }          
                    };
                    return new HttpResponse({ status: 200, 
                        body: {id:obj['id'], statusCode:200, message:'Updated'},
                        headers: new HttpHeaders({'Content-Type': 'application/json'})});
               } else {
                   arg['id']=this.getNextMuseum();
                   this.museums.push(arg);
                   return new HttpResponse({ status: 201, 
                       body: {id:arg['id'],statusCode:201, message:arg['name']},
                       headers: new HttpHeaders({'Content-Type': 'application/json'})});
               }
            } else {
               return this.getIdNamePairs('museum');
            }
        }).bind(this);
        this.map["/api/museum?id=1"]  = (function():{}{return this.getFromId('museum',1);}).bind(this);
        this.map["/api/museum?id=2"]  = (function():{}{return this.getFromId('museum',2);}).bind(this);
        this.map["/api/museum?id=3"]  = (function():{}{return this.getFromId('museum',3);}).bind(this);
        this.map["/api/museum?id=4"]  = (function():{}{return this.getFromId('museum',4);}).bind(this);
        this.map["/api/museum?id=5"]  = (function():{}{return this.getFromId('museum',5);}).bind(this);
        this.map["/api/artifact"]  = (function(arg0):any {
            if(arg0){
                let arg:{} = JSON.parse(arg0);
                let obj:{} = this.getFromId('artifact', arg['id']);
                if(obj){
                    for(let entry of Object.entries(arg)){
                        obj[entry[0]] = arg[entry[0]];               
                    };
                    for(let entry of Object.entries(obj)){
                        if(!arg[entry[0]]){
                          delete obj[entry[0]];
                        }          
                    };
                    return new HttpResponse({ status: 200, 
                       body: {id:obj['id'],statusCode:200, message:'Updated'},
                       headers: new HttpHeaders({'Content-Type': 'application/json'})});
               } else {
                   arg['id']=this.getNextArtifact();
                   this.artifacts.push(arg);
                   return new HttpResponse({ status: 201, 
                       body: {id:arg['id'],statusCode:201, message:arg['name']},
                       headers: new HttpHeaders({'Content-Type': 'application/json'})});
               }
            } else {
                return [];
            }
        }).bind(this);
        this.map["/api/artifact?museum=1"]  = (function():{}[]{return this.getArtifactsFromMuseum(1);}).bind(this);
        this.map["/api/artifact?museum=2"]  = (function():{}[]{return this.getArtifactsFromMuseum(2);}).bind(this);
        this.map["/api/artifact?museum=3"]  = (function():{}[]{return this.getArtifactsFromMuseum(3);}).bind(this);
        this.map["/api/artifact?museum=4"]  = (function():{}[]{return this.getArtifactsFromMuseum(4);}).bind(this);
        this.map["/api/artifact?museum=5"]  = (function():{}[]{return this.getArtifactsFromMuseum(5);}).bind(this);
        this.map["/api/artifact?id=1"]  = (function():{}{return this.getFromId('artifact',1);}).bind(this);
        this.map["/api/artifact?id=2"]  = (function():{}{return this.getFromId('artifact',2);}).bind(this);
        this.map["/api/artifact?id=3"]  = (function():{}{return this.getFromId('artifact',3);}).bind(this);
        this.map["/api/artifact?id=4"]  = (function():{}{return this.getFromId('artifact',4);}).bind(this);
        this.map["/api/artifact?id=5"]  = (function():{}{return this.getFromId('artifact',5);}).bind(this);
        this.map["/api/artifact?id=6"]  = (function():{}{return this.getFromId('artifact',6);}).bind(this);
        this.map["/api/artifact?id=7"]  = (function():{}{return this.getFromId('artifact',7);}).bind(this);
        this.map["/api/artifact?id=8"]  = (function():{}{return this.getFromId('artifact',8);}).bind(this);
        this.map["/api/artifact?id=9"]  = (function():{}{return this.getFromId('artifact',9);}).bind(this);
        this.map["/api/artifact?id=10"]  = (function():{}{return this.getFromId('artifact',10);}).bind(this);
        this.map["/api/artifact?id=11"]  = (function():{}{return this.getFromId('artifact',11);}).bind(this);
        this.map["/api/artifact/label?locale=fr"] = (function(){return []}).bind(this);
        this.map["/api/level?id=12345&component=artifact"] = (function(){return [0]}).bind(this);
        this.map["/api/level?id=12346&component=artifact"] = (function(){return [1]}).bind(this);
        this.map["/api/level?id=12347&component=artifact"] = (function(){return [2]}).bind(this);
        this.map["/api/level?id=12345&component=museum"] = (function(){return [0]}).bind(this);
        this.map["/api/level?id=12346&component=museum"] = (function(){return [1]}).bind(this);
        this.map["/api/level?id=12347&component=museum"] = (function(){return [2]}).bind(this);
        this.map["/api/artifact/level?id=12345&component=identity"] = (function(){return [2]}).bind(this);
        this.map["/api/artifact/level?id=12346&component=identity"] = (function(){return [2]}).bind(this);
        this.map["/api/artifact/level?id=12347&component=identity"] = (function(){return [2]}).bind(this);
        this.map["/api/artifact/level?id=12345&component=location"] = (function(){return [1]}).bind(this);
        this.map["/api/artifact/level?id=12346&component=location"] = (function(){return [0]}).bind(this);
        this.map["/api/artifact/level?id=12347&component=location"] = (function(){return [1]}).bind(this);
        this.map["/api/artifact/level?id=12345&component=movement"] = (function(){return [1]}).bind(this);
        this.map["/api/artifact/level?id=12346&component=movement"] = (function(){return [2]}).bind(this);
        this.map["/api/artifact/level?id=12347&component=movement"] = (function(){return [2]}).bind(this);
        this.map["/api/artifact/level?id=12345&component=picture"] = (function(){return [1]}).bind(this);
        this.map["/api/artifact/level?id=12346&component=picture"] = (function(){return [1]}).bind(this);
        this.map["/api/artifact/level?id=12347&component=picture"] = (function(){return [2]}).bind(this);
        this.map["/api/artifact/name?component=identity&locale=fr"] = (function(){return "Identité"}).bind(this);
        this.map["/api/artifact/name?component=location&locale=fr"] = (function(){return "Localistation"}).bind(this);
        this.map["/api/artifact/name?component=movement&locale=fr"] = (function(){return "Déplacement"}).bind(this);
        this.map["/api/artifact/name?component=picture&locale=fr"] = (function(){return "Photo"}).bind(this);
    }
    
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {        
        for(let entry of Object.entries(this.map)){
            if(entry[0] === request.url){
                let _headers = new HttpHeaders();
                let arg:any;
                _headers.append('Content-type','application/json');
                if(request.method === 'POST' || request.method === 'PUT'){
                    arg = request.body
                }
                let result:any = (<Function>entry[1])(arg);
                if(result instanceof HttpResponse){
                    return of(<HttpResponse<any>>result)
                }
                if(Object.prototype.toString.call(result) !== '[object Array]'){
                    let array = [];
                    array.push(result);
                    result = array;
                }
                return of(new HttpResponse({ status: 200, body: result, headers:_headers }));
            }
        };
        return next.handle(request);
    }
    
}