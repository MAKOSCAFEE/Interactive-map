import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromVisualizationObject from '../reducers/visualization-object.reducers';

export const getVisualizationObjectState = createSelector(
  fromFeature.getMapState,
  (state: fromFeature.MapState) => state.visualizationObjects
);

export const getAllVisualizationObjectsEntities = createSelector(
  getVisualizationObjectState,
  fromVisualizationObject.getVisualizationObjectsEntities
);
export const getAllVisualizationObjects = createSelector(
  getAllVisualizationObjectsEntities,
  entities => {
    return Object.keys(entities).map(id => entities[id]);
  }
);
export const isVisualizationObjectsLoading = createSelector(
  getVisualizationObjectState,
  fromVisualizationObject.getVisualizationObjectsLoading
);
export const isVisualizationObjectsLoaded = createSelector(
  getVisualizationObjectState,
  fromVisualizationObject.getVisualizationObjectsLoaded
);
