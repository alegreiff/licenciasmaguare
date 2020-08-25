//reducer global
import { ActionReducerMap } from '@ngrx/store';
import * as ingresoEgreso from "./components/store/datos.reducer";
import * as licencias from './components/store/licencias.reducer';
import * as contactos from './components/store/contactos.reducer'


export interface AppState {
   ingresosEgresos: ingresoEgreso.State,
   licencias: licencias.State,
  contactos: contactos.State
}



export const appReducers: ActionReducerMap<AppState> = {
   ingresosEgresos: ingresoEgreso.ingresoEgresoReducer,
   licencias: licencias.licenciasReducer,
  contactos: contactos.contactosReducer
}
