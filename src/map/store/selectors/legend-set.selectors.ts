import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import { LegendSet } from '../../models/legend-set.model';
import * as fromLegendSetReducers from '../reducers/legend-set.reducers';

export const getLegendSetObjectState = createSelector(
  fromFeature.getMapState,
  (state: fromFeature.MapState) => state.legendSets
);

export const getAllLegendSetObjectsEntities = createSelector(
  getLegendSetObjectState,
  fromLegendSetReducers.getLegendSetEntities
);

export const getAllLegendSetObjects = createSelector(getAllLegendSetObjectsEntities, entities => {
  return Object.keys(entities).map(id => entities[id]);
});
