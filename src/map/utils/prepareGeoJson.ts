import { Layer } from '../models/layer.model';
import { prepareMapLegend } from './mapLegend';
import { boundaryLayerClasses } from './legendSets';
import {
  prepareBoundaryLayerOptions,
  bindBoundaryLayerEvents
} from './boundaryLayer';
import {
  prepareThematicLayerOptions,
  bindThematicLayerEvents
} from './thematicLayer';
import * as _ from 'lodash';

export function prepareGeoJson(
  L,
  layer: Layer,
  geofeatures,
  analytics,
  layers
) {
  let options: any = {};
  const visualizationLayerSettings = {
    ...layer.legendProperties,
    ...layer.layerOptions,
    ...layer.displaySettings
  };
  let LayerEvents = null;
  let mapLegend = prepareMapLegend(visualizationLayerSettings, analytics);

  if (layer.layer === 'boundary') {
    mapLegend = boundaryLayerClasses(visualizationLayerSettings, geofeatures);
    options = prepareBoundaryLayerOptions(
      L,
      options,
      visualizationLayerSettings,
      layers,
      mapLegend,
      analytics
    );
  }
  if (layer.layer.indexOf('thematic') > -1) {
    if (analytics) {
      options = prepareThematicLayerOptions(
        L,
        options,
        visualizationLayerSettings,
        analytics,
        mapLegend
      );
    }
  }
  const mapLayer = _getGEOJSONLayer(
    L,
    geofeatures,
    analytics,
    options,
    mapLegend
  );

  if (layer.layer === 'boundary') {
    LayerEvents = bindBoundaryLayerEvents(L, mapLayer, layers, analytics);
  }

  if (layer.layer.indexOf('thematic') > -1 && analytics) {
    LayerEvents = bindThematicLayerEvents(L, mapLayer, analytics);
  }

  if (LayerEvents) {
    mapLayer.on({
      click: LayerEvents.click,
      mouseover: LayerEvents.mouseover,
      mouseout: LayerEvents.mouseout
    });
  }

  return mapLayer;
}

function _getGEOJSONLayer(
  L,
  geofeatures,
  analytics,
  options,
  legendClasses,
  mapLabels?
) {
  const geoJsonFeatures = _getGeoJSONObject(
    geofeatures,
    analytics,
    legendClasses
  );

  const showLabels = mapLabels;
  let layer: any;
  let layerGroup: any;

  const geoJsonLayer: any = L.geoJSON(geoJsonFeatures, options);

  if (showLabels) {
    const labels = _getMapLabels(L, geoJsonFeatures);
    layerGroup = L.layerGroup([geoJsonLayer, labels]);
  } else {
    layerGroup = geoJsonLayer;
  }

  layer = layerGroup;
  return layer;
}
function _getGeoJSONObject(
  geofeatures: any,
  analyticObject: any,
  legendClassess: any
): any {
  const geoFeatures = geofeatures;
  const geoJSONObject: any = [];
  if (geoFeatures) {
    geoFeatures.forEach(geoFeature => {
      const sampleGeometry: any = {
        type: 'Feature',
        le: geoFeature.le,
        geometry: {
          type: '',
          coordinates: new Function('return ' + geoFeature.co)()
        },
        properties: {
          id: geoFeature.id,
          name: geoFeature.na,
          percentage: '',
          'dataElement.id': '',
          'dataElement.name': '',
          'dataElement.value': 0,
          classInterval: '',
          fill: '#00ff00',
          'fill-opacity': 1,
          stroke: '#000000',
          'stroke-opacity': 1,
          'stroke-width': 1
        }
      };
      /**
       * Also get data if analytics is not empty
       */
      if (analyticObject) {
        const dataElement = _getDataForGeoFeature(
          geoFeature.id,
          analyticObject
        );
        if (dataElement) {
          sampleGeometry.properties['dataElement.id'] = dataElement.id;
          sampleGeometry.properties['dataElement.name'] = dataElement.name;
          sampleGeometry.properties['dataElement.value'] = dataElement.value;
        }
      }

      if (legendClassess) {
        const featureLegendClass = _getFeatureClassFromValue(
          legendClassess,
          sampleGeometry.properties['dataElement.value']
        );
        sampleGeometry.properties['fill'] = featureLegendClass.color;
        sampleGeometry.properties['classInterval'] =
          featureLegendClass.min +
          ' - ' +
          featureLegendClass.max +
          ' (' +
          featureLegendClass.count +
          ')';
        sampleGeometry.properties['percentage'] = featureLegendClass.percentage;
      }
      // TODO:: FIND BEST WAY TO DETERMINE FEATURE TYPE
      if (geoFeature.le >= 4) {
        sampleGeometry.geometry.type = 'Point';
      } else if (geoFeature.le >= 1) {
        sampleGeometry.geometry.type = 'MultiPolygon';
      }

      geoJSONObject.push(sampleGeometry);
    });
    return geoJSONObject;
  }
}

function _getDataForGeoFeature(geoFeatureId: string, analyticObject: any): any {
  const data: any = {};
  const geoFeatureIndex = analyticObject.headers.indexOf(
    _.find(analyticObject.headers, ['name', 'ou'])
  );
  const dataIndex = analyticObject.headers.indexOf(
    _.find(analyticObject.headers, ['name', 'value'])
  );
  const metadataIndex = analyticObject.headers.indexOf(
    _.find(analyticObject.headers, ['name', 'dx'])
  );

  analyticObject.rows.forEach(row => {
    if (geoFeatureId === row[geoFeatureIndex]) {
      data.id = row[metadataIndex];
      data.name = analyticObject.metaData.items[row[metadataIndex]].name;
      data.value = row[dataIndex];
    }
  });
  return !data.hasOwnProperty('id') && analyticObject
    ? _getDefaultData(analyticObject)
    : data;
}

function _getDefaultData(analyticObject) {
  const data: any = {};
  data.id = analyticObject.metaData.dimensions.dx[0];
  data.name = analyticObject.metaData.items[data.id];
  data.value = '';
  return data;
}

function _getFeatureClassFromValue(legendClass, dataElementValue): any {
  dataElementValue = +dataElementValue;
  const legendItem = legendClass.filter((legend, legendIndex) => {
    if (legend.min <= dataElementValue && legend.max > dataElementValue) {
      return legend;
    }
    if (
      legendIndex === legendClass.length - 1 &&
      legend.max === dataElementValue
    ) {
      return legend;
    }
  });
  return legendItem[0] ? legendItem[0] : '';
}

function _getMapLabels(L, features) {
  const markerLabels = [];
  const sanitizeColor = (color: any) => {
    if (color && color.indexOf('#') > -1) {
      const colors = color.split('#');
      color = '#' + colors[colors.length - 1];
    }
    return color;
  };
  features.forEach((feature, index) => {
    let center: any;
    if (feature.geometry.type === 'Point') {
      center = L.latLng(
        feature.geometry.coordinates[1],
        feature.geometry.coordinates[0]
      );
    } else {
      const polygon = L.polygon(feature.geometry.coordinates);
      center = polygon.getBounds().getCenter();
    }

    const label = L.marker([center.lng, center.lat], {
      icon: L.divIcon({
        iconSize: new L.Point(50, 50),
        className: 'feature-label',
        html: feature.properties.name
      })
    });

    markerLabels.push(label);
  });

  return L.layerGroup(markerLabels);
}
