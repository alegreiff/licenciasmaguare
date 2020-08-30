import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContactosComponent } from './components/contactos/contactos.component';
import { ContenidoComponent } from './components/contenidos/contenido.component';
import { ContenidosComponent } from './components/contenidos/contenidos.component';
import { HomeComponent } from './components/home/home.component';
import { EditarComponent } from './components/licencias/editar/editar.component';
import { LoginComponent } from './components/login/login.component';
import { PreciosComponent } from './components/precios/precios.component';
import { ProtegidaComponent } from './components/protegida/protegida.component';
import { AuthGuard } from './servicios/auth.guard';


const routes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'contenidos', component: ContenidosComponent, canActivate: [ AuthGuard ]},
  { path: 'contenido/:id', component: ContenidoComponent, canActivate: [ AuthGuard ] },
  { path: 'licencia/:licenciaId', component: EditarComponent, canActivate: [ AuthGuard ] },
  { path: 'reportelicencias', component: PreciosComponent, canActivate: [ AuthGuard ]},
  { path: 'contactos', component: ContactosComponent, canActivate: [ AuthGuard ]},
  { path: 'protegida', component: ProtegidaComponent, canActivate: [ AuthGuard ]},
  { path: 'ingreso', component: LoginComponent},
  { path: '**', pathMatch: 'full', redirectTo: ''},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
