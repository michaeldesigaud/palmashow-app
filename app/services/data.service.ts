/**
 * Data service file
 * Created by Michael DESIGAUD on 20/04/2016.
 */

import {Injectable} from 'angular2/core';
import {Http,Jsonp} from 'angular2/http';
import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import {Subscription} from 'rxjs/Subscription';

export const NB_GROUPS_PER_PAGE:number = 2;
export const NB_SOUNDS_PER_PAGE:number = 10;

const HOST:string = 'server_url';

@Injectable()
export class DataService {
    users:Array<any>;
    constructor(private http:Http) {
        console.log('DataService constructor');
        this.loadData();
    }
    loadData():void {
        this.getUsers().subscribe(users => this.users = users);
    }
    getChildGroups(parentId:string,limit:number):Observable<any> {
        return this.http.get(HOST+'?cmd=childGroups&parent_id='+parentId+'&limit='+limit).map(res => res.json());
    }
    getGroups(limit:number):Observable<any> {
        return this.http.get(HOST+'?cmd=parentGroups&limit='+limit).map(res => res.json());
    }
    getSounds(groupId:string,limit:number):Observable<any> {
        return this.http.get(HOST+'?cmd=sounds&group_id='+groupId+'&limit='+limit).map(res => res.json());
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