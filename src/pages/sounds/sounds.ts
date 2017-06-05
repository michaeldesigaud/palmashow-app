/**
 * Sounds page component
 * Created by Michael DESIGAUD on 19/04/2016.
 */
import {NavParams,NavController,Refresher} from 'ionic-angular';
import {DataService} from '../../services/data.service';
import {CacheService} from '../../services/cache.service';
import {Detail} from '../detail/detail';
import {AnalyticService} from '../../services/analytics.service';
import {Component} from '@angular/core';

@Component({
    templateUrl:'sounds.html'
})
export class SoundsPage {
    private title:string;
    private group:any;
    private sounds:Array<any>;
    private ids:Array<string>;
    constructor(private navController:NavController,private cacheService: CacheService, private dataService:DataService,navParams:NavParams,analyticService:AnalyticService) {
        this.group = navParams.data.group;
        this.title = navParams.data.title;
        this.ids = navParams.data.ids;

        if(this.ids) {
            this.group = {title:'Favoris'};
        }

        this.getSounds(() => {});

        analyticService.trackView('SoundsPage - '+this.group.title);
    }
    onClickCache(event:Event):void {
        event.stopImmediatePropagation();
    }
    getSounds(callback:Function,clearCache:boolean = false):void {
        if(!this.ids) {
            this.dataService.getSounds(this.group.id,clearCache).subscribe((sounds:Array<any>) => {
                this.sounds = sounds;
                callback();
            });
        } else {
            this.dataService.getSoundsByIds(this.ids,true).subscribe((sounds:Array<any>) => {
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
