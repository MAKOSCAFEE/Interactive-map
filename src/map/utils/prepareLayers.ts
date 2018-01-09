import * as fromTileLayers from '../constants/tile-layer.constant';
import { prepareGeoJson } from './prepareGeoJson';
import { Layer } from '../models/layer.model';
import { prepareMarkersLayerGroup, prepareMarkerClusters } from './eventLayer';
import * as _ from 'lodash';

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
  const mapObjects = [];
  const baseMap = prepareTileLayer(L, getTileLayer(basemap));
  if (baseMap) {
    mapLayers = [...mapLayers, baseMap];
    const layerObject = {};
    layerObject[basemap] = baseMap;
    mapLayersWithNames = [...mapLayersWithNames, layerObject];
  }
  visualizationLayers.map((layer: Layer, layerIndex: number) => {
    const visualizationLayerSettings = {
      ...layer.legendProperties,
      ...layer.layerOptions,
      ...layer.displaySettings
    };
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
      } else if (layer.layer.indexOf('thematic') !== -1) {
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
      } else if (layer.layer === 'facility') {
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
      } else if (layer.layer === 'event') {
        if (analytics) {
          if (visualizationLayerSettings.eventClustering) {
            const markerClusters: any = !prioritizeFilter
              ? _.find(mapObjects, ['id', mapObjectId])
              : undefined;
            let centerLayer: any = null;
            if (markerClusters && !prioritizeFilter) {
              centerLayer = markerClusters.layer;
            } else {
              centerLayer = prepareMarkerClusters(
                L,
                visualizationLayerSettings,
                analytics
              );
              mapObjects.push({ id: mapObjectId, layer: centerLayer });
            }
            if (centerLayer[0]) {
              mapLayers[visualizationLayers.length - layerIndex] =
                centerLayer[0];
            }

            const layerObject = {};
            layerObject[layer.name] = centerLayer[0];
            mapLayersWithNames.push(layerObject);
            centeringLayer = centerLayer[1];
          } else {
            const centerLayer = prepareMarkersLayerGroup(
              L,
              visualizationLayerSettings,
              analytics
            );
            if (centerLayer[0]) {
              mapLayers[visualizationLayers.length - layerIndex] =
                centerLayer[0];
            }
            const layerObject = {};
            layerObject[layer.name] = centerLayer[0];
            mapLayersWithNames.push(layerObject);
            centeringLayer = centerLayer[1];
          }
        }
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
