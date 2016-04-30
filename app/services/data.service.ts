/**
 * Data service file
 * Created by Michael DESIGAUD on 20/04/2016.
 */

import {Injectable} from 'angular2/core';
import {Http,Headers} from 'angular2/http';
import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import {Subscription} from 'rxjs/Subscription';
import * as Utils from '../utils/app.utils';

@Injectable()
export class DataService {
    users:Array<any>;
    private serverRoot:string;
    private configs:Array<any>;
    constructor(private http:Http) {
        console.log('DataService constructor');
    }
    initConfig(callback:Function):void {
        this.getConfig().subscribe((configs:Array<any>) =>{
            this.configs = configs;
            this.initRootConfig();
            this.getUsers().subscribe(users => this.users = users);
            callback();
        });
    }
    initRootConfig():void {
        let config:any = this.getConfigByKey(Utils.CONFIG_SERVER_URL);
        if(config && config.value) {
            this.serverRoot = config.value;
        } else {
            this.serverRoot = Utils.DEFAULT_SERVER_HOST;
        }
    }
    getConfigByKey(key:string):void {
        return this.configs.find(current => current.key === key);
    }
    getUrl(key:string,params?:any):any {
        let url:string;
        let config:any = this.getConfigByKey(key);
        if(config && config.value) {
            url = config.value;
            if(params) {
                Object.keys(params).forEach((key:string) => {
                    url = url.replace('{' + key + '}', params[key]);
                });
            }
        }
        return this.serverRoot+'/'+url;
    }
    getHeaders():Headers {
        let headers = new Headers();
        headers.set('Content-Type','application/json');
        headers.set('Accept','application/json');

        return headers;
    }
    getConfig():Observable<any> {
        return this.http.get(Utils.DEFAULT_SERVER_HOST+Utils.CONFIG_PATH,{headers:this.getHeaders()}).map(res => res.json());
    }
    getChildGroups(parentId:string,limit:number):Observable<any> {
        return this.http.get(this.getUrl(Utils.CONFIG_CHILD_GROUPS_PATH,{parentId:parentId,limit:limit}),{headers:this.getHeaders()}).map(res => res.json());
    }
    getGroups(limit:number):Observable<any> {
        return this.http.get(this.getUrl(Utils.CONFIG_PARENT_GROUPS_PATH,{limit:limit}),{headers:this.getHeaders()}).map(res => res.json());
    }
    getSounds(groupId:string,limit:number):Observable<any> {
        return this.http.get(this.getUrl(Utils.CONFIG_SOUNDS_PATH,{groupId:groupId,limit:limit}),{headers:this.getHeaders()}).map(res => res.json());
    }
    getSoundsByIds(ids:Array<string>,limit:number):Observable<any> {
        return this.http.post(this.getUrl(Utils.CONFIG_SOUNDS_BY_IDS_PATH,{limit:limit}),JSON.stringify(ids),{headers:this.getHeaders()}).map(res => res.json());
    }
    getUsers():Observable<any> {
        if (this.users) {
            return Observable.create((observer:Observer<any>) => {
                return observer.next(this.users);
            });
        }
        return this.http.get(this.getUrl(Utils.CONFIG_USERS_PATH)).map(res => res.json());
    }
    getUserById(id:number):any {
        return this.users.find((user:any) => user.id === id.toString());
    }
}