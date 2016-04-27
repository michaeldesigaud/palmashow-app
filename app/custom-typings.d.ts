/**
 * Custom typings
 * Created by Michael DESIGAUD on 26/04/2016.
 */
interface ImgCache {
    options:any;
    init(success:Function,error:Function):void;
    isCached(src:string,func:Function);
    useCachedFile(target:any);
    cacheFile(src:string,func:Function);
}
declare var ImgCache:ImgCache;

interface CordovaFileCache {}
declare var CordovaFileCache:CordovaFileCache;

interface CordovaPromiseFS {}
declare var CordovaPromiseFS:CordovaPromiseFS;

