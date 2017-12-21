import { Action } from '@ngrx/store';

import { Layer } from '../../models/layer.model';

// load layers
export const LOAD_LAYERS = '[MAP] Load Layer';
export const LOAD_LAYERS_FAIL = '[MAP] Load Layer Fail';
export const LOAD_LAYERS_SUCCESS = '[MAP] Load Layer Success';
export const ADD_LAYERS = '[MAP] Add Layer';
export const REMOVE_LAYERS = '[MAP] Remove Layer';

export class LoadLayers implements Action {
  readonly type = LOAD_LAYERS;
}

export class LoadLayersFail implements Action {
  readonly type = LOAD_LAYERS_FAIL;
  constructor(public payload: any) { }
}

export class LoadLayersSuccess implements Action {
  readonly type = LOAD_LAYERS_SUCCESS;
  constructor(public payload: Layer[]) { }
}

export class AddLayers implements Action {
  readonly type = ADD_LAYERS;
  constructor(public payload: Layer[]) { }
}

export class RemoveLayers implements Action {
  readonly type = REMOVE_LAYERS;
  constructor(public payload: Layer[]) { }
}

// action types
export type LayersAction = LoadLayers | LoadLayersFail | LoadLayersSuccess | AddLayers | RemoveLayers;
