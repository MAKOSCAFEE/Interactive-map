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
            const noAnalyticsLayers = [
              'boundary',
              'facility',
              'external',
              'event'
            ];
            const layerName = layer.layer;
            if (noAnalyticsLayers.indexOf(layerName) === -1) {
              return requestParams
                .map((param, paramIndex) => {
                  return `dimension=${param.dimension}:${param.items
                    .map(item => item.id)
                    .join(';')}`;
                })
                .join('&');
            }

            if (layerName === 'event') {
              const data = requestParams
                .map((param, paramIndex) => {
                  const dimension = `dimension=${param.dimension}`;
                  if (param.items.length) {
                    return `${dimension}:${param.items
                      .map(item => item.id)
                      .join(';')}`;
                  }
                  return dimension;
                })
                .join('&');
              let url = `/events/query/${
                layer.dataSelections.program.id
              }.json?stage=${layer.dataSelections.programStage.id}&${data}`;
              if (layer.dataSelections.endDate) {
                url += `&endDate=${layer.dataSelections.endDate.split('T')[0]}`;
              }
              if (layer.dataSelections.startDate) {
                url += `&startDate=${
                  layer.dataSelections.startDate.split('T')[0]
                }`;
              }
              return url;
            }
          });
          const sources =
            layersParams.length && layersParams[0]
              ? layersParams.map(param => {
                  if (param.startsWith('/events')) {
                    return this.analyticsService.getEventsAnalytics(param);
                  }
                  return this.analyticsService.getAnalytics(param);
                })
              : Observable.create([]);

          return Observable.combineLatest(sources).pipe(
            map(data => {
              const analytics = data.length ? data[0] : [];
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
