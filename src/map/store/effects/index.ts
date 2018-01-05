import { LayersEffects } from './layers.effect';
import { VisualizationObjectEffects } from './visualizationObject.effect';
import { AnalyticsEffects } from './analytics.effect';

export const effects: any[] = [
  LayersEffects,
  VisualizationObjectEffects,
  AnalyticsEffects
];

export * from './layers.effect';
export * from './visualizationObject.effect';
export * from './analytics.effect';
