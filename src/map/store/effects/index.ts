import { LayersEffects } from './layers.effect';
import { VisualizationObjectEffects } from './visualizationObject.effect';
import { GeoFeatureEffects } from './geo-feature.effect';

export const effects: any[] = [
  LayersEffects,
  VisualizationObjectEffects,
  GeoFeatureEffects
];

export * from './layers.effect';
export * from './visualizationObject.effect';
export * from './geo-feature.effect';
