import * as _ from 'lodash';
import { prepareDataByArrayByOrgUnitUid } from './orgUnitHelper';
import { Feature, GeometryObject } from 'geojson';

export function prepareBoundaryLayerOptions(
  L,
  options,
  visualizationLayerSettings,
  layers,
  mapLegend,
  analytics
) {
  let totalNumber: any = 0;
  const dataArrayByOrgUnitUid = prepareDataByArrayByOrgUnitUid(
    layers,
    analytics
  );
  dataArrayByOrgUnitUid.forEach(data => {
    totalNumber += +data.value;
  });
  options.style = feature => {
    return _prepareBoundaryFeatureStyle(
      feature,
      visualizationLayerSettings,
      mapLegend
    );
  };

  options.onEachFeature = (feature: any, layer: any) => {
    setTimeout(() => {
      const featureName = feature.properties.name;
      const data = _.find(dataArrayByOrgUnitUid, [
        'orgId',
        feature.properties.id
      ]);
      let toolTipContent: string =
        '<div style="color:#333!important;font-size: 10px">' + '<table>';
      toolTipContent +=
        '<tr><td style="color:#333!important;font-weight:bold;"></td><td style="color:#333!important;" > ' +
        featureName +
        '</td>';
      if (data) {
        toolTipContent +=
          '<tr><td style="color:#333!important;font-weight:bold;">Data: </td><td style="color:#333!important;" > ' +
          data.data +
          '</td>' +
          '<tr><td style="color:#333!important;font-weight:bold;">Value: </td><td style="color:#333!important;" ></td>';
        toolTipContent +=
          '<tr><td style="color:#333!important;font-weight:bold;" ></td></tr>';
      }
      toolTipContent += '</tr>' + '</table>' + '</div>';

      layer.bindPopup(toolTipContent);
    }, 10);
  };

  options.pointToLayer = (feature, latlng) => {
    const geojsonMarkerOptions = {
      radius: visualizationLayerSettings.radiusLow
        ? visualizationLayerSettings.radiusLow
        : 5,
      weight: 0.9,
      opacity: visualizationLayerSettings.opacity
        ? visualizationLayerSettings.opacity
        : 0.8,
      fillOpacity: visualizationLayerSettings.opacity
        ? visualizationLayerSettings.opacity
        : 0.8
    };
    const circleMarker = L.circleMarker(latlng, geojsonMarkerOptions);
    return circleMarker;
  };
  return options;
}

function _prepareBoundaryFeatureStyle(
  feature,
  visualizationLayerSettings,
  legendSet
) {
  const opacity = visualizationLayerSettings.opacity;
  const featureStyle: any = {
    color: _.find(legendSet, ['name', feature.le]).color,
    fillColor: '#ffffff',
    fillOpacity: 0,
    weight: 1,
    opacity: opacity,
    stroke: true
  };

  return featureStyle;
}

export function bindBoundaryLayerEvents(L, layer, layers, analytics) {
  const dataArrayByOrgUnitUid = prepareDataByArrayByOrgUnitUid(
    layers,
    analytics
  );
  return {
    click: event => {},
    mouseover: event => {
      const hoveredFeature: any = event.layer.feature;
      const data = _.find(dataArrayByOrgUnitUid, [
        'orgId',
        hoveredFeature.properties.id
      ]);
      let toolTipContent: string = `<div style='color:#333!important;font-size: 10px'><table>`;

      if (data) {
        toolTipContent += `<tr><td style='color:#333!important;font-weight:bold;'>${
          hoveredFeature.properties.name
        }</td><td style='color:#333!important;' > (${data.value}) </td></tr>`;
      } else {
        toolTipContent += `<tr><td style='color:#333!important;font-weight:bold;' > ${
          hoveredFeature.properties.name
        }</td></tr>`;
      }

      toolTipContent += `</table></div>`;

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
      layer.setStyle((feature: Feature<GeometryObject>) => {
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
    }
  };
}
