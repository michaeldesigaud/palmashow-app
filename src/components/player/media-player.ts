import {Component,ElementRef} from '@angular/core';
import {MediaService} from '../../services/media.service';

import * as $ from 'jquery';

/**
 * Player component
 * Created by Michael DESIGAUD on 23/04/2016.
 */
@Component({
    selector:'media-player',
    template:'<audio controls="controls" preload="auto" id="mediaPlayer" style="width: 100%" controlsList="nodownload"></audio>'
})
export class MediaPlayer {

    constructor(private mediaService:MediaService,private el:ElementRef) {}
    ngOnInit():void {
        this.mediaService.setMedia($(this.el.nativeElement).children()[0]);
    }
    play(sound:any) {
        sound.playing = false;
        sound.loading = true;

        this.mediaService.play(sound);
    }
}
