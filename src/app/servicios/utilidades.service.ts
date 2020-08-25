import { Injectable } from '@angular/core';
import { exit } from 'process';

@Injectable({
  providedIn: 'root'
})
export class UtilidadesService {

  constructor() { }

    enumToSelect(elementos: any[], etiqueta: string) : any[] {
      let defaultItem: { text: string, value: string } = { text: etiqueta + '...', value: null };
      let listItems: Array<{ text: string, value: string }> = [];
      for (let item of elementos){
        listItems.push({text: item, value: item})
      }
      return [defaultItem, listItems];

    }

    enumToSelectComplejo(elementos: any[], etiqueta: string) : any[] {

      let defaultItem: { text: string, value: string } = { text: etiqueta + '...', value: null };
      let listItems: Array<{ text: string, value: string }> = [];
      for (let item of elementos){
        listItems.push({text: (item.nombres + ' - ' + item.apellidos), value: item.id})
      }
      console.log(listItems)
      return [defaultItem, listItems];

    }
}