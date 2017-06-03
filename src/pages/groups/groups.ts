/**
 * Groups page component
 * Created by Michael DESIGAUD on 19/04/2016.
 */

import {NavController,NavParams,Refresher} from 'ionic-angular';

import {ElementRef, Component} from '@angular/core';
import {SoundsPage} from '../sounds/sounds';
import {DataService} from '../../services/data.service';
import {CacheService} from '../../services/cache.service';
import {AnalyticService} from '../../services/analytics.service';

import * as $ from 'jquery';

@Component({
    templateUrl:'groups.html'
})
export class GroupsPage {
  groups:Array<any>;
  parentGroup:any;
  sliderOptions:any;
  constructor(navParams:NavParams,private navController:NavController,private dataService:DataService,
              private cacheService:CacheService,private elementRef:ElementRef,analyticService:AnalyticService) {
    this.parentGroup = navParams.get('parentGroup');
    this.getGroups(() => {});
    this.sliderOptions = {autoplay:2000,loop:true};

    if(this.parentGroup) {
      analyticService.trackView('GroupPage - '+this.parentGroup.title);
    } else {
      analyticService.trackView('GroupPage');
    }

  }
  getGroups(callback:Function,clearCache:boolean = false):void {
    this.dataService.getChildGroups(this.parentGroup.id,clearCache).subscribe((groups:Array<any>) => {
      this.groups = groups;
      this.cacheService.cacheImages($(this.elementRef.nativeElement).find('img'));
      callback();
    });
  }
  doRefresh(refresher?:Refresher) {
    this.getGroups(() => {
      if(refresher) {
        refresher.complete();
      }
    },true);
  }
  onClickBtnListen(event:Event):void {
    event.stopImmediatePropagation();
  }
  onClickListen(event:Event,group:any) {
    event.preventDefault();
    let navTransition = this.navController.push(SoundsPage,{group:group,title:group.title,userInfo:true});
    navTransition.then(() => {
      let elementRef:ElementRef = this.navController.getActive().contentRef();
      this.cacheService.cacheImages($(elementRef.nativeElement).find('img'));
    });
  }
  onSelectSlide(event:Event):void {
    event.stopImmediatePropagation();
  }
}
