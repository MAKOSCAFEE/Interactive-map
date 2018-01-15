// Boundary layer
import L from 'leaflet';
import uniqBy from 'lodash/fp/uniqBy';
import { GeoJson } from 'leaflet';
import { Feature, GeometryObject } from 'geojson';

const colors = ['black', 'blue', 'red', 'green', 'yellow'];
const weights = [2, 1, 0.75, 0.5, 0.5];

export function boundary(options) {
  const { features, layerOptions, displaySettings, opacity, id } = options;
  const radiusLow = layerOptions.radiusLow;
  if (!features.length) {
    return;
  }
  const levels = uniqBy(f => f.properties.level, features)
    .map(f => f.properties.level)
    .sort();
  const levelStyle = levels.reduce(
    (obj, level, index) => ({
      ...obj,
      [level]: {
        color: colors[index],
        fillOpacity: 0,
        weight: levels.length === 1 ? 1 : weights[index],
        stroke: true,
        fill: true
      }
    }),
    {}
  );

  features.forEach(feature => {
    feature.properties.style = levelStyle[feature.properties.level];
    feature.properties.labelStyle = {
      fontSize: displaySettings.labelFontSize,
      fontStyle: displaySettings.labelFontStyle,
      fontColor: displaySettings.labelFontColor,
      fontWeight: displaySettings.labelFontWeight,
      paddingTop:
        feature.geometry.type === 'Point' ? 5 + (radiusLow || 5) + 'px' : '0'
    };
  });

  const geoJSonOptions = boundaryOptions(id, radiusLow, opacity);
  const geoJsonLayer = L.geoJSON(features, geoJSonOptions);
  geoJsonLayer.on({
    click: boundaryEvents().onClick,
    mouseover: boundaryEvents().mouseover,
    mouseout: boundaryEvents().mouseout
  });
  return {
    ...options,
    features,
    geoJsonLayer
  };
}

export const boundaryOptions = (id, radiusLow, opacity) => {
  const style = feature => {
    const pop = feature.properties;
    if (pop.style) {
      return pop.style;
    }
  };

  const onEachFeature = (feature, layer) => {};

  const pointToLayer = (feature, latlng) => {
    const geojsonMarkerOptions = {
      radius: radiusLow ? radiusLow : 5,
      opacity: opacity ? opacity : 0.8,
      fillOpacity: opacity ? opacity : 0.8
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

export const boundaryEvents = () => {
  const onClick = evt => {
    const attr = evt.layer.feature.properties;
    let content = `<div class="leaflet-popup-orgunit"><em>${attr.name}</em>`;

    if (attr.level) {
      content += `<br/>Level: ${attr.level}`;
    }

    if (attr.parentName) {
      content += `<br/>Parent unit: ${attr.parentName}`;
    }

    content += '</div>';
    evt.layer.closePopup();
    evt.layer.bindPopup(content);
    evt.layer.openPopup();
  };

  const onRightClick = evt => {
    L.DomEvent.stopPropagation(evt); // Don't propagate to map right-click
  };

  const mouseover = evt => {
    const style = evt.layer.feature.properties.style;
    const weight = 3;
    evt.layer.feature.properties.style = { ...style, weight };
    evt.layer.closeTooltip();
    evt.layer
      .bindTooltip(evt.layer.feature.properties.name, {
        direction: 'auto',
        permanent: false,
        sticky: true,
        interactive: true,
        opacity: 1
      })
      .openTooltip();
  };

  const mouseout = event => {
    const hoveredFeature: any = event.layer.feature;
    const layer = event.layer;
    layer.setStyle((feature: Feature<GeometryObject>) => {
      const properties: any = feature.properties;
      const featureStyle: any = {
        stroke: true,
        weight: 1
      };
      const hov: any = hoveredFeature.properties;
      if (hov.id === properties.id) {
        featureStyle.weight = 1;
      }
      return featureStyle;
    });
  };

  return {
    onClick,
    onRightClick,
    mouseover,
    mouseout
  };
};
