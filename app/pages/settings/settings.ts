/**
 * Settings page
 * Created by Michael DESIGAUD on 27/04/2016.
 */

import {Page,Toggle,Storage,LocalStorage,Alert,NavController,Platform} from 'ionic-angular/index';
import {CacheService} from '../../services/cache.service';
import * as Utils from '../../utils/app.utils';

@Page({
    templateUrl:'build/pages/settings/settings.html',
})
export class SettingsPage {
    private storage:Storage;
    private useCacheSound:boolean = true;
    private useCacheImage:boolean = true;
    private nbSoundsInCache:number = 0;
    private cacheText:string;
    constructor(private platform:Platform, private navController:NavController,private cacheService:CacheService) {
        this.storage = new Storage(LocalStorage);
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
        this.getCacheSize();
    }
    getCacheSize():void {
        if(navigator.webkitPersistentStorage) {
            navigator.webkitPersistentStorage.queryUsageAndQuota ((usedBytes,grantedBytes) => {
                this.cacheText = Math.floor(usedBytes / 1048576) + ' Mb / ' + Math.floor(grantedBytes / 1048576)+' Mb';
            });
        }
    }
    onPageLoaded():void {
        this.cacheService.soundCache.list().then((list) => this.nbSoundsInCache = list.length);
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
            let alert:Alert = Alert.create({
                title: 'Suppression réussie !',
                subTitle: 'Tous les sons du cache ont été supprimés.',
                buttons: [{text: 'Ok', handler: () => {alert.dismiss()}}]
            });
            this.navController.present(alert);
            this.nbSoundsInCache = 0;
        });
    }
    onClickDeleteImages(event:Event):void {
        event.preventDefault();
        this.cacheService.clearCacheImage(() => {
            let alert:Alert = Alert.create({
                title: 'Suppression réussie !',
                subTitle: 'Toutes les images du cache ont été supprimées.',
                buttons: [{text: 'Ok', handler: () => {alert.dismiss()}}]
            });
            this.navController.present(alert);
        });
    }
}
