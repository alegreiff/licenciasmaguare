import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { IntlModule } from '@progress/kendo-angular-intl';
import '@progress/kendo-angular-intl/locales/es/all';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { ProtegidaComponent } from './components/protegida/protegida.component';

import { LoginComponent } from './components/login/login.component';
import { registerLocaleData } from '@angular/common';
import localeES from '@angular/common/locales/es';

registerLocaleData(localeES, 'es-CO');

//STORE

import { StoreModule } from "@ngrx/store";
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { appReducers } from './app.reducer';
import { environment } from 'src/environments/environment';
import { GridModule } from '@progress/kendo-angular-grid';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ContenidosComponent } from './components/contenidos/contenidos.component';
import { ContenidoComponent } from './components/contenidos/contenido.component';

import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { EditarComponent } from './components/licencias/editar/editar.component';
import { DialogsModule } from '@progress/kendo-angular-dialog';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { NuevaLicenciaComponent } from './components/licencias/nueva-licencia.component';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { ContactosComponent } from './components/contactos/contactos.component';
import { NuevoeditarcontactoComponent } from './components/contactos/nuevoeditarcontacto.component';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { MomentPipe } from './pipes/moment.pipe';
import { DiasPipe } from './pipes/dias.pipe';
import { PDFExportModule } from '@progress/kendo-angular-pdf-export';

import { UploadsModule } from '@progress/kendo-angular-upload';
import { LicenciaComponent } from './components/presentacion/licencia.component';
import { ClaselicenciaPipe } from './pipes/claselicencia.pipe';
import { FichacontactoComponent } from './components/presentacion/fichacontacto.component';
import { DocanexosComponent } from './components/presentacion/docanexos.component';
import { ObservacionesComponent } from './components/presentacion/observaciones.component';
import { ReporteLicenciasComponent } from './components/reportes/reportelicencias.component';
import { ExcelExportModule } from '@progress/kendo-angular-excel-export';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    ProtegidaComponent,
    ReporteLicenciasComponent,
    LoginComponent,
    ContenidosComponent,
    ContenidoComponent,
    EditarComponent,
    NuevaLicenciaComponent,
    ContactosComponent,
    NuevoeditarcontactoComponent,
    MomentPipe,
    DiasPipe,
    LicenciaComponent,
    ClaselicenciaPipe,
    FichacontactoComponent,
    DocanexosComponent,
    ObservacionesComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    StoreModule.forRoot( appReducers ),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      logOnly: environment.production, // Restrict extension to log-only mode
    }),
    GridModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    DialogsModule,
    ButtonsModule,
    DateInputsModule,
    InputsModule,
    DropDownsModule,
    IntlModule,
    LayoutModule,
    PDFExportModule,
    UploadsModule,
    ExcelExportModule

  ],
  providers: [{provide: LOCALE_ID, useValue: 'es-CO'}],
  bootstrap: [AppComponent]
})
export class AppModule { }
