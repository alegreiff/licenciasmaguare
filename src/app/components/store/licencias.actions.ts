import { createAction, props } from '@ngrx/store';
import { LicenciaContenido } from 'src/app/models/contenido.model';

export const setLicencias = createAction(
  '[Licencias] Set Licencias',
  props<{ licencias: LicenciaContenido[]}>()

  );
