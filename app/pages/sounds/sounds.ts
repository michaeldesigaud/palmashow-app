/**
 * Sounds page component
 * Created by Michael DESIGAUD on 19/04/2016.
 */
import {Page,NavParams,NavController,Modal,Platform} from 'ionic-angular/index';
import {Http} from 'angular2/http';
import {NgZone,ViewChild} from 'angular2/core';
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
    private sounds:Array<any>;
    private userInfo:boolean = false;
    private currentSound:any;
    constructor(private mediaService:MediaService,private dataService:DataService,navParams:NavParams,zone:NgZone,platform:Platform,cacheService:CacheService) {
        super(platform,cacheService);
        this.sounds = navParams.data.sounds;
        this.title = navParams.data.title;
        this.userInfo = navParams.data.userInfo;

        this.mediaService.mediaEnd.subscribe((sound) => {
            this.sounds.forEach((_sound:any) => {
                if(_sound.id === sound.id) {
                    zone.run(() =>  {
                        sound.playing = false;
                        sound.loading = false;
                    });
                }
            });
        });

        this.mediaService.mediaPlaying.subscribe((sound) => {
            this.sounds.forEach((_sound:any) => {
                if(_sound.id === sound.id) {
                    console.log('Sound '+sound.name+' is playing');
                    zone.run(() =>  {
                        sound.loading = false;
                        sound.playing = true;
                        this.currentSound = sound;
                    });
                }
            });
        });
    }
    onPlay(event:Event,sound:any) {
        event.preventDefault();
        this.mediaPlayer.play(event,sound);
    }
    onClickFavoris(event:Event,sound:any):void {
        event.stopImmediatePropagation();
        console.log('Adding sound to favoris',sound);
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
