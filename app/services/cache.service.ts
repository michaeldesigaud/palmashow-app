/**
 * Cache service
 * Created by Michael DESIGAUD on 25/04/2016.
 */

import {Injectable} from 'angular2/core';
import {Platform,Events} from 'ionic-angular/index';

export const EVENT_CACHE_SOUND_DOWNLOADED:string = 'cache:soundDownloaded';
export const EVENT_CACHE_IMAGE_LOADED:string = 'cache:imageLoaded';

@Injectable()
export class CacheService {
    soundCache:any;
    constructor(private platform:Platform,private events:Events) {
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
    clearCacheImage(callback:Function):void {
        ImgCache.clearCache(callback);
    }
    clearCacheSound(callback:Function):void {
        this.platform.ready().then(() => {
            this.soundCache.ready.then(() => this.soundCache.clear().then(callback));
        });
    }
    cacheSound(sound:any):void {
        this.platform.ready().then(() => {
            this.soundCache.ready.then(() => {
                if (!this.soundInCache(sound.file)) {
                    this.soundCache.add(sound.file);
                    this.soundCache.download().then(() =>  this.events.publish(EVENT_CACHE_SOUND_DOWNLOADED,sound));
                } else {
                    this.events.publish(EVENT_CACHE_SOUND_DOWNLOADED,sound);
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
        ImgCache.init(() => this.events.publish(EVENT_CACHE_IMAGE_LOADED,'success'), () => console.log('ImgCache init: error! Check the log for errors'));
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
