/**
 * Page to cache images and sounds
 * Created by Michael DESIGAUD on 26/04/2016.
 */

import {Platform} from 'ionic-angular/index';
import {CacheService} from '../../services/cache.service';

export abstract class CachedPage {
    constructor(private platform:Platform,private cacheService:CacheService) {}
    onPageLoaded():void {
        this.platform.ready().then(() => {
            this.cacheService.cacheImages($('img'));
        });
    }
}