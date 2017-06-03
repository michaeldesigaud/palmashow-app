/**
 * Dvd page component
 * Created by Michael DESIGAUD on 14/05/2016.
 */

import {Refresher} from 'ionic-angular';
import {DataService} from '../../services/data.service';
import {CacheService} from '../../services/cache.service';
import {ElementRef, Component} from '@angular/core';

import * as $ from 'jquery';

@Component({
    templateUrl:'dvd.html'
})
export class DvdPage {
    dvds:Array<any>;
    constructor(private dataService:DataService,private cacheService:CacheService,private elementRef:ElementRef) {
       this.getDvds(() => {});
    }
    getDvds(callback:Function,clearCache:boolean = false):void {
        this.dataService.getDvd(clearCache).subscribe((dvds:Array<any>) => {
            this.dvds = dvds;
            this.cacheService.cacheImages($(this.elementRef.nativeElement).find('img'));
            callback();
        });
    }
    onClickDvd(event:Event,dvd:any):void {
        event.preventDefault();
        window.open(dvd.link,'_blank');
    }
    doRefresh(refresher?:Refresher) {
        this.getDvds(() => {
            if(refresher) {
                refresher.complete();
            }
        },true);
    }
}
