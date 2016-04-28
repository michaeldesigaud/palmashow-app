import {Page,NavController,Platform,InfiniteScroll,Events} from 'ionic-angular/index';
import {GroupsPage} from '../groups/groups';
import {DataService,NB_GROUPS_PER_PAGE} from '../../services/data.service';
import {CachedPage} from '../cache/cache-page';
import {CacheService,EVENT_CACHE_IMAGE_LOADED} from '../../services/cache.service';
import {ElementRef} from 'angular2/core';

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
        return this.groups && this.groups.length === NB_GROUPS_PER_PAGE ? this.groups.length + NB_GROUPS_PER_PAGE : NB_GROUPS_PER_PAGE;
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
        this.events.subscribe(EVENT_CACHE_IMAGE_LOADED,() => this.cacheService.cacheImages(this.getImages()));
    }
    goToGroupsPage(group:any):void {
        let navTransition = this.navController.push(GroupsPage,{parentGroup:group});
        navTransition.then(() => {
            let elementRef:ElementRef = this.navController.getActive().contentRef();
            this.cacheService.cacheImages($(elementRef.nativeElement).find('img'));
        });
    }
}
