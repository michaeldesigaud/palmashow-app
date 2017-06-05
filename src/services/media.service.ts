/**
 * Media service
 * Created by Michael DESIGAUD on 20/04/2016.
 */

import {Injectable} from '@angular/core';
import {Events, Loading, LoadingController, Platform} from 'ionic-angular/index';
import * as Utils from '../utils/app.utils';
import {CacheService} from './cache.service';

@Injectable()
export class MediaService {
    media:any;
    lastSound:any;
    currentSound:any;
    private loading: Loading;
    constructor(private events:Events,private cacheService:CacheService,private platform:Platform, private loadingCtrl:LoadingController) {}
    setMedia(media:any) {
        this.media = media;
        this.media.addEventListener('playing',() => {
            this.events.publish(Utils.EVENT_MEDIA_PLAYING,this.currentSound);
            this.loading.dismiss();
        });
        this.media.addEventListener('ended', () => this.events.publish(Utils.EVENT_MEDIA_END,this.currentSound));
        this.media.addEventListener('progress', () => {
            //Show loader
            this.loading = this.loadingCtrl.create({
                content: 'Téléchargement du sound "'+this.currentSound.name+'"...'
            });

            this.loading.present();
        });
    }
    stop():void {
        this.events.publish(Utils.EVENT_MEDIA_END,this.lastSound);
        this.media.pause();
        console.log('Stop current media',this.media);
        this.media.currentTime = 0;
    }
    isPlaying():boolean {
        return this.media && this.media.duration > 0 &&!this.media.paused;
    }
    isCurrentSound(newSound:any):boolean {
        return this.currentSound && newSound.id === this.currentSound.id;
    }
    play(newSound:any):void {
        console.log('Playing sound',newSound);

        let soundPlaying:boolean = this.isPlaying() && this.isCurrentSound(newSound);

        if(!soundPlaying) {
            if (this.media && !this.media.paused) {
                this.stop();
            }
            this.currentSound = newSound;

            if (this.platform.is('cordova')) {
                if (!this.cacheService.soundInCache(newSound.file)) {
                    this.media.src = newSound.file;
                } else {
                    console.log('Playing sound from cache', this.cacheService.getCachedSoundPath(newSound));
                    this.media.src = this.cacheService.getCachedSoundPath(newSound);
                }
            } else {
                if (!this.cacheService.soundInCache(newSound.file)) {
                    this.media.src = newSound.file;
                } else {
                    console.log('Playing sound from cache', this.cacheService.soundCache.toInternalURL(newSound.file));
                    this.media.src = this.cacheService.soundCache.toInternalURL(newSound.file);
                }
            }

            this.media.load();
            this.media.play();

            this.lastSound = newSound;
        } else {
            console.info('This song is already in play');
            this.currentSound.loading = false;
            this.currentSound.playing = true;
            this.events.publish(Utils.EVENT_MEDIA_PLAYING,this.currentSound);
        }
    }
}
