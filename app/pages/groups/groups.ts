/**
 * Groups page component
 * Created by Michael DESIGAUD on 19/04/2016.
 */

import {Page,NavController,NavParams,InfiniteScroll} from 'ionic-angular/index';
import {Http,Response} from 'angular2/http';

import {ElementRef} from 'angular2/core';
import {SoundsPage} from "../sounds/sounds";
import {DataService} from '../../services/data.service';
import {CacheService} from '../../services/cache.service';
import {SearchFilterPipe} from '../../pipes/pipes';
import * as Utils from '../../utils/app.utils';

@Page({
    templateUrl:'build/pages/groups/groups.html',
    pipes:[SearchFilterPipe]
})
export class GroupsPage {
  groups:Array<any>;
  parentGroup:any;
  constructor(navParams:NavParams,private navController:NavController,private dataService:DataService,private cacheService:CacheService,private elementRef:ElementRef) {
    this.parentGroup = navParams.get('parentGroup');
    this.getGroups(() => {});
  }
  getLimit():number {
    return this.groups && this.groups.length >= Utils.NB_GROUPS_PER_PAGE ? this.groups.length + Utils.NB_GROUPS_PER_PAGE : Utils.NB_GROUPS_PER_PAGE;
  }
  getGroups(callback:Function):void {
    this.dataService.getChildGroups(this.parentGroup.id,this.getLimit()).subscribe((groups:Array<any>) => {
      this.groups = groups;
      this.cacheService.cacheImages($(this.elementRef.nativeElement).find('img'));
      callback();
    });
  }
  doInfinite(infiniteScroll:InfiniteScroll) {
    this.getGroups(() => infiniteScroll.complete());
  }
  onClickListen(event:Event,group:any) {
    event.preventDefault();
    let navTransition = this.navController.push(SoundsPage,{group:group,title:group.title,userInfo:true});
    navTransition.then(() => {
      let elementRef:ElementRef = this.navController.getActive().contentRef();
      this.cacheService.cacheImages($(elementRef.nativeElement).find('img'));
    });
  }
}