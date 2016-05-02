import {App, Platform,IonicApp,LocalStorage,Storage,Alert} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {GroupsPage} from './pages/groups/groups';
import {MediaService} from './services/media.service';
import {DataService} from './services/data.service';
import {CacheService} from './services/cache.service';
import {HomePage} from './pages/home/home';
import {SettingsPage} from './pages/settings/settings';
import {NavController} from 'ionic-angular/index';
import {Type,ViewChild} from 'angular2/core';
import  * as Utils from './utils/app.utils';

import 'es6-shim';
import 'rxjs/add/operator/map';
import {SoundsPage} from "./pages/sounds/sounds";
import {LOCAL_STORAGE_BOOKMARK} from "./utils/app.utils";
import {MediaPlayer} from './components/player/media-player';

@App({
  templateUrl: 'build/app.html',
  providers:[MediaService,DataService,CacheService],
  directives:[MediaPlayer],
  config: {}
})
export class MyApp {
  @ViewChild(MediaPlayer) mediaPlayer:MediaPlayer;
  private rootPage:any;
  private pages:Array<any>;
  private storage:Storage;
  private nbBookmarked:number = 0;
  constructor(private app:IonicApp,private dataService:DataService,cacheService:CacheService,platform: Platform) {
    this.pages = [{label: 'Accueil', component: HomePage, icon: 'home'},{label: 'Paramètres', component: SettingsPage, icon: 'settings'}];

    this.initLocalStorage();

    this.dataService.initConfig(() => {
      this.loadMenuPages();
      let nav:NavController = this.app.getComponent('nav');
      this.rootPage = HomePage;
    });

    platform.ready().then(() => {
      console.log('Platform',platform);
      StatusBar.styleDefault()
    });
  }
  loadMenuPages():void {
    this.dataService.getGroups(10).subscribe((groups:Array<any>) => {
      let parentGroups:Array<any> = groups.filter(group => !group.parent_id);
      parentGroups.forEach((group) => {
        let page:Type = GroupsPage;
        if(group.sub_groups === '0') {
          page = SoundsPage;
        }
        this.pages.push({label:group.title,component:page,icon:group.iconName,params:{group:group}});
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
  openBookmarkPage():void {
    this.storage.getJson(LOCAL_STORAGE_BOOKMARK).then((ids:Array<string>) => {
      let nav:NavController = this.app.getComponent('nav');
      if(ids && $.isArray(ids) && ids.length > 0) {
        nav.setRoot(SoundsPage,{title:'Favoris',ids:ids});
      } else {
        let alert = Alert.create({
          title: 'Favoris',
          subTitle: 'Aucun favoris enregistré',
          buttons: ['Ok']
        });
        nav.present(alert);
      }
    });
    this.app.getComponent('leftMenu').close();
  }
  openPage(page:any):void {
    // navigate to the new page if it is not the current page
    this.app.getComponent('leftMenu').enable(true);
    let nav:NavController = this.app.getComponent('nav');
    if(page.params) {
      let params:any = {};
      if(page.params.group.sub_groups === '0') {
        params.group = page.params.group;
        params.title = page.params.group.title;
        params.userInfo = true;
      } else {
        params.parentGroup = page.params.group;
      }
      nav.setRoot(page.component,params);
    } else {
      nav.setRoot(page.component);
    }

    this.app.getComponent('leftMenu').close();
  }
}
