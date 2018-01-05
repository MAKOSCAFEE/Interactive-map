import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { of } from 'rxjs/observable/of';
import { map, switchMap, catchError } from 'rxjs/operators';

import * as visualizationObjectActions from '../actions/visualization-object.action';
import * as layersActions from '../actions/layers.action';
import * as fromServices from '../../services';

@Injectable()
export class AnalyticsEffects {
  constructor(
    private actions$: Actions,
    private analyticsService: fromServices.AnalyticsService
  ) {}

  @Effect()
  addAnalytics$ = this.actions$
    .ofType(visualizationObjectActions.CREATE_VISUALIZATION_OBJECT_SUCCESS)
    .pipe(
      switchMap(
        (
          action: visualizationObjectActions.CreateVisualizationObjectSuccess
        ) => {
          return this.analyticsService
            .getMapAnalytics(
              ['dimension=ou:ImspTQPwCqd;LEVEL-3', 'dimension=dx:c8fABiNpT0B'],
              ['filter=pe:THIS_YEAR']
            )
            .pipe(
              map(analytics => {
                const vizObject = {
                  ...action.payload,
                  analytics
                };
                return new visualizationObjectActions.UpdateVisualizationObjectSuccess(
                  vizObject
                );
              }),
              catchError(error =>
                of(
                  new visualizationObjectActions.UpdateVisualizationObjectFail(
                    error
                  )
                )
              )
            );
        }
      )
    );
}
