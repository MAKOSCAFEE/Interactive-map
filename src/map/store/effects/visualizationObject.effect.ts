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
          console.log(action.payload);
          return this.geofeatureService
            .getGeoFeatures('ImspTQPwCqd', 'LEVEL-2')
            .pipe(
              map(geofeatures => {
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
