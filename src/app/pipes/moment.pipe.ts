import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
import 'moment/locale/es';

@Pipe({
  name: 'fechamoment'
})
export class MomentPipe implements PipeTransform {
  transform(value: Date|moment.Moment, ...args: any[]): any {
      let [format] = args;
      //return moment(value).format(format);
      return moment(value).diff(moment(), 'days')
  }
}
