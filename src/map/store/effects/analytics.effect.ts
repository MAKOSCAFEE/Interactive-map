import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { of } from 'rxjs/observable/of';
import { map, switchMap, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';

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
          const layersParams = action.payload.layers.map(layer => {
            const requestParams = [
              ...layer.dataSelections.rows,
              ...layer.dataSelections.columns,
              ...layer.dataSelections.filters
            ];
            return requestParams
              .map((param, paramIndex) => {
                return `dimension=${param.dimension}:${param.items
                  .map(item => item.id)
                  .join(';')}`;
              })
              .join('&');
          });
          const sources = layersParams.map(param =>
            this.analyticsService.getAnalytics(param)
          );

          return Observable.combineLatest(sources).pipe(
            map(analytics => {
              const vizObject = {
                ...action.payload,
                analytics: analytics[0]
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
