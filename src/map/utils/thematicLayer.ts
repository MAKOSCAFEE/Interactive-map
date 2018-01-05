import * as _ from 'lodash';
import { getMapRadiusLegend, getFeatureRadius } from './legendSets';

export function prepareThematicLayerOptions(
  L,
  options,
  visualizationLayerSettings,
  visualizationAnalytics,
  mapLegend
) {
  let totalValues: number = 0;
  const valueIndex = _.findIndex(visualizationAnalytics.headers, [
    'name',
    'value'
  ]);
  const legend = getMapRadiusLegend(
    visualizationLayerSettings,
    visualizationAnalytics
  );
  visualizationAnalytics.rows.forEach(row => {
    totalValues += +row[valueIndex];
  });

  const showLabels = visualizationLayerSettings.labels;
  const labels = [];

  const sanitizeColor = (color: any) => {
    const colors = color.split('#');
    color = '#' + colors[colors.length - 1];
    return color;
  };

  options.style = feature => {
    return _prepareFeatureStyle(feature, visualizationLayerSettings, mapLegend);
  };

  options.onEachFeature = (feature: any, layer: any) => {
    setTimeout(() => {
      const featureName = feature.properties.name;
      const percentage = feature.properties.percentage;

      let toolTipContent: string =
        '<div style="color:#333!important;font-size: 10px">' + '<table>';
      toolTipContent +=
        '<tr><td style="color:#333!important;font-weight:bold;"></td><td style="color:#333!important;" ><b> ' +
        featureName +
        '</b></td>';
      if (feature.properties['dataElement.value']) {
        toolTipContent +=
          '<tr><td style="color:#333!important;font-weight:bold;">Data: </td><td style="color:#333!important;" > ' +
          feature.properties['dataElement.name'] +
          '</td>' +
          '<tr><td style="color:#333!important;font-weight:bold;">Value: </td><td style="color:#333!important;" > ' +
          feature.properties['dataElement.value'] +
          '  (' +
          percentage +
          ')</td>';
        toolTipContent +=
          '<tr><td style="color:#333!important;font-weight:bold;" ></td></tr>';
      }
      toolTipContent += '</tr>' + '</table>' + '</div>';

      layer.bindPopup(toolTipContent);

      if (showLabels) {
        let center = null;
        if (feature.geometry.type === 'Point') {
          center = L.latLng(
            feature.geometry.coordinates[1],
            feature.geometry.coordinates[0]
          );
        } else {
          center = layer.getBounds().getCenter();
        }

        const label = L.marker(center, {
          icon: L.divIcon({
            iconSize: null,
            className: 'label',
            html:
              '<div  style="color:' +
              sanitizeColor(visualizationLayerSettings.labelFontColor) +
              '!important;font-size:' +
              visualizationLayerSettings.labelFontSize +
              '!important;;font-weight:bolder!important;;-webkit-text-stroke: 0.04em white!important;;">' +
              feature.properties.name +
              '</div>'
          })
        });
        labels.push(label);
      }
    }, 10);
  };

  options.pointToLayer = (feature, latlng) => {
    const geojsonMarkerOptions = {
      radius: getFeatureRadius(legend, feature.properties['dataElement.value']),
      fillColor: '#ff7800',
      color: '#000',
      weight: 0.5,
      opacity: visualizationLayerSettings.opacity,
      fillOpacity: visualizationLayerSettings.opacity
    };
    const circleMarker = L.circleMarker(latlng, geojsonMarkerOptions);
    return circleMarker;
  };

  return options;
}

function _prepareFeatureStyle(feature, visualizationLayerSettings, legendSet) {
  const opacity = visualizationLayerSettings.opacity;
  let featureStyle: any = {
    color: '#000000',
    fillColor: '#ffffff',
    fillOpacity: 0,
    weight: 1,
    opacity: 0.8,
    stroke: true
  };

  if (feature.properties['dataElement.id'] !== '') {
    featureStyle = _updateFillColor(
      featureStyle,
      opacity,
      feature.properties['dataElement.value'],
      legendSet
    );
  }

  return featureStyle;
}

function _updateFillColor(featureStyle, opacity, value, legendSet) {
  value = +value;
  if (legendSet) {
    legendSet.forEach((legend, legendIndex) => {
      if (legend.min <= value && value < legend.max) {
        featureStyle.fillColor = legend.color;
        featureStyle.fillOpacity = opacity;
      }

      if (value === legend.max) {
        featureStyle.fillColor = legend.color;
        featureStyle.fillOpacity = opacity;
      }
    });
  }

  return featureStyle;
}

export function bindThematicLayerEvents(L, layer, visualizationAnalytics) {
  let totalValues: number = 0;
  const valueIndex = _.findIndex(visualizationAnalytics.headers, [
    'name',
    'value'
  ]);
  visualizationAnalytics.rows.forEach(row => {
    totalValues += +row[valueIndex];
  });

  return {
    click: event => {},
    mouseover: event => {
      const hoveredFeature: any = event.layer.feature;
      const properties = hoveredFeature.properties;
      const percentage = hoveredFeature.properties.percentage;
      let toolTipContent: string =
        '<div style="color:#333!important;font-size: 10px">' + '<table>';

      if (properties['dataElement.value']) {
        toolTipContent +=
          '<tr><td style="color:#333!important;font-weight:bold;"> ' +
          properties.name +
          ' </td><td style="color:#333!important;" > ( ' +
          properties['dataElement.value'] +
          ' ) (' +
          properties['percentage'] +
          ') </td></tr>';
      } else {
        toolTipContent +=
          '<tr><td style="color:#333!important;font-weight:bold;" > ' +
          properties.name +
          ' </td></tr>';
      }

      toolTipContent += '</table></div>';

      layer.bindTooltip(toolTipContent, {
        direction: 'auto',
        permanent: false,
        sticky: true,
        interactive: true,
        opacity: 1
      });

      const popUp = layer.getPopup();
      if (popUp && popUp.isOpen()) {
        layer.closePopup();
      }
      layer.setStyle((feature: GeoJSON.Feature<GeoJSON.GeometryObject>) => {
        const properties: any = feature.properties;
        const featureStyle: any = {
          stroke: true,
          weight: 1
        };
        if (hoveredFeature.properties.id === properties.id) {
          featureStyle.weight = 3;
        }

        return featureStyle;
      });
    },
    mouseout: event => {
      const hoveredFeature: any = event.layer.feature;
      layer.setStyle((feature: GeoJSON.Feature<GeoJSON.GeometryObject>) => {
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
    }
  };
}
