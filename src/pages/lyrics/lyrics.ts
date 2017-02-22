/**
 * Lyrics page
 * Created by Michael DESIGAUD on 01/05/2016.
 */
import {ViewController} from 'ionic-angular';
import {Component} from '@angular/core';

@Component({
    templateUrl:'lyrics.html'
})
export class LyricsPage {
    private sound:any = {};
    constructor(private viewCtrl: ViewController) {
        this.sound = viewCtrl.data.sound;
    }
    dismiss() {
        this.viewCtrl.dismiss();
    }
}
