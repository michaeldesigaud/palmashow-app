/**
 * Lyrics page
 * Created by Michael DESIGAUD on 01/05/2016.
 */
import {Page,ViewController} from 'ionic-angular/index';

@Page({
    templateUrl:'build/pages/lyrics/lyrics.html'
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
