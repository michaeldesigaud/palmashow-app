/**
 * Settings page
 * Created by Michael DESIGAUD on 27/04/2016.
 */

import {Page,Toggle,Storage,LocalStorage,Alert,NavController} from 'ionic-angular/index';
import {CacheService} from '../../services/cache.service';

export const LOCAL_STORAGE_USE_CACHE:string = 'USE_CACHE';

@Page({
    templateUrl:'build/pages/settings/settings.html',
})
export class SettingsPage {
    private storage:Storage;
    private useCache:boolean = true;
    constructor(private cacheService:CacheService,private navController:NavController) {
        this.storage = new Storage(LocalStorage);
        this.storage.get(LOCAL_STORAGE_USE_CACHE).then((value) => {
            if(value) {
                this.useCache = value;
            }
        });
    }
    onChangeCache(toggle:Toggle):void {
        this.storage.set(LOCAL_STORAGE_USE_CACHE,toggle.checked);
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
