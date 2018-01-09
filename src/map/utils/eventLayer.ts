import * as _ from 'lodash';
export function prepareMarkerClusters(
  L,
  visualizationLayerSettings: any,
  visualizationAnalytics: any
): any {
  const markersCoordinates = [];
  const markers = new L.MarkerClusterGroup({
    spiderfyOnMaxZoom: false,
    showCoverageOnHover: false,
    iconCreateFunction: cluster => {
      const childMarkers = cluster.getAllChildMarkers();
      return _iconCreateFunction(L, cluster, visualizationLayerSettings);
    }
  });

  if (
    visualizationAnalytics &&
    visualizationAnalytics.hasOwnProperty('headers')
  ) {
    const latitudeIndex = visualizationAnalytics.headers.indexOf(
      _.find(visualizationAnalytics.headers, ['name', 'latitude'])
    );
    const longitudeIndex = visualizationAnalytics.headers.indexOf(
      _.find(visualizationAnalytics.headers, ['name', 'longitude'])
    );
    const nameIndex = visualizationAnalytics.headers.indexOf(
      _.find(visualizationAnalytics.headers, ['name', 'ouname'])
    );
    const codeIndex = visualizationAnalytics.headers.indexOf(
      _.find(visualizationAnalytics.headers, ['name', 'oucode'])
    );

    if (visualizationAnalytics.rows.length > 0) {
      visualizationAnalytics.rows.forEach(row => {
        const title =
          '<b>' +
          row[nameIndex] +
          ' </b><br/>' +
          '<b>Coordinate:</b>' +
          row[longitudeIndex] +
          ',' +
          row[latitudeIndex] +
          '<br/>' +
          '<b>Code:</b>' +
          row[codeIndex];
        const latitude = row[latitudeIndex];
        const longitude = row[longitudeIndex];
        if (latitude && longitude) {
          markersCoordinates.push([latitude, longitude]);
          const icon = L.divIcon({
            iconSize: null,
            html:
              '<i class="fa fa-map-marker" style="color:#276696;font-size:16px; height:16px; width:16px;"></i>'
          });
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
              : 0.8,
            fillColor: visualizationLayerSettings.eventPointColor
              ? visualizationLayerSettings.eventPointColor
              : '#3333'
          };
          markers.addLayer(
            L.circleMarker([latitude, longitude], geojsonMarkerOptions)
              .bindPopup(title)
              .on({
                mouseover: event => {}
              })
          );
        }
      });
    }
  }

  return [markers, markersCoordinates];
}

function _iconCreateFunction(L: any, cluster: any, layerSettings: any) {
  const children = cluster.getAllChildMarkers();
  const iconSize = _calculateClusterSize(cluster.getChildCount());
  return L.divIcon({
    html: _createClusterIcon(iconSize, cluster, layerSettings),
    className: 'marker-cluster ' + layerSettings.id,
    iconSize: new L.Point(iconSize[0], iconSize[1])
  });
}

function _createClusterIcon(iconSize, cluster, layerSettings) {
  const marginTop = _calculateMarginTop(iconSize);
  const height = iconSize[0];
  const width = iconSize[1];
  const htmlContent =
    '<div style="' +
    'color:#ffffff;text-align:center;' +
    'box-shadow: 0 1px 4px rgba(0, 0, 0, 0.65);' +
    'opacity:' +
    layerSettings.opacity +
    ';' +
    'background-color:' +
    _eventColor(layerSettings.eventPointColor) +
    ';' +
    'height:' +
    height +
    'px;width:' +
    width +
    'px;' +
    'font-style:' +
    layerSettings.labelFontStyle +
    ';' +
    'font-size:' +
    layerSettings.labelFontSize +
    ';' +
    'border-radius:' +
    iconSize[0] +
    'px;">' +
    '<span style="line-height:' +
    width +
    'px;">' +
    _writeInKNumberSystem(parseInt(cluster.getChildCount(), 10)) +
    '</span>' +
    '</div>';
  return htmlContent;
}

function _calculateClusterSize(childCount: number): any {
  return childCount < 10
    ? [16, 16]
    : childCount >= 10 && childCount <= 40
      ? [20, 20]
      : childCount > 40 && childCount < 100 ? [30, 30] : [40, 40];
}

function _calculateMarginTop(iconSize: any) {
  const size = iconSize[0];
  return size === 30 ? 5 : size === 20 ? 2 : 10;
}

function _writeInKNumberSystem(childCount: any): any {
  return childCount >= 1000
    ? (childCount = (childCount / 1000).toFixed(1) + 'k')
    : childCount;
}

function _eventColor(color) {
  return '#' + color;
}

export function prepareMarkersLayerGroup(
  L,
  visualizationLayerSettings,
  visualizationAnalytics
) {
  const markersCoordinates = [];
  const markersArray = [];
  if (visualizationAnalytics.hasOwnProperty('headers')) {
    const latitudeIndex = visualizationAnalytics.headers.indexOf(
      _.find(visualizationAnalytics.headers, ['name', 'latitude'])
    );
    const longitudeIndex = visualizationAnalytics.headers.indexOf(
      _.find(visualizationAnalytics.headers, ['name', 'longitude'])
    );
    const nameIndex = visualizationAnalytics.headers.indexOf(
      _.find(visualizationAnalytics.headers, ['name', 'ouname'])
    );
    const codeIndex = visualizationAnalytics.headers.indexOf(
      _.find(visualizationAnalytics.headers, ['name', 'oucode'])
    );
    if (visualizationAnalytics.rows.length > 0) {
      visualizationAnalytics.rows.forEach(row => {
        const title =
          '<b>' +
          row[nameIndex] +
          '</b><br/>' +
          '<b>Coordinate:</b>' +
          row[longitudeIndex] +
          ',' +
          row[latitudeIndex] +
          '<br/>' +
          '<b>Code:</b>' +
          row[codeIndex];
        const latitude = row[latitudeIndex];
        const longitude = row[longitudeIndex];
        if (latitude && longitude) {
          markersCoordinates.push([latitude, longitude]);
          const icon = L.divIcon({
            iconSize: null,
            html:
              '<i class="fa fa-map-marker" style="color:#276696;-webkit-text-stroke: 1px white;font-size: 16px"></i>'
          });
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
              : 0.8,
            fillColor: visualizationLayerSettings.eventPointColor
              ? visualizationLayerSettings.eventPointColor
              : '#3333'
          };
          markersArray.push(
            L.circleMarker([latitude, longitude], geojsonMarkerOptions)
              .bindPopup(title)
              .on({
                mouseover: event => {}
              })
          );
        }
      });
    }
  }

  return [L.layerGroup(markersArray), markersCoordinates];
}
