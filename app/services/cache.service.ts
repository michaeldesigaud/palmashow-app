/**
 * Cache service
 * Created by Michael DESIGAUD on 25/04/2016.
 */

import {Injectable} from '@angular/core';
import {Platform,Events,Storage,LocalStorage} from 'ionic-angular/index';
import * as Utils from '../utils/app.utils';

@Injectable()
export class CacheService {
    soundCache:any;
    storage:Storage;
    constructor(private platform:Platform,private events:Events) {
        this.storage = new Storage(LocalStorage);
        platform.ready().then(() => {
            this.initImageCache();
            this.initSoundCache();
        });
    }
    dataInCache(key:string):Promise<any> {
        return this.storage.getJson(key).then(value => {return {key:key,inCache:!!value}});
    }
    clearCacheData():Promise<any> {
        let promises:Array<Promise<any>> = [];
        Object.keys(localStorage).forEach((key:string) => {
            if(key.indexOf('cmd=') !== -1) {
                promises.push(this.storage.remove(key));
            }
        });
        return Promise.all(promises);
    }
    initSoundCache():void {
        this.soundCache = new CordovaFileCache({
            fs: new CordovaPromiseFS({
                promise: Promise
            }),
            mode:'hash'
        });
    }
    soundInCache(url:string):boolean {
        return url && this.soundCache.get(url) !== url;
    }
    clearCacheImage(callback:Function):void {
        ImgCache.clearCache(callback);
    }
    clearCacheSound(callback:Function):void {
        this.platform.ready().then(() => {
            this.soundCache.ready.then(() => this.soundCache.clear().then(callback));
        });
    }
    cacheSound(sound:any,callback:Function):void {
        this.platform.ready().then(() => {
            this.soundCache.ready.then(() => {
                if (!this.soundInCache(sound.file)) {
                    this.soundCache.add(sound.file);
                    this.soundCache.download((e) => console.log('progress',e)).then(callback);
                } else {
                    callback();
                }
            });
        });
    }
    removeSound(sound:any,callback:Function):void {
        this.platform.ready().then(() => {
            this.soundCache.ready.then(() => this.soundCache.remove(sound.file).then(callback));
        });
    }
    initImageCache():void {
        ImgCache.init(() => this.events.publish(Utils.EVENT_CACHE_IMAGE_LOADED,'success'), () => console.log('ImgCache init: error! Check the log for errors'));
        ImgCache.options.debug = true;
    }
    cacheImages(targets:JQuery):void {
        this.platform.ready().then(() => targets.each((index:number,target:any) => this.readImageCache(target)));
    }
    getCachedSoundPath(sound:any):string {
        return cordova.file.externalRootDirectory+this.soundCache.toPath(sound.file);
    }
    private readImageCache(target:any):void {
        ImgCache.isCached($(target).attr('src'), (path, success) => {
            if (success) {
                // already cached
                ImgCache.useCachedFile($(target));
            } else {
                this.storage.get(Utils.LOCAL_STORAGE_USE_CACHE_IMAGE).then((value:string) => {
                    if(value === 'true') {
                        ImgCache.cacheFile($(target).attr('src'),() => ImgCache.useCachedFile($(target)));
                    }
                });
            }
        });
    }
}
