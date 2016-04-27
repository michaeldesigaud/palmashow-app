/**
 * Media service
 * Created by Michael DESIGAUD on 20/04/2016.
 */

import {Injectable} from 'angular2/core';
import {PathUtils} from '../utils/app.utils';
import {Observable} from "rxjs/Observable";
import {Subject} from 'rxjs/Subject';

@Injectable()
export class MediaService {
    media:any;
    mediaEnd:Subject<any>;
    mediaPlaying:Subject<any>;
    lastSound:any;
    currentSound:any;
    constructor() {
        this.mediaEnd = new Subject();
        this.mediaPlaying = new Subject();
    }
    setMedia(media:any) {
        this.media = media;
        this.media.addEventListener('playing',() => this.mediaPlaying.next(this.currentSound));
        this.media.addEventListener('ended', () => this.mediaEnd.next(this.currentSound));
    }
    stop():void {
        this.mediaEnd.next(this.lastSound);
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