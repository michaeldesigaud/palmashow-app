/**
 * StringDate pipe
 * Created by Michael DESIGAUD on 27/04/2016.
 */
import {Pipe, PipeTransform} from 'angular2/core';
import {DatePipe} from 'angular2/common';

@Pipe({
    name: 'stringDate'
})
export class StringDatePipe implements PipeTransform {
    transform(value: string, args: any[]) {
        if(value) {
            return moment(new Date(value)).format('DD/MM/YYYY').toString();
        }
        return;
    }
}

@Pipe({ name: 'searchFilter',  pure: false })
export class SearchFilterPipe implements PipeTransform {
    transform(value: Array<any>, args: string[] = null): any {
        let filter:any = args[0];
        if (filter && $.isArray(value)) {

            let allUndefined:boolean = true;
            Object.keys(filter).forEach((key:string) => {
                if(filter[key]) {
                    allUndefined = false;
                }
            });

            if(allUndefined) {
                return value;
            }

            return value.filter((item:any) => {
                let valid:boolean = false;
                Object.keys(filter).forEach((key:string) => {
                    if(item[key] && item[key].toLowerCase().indexOf(filter[key].toLowerCase()) !== -1) {
                        valid = true;
                    }
                });
                return valid;
            });
        } else {
            return value;
        }
    }
}
