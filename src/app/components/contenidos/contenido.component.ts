import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AngularFirestore } from 'angularfire2/firestore';
import { map } from 'rxjs/operators';
import { AppState } from 'src/app/app.reducer';
import { LicenciaContenido, EstadoContenido, FormaAdquisicion } from 'src/app/models/contenido.model';
import { EntradaWP } from 'src/app/models/entrada.model';
import { WordpressService } from 'src/app/servicios/wordpress.service';

@Component({
  selector: 'app-contenido',
  templateUrl: './contenido.component.html',
  styles: [
  ]
})
export class ContenidoComponent implements OnInit {
imagen: string;
contenido: LicenciaContenido;
entradawp: EntradaWP
licencias: LicenciaContenido[];
existeEnLicencias: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private wp: WordpressService,
    private db: AngularFirestore,
    private store: Store<AppState>,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.wp.entradaactiva = null
    this.store.select('licencias').subscribe( ({licencias}) => {
      this.licencias = licencias
    } )
    this.route.params.subscribe((e: any) => {
      console.log("RUTA ID ===>", e.id)
      this.wp.cargarPost(e.id).pipe(
        map((entrada: EntradaWP) => {
          console.log("LA ENTRADA", entrada)
          return {
            creado: entrada.creado,
            img: entrada.img,
            guid: entrada.guid,
            titulo: entrada.titulo,
            status: entrada.status,
            wpid: entrada.wpid,
            descripcion: entrada.descripcion,
            interprete_autor: entrada.interprete_autor,
            tipo: entrada.tipo,
            seccion: entrada.seccion
          }
        })
      )
      .subscribe( (res: EntradaWP) => {
        this.entradawp = res;
        this.wp.entradaactiva = res;
        if(this.licencias){

          this.existeEnLicencias = this.licencias.some(licencia => licencia.wpid == e.id);

        }
        if(this.existeEnLicencias){
          console.log("SI TIENE LICENCIA", this.existeEnLicencias)
          this.editarlicencia()
        }else{
          console.log("NOO TIENE LICENCIA", this.existeEnLicencias)
          this.creacontenido()
        }
      })
    })

  }

  creacontenido(){
  this.contenido = {
    wpid: this.entradawp.wpid,
    titulo: this.entradawp.titulo,
    estado: EstadoContenido[this.entradawp.status],
    tipo: this.entradawp.tipo,
    licencia: [
    ]
  }
  this.entradawp.firebase = true
  console.info(this.contenido)
  this.db.collection('licencias').add(this.contenido)
  .then(res => {
    this.router.navigate(['/licencia', res.id])
  })
  }
  editarlicencia(){
    const id = (this.licencias.find(licencia => licencia.wpid === this.entradawp.wpid)).id
    console.log(id)
    this.router.navigate(['/licencia', id])
  }

}
