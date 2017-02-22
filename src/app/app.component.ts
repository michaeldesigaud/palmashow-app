/**
 * Application main component
 * Created by michael on 21/02/17.
 */

import {Platform,IonicApp,Nav,Menu,AlertController} from 'ionic-angular';
import {Storage} from '@ionic/storage';
import {StatusBar,Push} from 'ionic-native';
import {GroupsPage} from '../pages/groups/groups';
import {HomePage} from '../pages/home/home';
import {SettingsPage} from '../pages/settings/settings';
import {Type,ViewChild,Component} from '@angular/core';
import  * as Utils from '../utils/app.utils';

import * as $ from 'jquery';

import {SoundsPage} from '../pages/sounds/sounds';
import {LOCAL_STORAGE_BOOKMARK} from '../utils/app.utils';
import {MediaPlayer} from '../components/player/media-player';
import {DvdPage} from '../pages/dvd/dvd';

import {DataService} from '../services/data.service';

import 'rxjs/add/operator/map';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/toPromise';

@Component({
    templateUrl: 'app.html'
})
export class PalmashowApp {
    @ViewChild(MediaPlayer) mediaPlayer:MediaPlayer;
    @ViewChild(Nav) nav:Nav;
    @ViewChild(Menu) menu:Menu;
    private rootPage:any;
    private pages:Array<any>;
    private nbBookmarked:number = 0;
    constructor(private app:IonicApp,private dataService:DataService,private storage:Storage,
                private alertCtrl: AlertController,private platform: Platform) {
        this.pages = [{label: 'Accueil', component: HomePage, icon: 'home'}];

        this.initLocalStorage();

        this.dataService.initConfig(() => {
            this.loadMenuPages();
            this.nav.push(HomePage);
        });

        platform.ready().then(() => {
            console.log('Platform',platform);
            StatusBar.styleDefault();
            this.initPushNotification();
        });
    }
    initPushNotification(): void {

        let push = Push.init({
            android: {
                senderID: "784104879538"
            },
            ios: {
                alert: "true",
                badge: false,
                sound: "true"
            },
            windows: {}
        });

        push.on('registration', (data) => {
            console.log("device token ->", data.registrationId);
        });

        push.on('notification', (data) => {
            console.log('message', data.message);
        });

        push.on('error', (e) => {
            console.log(e.message);
        });
    }
    loadMenuPages():void {
        this.dataService.getGroups().subscribe((groups:Array<any>) => {
            let parentGroups:Array<any> = groups.filter(group => !group.parent_id);
            parentGroups.forEach((group) => {
                let page:Type<any> = GroupsPage;
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
        this.storage.get(LOCAL_STORAGE_BOOKMARK).then((data: string) => {
            let ids:Array<string> = JSON.parse(data);
            if(ids && $.isArray(ids) && ids.length > 0) {
                this.nav.setRoot(SoundsPage,{title:'Favoris',ids:ids});
            } else {
                let alert = this.alertCtrl.create({
                    title: 'Favoris',
                    subTitle: 'Aucun favoris enregistré',
                    buttons: ['Ok']
                });
                alert.present();
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
