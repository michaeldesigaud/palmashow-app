import {App, Platform,IonicApp,LocalStorage,Storage} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {GroupsPage} from './pages/groups/groups';
import {MediaService} from './services/media.service';
import {DataService} from './services/data.service';
import {CacheService} from './services/cache.service';
import {HomePage} from './pages/home/home';
import {SettingsPage} from './pages/settings/settings';
import {NavController} from 'ionic-angular/index';
import {Type} from 'angular2/core';
import  * as Utils from './utils/app.utils';

import 'es6-shim';
import 'rxjs/add/operator/map';

@App({
  templateUrl: 'build/app.html',
  providers:[MediaService,DataService,CacheService],
  config: {}
})
export class MyApp {
  private rootPage:any = HomePage;
  private pages:Array<any>;
  private storage:Storage;
  constructor(private app:IonicApp,private dataService:DataService,cacheService:CacheService,platform: Platform) {
    this.pages = [{label: 'Accueil', component: HomePage, icon: 'home'},{label: 'Paramètres', component: SettingsPage, icon: 'settings'}];

    this.initLocalStorage();

    platform.ready().then(() => {
      StatusBar.styleDefault();
      this.loadMenuPages();
    });
  }
  loadMenuPages():void {
    this.dataService.getGroups(10).subscribe((groups:Array<any>) => {
      let parentGroups:Array<any> = groups.filter(group => !group.parent_id);
      parentGroups.forEach((group) => {
        this.pages.push({label:group.title,component:GroupsPage,icon:group.iconName,params:{group:group}});
      });
    });
  }
  initLocalStorage():void {
    this.storage = new Storage(LocalStorage);

    this.storage.get(Utils.LOCAL_STORAGE_USE_CACHE_SOUND).then((value) => {
      if(!value) {
        this.storage.set(Utils.LOCAL_STORAGE_USE_CACHE_SOUND,true);
      }
    });

    this.storage.get(Utils.LOCAL_STORAGE_USE_CACHE_IMAGE).then((value) => {
      if(!value) {
        this.storage.set(Utils.LOCAL_STORAGE_USE_CACHE_IMAGE,true);
      }
    });
  }
  openPage(page:any):void {
    // navigate to the new page if it is not the current page
    this.app.getComponent('leftMenu').enable(true);
    let nav:NavController = this.app.getComponent('nav');
    if(page.params) {
      nav.setRoot(page.component,{parentGroup:page.params.group});
    } else {
      nav.setRoot(page.component);
    }

    this.app.getComponent('leftMenu').close();
  }
}
