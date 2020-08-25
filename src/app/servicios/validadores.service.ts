import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidadoresService {

  constructor() { }

  /* noHerrera(control: FormControl): {[s: string]: boolean}{

  } */




  controlSeleccion(control: FormControl): {[s: string]: boolean}{
    if(control.value){
      //if(control.value.value && control.value.value.length>2){
      if(control.value.value?.length>2){
        return null
      }else{
        return { ValidarSelect: true };
      }
    }else{
      return { ValidarSelect: true };
    }
  }
}
