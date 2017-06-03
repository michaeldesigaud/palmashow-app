/**
 * Custom typings
 * Created by Michael DESIGAUD on 26/04/2016.
 */

interface Window {
    ringtone:any;
    plugins:any;
    analytics:any;
    resolveLocalFileSystemURL(uri:string,success:Function,error?:Function):void;
}

interface Cordova {
    file:any;
}

interface Navigator {
    webkitPersistentStorage:any;
}

interface ImgCache {
    options:any;
    init(success:Function,error:Function):void;
    isCached(src:string,func:Function):void;
    useCachedFile(target:any):void;
    cacheFile(src:string,func:Function):void;
    clearCache(success:Function,error?:Function):void;
}
declare let ImgCache:ImgCache;

interface CordovaFileCache {
    new (args:any): any;
}
declare let CordovaFileCache:CordovaFileCache;

interface CordovaPromiseFS {
    new (args:any): any;
}
declare let CordovaPromiseFS:CordovaPromiseFS;

declare let cordova: Cordova;

