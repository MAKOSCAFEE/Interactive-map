import { DisplaySettings } from './display-settings.model';
import { LayerOptions } from './layer-options.model';
import { DataSelections } from './data-selections.model';

export interface Layer {
  id: string,
  action: string;
  layer: Object;
}

export interface LayerModel{
  id: string,
  layer: string,
  hidden: boolean,
  opacity: number,
  name: string,
  displayName: string,
  displaySettings: DisplaySettings,
  layerOptions: LayerOptions,
  dataSelections: DataSelections
}
