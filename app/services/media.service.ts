/**
 * Media service
 * Created by Michael DESIGAUD on 20/04/2016.
 */

import {Injectable} from 'angular2/core';
import {Observable} from "rxjs/Observable";
import {Events} from 'ionic-angular/index';
import * as Utils from '../utils/app.utils';

@Injectable()
export class MediaService {
    media:any;
    lastSound:any;
    currentSound:any;
    constructor(public events:Events) {}
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

        this.media.src = newSound.file;
        this.media.load();
        this.media.play();

        this.lastSound = newSound;
    }
}