import { DisplaySettings } from './display-settings.model';
import { LayerOptions } from './layer-options.model';
import { DataSelections } from './data-selections.model';
import { LegendProperties } from './legend-properties.model';

export interface Layer {
  id: string,
  layer: string,
  hidden: boolean,
  opacity: number,
  name: string,
  displayName: string,
  displaySettings: DisplaySettings,
  legendProperties: LegendProperties,
  layerOptions: LayerOptions,
  dataSelections: DataSelections
}
