/**
 * Override default http class to automatically cache requests
 * Created by Michael DESIGAUD on 10/05/2016.
 */

import {Http,RequestOptionsArgs,Response,ConnectionBackend,RequestOptions} from 'angular2/http';
import {Observable} from 'rxjs/Observable';
import {CacheService} from '../services/cache.service';
import * as Utils from './app.utils';

export class CachedHttp extends Http {
    constructor(_backend: ConnectionBackend, _defaultOptions: RequestOptions, private _cacheService:CacheService) {
        super(_backend,_defaultOptions);
        console.log('CachedHttp constructor');
    }
    private checkCache(url:string):Promise<any> {
        if(url && url.indexOf(Utils.CONFIG_PATH) === -1) {
            let cacheKey:string = url.replace(Utils.DEFAULT_SERVER_HOST+'/?','');
            return this._cacheService.dataInCache(cacheKey);
        }
        return Promise.resolve(false);
    }
    get(url: string, options?: RequestOptionsArgs): Observable<Response> {
        return Observable.fromPromise(this.checkCache(url).then((result:any) => {
            if(url.indexOf(Utils.CONFIG_PATH) !== -1) {
                return super.get(url, options).toPromise();
            }
            if(!result.inCache) {
                return super.get(url, options).map((res:Response) => {
                    this._cacheService.storage.set(result.key,res.text());
                    return res.json();
                }).toPromise();
            } else {
                console.log('Get data from cache');
                return this._cacheService.storage.getJson(result.key);
            }
        }));
    }
    post(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
        return Observable.fromPromise(this.checkCache(url).then((result:any) => {
            if(url.indexOf(Utils.CONFIG_PATH) !== -1) {
                return super.post(url,body,options).toPromise();
            }
            if(!result.inCache) {
                return super.post(url,body,options).map((res:Response) => {
                    this._cacheService.storage.set(result.key,res.text());
                    return res.json();
                }).toPromise();
            } else {
                console.log('Get data from cache');
                return this._cacheService.storage.getJson(result.key);
            }
        }));
    }
}