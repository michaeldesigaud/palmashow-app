/**
 * Custom typings
 * Created by Michael DESIGAUD on 26/04/2016.
 */

interface Window {
    ringtone:any;
    plugins:any;
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
declare var ImgCache:ImgCache;

interface CordovaFileCache {}
declare var CordovaFileCache:CordovaFileCache;

interface CordovaPromiseFS {}
declare var CordovaPromiseFS:CordovaPromiseFS;

