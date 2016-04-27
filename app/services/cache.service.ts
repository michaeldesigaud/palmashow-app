/**
 * Cache service
 * Created by Michael DESIGAUD on 25/04/2016.
 */

import {Injectable} from 'angular2/core';
import {Platform} from 'ionic-angular/index';
import {Subject} from 'rxjs/Subject';

@Injectable()
export class CacheService {
    imageCacheLoaded:Subject<any>;
    soundDownloaded:Subject<any>;
    soundCache:any;
    constructor(private platform:Platform) {
        this.imageCacheLoaded = new Subject<any>();
        this.soundDownloaded = new Subject<any>();
        platform.ready().then(() => {
            this.initImageCache();
            this.initSoundCache();
        });
    }
    initSoundCache():void {
        this.soundCache = new CordovaFileCache({
            fs: new CordovaPromiseFS({
                promise: Promise
            }),
            mode:'hash'
        });
    }
    soundInCache(url:string) {
        return this.soundCache.get(url) !== url;
    }
    cacheSound(sound:any):void {
        this.platform.ready().then(() => {
            this.soundCache.ready.then(() => {
                if (!this.soundInCache(sound.file)) {
                    this.soundCache.add(sound.file);
                    this.soundCache.download().then(() =>  this.soundDownloaded.next(sound));
                } else {
                    this.soundDownloaded.next(sound);
                }
            });
        });
    }
    removeSound(sound:any,callback:Function):void {
        this.platform.ready().then(() => {
            this.soundCache.ready.then(() => {
                this.soundCache.remove(sound.file).then(callback);
            });
        });
    }
    initImageCache():void {
        ImgCache.init(() => this.imageCacheLoaded.next('success'), () => console.log('ImgCache init: error! Check the log for errors'));
        ImgCache.options.debug = true;
    }
    cacheImages(targets:JQuery):void {
        this.platform.ready().then(() => targets.each((index:number,target:any) => this.readImageCache(target)));
    }
    private readImageCache(target:any):void {
        ImgCache.isCached($(target).attr('src'), function(path, success) {
            if (success) {
                // already cached
                ImgCache.useCachedFile($(target));
            } else {
                // not there, need to cache the image
                ImgCache.cacheFile($(target).attr('src'), function () {
                    ImgCache.useCachedFile($(target));
                });
            }
        });
    }
}
