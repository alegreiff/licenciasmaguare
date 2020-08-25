import { createReducer, on } from '@ngrx/store';
import { LicenciaContenido } from 'src/app/models/contenido.model';
import { setLicencias } from './licencias.actions';

export interface State {
    licencias: LicenciaContenido[];
}

export const initialState: State = {
   licencias: [],
}

const _licenciasReducer = createReducer(initialState,

    on(setLicencias, (state, { licencias }) => ({

      ...state, licencias: [ ...licencias]
    })),

);

export function licenciasReducer(state, action) {
    return _licenciasReducer(state, action);
}
