import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { of } from 'rxjs/observable/of';
import { map, switchMap, catchError } from 'rxjs/operators';

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
          return this.geofeatureService
            .getGeoFeatures('ImspTQPwCqd', 'LEVEL-2')
            .pipe(
              map(geofeature => {
                const geofeatures = {
                  ...action.payload.geofeatures,
                  [action.payload.layers[0].id]: geofeature
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
