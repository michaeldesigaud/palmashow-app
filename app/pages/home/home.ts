import {Page,NavController,Platform} from 'ionic-angular/index';
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
        dataService.getGroups().subscribe((groups:Array<any>) => this.groups = groups.filter(group => !group.parent_id));
    }
    onPageLoaded():void {
        this.cacheService.cacheLoaded.subscribe(() => {
            this.cacheService.cacheImages($('img'));
        });
    }
    goToGroupsPage(group:any):void {
        this.navController.push(GroupsPage,{parentGroup:group});
    }
}
