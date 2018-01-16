import L from 'leaflet';
import uniqBy from 'lodash/fp/uniqBy';
import { toGeoJson, isValidCoordinate, geoJsonOptions } from './GeoJson';
import { GeoJson } from 'leaflet';
import { Feature, GeometryObject } from 'geojson';
import {
  getOrgUnitsFromRows,
  getPeriodFromFilters,
  getDataItemsFromColumns
} from '../utils/analytics';
import isPlainObject from 'lodash/fp/isPlainObject';

export const facility = options => {
  const {
    geofeature,
    layerOptions,
    displaySettings,
    opacity,
    areaRadius,
    dataSelections,
    legendProperties,
    analyticsData,
    orgUnitGroupSet
  } = options;
  const { rows, columns, filters, organisationUnitGroupSet } = dataSelections;
  const orgUnits = getOrgUnitsFromRows(rows);
  const { radiusLow, radiusHigh } = layerOptions;

  let features = toGeoJson(geofeature);
  const geoOptions = geoJsonOptions(options.id, radiusLow, opacity);
  let geoJsonLayer = L.geoJSON(features, geoOptions);

  if (orgUnitGroupSet) {
    const groupSetId = organisationUnitGroupSet.id;
    const { organisationUnitGroups } = orgUnitGroupSet;
    const facilities = parseFacilities(geofeature, groupSetId);
    const groupSet = parseGroupSet(organisationUnitGroups);

    features = facilities.map(data => {
      const id = data.dimensions[groupSetId];
      return toFacilityGeoJson(data, groupSet[id]);
    });

    const otherOptions = facilityGeoJsonOptions(options.id, displaySettings, areaRadius, opacity);

    geoJsonLayer = L.geoJSON(features, otherOptions);
  }

  return {
    ...options,
    features,
    geoJsonLayer
  };
};

const parseFacilities = (facilities, groupSetId) =>
  facilities.filter(
    data =>
      data.ty === 1 &&
      isPlainObject(data.dimensions) &&
      data.dimensions[groupSetId] &&
      isValidCoordinate(JSON.parse(data.co))
  );

const toFacilityGeoJson = (data, group) => ({
  type: 'Feature',
  id: data.id,
  properties: {
    id: data.id,
    name: data.na,
    label: `${data.na} (${group.name})`,
    icon: {
      iconUrl: `/images/orgunitgroup/${group.symbol}`,
      iconSize: [16, 16]
    }
  },
  geometry: {
    type: 'Point',
    coordinates: JSON.parse(data.co)
  }
});

const parseGroupSet = organisationUnitGroups =>
  organisationUnitGroups.reduce((symbols = {}, group, index) => {
    // Easier lookup of unit group symbols
    const symbol = group.symbol || 21 + index + '.png'; // Default symbol 21-25 are coloured circles
    return {
      ...symbols,
      [group.id]: {
        ...group,
        symbol
      }
    };
  }, {});

export const facilityGeoJsonOptions = (id, displaySettings, areaRadius, opacity) => {
  const {
    labelFontStyle,
    labelFontSize,
    labelFontColor,
    labelFontWeight,
    labels
  } = displaySettings;
  const onEachFeature = (feature, layer) => {
    if (labels) {
      feature.properties.label = feature.properties.name;
      feature.properties.labelStyle = {
        fontSize: labelFontSize,
        fontStyle: labelFontStyle,
        fontColor: labelFontColor,
        fontWeight: labelFontWeight,
        paddingTop: '10px'
      };
    }
  };

  const pointToLayer = (feature, latlng) => {
    const iconProperty = 'icon';
    const markerOptions = L.extend({}, { riseOnHover: true });
    const { labelStyle } = feature.properties;
    const title = L.Util.template('{name}', feature.properties);
    const icon = L.icon({
      ...feature.properties.icon
    });

    const marker = new L.marker(latlng, {
      ...markerOptions,
      icon,
      iconProperty,
      title,
      labelStyle
    });

    if (areaRadius) {
      const geojsonMarkerOptions = {
        radius: 6,
        weight: 0.5,
        strokeColor: '#fff'
      };
      const circle = new L.CircleMarker(latlng, geojsonMarkerOptions);
      return new L.featureGroup([circle, marker]);
    }

    return marker;
  };

  const setOpacity = op => {
    this.eachLayer(layer => {
      layer.setOpacity(op);
    });
  };

  return {
    pane: id,
    onEachFeature,
    pointToLayer,
    setOpacity
  };
};
