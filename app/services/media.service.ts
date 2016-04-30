/**
 * Media service
 * Created by Michael DESIGAUD on 20/04/2016.
 */

import {Injectable} from 'angular2/core';
import {Observable} from "rxjs/Observable";
import {Events,Platform} from 'ionic-angular/index';
import * as Utils from '../utils/app.utils';
import {CacheService} from './cache.service';

@Injectable()
export class MediaService {
    media:any;
    lastSound:any;
    currentSound:any;
    constructor(private events:Events,private cacheService:CacheService,private platform:Platform) {}
    setMedia(media:any) {
        this.media = media;
        this.media.addEventListener('playing',() => this.events.publish(Utils.EVENT_MEDIA_PLAYING,this.currentSound));
        this.media.addEventListener('ended', () => this.events.publish(Utils.EVENT_MEDIA_END,this.currentSound));
    }
    stop():void {
        this.events.publish('media:end',this.lastSound);
        this.media.pause();
        console.log('Stop current media',this.media);
        this.media.currentTime = 0;
    }
    play(newSound:any):void {
        console.log('Start sound',newSound);
        if(this.media && !this.media.paused) {
            this.stop();
        }
        this.currentSound = newSound;

        if(this.platform.is('cordova')) {
            console.log('cordova');
            if(!this.cacheService.soundInCache(newSound.file)) {
                this.media.src = newSound.file;
            } else {
                console.log('Playing sound from cache',this.cacheService.getCachedSoundPath(newSound));
                this.media.src = this.cacheService.getCachedSoundPath(newSound);
            }
        } else {
            if(!this.cacheService.soundInCache(newSound.file)) {
                this.media.src = newSound.file;
            } else {
                console.log('Playing sound from cache',this.cacheService.soundCache.toInternalURL(newSound.file));
                this.media.src = this.cacheService.soundCache.toInternalURL(newSound.file);
            }
        }

        this.media.load();
        this.media.play();

        this.lastSound = newSound;
    }
}