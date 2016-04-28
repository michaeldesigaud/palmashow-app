/**
 * Sounds page component
 * Created by Michael DESIGAUD on 19/04/2016.
 */
import {Page,NavParams,NavController,Alert,Events,InfiniteScroll,Storage,LocalStorage} from 'ionic-angular/index';
import {ViewChild} from 'angular2/core';
import {PathUtils} from "../../utils/app.utils";
import {EVENT_MEDIA_END,EVENT_MEDIA_PLAYING} from '../../services/media.service';
import {DataService,NB_SOUNDS_PER_PAGE} from '../../services/data.service';
import {CacheService,EVENT_CACHE_SOUND_DOWNLOADED} from '../../services/cache.service';
import {MediaPlayer} from '../../components/player/media-player';
import {CachedPage} from '../cache/cache-page';
import {StringDatePipe,SearchFilterPipe} from '../../pipes/pipes';
import {LOCAL_STORAGE_USE_CACHE} from '../settings/settings';

@Page({
    templateUrl:'build/pages/sounds/sounds.html',
    directives:[MediaPlayer],
    pipes:[StringDatePipe,SearchFilterPipe]
})
export class SoundsPage {
    @ViewChild(MediaPlayer) private mediaPlayer:MediaPlayer;
    private title:string;
    private group:any;
    private sounds:Array<any>;
    private userInfo:boolean = false;
    private currentSound:any;
    private storage:Storage;
    constructor(private navController:NavController,private dataService:DataService,private events:Events,navParams:NavParams,private cacheService:CacheService) {
        this.group = navParams.data.group;
        this.title = navParams.data.title;
        this.userInfo = navParams.data.userInfo;
        this.storage = new Storage(LocalStorage);

        this.addListeners();

        this.events.subscribe(EVENT_CACHE_SOUND_DOWNLOADED,(data:any) => this.mediaPlayer.play(data[0]));

        this.getSounds(() => {});
    }
    onPageDidLeave():void {
        delete this.events._channels[EVENT_CACHE_SOUND_DOWNLOADED];
        delete this.events._channels[EVENT_MEDIA_END];
        delete this.events._channels[EVENT_MEDIA_PLAYING];
    }
    getLimit():number {
        return this.sounds && this.sounds.length >= NB_SOUNDS_PER_PAGE ? this.sounds.length + NB_SOUNDS_PER_PAGE : NB_SOUNDS_PER_PAGE;
    }
    getSounds(callback:Function):void {
        this.dataService.getSounds(this.group.id,this.getLimit()).subscribe((sounds:Array<any>) => {
            this.sounds = sounds;
            callback();
        });
    }
    doInfinite(infiniteScroll:InfiniteScroll) {
        this.getSounds(() => infiniteScroll.complete());
    }
    addListeners():void {
        this.events.subscribe(EVENT_MEDIA_END,(data:any) => {
            let sound:any  = data[0];
            this.sounds.forEach((_sound:any) => {
                if(_sound.id === sound.id) {
                    sound.playing = false;
                    sound.loading = false;
                }
            });
        });
        this.events.subscribe(EVENT_MEDIA_PLAYING,(data:any) => {
            let sound:any  = data[0];
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
        this.storage.get(LOCAL_STORAGE_USE_CACHE).then((value:string) => {
            if(value === 'true') {
                this.cacheService.cacheSound(sound);
            } else {
                this.mediaPlayer.play(sound);
            }
        });

    }
    isSelected(sound:any):boolean {
        return this.currentSound && this.currentSound.id === sound.id;
    }
    onClickFavoris(event:Event,sound:any):void {
        event.stopImmediatePropagation();
        console.log('Adding sound to favoris',sound);
    }
    onRedirectYoutube(event:Event,sound:any):void {
        event.stopImmediatePropagation();
        window.open(sound.youtube_url,'_blank');
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
