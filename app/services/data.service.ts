/**
 * Data service file
 * Created by Michael DESIGAUD on 20/04/2016.
 */

import {Injectable} from '@angular/core';
import {Http,Headers} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import {Subscription} from 'rxjs/Subscription';
import * as Utils from '../utils/app.utils';
import {CacheService} from './cache.service';

@Injectable()
export class DataService {
    users:Array<any>;
    dvds:Array<any>;
    private serverRoot:string;
    private configs:Array<any>;
    constructor(private http:Http,private cacheService:CacheService) {
        console.log('DataService constructor');
    }
    initConfig(callback:Function):void {
        this.getConfig().subscribe((configs:Array<any>) => {
            this.configs = configs;
            this.initRootConfig();

            let clearCache:boolean = this.getConfigByKey(Utils.CONFIG_CLEAR_CACHE).value === '1';
            if(clearCache) {
                this.cacheService.clearCacheData().then(() => this.initData());
            } else {
                this.initData();
            }

            callback();
        });
    }
    initData():void {
        this.getUsers().subscribe(users => this.users = users);
        this.getDvd().subscribe(dvds => this.dvds = dvds);
    }
    initRootConfig():void {
        let config:any = this.getConfigByKey(Utils.CONFIG_SERVER_URL);
        if(config && config.value) {
            this.serverRoot = config.value;
        } else {
            this.serverRoot = Utils.DEFAULT_SERVER_HOST;
        }
    }
    getConfigByKey(key:string):any {
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
    getChildGroups(parentId:string,clearCache:boolean = false):Observable<any> {
        let url:string = this.getUrl(Utils.CONFIG_CHILD_GROUPS_PATH,{parentId:parentId});
        if(clearCache) {
            let cacheKey:string = url.replace(Utils.DEFAULT_SERVER_HOST+'/?','');
            this.cacheService.storage.remove(cacheKey);
        }
        return this.http.get(url,{headers:this.getHeaders()});
    }
    getGroups(clearCache:boolean = false):Observable<any> {
        let url:string = this.getUrl(Utils.CONFIG_PARENT_GROUPS_PATH);
        if(clearCache) {
            let cacheKey:string = url.replace(Utils.DEFAULT_SERVER_HOST+'/?','');
            this.cacheService.storage.remove(cacheKey);
        }
        return this.http.get(url,{headers:this.getHeaders()});
    }
    getSounds(groupId?:string,clearCache:boolean = false):Observable<any> {
        let url:string = this.getUrl(Utils.CONFIG_SOUNDS_PATH,{groupId:groupId});
        if(clearCache) {
            let cacheKey:string = url.replace(Utils.DEFAULT_SERVER_HOST+'/?','');
            this.cacheService.storage.remove(cacheKey);
        }
        return this.http.get(url,{headers:this.getHeaders()});
    }
    getSoundsByIds(ids:Array<string>,clearCache:boolean = false):Observable<any> {
        let url:string = this.getUrl(Utils.CONFIG_SOUNDS_BY_IDS_PATH);
        if(clearCache) {
            let cacheKey:string = url.replace(Utils.DEFAULT_SERVER_HOST+'/?','');
            this.cacheService.storage.remove(cacheKey);
        }
        return this.http.post(url,JSON.stringify(ids),{headers:this.getHeaders()});
    }
    getUsers(clearCache:boolean = false):Observable<any> {
        let url:string = this.getUrl(Utils.CONFIG_USERS_PATH);
        if(clearCache) {
            let cacheKey:string = url.replace(Utils.DEFAULT_SERVER_HOST+'/?','');
            this.cacheService.storage.remove(cacheKey);
            this.users = null;
        }
        if (this.users) {
            return Observable.create((observer:Observer<any>) => {
                return observer.next(this.users);
            });
        }
        return this.http.get(url);
    }
    getDvd(clearCache:boolean = false):Observable<any> {
        let url:string = this.getUrl(Utils.CONFIG_DVD_PATH);
        if(clearCache) {
            let cacheKey:string = url.replace(Utils.DEFAULT_SERVER_HOST+'/?','');
            this.cacheService.storage.remove(cacheKey);
        }
        if(this.dvds) {
            return Observable.create((observer:Observer<any>) => {
                return observer.next(this.dvds);
            });
        }
        return this.http.get(url,{headers:this.getHeaders()});
    }
    getUserById(id:number):any {
        return this.users.find((user:any) => user.id === id.toString());
    }
}
