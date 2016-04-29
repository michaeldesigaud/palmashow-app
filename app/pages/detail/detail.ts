/**
 * Detail page
 * Created by Michael DESIGAUD on 29/04/2016.
 */

import {Page,NavParams,Storage,LocalStorage,Events,Alert} from 'ionic-angular/index';
import {MediaPlayer} from '../../components/player/media-player';
import {DataService} from '../../services/data.service';
import {StringDatePipe} from '../../pipes/pipes';
import {CacheService} from '../../services/cache.service';
import * as Utils from '../../utils/app.utils';
import {NavController} from "ionic-angular/index";
import {ViewChild} from 'angular2/core';

@Page({
    templateUrl:'build/pages/detail/detail.html',
    directives:[MediaPlayer],
    pipes:[StringDatePipe]
})
export class Detail {
    @ViewChild(MediaPlayer) private mediaPlayer:MediaPlayer;
    private sound:any;
    private storage:Storage;
    private saveType:string;
    private alertOptions:any = {title:'Exporter le son',subTitle:'Suavegarder le son en tant que sonnerie ou notification'};
    private bookmarked:boolean = false;
    constructor(private dataService:DataService,private cacheService:CacheService, private events:Events,private navController:NavController,navParams:NavParams) {
        this.storage = new Storage(LocalStorage);
        this.sound = navParams.get('sound');
        this.sound.loading = true;
        this.sound.playing = false;
        this.sound.simpleName = this.sound.file.substring(this.sound.file.lastIndexOf('/')+1);

        this.addListeners();

        this.isBookmarked();
    }
    getThumbtail(id:number):string {
        let user:any = this.dataService.getUserById(id);
        return user.thumbtail;
    }
    getUsername(id:number):string {
        let user:any = this.dataService.getUserById(id);
        return user.name;
    }
    canRingtone():boolean {
        return !!window.ringtone;
    }
    addListeners():void {
        this.events.subscribe(Utils.EVENT_MEDIA_END,(data:any) => {
            let sound:any = data[0];
            sound.playing = false;
            sound.loading = false;
        });
        this.events.subscribe(Utils.EVENT_MEDIA_PLAYING,(data:any) => {
            let sound:any  = data[0];
            sound.loading = false;
            sound.playing = true;
        });
    }
    onPageDidEnter():void {
      this.storage.get(Utils.LOCAL_STORAGE_USE_CACHE_SOUND).then((value:string) => {
            if(value === 'true') {
                this.cacheService.cacheSound(this.sound,()=> {
                    this.mediaPlayer.play(this.sound);
                });
            } else {
                this.mediaPlayer.play(this.sound)
            }
        });
    }
    onPageDidLeave():void {
        delete this.events._channels[Utils.EVENT_CACHE_SOUND_DOWNLOADED];
        delete this.events._channels[Utils.EVENT_MEDIA_END];
        delete this.events._channels[Utils.EVENT_MEDIA_PLAYING];
    }
    isBookmarked():void {
        this.storage.getJson(Utils.LOCAL_STORAGE_BOOKMARK).then((value:Array<string>) => {
            if(value && $.isArray(value) && value.indexOf(this.sound.id) !== -1) {
                this.bookmarked = true;
            }
        });
    }
    onClickDeleteBookmark(event:Event):void {
        event.preventDefault();
        this.storage.getJson(Utils.LOCAL_STORAGE_BOOKMARK).then((value:Array<string>) => {
            if(value && $.isArray(value) && value.indexOf(this.sound.id) !== -1) {
                value = value.filter((id:string) => this.sound.id !== id);
                this.storage.setJson(Utils.LOCAL_STORAGE_BOOKMARK,value);
                this.bookmarked = false;
            }
        });
    }
    onClickBookmark(event:Event):void {
        event.preventDefault();

        this.storage.getJson(Utils.LOCAL_STORAGE_BOOKMARK).then((value:Array<string>) => {
            if(!value || !$.isArray(value)) {
                value = [this.sound.id];
            } else {
                if(value.indexOf(this.sound.id) === -1) {
                    value.push(this.sound.id);
                }
            }
            this.storage.setJson(Utils.LOCAL_STORAGE_BOOKMARK,value);
            this.bookmarked = true;
        });
    }
    onRedirectYoutube(event:Event):void {
        event.preventDefault();
        window.open(this.sound.youtube_url,'_blank');
    }
    removeFromCache(event:Event):void {
        event.preventDefault();
        let confirm:Alert = Alert.create({
            title: 'Supprimer du cache ?',
            message: 'La chanson sera supprimée du cache et sera retéléchargée à la prochaine écoute. <br/>Pour gérer les options de cache allez dans Menu > Paramètres',
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
        this.navController.present(confirm);
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
                    window.ringtone.setRingtone(cordova.file.externalRootDirectory + this.getRingtoneFolder(type)+'/'+ Utils.RINGTONE_DEFAULT_NAME+type+'.mp3',Utils.RINGTONE_DEFAULT_NAME+type, 'Palmashow', type, () => {
                            let text:String = type === 'ringtone' ? 'sonnerie' : 'notification';
                            let alert = Alert.create({
                                title: 'Sauvegarde réussie',
                                subTitle: 'Le son à été sauvegardé en tant que ' + text,
                                buttons: ['Ok']
                            });
                            this.navController.present(alert);
                        },
                        () => {
                            let text:String = type === 'ringtone' ? 'sonnerie' : 'notification';
                            let alert = Alert.create({
                                title: 'Echec sauvegarde',
                                subTitle: 'Le son n\'à pas été sauvegardé en tant que ' + text,
                                buttons: ['Ok']
                            });
                            this.navController.present(alert);
                        });
                });
            });
        }
    }
    copyFileToRingtoneFolder(type:string,callback:Function):void {
        window.resolveLocalFileSystemURL(this.cacheService.soundCache.toInternalURL(this.sound.file),(fileEntry) =>{
            window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory+ this.getRingtoneFolder(type),(dirEntry) =>{
                fileEntry.copyTo(dirEntry,Utils.RINGTONE_DEFAULT_NAME+type+'.mp3',callback);
            });
        });
    }
}