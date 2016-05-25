import {App, Platform,IonicApp,LocalStorage,Storage,Alert,NavController,Nav,Menu} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {GroupsPage} from './pages/groups/groups';
import {MediaService} from './services/media.service';
import {DataService} from './services/data.service';
import {CacheService} from './services/cache.service';
import {AnalyticService} from './services/analytics.service';
import {HomePage} from './pages/home/home';
import {SettingsPage} from './pages/settings/settings';
import {Type,ViewChild,provide} from '@angular/core';
import  * as Utils from './utils/app.utils';

import {SoundsPage} from './pages/sounds/sounds';
import {LOCAL_STORAGE_BOOKMARK} from './utils/app.utils';
import {MediaPlayer} from './components/player/media-player';
import {Http,XHRBackend,RequestOptions} from '@angular/http';
import {CachedHttp} from './utils/cached-http';
import {DvdPage} from './pages/dvd/dvd';

import 'es6-shim';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/toPromise';

@App({
  templateUrl: 'build/app.html',
  providers:[MediaService,DataService,CacheService,AnalyticService,
    provide(Http,{
      useFactory:(xhrBackend: XHRBackend, requestOptions: RequestOptions, cacheService:CacheService) => {
        return new CachedHttp(xhrBackend, requestOptions, cacheService);
      },
      deps: [XHRBackend, RequestOptions,CacheService],
      multi:false
    })],
  directives:[MediaPlayer],
  config: {}
})
export class MyApp {
  @ViewChild(MediaPlayer) mediaPlayer:MediaPlayer;
  @ViewChild(Nav) nav:Nav;
  @ViewChild(Menu) menu:Menu;
  private rootPage:any;
  private pages:Array<any>;
  private storage:Storage;
  private nbBookmarked:number = 0;
  constructor(private app:IonicApp,private dataService:DataService,cacheService:CacheService,platform: Platform) {
    this.pages = [{label: 'Accueil', component: HomePage, icon: 'home'}];

    this.initLocalStorage();

    this.dataService.initConfig(() => {
      this.loadMenuPages();
      this.rootPage = HomePage;
    });

    platform.ready().then(() => {
      console.log('Platform',platform);
      StatusBar.styleDefault();
    });
  }
  loadMenuPages():void {
    this.dataService.getGroups().subscribe((groups:Array<any>) => {
      let parentGroups:Array<any> = groups.filter(group => !group.parent_id);
      parentGroups.forEach((group) => {
        let page:Type = GroupsPage;
        if(group.sub_groups === '0') {
          page = SoundsPage;
        }
        this.pages.push({label:group.title,component:page,icon:group.iconName,params:{group:group}});
      });
      this.pages.push({label: 'Paramètres', component: SettingsPage, icon: 'settings'});
      this.pages.push({label:'Les dvd',component:DvdPage,icon:'disc'});
      this.pages.push({label:'Youtube',component:'https://www.youtube.com/user/Palmashow',icon:'videocam',redirect:true});
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
      if(ids && $.isArray(ids) && ids.length > 0) {
        this.nav.setRoot(SoundsPage,{title:'Favoris',ids:ids});
      } else {
        let alert = Alert.create({
          title: 'Favoris',
          subTitle: 'Aucun favoris enregistré',
          buttons: ['Ok']
        });
        this.nav.present(alert);
      }
    });
    this.menu.close();
  }
  openPage(page:any):void {
    // navigate to the new page if it is not the current page
    this.menu.enable(true);
    if(page.params) {
      let params:any = {};
      if(page.params.group.sub_groups === '0') {
        params.group = page.params.group;
        params.title = page.params.group.title;
        params.userInfo = true;
      } else {
        params.parentGroup = page.params.group;
      }
      this.nav.setRoot(page.component,params);
    } else {
      if(page.redirect) {
        window.open(page.component,'_blank');
      } else {
        this.nav.setRoot(page.component);
      }
    }

    this.menu.close();
  }
}
