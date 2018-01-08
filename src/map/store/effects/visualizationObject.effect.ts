import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { of } from 'rxjs/observable/of';
import { map, switchMap, catchError, combineLatest } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';

import * as visualizationObjectActions from '../actions/visualization-object.action';
import * as fromServices from '../../services';

@Injectable()
export class VisualizationObjectEffects {
  constructor(
    private actions$: Actions,
    private geofeatureService: fromServices.GeoFeatureService
  ) {}
  @Effect()
  createVisualizationObjet$ = this.actions$
    .ofType(visualizationObjectActions.CREATE_VISUALIZATION_OBJECT)
    .pipe(
      switchMap(
        (action: visualizationObjectActions.CreateVisualizationObject) => {
          const parameters = action.payload.layers.map(layer => {
            const requestParams = [
              ...layer.dataSelections.rows,
              ...layer.dataSelections.columns
            ];
            const data = requestParams.filter(
              dimension => dimension.dimension === 'ou'
            );
            let params = {};
            data.map(item => {
              let orgUnit = null,
                level = null;
              item.items.map(dimension => {
                dimension.id.indexOf('LEVEL') === -1
                  ? (orgUnit = dimension.id)
                  : (level = dimension.id);
              });
              params = {
                ...params,
                orgUnit,
                level
              };
            });
            return params;
          });
          const sources = parameters.map(param =>
            this.geofeatureService.getGeoFeatures(
              param['orgUnit'],
              param['level']
            )
          );
          return Observable.combineLatest(sources).pipe(
            map(geofeature => {
              let entity = {};
              action.payload.layers.forEach((layer, index) => {
                entity = {
                  ...entity,
                  [layer.id]: geofeature[index]
                };
              });
              const geofeatures = {
                ...action.payload.geofeatures,
                ...entity
              };
              const vizObject = {
                ...action.payload,
                geofeatures
              };
              return new visualizationObjectActions.CreateVisualizationObjectSuccess(
                vizObject
              );
            }),
            catchError(error =>
              of(
                new visualizationObjectActions.CreateVisualizationObjectFail(
                  error
                )
              )
            )
          );
        }
      )
    );
}
