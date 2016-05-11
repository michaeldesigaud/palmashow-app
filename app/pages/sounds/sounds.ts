/**
 * Sounds page component
 * Created by Michael DESIGAUD on 19/04/2016.
 */
import {Page,NavParams,NavController,Refresher} from 'ionic-angular/index';
import {DataService} from '../../services/data.service';
import {StringDatePipe,SearchFilterPipe} from '../../pipes/pipes';
import * as Utils from '../../utils/app.utils';
import {Detail} from '../detail/detail';
import {CacheService} from '../../services/cache.service';

@Page({
    templateUrl:'build/pages/sounds/sounds.html',
    pipes:[StringDatePipe,SearchFilterPipe]
})
export class SoundsPage {
    private title:string;
    private group:any;
    private sounds:Array<any>;
    private ids:Array<string>;
    constructor(private navController:NavController,private cacheService:CacheService,private dataService:DataService,navParams:NavParams) {
        this.group = navParams.data.group;
        this.title = navParams.data.title;
        this.ids = navParams.data.ids;

        this.getSounds(() => {});
    }
    onClickCache(event:Event):void {
        event.stopImmediatePropagation();
    }
    getSounds(callback:Function,clearCache:boolean = false):void {
        if(this.group) {
            this.dataService.getSounds(this.group.id,clearCache).subscribe((sounds:Array<any>) => {
                this.sounds = sounds;
                callback();
            });
        } else if(this.ids){
            this.dataService.getSoundsByIds(this.ids,clearCache).subscribe((sounds:Array<any>) => {
                this.sounds = sounds;
                callback();
            });
        }
    }
    getUsername(id:number):string {
        let user:any = this.dataService.getUserById(id);
        return user.name;
    }
    doRefresh(refresher?:Refresher) {
        this.getSounds(() => {
            if(refresher) {
                refresher.complete();
            }
        },true);
    }
    onPlay(event:Event,sound:any) {
        event.preventDefault();
        this.navController.push(Detail, {sound: sound}, {animate: false});
    }
    getThumbtail(id:number):string {
        let user:any = this.dataService.getUserById(id);
        return user.thumbtail;
    }
}
