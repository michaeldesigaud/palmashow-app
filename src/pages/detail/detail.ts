/**
 * Detail page
 * Created by Michael DESIGAUD on 29/04/2016.
 */

import {NavParams, Events, Alert, Platform, Modal, AlertController, ModalController} from 'ionic-angular';
import {Storage} from '@ionic/storage';
import {DataService} from '../../services/data.service';

import {CacheService} from '../../services/cache.service';
import {AnalyticService} from '../../services/analytics.service';
import * as Utils from '../../utils/app.utils';
import {Inject,forwardRef, Component} from '@angular/core';
import {PalmashowApp} from '../../app/app.component';
import {LyricsPage} from '../lyrics/lyrics';

import * as $ from 'jquery';

@Component({
    templateUrl:'detail.html'
})
export class Detail {
    private sound:any;
    private saveType:string;
    private alertOptions:any = {title:'Exporter le son',subTitle:'Sauvegarder le son en tant que sonnerie ou notification'};
    private bookmarked:boolean = false;
    private playing:boolean = true;
    constructor(@Inject(forwardRef(() => PalmashowApp)) private _parent:PalmashowApp,private dataService:DataService,
                private storage:Storage, private cacheService:CacheService, private events:Events,
                private platform:Platform, navParams:NavParams,
                private analyticService:AnalyticService, private alertController:AlertController,
                private modalController: ModalController) {
        this.sound = navParams.get('sound');
        this.sound.loading = true;
        this.sound.playing = false;
        this.sound.simpleName = this.sound.file.substring(this.sound.file.lastIndexOf('/')+1);

        this.addListeners();

        this.isBookmarked();

        analyticService.trackView('DetailPage - '+this.sound.name);
    }
    getThumbtail(id:number):string {
        let user:any = this.dataService.getUserById(id);
        return user.thumbtail;
    }
    getUsername(id:number):string {
        let user:any = this.dataService.getUserById(id);
        return user.name;
    }
    canNotif():boolean {
        return !!window.ringtone;
    }
    canRingtone():boolean {
        return this.canNotif()
            && this.platform.is('mobile')
            && !this.platform.is('tablet');
    }
    onMediaEnd(sound:any):void {
        sound.playing = false;
        sound.loading = false;
    }
    onMediaPlaying(sound:any):void {
        sound.loading = false;
        sound.playing = true;
    }
    addListeners():void {
        this.events.subscribe(Utils.EVENT_MEDIA_END,this.onMediaEnd);
        this.events.subscribe(Utils.EVENT_MEDIA_PLAYING,this.onMediaPlaying);
    }
    ionViewDidLoad():void {
        if(this.playing) {
            this.storage.get(Utils.LOCAL_STORAGE_USE_CACHE_SOUND).then((value:string) => {
                if (value === 'true') {
                    this.cacheService.cacheSound(this.sound, ()=> {
                        this._parent.mediaPlayer.play(this.sound);
                    });
                } else {
                    this._parent.mediaPlayer.play(this.sound);
                }
            });
        }
    }
    ionViewDidLeave():void {
        this.events.unsubscribe(Utils.EVENT_CACHE_SOUND_DOWNLOADED);
        this.events.unsubscribe(Utils.EVENT_MEDIA_END, this.onMediaEnd);
        this.events.unsubscribe(Utils.EVENT_MEDIA_PLAYING, this.onMediaPlaying);
    }
    isBookmarked():void {
        this.storage.get(Utils.LOCAL_STORAGE_BOOKMARK).then((data: string) => {
            let value:Array<string> = JSON.parse(data);
            if(value && $.isArray(value) && value.indexOf(this.sound.id) !== -1) {
                this.bookmarked = true;
            }
        });
    }
    onClickDeleteBookmark(event:Event):void {
        event.preventDefault();
        this.storage.get(Utils.LOCAL_STORAGE_BOOKMARK).then((data: string) => {
            let value:Array<string> = JSON.parse(data);
            if (value && $.isArray(value) && value.indexOf(this.sound.id) !== -1) {
                value = value.filter((id:string) => this.sound.id !== id);
                this.storage.set(Utils.LOCAL_STORAGE_BOOKMARK,JSON.stringify(value));
                this.bookmarked = false;
            }
        });
    }
    onClickBookmark(event:Event):void {
        event.preventDefault();

        this.storage.get(Utils.LOCAL_STORAGE_BOOKMARK).then((data: string) => {
            let value:Array<string> = JSON.parse(data);
            if(!value || !$.isArray(value)) {
                value = [this.sound.id];
            } else {
                if(value.indexOf(this.sound.id) === -1) {
                    value.push(this.sound.id);
                }
            }
            this.storage.set(Utils.LOCAL_STORAGE_BOOKMARK, JSON.stringify(value));
            this.bookmarked = true;
        });
    }
    onRedirectYoutube(event:Event):void {
        event.preventDefault();
        window.open(this.sound.youtube_url,'_blank');
    }
    onClickLyrics(event:Event):void {
        event.preventDefault();
        let lycrisModal:Modal = this.modalController.create(LyricsPage,{sound:this.sound});
        lycrisModal.onDidDismiss(data => this.playing = false);
        lycrisModal.present();
    }
    createShareAlert():void {
        let alert = this.alertController.create();
        alert.setTitle('Partager un son');
        alert.addInput({
            type: 'radio',
            label: 'Twitter',
            value: 'twitter'
        });
        alert.addInput({
            type: 'radio',
            label: 'Facebook',
            value: 'facebook'
        });
        alert.addInput({
            type: 'radio',
            label: 'Email',
            value: 'email'
        });
        alert.addButton('Annuler');
        alert.addButton({
            text: 'Ok',
            handler: data => {

                let playStoreUrlConfig:any = this.dataService.getConfigByKey(Utils.PLAY_STORE_URL);

                this.analyticService.trackEvent('DetailPage','Share',data,this.sound.name);

                let fileUri:string = cordova.file.externalRootDirectory+this.cacheService.soundCache.toPath(this.sound.file);
                let message:string = 'Enorme le son "'+this.sound.name+'" de l\'application Palmashow Soundboard ! '+playStoreUrlConfig.value;
                if(data === 'twitter') {
                    window.plugins.socialsharing.shareViaTwitter(message);
                }
                if(data === 'email') {
                    console.log('Attachment file',fileUri);
                    window.plugins.socialsharing.shareViaEmail(message,'Palmashow Soundboard: '+this.sound.name,null,null,null);
                }
                if(data === 'facebook') {
                    window.plugins.socialsharing.shareViaFacebook(message);
                }
            }
        });
        alert.present();
    }
    onClickShare(event:Event):void {
        event.preventDefault();
        this.createShareAlert();
    }
    removeFromCache(event:Event):void {
        event.preventDefault();
        let confirm:Alert = this.alertController.create({
            title: 'Supprimer du cache ?',
            message: 'La chanson sera supprimée du cache et sera retéléchargée à la prochaine écoute. ' +
            '<br/>Pour gérer les options de cache allez dans Menu > Paramètres',
            buttons: [
                {
                    text: 'Confirmer',
                    handler: () => {
                        this.cacheService.removeSound(this.sound,() => confirm.dismiss());
                    }
                },
                {
                    text: 'Annuler',
                    handler: () => confirm.dismiss()
                }
            ]
        });
        confirm.present();
    }
    getRingtoneFolder(type:string):string {
        if(type === 'ringtone') {
            return 'Ringtones';
        }
        return 'Notifications';
    }
    saveAs(event:Event,type:string):void {
        event.preventDefault();
        if(this.canRingtone()) {
            this.cacheService.cacheSound(this.sound,() => {
                this.copyFileToRingtoneFolder(type,() => {
                    window.ringtone.setRingtone(cordova.file.externalRootDirectory +
                        this.getRingtoneFolder(type)+'/'+ Utils.RINGTONE_DEFAULT_NAME+type+'.mp3',
                        Utils.RINGTONE_DEFAULT_NAME+type, 'Palmashow', type, () => {
                            let text:String = type === 'ringtone' ? 'sonnerie' : 'notification';
                            let alert = this.alertController.create({
                                title: 'Sauvegarde réussie',
                                subTitle: 'Le son à été sauvegardé en tant que ' + text,
                                buttons: ['Ok']
                            });
                            alert.present();
                        },
                        () => {
                            let text:String = type === 'ringtone' ? 'sonnerie' : 'notification';
                            let alert = this.alertController.create({
                                title: 'Echec sauvegarde',
                                subTitle: 'Le son n\'à pas été sauvegardé en tant que ' + text,
                                buttons: ['Ok']
                            });
                            alert.present();
                        });
                });
            });
        }
    }
    copyFileToRingtoneFolder(type:string, callback:Function):void {
        window.resolveLocalFileSystemURL(this.cacheService.soundCache.toInternalURL(this.sound.file),(fileEntry) => {
            window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory+
                this.getRingtoneFolder(type),(dirEntry) => {
                fileEntry.copyTo(dirEntry,Utils.RINGTONE_DEFAULT_NAME+type+'.mp3',callback);
            });
        });
    }
}
