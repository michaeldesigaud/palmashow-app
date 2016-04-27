/**
 * Data service file
 * Created by Michael DESIGAUD on 20/04/2016.
 */

import {Injectable} from 'angular2/core';
import {Http,Jsonp} from 'angular2/http';
import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import {Subscription} from 'rxjs/Subscription';

const HOST:string = 'server_url';

@Injectable()
export class DataService {
    groups:Array<any>;
    users:Array<any>;
    sounds:Array<any>;
    constructor(private http:Http) {
        console.log('DataService constructor');
        this.loadData();
    }
    loadData():void {
        this.getGroups().subscribe(groups => this.groups = groups);
        this.getSounds().subscribe(sounds => this.sounds = sounds);
        this.getUsers().subscribe(users => this.users = users);
    }
    clearSounds():void {
        this.sounds = null;
    }
    clearGroups():void {
        this.groups = null;
    }
    getGroups():Observable<any> {
        if (this.groups) {
            return Observable.create((observer:Observer<any>) => {
                console.log('Get groups from cache');
                return observer.next(this.groups);
            });
        }
        return this.http.get(HOST+'?cmd=groups').map(res => res.json());
    }
    getSounds():Observable<any> {
        if (this.sounds) {
            return Observable.create((observer:Observer<any>) => {
                return observer.next(this.sounds);
            });
        }
        return this.http.get(HOST+'?cmd=sounds').map(res => res.json());
    }
    getUsers():Observable<any> {
        if (this.users) {
            return Observable.create((observer:Observer<any>) => {
                return observer.next(this.users);
            });
        }
        return this.http.get(HOST+'?cmd=users').map(res => res.json());
    }
    getUserById(id:number):any {
        return this.users.find((user:any) => user.id === id.toString());
    }
}