import { Action } from '@ngrx/store';

import { VisualizationObject } from '../../models/visualization-object.model';

export const CREATE_VISUALIZATION_OBJECT = '[Map] Create visualization object';
export const CREATE_VISUALIZATION_OBJECT_FAIL =
  '[Map] Create visualization object Fail';
export const CREATE_VISUALIZATION_OBJECT_SUCCESS =
  '[Map] Create visualization object Success';
export const UPDATE_VISUALIZATION_OBJECT = '[Map] Update visualization object';
export const UPDATE_VISUALIZATION_OBJECT_FAIL =
  '[Map] Update visualization object Fail';
export const UPDATE_VISUALIZATION_OBJECT_SUCCESS =
  '[Map] Update visualization object Success';
export const ADD_LAYER = '[Map] Add Layer to visualization object';
export const ADD_GEOFEATURES = '[Map] Add Geofeatures to visualization object';
export const REMOVE_LAYER = '[Map] Remove Layer from visualization object';
export const HIDE_LAYER = '[Map] Hide Layer';
export const LOAD_VISUALIZATION_OBJECT = '[Map] Load visualization object';
export const LOAD_VISUALIZATION_OBJECT_SUCCESS =
  '[Map] Load visualization object success';
export const LOAD_VISUALIZATION_OBJECT_FAIL =
  '[Map] Load visualization object Fail';

export class CreateVisualizationObject implements Action {
  readonly type = CREATE_VISUALIZATION_OBJECT;
  constructor(public payload: VisualizationObject) {}
}

export class CreateVisualizationObjectFail implements Action {
  readonly type = CREATE_VISUALIZATION_OBJECT_FAIL;
  constructor(public payload: any) {}
}

export class CreateVisualizationObjectSuccess implements Action {
  readonly type = CREATE_VISUALIZATION_OBJECT_SUCCESS;
  constructor(public payload: VisualizationObject) {}
}

export class UpdateVisualizationObject implements Action {
  readonly type = UPDATE_VISUALIZATION_OBJECT;
  constructor(public payload: VisualizationObject) {}
}

export class UpdateVisualizationObjectFail implements Action {
  readonly type = UPDATE_VISUALIZATION_OBJECT_FAIL;
  constructor(public payload: any) {}
}

export class UpdateVisualizationObjectSuccess implements Action {
  readonly type = UPDATE_VISUALIZATION_OBJECT_SUCCESS;
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

export class AddGeoFeaturesVizObj implements Action {
  readonly type = ADD_GEOFEATURES;
  constructor(public payload: any) {}
}

export class HideLayerVizObj implements Action {
  readonly type = HIDE_LAYER;
  constructor(public payload: any) {}
}

export class LoadVisualizationObject implements Action {
  readonly type = LOAD_VISUALIZATION_OBJECT;
}

export class LoadVisualizationObjectSuccess implements Action {
  readonly type = LOAD_VISUALIZATION_OBJECT_SUCCESS;
  constructor(public payload: VisualizationObject[]) {}
}

export class LoadVisualizationObjectFail implements Action {
  readonly type = LOAD_VISUALIZATION_OBJECT_FAIL;
  constructor(public payload: any) {}
}

export type VisualizationObjectAction =
  | CreateVisualizationObject
  | CreateVisualizationObjectSuccess
  | CreateVisualizationObjectFail
  | UpdateVisualizationObject
  | UpdateVisualizationObjectFail
  | UpdateVisualizationObjectSuccess
  | AddLayerVizObj
  | AddGeoFeaturesVizObj
  | RemoveLayerVizObj
  | HideLayerVizObj
  | LoadVisualizationObject
  | LoadVisualizationObjectFail
  | LoadVisualizationObjectSuccess;
