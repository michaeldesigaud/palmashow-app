import {Page,NavController,Platform,Refresher} from 'ionic-angular/index';
import {GroupsPage} from '../groups/groups';
import {DataService} from '../../services/data.service';
import {CachedPage} from '../cache/cache-page';
import {CacheService} from '../../services/cache.service';

/**
 * home page component
 * Created by Michael DESIGAUD on 22/04/2016.
 */

@Page({
    templateUrl:'build/pages/home/home.html'
})
export class HomePage{
    groups:Array<any>;
    constructor(private navController:NavController,private dataService:DataService,private cacheService:CacheService){
        this.doRefresh(null,false);
    }
    doRefresh(refresher:Refresher,reload:boolean = true) {
        if(reload) {
            this.dataService.removeGroups();
        }
        this.dataService.getGroups().subscribe((groups:Array<any>) => {
            this.groups = groups.filter(group => !group.parent_id);
            if(reload) {
                refresher.complete();
            }
        });
    }
    onPageLoaded():void {
        this.cacheService.imageCacheLoaded.subscribe(() => {
            this.cacheService.cacheImages($('img'));
        });
    }
    goToGroupsPage(group:any):void {
        this.navController.push(GroupsPage,{parentGroup:group});
    }
}
