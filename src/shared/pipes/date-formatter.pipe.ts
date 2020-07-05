import { Pipe, PipeTransform } from '@angular/core';

declare var moment;

@Pipe({
  name: 'dateFormatter'
})
export class DateFormatterPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if(value == null){
      return '';
    }
   
    return moment(value).format(args);    
  }

}
