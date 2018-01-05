import * as fromTileLayers from '../constants/tile-layer.constant';
import { prepareGeoJson } from './prepareGeoJson';

export function getMapLayers(
  L,
  basemap,
  mapObjectId,
  visualizationLayers?,
  prioritizeFilter?
) {
  let mapLayers: any[] = [];
  let mapLayersWithNames: any[] = [];
  const baseMap = prepareTileLayer(L, getTileLayer(basemap));
  if (baseMap) {
    mapLayers = [...mapLayers, baseMap];
    const layerObject = {};
    layerObject[basemap] = baseMap;
    mapLayersWithNames = [...mapLayersWithNames, layerObject];
  }

  visualizationLayers.map((layer, layerIndex) => {
    if (layer.hasOwnProperty('layer')) {
      if (layer.layer === 'boundary') {
        const centerLayer = prepareGeoJson(L, layer, layer.analytics);
      }
    }
  });

  return [mapLayers, mapLayersWithNames];
}

export function prepareTileLayer(L, tileLayer): any {
  if (!tileLayer) {
    return null;
  }

  return L.tileLayer(tileLayer.url, {
    maxZoom: tileLayer.maxZoom,
    attribution: tileLayer.attribution
  });
}

export function getTileLayer(tileLayerId) {
  const tileLayer = fromTileLayers.TILE_LAYERS[tileLayerId];
  return tileLayer ? tileLayer : fromTileLayers.TILE_LAYERS['osmLight'];
}
