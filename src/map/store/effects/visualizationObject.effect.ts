import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { of } from 'rxjs/observable/of';
import { map, switchMap, catchError } from 'rxjs/operators';

import * as visualizationObjectActions from '../actions/visualization-object.action';
import * as fromServices from '../../services';

@Injectable()
export class VisualizationObjectEffects {
  constructor(private actions$: Actions) {}
  @Effect()
  createVisualizationObjet$ = this.actions$
    .ofType(visualizationObjectActions.CREATE_VISUALIZATION_OBJECT)
    .pipe(
      map(
        (action: visualizationObjectActions.CreateVisualizationObject) =>
          new visualizationObjectActions.CreateVisualizationObjectSuccess(
            action.payload
          )
      ),
      catchError(error =>
        of(new visualizationObjectActions.CreateVisualizationObjectFail(error))
      )
    );
}
