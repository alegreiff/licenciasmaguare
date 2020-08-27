import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
import 'moment/locale/es';
@Pipe({
  name: 'titulolicencia'
})
export class DiasPipe implements PipeTransform {

  transform(value: Date|moment.Moment[]): unknown {

    const hoy = moment()
    const inicio = moment(value[0].toDate());
    //console.log(inicio, final, hoy)

    if(!value[1]){
      return 'Indefinida (desde ' + inicio.format('MMMM d, yy') + ')';
      //return 'Indefinida '
    }else{

    const final = moment(value[1].toDate());
    //console.log("DURACIÓN", (final.diff(inicio, 'days')))
    //console.log("HOY MENOS FINAL", (final.diff(hoy, 'days')))
    if(final.diff(hoy, 'days') < 1){
      return 'Vencida hace ' + this.fechaformateada(final)
    }else{
      return 'Vigente. Quedan ' + this.fechaformateada(final);
    }


    }

  }

  fechaformateada(final: any){
    let sale: any = moment.duration(moment(final).diff(moment()));
    return `${sale.years()} años ${sale.months()} meses ${sale.days()}  días`;
  }
}

//let sale: any = moment.duration(moment(value).diff(moment()));
//return `${sale.years()} años / ${sale.months()} meses / ${sale.days()}  días.`;
