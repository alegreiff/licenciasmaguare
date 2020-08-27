import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'claselicencia'
})
export class ClaselicenciaPipe implements PipeTransform {

  transform(value: Date|moment.Moment[]): unknown {

    const hoy = moment()

    if(!value[1]){
      return 'indef';
    }else{
    const inicio = moment(value[0].toDate());
    const final = moment(value[1].toDate());

    if(final.diff(hoy, 'days') < 1){
      return 'venci'
    }else{
      return 'vigen'
    }


    }
  }

}
