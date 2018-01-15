import L from 'leaflet';
import 'leaflet.markercluster';
import uniqBy from 'lodash/fp/uniqBy';
import isString from 'lodash/fp/isString';
import isEmpty from 'lodash/fp/isEmpty';
import { toGeoJson, isValidCoordinate, geoJsonOptions } from './GeoJson';
import { GeoJson } from 'leaflet';
import { Feature, GeometryObject } from 'geojson';
import { EVENT_COLOR, EVENT_RADIUS } from '../constants/layer.constant';
import {
  getOrgUnitsFromRows,
  getFiltersFromColumns,
  getFiltersAsText,
  getPeriodFromFilters,
  getPeriodNameFromId
} from '../utils/analytics';

export const event = options => {
  const {
    geofeature,
    layerOptions,
    displaySettings,
    opacity,
    id,
    dataSelections,
    legendProperties,
    analyticsData
  } = options;

  const { startDate, endDate } = dataSelections;
  const { eventPointColor, eventPointRadius, radiusLow } = layerOptions;

  const orgUnits = getOrgUnitsFromRows(dataSelections.rows);
  const period = getPeriodFromFilters(dataSelections.filters);
  const dataFilters = getFiltersFromColumns(dataSelections.columns);

  let legend = {
    period: period
      ? getPeriodNameFromId(period.id)
      : `${startDate} - ${endDate}`,
    filters: dataFilters && getFiltersAsText(dataFilters),
    items: null
  };
  const features = toGeoJson(geofeature);
  let geoJsonLayer = L.geoJSON(features);

  if (analyticsData) {
    const names = {
      true: 'Yes',
      false: 'No'
    };
    const { rows, headers, height, metaData, width } = analyticsData;
    headers.forEach(header => (names[header.name] = header.column));
    const data = rows
      .map(row => createEventFeature(headers, names, row))
      .filter(feature => isValidCoordinate(feature.geometry.coordinates));

    if (Array.isArray(data) && data.length) {
      const items = [
        {
          name: 'Event',
          color: eventPointColor || EVENT_COLOR,
          radius: eventPointRadius || EVENT_RADIUS
        }
      ];
      legend = {
        ...legend,
        items
      };
      const eventOptions = {
        maxClusterRadius: 40,
        showCoverageOnHover: false,
        iconCreateFunction: iconCreateFunction
      };
      const geoJSonOptions = geoJsonOptions(
        id,
        eventPointRadius,
        opacity,
        eventPointColor
      );
      geoJsonLayer = L.geoJSON(data, geoJSonOptions);
      geoJsonLayer.on({
        click: eventLayerEvents().onClick,
        mouseover: eventLayerEvents().mouseover,
        rightClick: eventLayerEvents().onRightClick,
        mouseout: eventLayerEvents().mouseout
      });
    }
  }
  return {
    ...options,
    features,
    geoJsonLayer
  };
};

const createEventFeature = (
  headers,
  names,
  layerEvent,
  eventCoordinateField?
) => {
  const properties = layerEvent.reduce(
    (props, value, i) => ({
      ...props,
      [headers[i].name]: names[value] || value
    }),
    {}
  );

  // properties style
  properties.style = {
    color: '#fff',
    weight: 1,
    stroke: true,
    fill: true
  };

  let coordinates;

  if (eventCoordinateField) {
    // If coordinate field other than event location
    const eventCoord = properties[eventCoordinateField];

    if (Array.isArray(eventCoord)) {
      coordinates = eventCoord;
    } else if (isString(eventCoord) && !isEmpty(eventCoord)) {
      coordinates = JSON.parse(eventCoord);
    } else {
      coordinates = [];
    }
  } else {
    // Use event location
    coordinates = [properties.longitude, properties.latitude]; // Event location
  }

  return {
    type: 'Feature',
    id: properties.psi,
    properties,
    geometry: {
      type: 'Point',
      coordinates: coordinates.map(parseFloat)
    }
  };
};

const iconCreateFunction = cluster => {
  const count = cluster.getChildCount();
  return L.divIcon({ html: '<b>' + count + '</b>' });
};

const eventLayerEvents = () => {
  const onClick = evt => {
    const attr = evt.layer.feature.properties;
    const content = `<table><tbody> <tr>
                    <th>Organisation unit: </th><td>${attr.ouname}</td></tr>
                    <tr><th>Event time: </th><td>${attr.eventdate}</td></tr>
                    <tr>
                      <th>Event location: </th>
                      <td>${attr.latitude}, ${attr.longitude}</td>
                    </tr></tbody></table>`;
    // Close any popup if there is one
    evt.layer.closePopup();
    // Bind new popup to the layer
    evt.layer.bindPopup(content);
    // Open the binded popup
    evt.layer.openPopup();
  };

  const onRightClick = evt => {
    L.DomEvent.stopPropagation(evt); // Don't propagate to map right-click
  };

  const mouseover = evt => {
    const style = evt.layer.feature.properties.style;
    const weight = 3;
    evt.layer.setStyle({ ...style, weight });
  };

  const mouseout = evt => {
    const style = evt.layer.feature.properties.style;
    const weight = 1;
    evt.layer.setStyle({ ...style, weight });
  };

  return {
    onClick,
    onRightClick,
    mouseover,
    mouseout
  };
};
