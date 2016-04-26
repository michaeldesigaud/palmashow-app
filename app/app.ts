import {App, Platform,IonicApp} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {GroupsPage} from './pages/groups/groups';
import {MediaService} from './services/media.service';
import {DataService} from './services/data.service';
import {CacheService} from './services/cache.service';
import {HomePage} from './pages/home/home';
import {NavController} from 'ionic-angular/index';

import 'es6-shim';
import 'rxjs/add/operator/map';

@App({
  templateUrl: 'build/app.html',
  providers:[MediaService,DataService,CacheService],
  config: {}
})
export class MyApp {
  rootPage: any = HomePage;
  pages:Array<any>;
  constructor(private app:IonicApp,dataService:DataService,cacheService:CacheService,platform: Platform) {

    this.pages = [
      {label: 'Accueil', component: HomePage, icon: 'home'},
      {label: 'Les personnages', component: GroupsPage, icon: 'person'}
    ];

    /*dataService.getGroups().subscribe((groups:Array<any>) => {
      let parentGroups:Array<any> = groups.filter(group => !group.parent_id);
      parentGroups.forEach((group) => )
    });*/

    platform.ready().then(() => {
      StatusBar.styleDefault();
    });
  }
  openPage(page:any):void {
    // navigate to the new page if it is not the current page
    this.app.getComponent('leftMenu').enable(true);
    let nav:NavController = this.app.getComponent('nav');
    nav.setRoot(page.component);
    this.app.getComponent('leftMenu').close();
  }
}
