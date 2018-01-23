import { Action } from '@ngrx/store';

export const TOGGLE_OPEN_VISUALIZATION_LEGEND = '[Map UI] Toggle visualization open';
export const TOGGLE_PIN_VISUALIZATION_LEGEND = '[Map UI] Toggle pin visualization Legend';
export const CLOSE_PIN_VISUALIZATION_LEGEND = '[Map UI] Close pinned legend';

export class ToggleOpenVisualizationLegend implements Action {
  readonly type = TOGGLE_OPEN_VISUALIZATION_LEGEND;
}

export class TogglePinVisualizationLegend implements Action {
  readonly type = TOGGLE_PIN_VISUALIZATION_LEGEND;
}

export class CloseVisualizationLegend implements Action {
  readonly type = CLOSE_PIN_VISUALIZATION_LEGEND;
}

// action types
export type VisualizationLegendAction =
  | ToggleOpenVisualizationLegend
  | TogglePinVisualizationLegend
  | CloseVisualizationLegend;
