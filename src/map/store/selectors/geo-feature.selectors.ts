import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromGeofeature from '../reducers/geo-feature.reducers';

export const getGeofeatureState = createSelector(
  fromFeature.getMapState,
  (state: fromFeature.MapState) => state.geoFeatures
);

export const getGeofeatures = createSelector(
  getGeofeatureState,
  fromGeofeature.getGeofeatures
);

export const isGeofeatureLoading = createSelector(
  getGeofeatureState,
  fromGeofeature.getGeofeatureLoading
);
export const isGeofeatureLoaded = createSelector(
  getGeofeatureState,
  fromGeofeature.getGeofeatureLoaded
);
