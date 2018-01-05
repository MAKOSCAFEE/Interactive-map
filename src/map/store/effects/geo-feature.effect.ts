import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { of } from 'rxjs/observable/of';
import { map, switchMap, catchError, tap, flatMap } from 'rxjs/operators';

import * as geofeatureActions from '../actions/geo-features.action';
import * as fromServices from '../../services';
import * as visualizationObjectActions from '../actions/visualization-object.action';

@Injectable()
export class GeoFeatureEffects {
  constructor(
    private actions$: Actions,
    private geofeatureService: fromServices.GeoFeatureService
  ) {}

  @Effect()
  loadGeofeature$ = this.actions$
    .ofType(geofeatureActions.LOAD_GEOFEATURE)
    .pipe(
      switchMap((action: geofeatureActions.LoadGeoFeature) => {
        const { visualizationObject } = action.payload;
        const ou = 'ImspTQPwCqd',
          level = 'LEVEL-2';
        return this.geofeatureService
          .getGeoFeatures('ImspTQPwCqd', 'LEVEL-2')
          .pipe(
            map(geofeatures => {
              const id = visualizationObject.mapConfiguration.id;
              const payload = {
                id,
                geofeatures
              };
              return new visualizationObjectActions.AddGeoFeaturesVizObj(
                payload
              );
            }),
            catchError(error =>
              of(new geofeatureActions.LoadGeoFeatureFail(error))
            )
          );
      })
    );
}
