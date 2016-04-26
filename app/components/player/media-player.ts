import {Component,ElementRef,ViewEncapsulation} from 'angular2/core';
import {MediaService} from '../../services/media.service';
import {DOM} from "angular2/src/platform/dom/dom_adapter";

/**
 * Player component
 * Created by Michael DESIGAUD on 23/04/2016.
 */
@Component({
    selector:'media-player',
    template:'<audio controls="controls" preload="none" id="mediaPlayer"></audio>'
})
export class MediaPlayer {
    constructor(private mediaService:MediaService,private el:ElementRef) {}
    ngOnInit():void {
        this.mediaService.setMedia(DOM.firstChild(this.el.nativeElement));
    }
    play(event:Event,sound:any) {
        event.preventDefault();
        sound.playing = false;
        sound.loading = true;
        this.mediaService.play(sound);
    }
}
