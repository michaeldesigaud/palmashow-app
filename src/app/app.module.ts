/**
 * Application main module
 * Created by michael on 21/02/17.
 */

import { NgModule } from '@angular/core';
import {Http,XHRBackend,RequestOptions} from '@angular/http';

import { PalmashowApp } from './app.component';

import { IonicApp, IonicModule } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { MediaPlayer } from '../components/player/media-player';

import { Detail } from '../pages/detail/detail';
import { DvdPage } from '../pages/dvd/dvd';
import { GroupsPage } from '../pages/groups/groups';
import { HomePage } from '../pages/home/home';
import { LyricsPage } from '../pages/lyrics/lyrics';
import { SettingsPage } from '../pages/settings/settings';
import { SoundsPage } from '../pages/sounds/sounds';

import {MediaService} from '../services/media.service';
import {DataService} from '../services/data.service';
import {CacheService} from '../services/cache.service';
import {AnalyticService} from '../services/analytics.service';

import {CachedHttp} from '../utils/cached-http';
import {StringDatePipe} from '../pipes/pipes';
import {SearchFilterPipe} from '../pipes/pipes';

@NgModule({
    declarations: [
        PalmashowApp,
        MediaPlayer,
        StringDatePipe,
        SearchFilterPipe,
        Detail,
        GroupsPage,
        HomePage,
        DvdPage,
        LyricsPage,
        SettingsPage,
        SoundsPage
    ],
    imports: [
        IonicModule.forRoot(PalmashowApp)
    ],
    exports: [
        IonicModule
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        PalmashowApp,
        Detail,
        GroupsPage,
        HomePage,
        DvdPage,
        LyricsPage,
        SettingsPage,
        SoundsPage
    ],
    providers:[Storage, MediaService,DataService,CacheService,AnalyticService,
        {
            provide: Http,
            useFactory:(xhrBackend: XHRBackend, requestOptions: RequestOptions, cacheService:CacheService) => {
                return new CachedHttp(xhrBackend, requestOptions, cacheService);
            },
            deps: [XHRBackend, RequestOptions,CacheService],
            multi:false
        }],
})
export class AppModule { }
