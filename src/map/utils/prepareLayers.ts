import * as fromTileLayers from '../constants/tile-layer.constant';
import { prepareGeoJson } from './prepareGeoJson';
import { Layer } from '../models/layer.model';

export function getMapLayers(
  L,
  basemap,
  mapObjectId,
  visualizationLayers?,
  geofeatures?,
  analytics?,
  prioritizeFilter?
) {
  let mapLayers: any[] = [];
  let mapLayersWithNames: any[] = [];
  let centeringLayer: any = null;
  const baseMap = prepareTileLayer(L, getTileLayer(basemap));
  if (baseMap) {
    mapLayers = [...mapLayers, baseMap];
    const layerObject = {};
    layerObject[basemap] = baseMap;
    mapLayersWithNames = [...mapLayersWithNames, layerObject];
  }

  visualizationLayers.map((layer: Layer, layerIndex) => {
    if (layer.hasOwnProperty('layer')) {
      if (layer.layer === 'boundary') {
        const centerLayer = prepareGeoJson(
          L,
          layer,
          geofeatures[layer.id],
          analytics,
          visualizationLayers
        );
        if (centerLayer) {
          mapLayers = [...mapLayers, centerLayer];
        }
        const layerObject = {};
        layerObject[layer.name] = centerLayer;
        mapLayersWithNames.push(layerObject);
        /**
         * Also add centering
         * @type {L.GeoJSON}
         */
        centeringLayer = centerLayer;
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