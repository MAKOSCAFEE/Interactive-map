import { MapConfiguration } from './map-configuration.model';
import { LayerModel } from './layer.model';

export interface visualizationObject {
  mapConfiguration: MapConfiguration,
  layers: LayerModel[]
}
