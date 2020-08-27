import { Component, Input, OnInit } from '@angular/core';
import { EntradaWP } from 'src/app/models/entrada.model';
import { WordpressService } from 'src/app/servicios/wordpress.service';
import * as FileSaver from 'file-saver';


interface anejo {
  archivo: string
  descripcion: string
}

@Component({
  selector: 'anexos',
  templateUrl: './docanexos.component.html',
  styles: [
  ]
})
export class DocanexosComponent implements OnInit {
@Input() soportes: anejo[];
entradaActiva: EntradaWP;
urlbase: string;
  constructor(
    private ws: WordpressService
  ) { }

  ngOnInit(): void {
    this.urlbase = this.ws.urlBaseEnlaces;
    this.entradaActiva = this.ws.entradaactiva;

  }
  guardaarchivo(i: number){
    const ext =  this.soportes[i].archivo.split('.').pop();
    let nombre = 'licencia-'+this.entradaActiva.wpid+'-'+this.entradaActiva.titulo+'-'+this.entradaActiva.tipo+'-'+(i+1);
    nombre = nombre.replace(/[^a-z0-9]/gi, '-').toLowerCase();
    const archivo = this.urlbase+this.soportes[i].archivo;
    const nombredescarga = nombre+'.'+ext;
    console.log(archivo + ' ----  '  + nombredescarga)
    FileSaver.saveAs(archivo, nombredescarga);
  }

}
