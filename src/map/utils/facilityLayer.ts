export function bindFacilityLayerEvents(L, layer, visualizationAnalytics) {
  return {
    click: event => {},
    mouseover: event => {
      const hoveredFeature: any = event.layer.feature;
      const properties = hoveredFeature.properties;
      let toolTipContent: string =
        '<div style="color:#333!important;font-size: 10px">' + '<table>';

      toolTipContent +=
        '<tr><td style="color:#333!important;font-weight:bold;" > ' +
        properties.name +
        ' </td></tr>';

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

export function prepareFacilityLayerOptions(
  L,
  options,
  visualizationLayerSettings: any,
  legendObject: any
) {
  options.pointToLayer = (geoJsonPoint, latlng) => {
    const label = _getLabel(L, geoJsonPoint, latlng);
    const icon = _getIcon(
      L,
      geoJsonPoint,
      visualizationLayerSettings.geoFeature
    );
    return _prepareFacilitySubLayerOptions(
      L,
      geoJsonPoint,
      icon,
      latlng,
      label,
      visualizationLayerSettings
    );
  };

  return options;
}

function _getIcon(L, feature: any, geoFeatures: any) {
  const icon = L.divIcon({
    className: 'map-marker',
    iconSize: new L.Point(10, 10),
    html: this._getFeatureImage(feature, geoFeatures)
  });
  return icon;
}

function _getLabel(L, feature: any, center) {
  const label = L.marker(center, {
    icon: L.divIcon({
      iconSize: new L.Point(50, 50),
      className: 'feature-label',
      html: feature.properties.name
    })
  });

  return label;
}

function _prepareFacilitySubLayerOptions(
  L,
  feature,
  icon,
  latlng,
  label,
  visualizationLayerSettings
) {
  const areaRadius = visualizationLayerSettings.areaRadius
    ? visualizationLayerSettings.areaRadius
    : undefined;
  const layers = [];
  const featureName = feature.properties.name;
  if (visualizationLayerSettings.labels) {
    layers.push(label);
  }

  if (areaRadius) {
    layers.push(L.circle(latlng, { radius: areaRadius, weight: 0.5 }));
  }
  const markerLayer = L.marker(latlng, { icon: icon });
  markerLayer.on({
    mouseover: (layer, other) => {
      markerLayer.bindTooltip(featureName).openTooltip();
    }
  });
  return layers.length > 0
    ? L.layerGroup([...layers, markerLayer])
    : markerLayer;
}
