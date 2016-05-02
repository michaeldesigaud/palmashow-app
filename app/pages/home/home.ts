import {Page,NavController,Platform,InfiniteScroll,Events} from 'ionic-angular/index';
import {GroupsPage} from '../groups/groups';
import {DataService} from '../../services/data.service';
import {CacheService} from '../../services/cache.service';
import {ElementRef,Type} from 'angular2/core';
import * as Utils from '../../utils/app.utils';
import {SoundsPage} from "../sounds/sounds";

/**
 * home page component
 * Created by Michael DESIGAUD on 22/04/2016.
 */

@Page({
    templateUrl:'build/pages/home/home.html'
})
export class HomePage {
    groups:Array<any>;
    constructor(private navController:NavController,private dataService:DataService,private cacheService:CacheService,private events:Events,private elementRef:ElementRef){
        this.getGroups(() => {});
    }
    doInfinite(infiniteScroll:InfiniteScroll) {
        this.getGroups(() => infiniteScroll.complete());
    }
    getLimit():number {
        return this.groups && this.groups.length === Utils.NB_GROUPS_PER_PAGE ? this.groups.length + Utils.NB_GROUPS_PER_PAGE : Utils.NB_GROUPS_PER_PAGE;
    }
    getGroups(callback:Function):void {
        this.dataService.getGroups(this.getLimit()).subscribe((groups:Array<any>) => {
            this.groups = groups;
            callback();
        });
    }
    getImages():any {
        return $(this.elementRef.nativeElement).find('img');
    }
    onPageLoaded():void {
        this.events.subscribe(Utils.EVENT_CACHE_IMAGE_LOADED,() => this.cacheService.cacheImages(this.getImages()));
    }
    goToGroupsPage(group:any):void {
        let page:Type = GroupsPage;
        let params:any = {};
        if(group.sub_groups === '0') {
            page = SoundsPage;
            params.group = group;
            params.title = group.title;
            params.userInfo = true;
        } else {
            params.parentGroup = group;
        }
        let navTransition = this.navController.push(page,params);
        navTransition.then(() => {
            let elementRef:ElementRef = this.navController.getActive().contentRef();
            this.cacheService.cacheImages($(elementRef.nativeElement).find('img'));
        });
    }
}
