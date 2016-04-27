/**
 * Sounds page component
 * Created by Michael DESIGAUD on 19/04/2016.
 */
import {Page,NavParams,NavController,Platform,Alert,Refresher} from 'ionic-angular/index';
import {ViewChild} from 'angular2/core';
import {PathUtils} from "../../utils/app.utils";
import {MediaService} from '../../services/media.service';
import {DataService} from '../../services/data.service';
import {CacheService} from '../../services/cache.service';
import {MediaPlayer} from '../../components/player/media-player';
import {CachedPage} from '../cache/cache-page';

@Page({
    templateUrl:'build/pages/sounds/sounds.html',
    directives:[MediaPlayer]
})
export class SoundsPage extends CachedPage {
    @ViewChild(MediaPlayer) private mediaPlayer:MediaPlayer;
    private title:string;
    private group:any;
    private sounds:Array<any>;
    private userInfo:boolean = false;
    private currentSound:any;
    constructor(private mediaService:MediaService,private navController:NavController,private dataService:DataService,navParams:NavParams,platform:Platform,cacheService:CacheService) {
        super(platform,cacheService);
        this.group = navParams.data.group;
        this.title = navParams.data.title;
        this.userInfo = navParams.data.userInfo;

        this.addListeners();

        this.cacheService.soundDownloaded.subscribe((sound:any) => this.mediaPlayer.play(sound));

        this.doRefresh(null,false);
    }
    doRefresh(refresher:Refresher,reload:boolean = true) {
        if(reload) {
            this.dataService.clearSounds();
        }
        this.dataService.getSounds().subscribe((sounds:Array<any>) => {
            this.sounds = sounds.filter((sound:any) => sound.group_id === this.group.id);
            if(reload) {
                refresher.complete();
            }
        });
    }
    addListeners():void {
        this.mediaService.mediaEnd.subscribe((sound) => {
            this.sounds.forEach((_sound:any) => {
                if(_sound.id === sound.id) {
                    sound.playing = false;
                    sound.loading = false;
                }
            });
        });

        this.mediaService.mediaPlaying.subscribe((sound) => {
            this.sounds.forEach((_sound:any) => {
                if(_sound.id === sound.id) {
                    console.log('Sound '+sound.name+' is playing');
                    sound.loading = false;
                    sound.playing = true;
                    this.currentSound = sound;
                }
            });
        });
    }
    onPlay(event:Event,sound:any) {
        event.preventDefault();
        this.cacheService.cacheSound(sound);
    }
    onClickFavoris(event:Event,sound:any):void {
        event.stopImmediatePropagation();
        console.log('Adding sound to favoris',sound);
    }
    removeFromCache(event:Event,sound:any):void {
        event.stopImmediatePropagation();
        let confirm:Alert = Alert.create({
            title: 'Supprimer du cache ?',
            message: 'La chanson sera supprimée du cache et sera téléchargée à la prochaine écoute',
            buttons: [
                {
                    text: 'Confirmer',
                    handler: () => {
                        this.cacheService.removeSound(sound,() => confirm.dismiss());
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
    getThumbtail(id:number):string {
        let user:any = this.dataService.getUserById(id);
        return user.thumbtail;
    }
    getUsername(id:number):string {
        let user:any = this.dataService.getUserById(id);
        return user.name;
    }
}
