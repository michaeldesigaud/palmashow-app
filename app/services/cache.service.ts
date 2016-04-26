/**
 * Cache service
 * Created by Michael DESIGAUD on 25/04/2016.
 */

import {Injectable} from 'angular2/core';
import {Platform} from 'ionic-angular/index';
import {Subject} from 'rxjs/Subject';

@Injectable()
export class CacheService {
    cacheLoaded:Subject<any>;
    constructor(private platform:Platform) {
        this.cacheLoaded = new Subject<any>();
        platform.ready().then(() => {
            ImgCache.init(() => this.cacheLoaded.next('success'), () => console.log('ImgCache init: error! Check the log for errors'));
            ImgCache.options.debug = true;
        });
    }
    cacheImages(targets:JQuery):void {
        this.platform.ready().then(() => {
            targets.each((index:number,target:any) => {
                ImgCache.isCached($(target).attr('src'), function(path, success) {
                    if (success) {
                        // already cached
                        console.log('Using cached file');
                        ImgCache.useCachedFile($(target));
                    } else {
                        // not there, need to cache the image
                        ImgCache.cacheFile($(target).attr('src'), function () {
                            ImgCache.useCachedFile($(target));
                        });
                    }
                });
            });
        });
    }
}
