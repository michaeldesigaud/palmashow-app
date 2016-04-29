/**
 * Sounds page component
 * Created by Michael DESIGAUD on 19/04/2016.
 */
import {Page,NavParams,NavController,InfiniteScroll} from 'ionic-angular/index';
import {DataService} from '../../services/data.service';
import {StringDatePipe,SearchFilterPipe} from '../../pipes/pipes';
import * as Utils from '../../utils/app.utils';
import {Detail} from '../detail/detail';

@Page({
    templateUrl:'build/pages/sounds/sounds.html',
    pipes:[StringDatePipe,SearchFilterPipe]
})
export class SoundsPage {
    private title:string;
    private group:any;
    private sounds:Array<any>;
    private ids:Array<string>;
    constructor(private navController:NavController,private dataService:DataService,navParams:NavParams) {
        this.group = navParams.data.group;
        this.title = navParams.data.title;
        this.ids = navParams.data.ids;

        this.getSounds(() => {});
    }
    getLimit():number {
        return this.sounds && this.sounds.length >= Utils.NB_SOUNDS_PER_PAGE ? this.sounds.length + Utils.NB_SOUNDS_PER_PAGE : Utils.NB_SOUNDS_PER_PAGE;
    }
    getSounds(callback:Function):void {
        if(this.group) {
            this.dataService.getSounds(this.group.id, this.getLimit()).subscribe((sounds:Array<any>) => {
                this.sounds = sounds;
                callback();
            });
        } else if(this.ids){
            this.dataService.getSoundsByIds(this.ids,this.getLimit()).subscribe((sounds:Array<any>) => {
                this.sounds = sounds;
                callback();
            });
        }
    }
    getUsername(id:number):string {
        let user:any = this.dataService.getUserById(id);
        return user.name;
    }
    doInfinite(infiniteScroll:InfiniteScroll) {
        this.getSounds(() => infiniteScroll.complete());
    }
    onPlay(event:Event,sound:any) {
        event.preventDefault();
        this.navController.push(Detail, {sound: sound}, {animate: false});
    }
}
