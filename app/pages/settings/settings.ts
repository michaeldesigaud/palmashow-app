/**
 * Settings page
 * Created by Michael DESIGAUD on 27/04/2016.
 */

import {Page,Toggle,Storage,LocalStorage,Alert,NavController} from 'ionic-angular/index';
import {CacheService} from '../../services/cache.service';
import * as Utils from '../../utils/app.utils';

@Page({
    templateUrl:'build/pages/settings/settings.html',
})
export class SettingsPage {
    private storage:Storage;
    private useCacheSound:boolean = true;
    private useCacheImage:boolean = true;
    constructor(private navController:NavController,private cacheService:CacheService) {
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
