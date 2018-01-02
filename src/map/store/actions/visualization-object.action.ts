import { Action } from '@ngrx/store';

import { VisualizationObject } from '../../models/visualization-object.model';

export const ADD_VISUALIZATION_OBJECT = '[Map] Add visualization object';
export const UPDATE_VISUALIZATION_OBJECT = '[Map] Update visualization object';
export const ADD_LAYER = '[Map] Add Layer to visualization object';
export const REMOVE_LAYER = '[Map] Remove Layer from visualization object';
export const HIDE_LAYER = '[Map] Hide Layer';
export const LOAD_VISUALIZATION_OBJECT = '[Map] Load visualization object';

export class AddVisualizationObject implements Action {
  readonly type = ADD_VISUALIZATION_OBJECT;
  constructor(public payload: VisualizationObject) {}
}

export class UpdateVisualizationObject implements Action {
  readonly type = UPDATE_VISUALIZATION_OBJECT;
  constructor(public payload: VisualizationObject) {}
}

export class AddLayerVizObj implements Action {
  readonly type = ADD_LAYER;
  constructor(public payload: any) {}
}

export class RemoveLayerVizObj implements Action {
  readonly type = REMOVE_LAYER;
  constructor(public payload: any) {}
}

export class HideLayerVizObj implements Action {
  readonly type = HIDE_LAYER;
  constructor(public payload: any) {}
}

export class LoadVisualizationObject implements Action {
  readonly type = LOAD_VISUALIZATION_OBJECT;
}

export type VisualizationObjectAction =
  | AddVisualizationObject
  | UpdateVisualizationObject
  | AddLayerVizObj
  | RemoveLayerVizObj
  | HideLayerVizObj
  | LoadVisualizationObject;
