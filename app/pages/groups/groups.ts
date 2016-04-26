/**
 * Home page component
 * Created by Michael DESIGAUD on 19/04/2016.
 */

import {Page,NavController,NavParams,Platform} from 'ionic-angular/index';
import {Http,Response} from 'angular2/http';

import {NgZone} from 'angular2/core';
import {SoundsPage} from "../sounds/sounds";
import {DataService} from '../../services/data.service';
import {CacheService} from '../../services/cache.service';
import {CachedPage} from '../cache/cache-page';

@Page({
    templateUrl:'build/pages/groups/groups.html'
})
export class GroupsPage extends CachedPage {
  groups:Array<any>;
  parentGroup:any;
  constructor(navParams:NavParams,private navController:NavController,private dataService:DataService,cacheService:CacheService,platform:Platform) {
    super(platform,cacheService);
    this.parentGroup = navParams.get('parentGroup');
    dataService.getGroups().subscribe((groups:Array<any>) => {
      this.groups = groups.filter(group => group.parent_id === this.parentGroup.id);
    });
  }
  onClickListen(event:Event,group:any) {
    event.preventDefault();
    let sounds:Array<any> = this.dataService.getSoundsByGroup(group);
    this.navController.push(SoundsPage,{sounds:sounds,title:group.title,userInfo:true});
  }
}