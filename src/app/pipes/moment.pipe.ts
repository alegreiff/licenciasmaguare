import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
import 'moment/locale/es';

@Pipe({
  name: 'fechamoment'
})
export class MomentPipe implements PipeTransform {
  transform(value: Date|moment.Moment, ...args: any[]): any {
      let [format] = args;
      let sale: any = moment.duration(moment(value).diff(moment()));
      return `${sale.years()} años / ${sale.months()} meses / ${sale.days()}  días.`;
  }
}
