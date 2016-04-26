/**
 * Utility classes
 * Created by Michael DESIGAUD on 20/04/2016.
 */

export class PathUtils {
    static getAbsolutePath(filePath:string):string {
        let path:string = window.location.pathname;
        path = path.substr(path, path.length - 10);

        return path+'sounds/'+filePath;
    }
}