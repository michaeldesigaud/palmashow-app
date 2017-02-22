/**
 * Settings page
 * Created by Michael DESIGAUD on 27/04/2016.
 */

import {Toggle,Alert,NavController,Platform, AlertController} from 'ionic-angular';
import {Storage} from '@ionic/storage';
import {CacheService} from '../../services/cache.service';
import * as Utils from '../../utils/app.utils';
import {NgZone,Component} from '@angular/core';
import {AnalyticService} from '../../services/analytics.service';

@Component({
    templateUrl:'settings.html',
})
export class SettingsPage {
    private useCacheSound:boolean = true;
    private useCacheImage:boolean = true;
    private nbSoundsInCache:number = 0;
    constructor(private storage:Storage, private alertController:AlertController,
                private cacheService:CacheService,private zone:NgZone,analyticService:AnalyticService) {
        this.storage.get(Utils.LOCAL_STORAGE_USE_CACHE_SOUND).then((value) => {
            if(value) {
                this.useCacheSound = value;
            }
        });
        this.storage.get(Utils.LOCAL_STORAGE_USE_CACHE_IMAGE).then((value) => {
            if(value) {
                this.useCacheImage = value;
            }
        });
        analyticService.trackView('SettingsPage');
    }
    onPageLoaded():void {
        this.cacheService.soundCache.list().then((list) => this.zone.run(() => this.nbSoundsInCache = list.length));
    }
    onChangeToggleSound(toggle:Toggle):void {
        this.storage.set(Utils.LOCAL_STORAGE_USE_CACHE_SOUND,toggle.checked);
    }
    onChangeToggleImage(toggle:Toggle):void {
        this.storage.set(Utils.LOCAL_STORAGE_USE_CACHE_IMAGE,toggle.checked);
    }
    onClickDeleteSounds(event:Event):void {
        event.preventDefault();
        this.cacheService.clearCacheSound(() => {
            let alert:Alert = this.alertController.create({
                title: 'Suppression réussie !',
                subTitle: 'Tous les sons du cache ont été supprimés.',
                buttons: [{text: 'Ok', handler: () => alert.dismiss()}]
            });
            alert.present();
            this.nbSoundsInCache = 0;
        });
    }
    onClickDeleteImages(event:Event):void {
        event.preventDefault();
        this.cacheService.clearCacheImage(() => {
            let alert:Alert = this.alertController.create({
                title: 'Suppression réussie !',
                subTitle: 'Toutes les images du cache ont été supprimées.',
                buttons: [{text: 'Ok', handler: () => alert.dismiss()}]
            });
            alert.present();
        });
    }
    onClickDeleteData(event:Event):void {
        event.preventDefault();
        this.cacheService.clearCacheData().then(() => {
            let alert:Alert = this.alertController.create({
                title: 'Suppression réussie !',
                subTitle: 'Toutes les données du cache ont été supprimées.',
                buttons: [{text: 'Ok', handler: () => {alert.dismiss();}}]
            });
            alert.present();
        });
    }
}
