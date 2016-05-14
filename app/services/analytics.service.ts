/**
 * Analytic service
 * Created by Michael DESIGAUD on 13/05/2016.
 */
import {Injectable} from 'angular2/core';
import {Platform} from 'ionic-angular/index';
import * as Utils from '../utils/app.utils';

@Injectable()
export class AnalyticService {
    constructor(private platform:Platform) {
        platform.ready().then(() => {
            if(window.analytics) {
                window.analytics.startTrackerWithId(Utils.GOOGLE_ANALYTICS_UAID);
            }
        });
    }
    trackView(screenName:string):void {
        this.platform.ready().then(() => {
            if(window.analytics) {
                window.analytics.trackView(screenName);
            }
        });
    }
    trackEvent(category:string,action:string):void {
        this.platform.ready().then(() => {
            if(window.analytics) {
                window.analytics.trackEvent(category, action);
            }
        });
    }
}
