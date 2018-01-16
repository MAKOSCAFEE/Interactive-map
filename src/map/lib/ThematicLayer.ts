import L from 'leaflet';
import uniqBy from 'lodash/fp/uniqBy';
import isString from 'lodash/fp/isString';
import findIndex from 'lodash/fp/findIndex';
import sortBy from 'lodash/fp/sortBy';
import pick from 'lodash/fp/pick';
import curry from 'lodash/fp/curry';
import {
  getOrgUnitsFromRows,
  getPeriodFromFilters,
  getDataItemsFromColumns
} from '../utils/analytics';
import { getLegendItems, getColorsByRgbInterpolation } from '../utils/classify';
import { toGeoJson } from './GeoJson';
import { GeoJson } from 'leaflet';
import { Feature, GeometryObject } from 'geojson';

export const thematic = options => {
  const {
    geofeature,
    layerOptions,
    displaySettings,
    opacity,
    dataSelections,
    legendProperties,
    analyticsData
  } = options;
  const { rows, columns, filters } = dataSelections;
  const { radiusLow, radiusHigh } = layerOptions;
  const features = toGeoJson(geofeature);
  const otherOptions = thematicLayerOptions(options.id, opacity);
  let geoJsonLayer = L.geoJSON(features, otherOptions);

  if (analyticsData) {
    const valueById = getValueById(analyticsData);
    const valueFeatures = features.filter(({ id }) => valueById[id] !== undefined);
    const orderedValues = getOrderedValues(analyticsData);
    const minValue = orderedValues[0];
    const maxValue = orderedValues[orderedValues.length - 1];
    const dataItem = getDataItemsFromColumns(columns)[0];
    const name = options.name || dataItem.name;
    const legend = createLegendFromConfig(orderedValues, legendProperties);
    const getLegendItem = curry(getLegendItemForValue)(legend.items);
    legend['period'] = analyticsData.metaData.dimensions.pe[0];

    valueFeatures.forEach(({ id, properties }) => {
      const value = valueById[id];
      const item = getLegendItem(value);

      item.count === undefined ? (item.count = 1) : item.count++;

      properties.value = value;
      properties.color = item && item.color;
      properties.radius =
        (value - minValue) / (maxValue - minValue) * (radiusHigh - radiusLow) + radiusLow;
    });
    geoJsonLayer = L.geoJSON(valueFeatures, otherOptions);
  }

  return {
    ...options,
    features,
    geoJsonLayer
  };
};

// Returns an object mapping org. units and values
const getValueById = data => {
  const { headers, rows } = data;
  const ouIndex = findIndex(['name', 'ou'], headers);
  const valueIndex = findIndex(['name', 'value'], headers);

  return rows.reduce((obj, row) => {
    obj[row[ouIndex]] = parseFloat(row[valueIndex]);
    return obj;
  }, {});
};

// Returns an array of ordered values
const getOrderedValues = data => {
  const { headers, rows } = data;
  const valueIndex = findIndex(['name', 'value'], headers);

  return rows.map(row => parseFloat(row[valueIndex])).sort((a, b) => a - b);
};

const createLegendFromConfig = (data, config) => {
  const { method, classes, colorScale, colorLow, colorHigh } = config;
  const items = getLegendItems(data, method, classes);
  let colors;

  // TODO: Unify how we represent a colorScale
  if (Array.isArray(colorScale)) {
    colors = colorScale;
  } else if (isString(colorScale)) {
    colors = colorScale.split(',');
  } else {
    colors = getColorsByRgbInterpolation(colorLow, colorHigh, classes);
  }

  return {
    items: items.map((item, index) => ({
      ...item,
      color: colors[index]
    }))
  };
};

// Returns legend item where a value belongs
const getLegendItemForValue = (legendItems, value) => {
  const isLast = index => index === legendItems.length - 1;
  return legendItems.find(
    (item, index) =>
      value >= item.startValue &&
      (value < item.endValue || (isLast(index) && value === item.endValue))
  );
};

export const thematicLayerOptions = (id, opacity) => {
  const style = feature => {
    const pop = feature.properties;
    return {
      color: '#333',
      fillColor: pop.color,
      fillOpacity: opacity,
      opacity,
      weight: 1,
      fill: true,
      stroke: true
    };
  };
  const onEachFeature = (feature, layer) => {};

  const pointToLayer = (feature, latlng) => {
    const geojsonMarkerOptions = {
      radius: feature.properties.radius || 6,
      fillColor: feature.properties.color || '#fff',
      color: feature.properties.color || '#333',
      opacity: opacity || 0.8,
      weight: 1,
      fillOpacity: opacity || 0.8
    };
    return new L.CircleMarker(latlng, geojsonMarkerOptions);
  };

  return {
    pane: id,
    style,
    onEachFeature,
    pointToLayer
  };
};
