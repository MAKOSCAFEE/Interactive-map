import * as _ from 'lodash';

export function prepareDataByArrayByOrgUnitUid(layers, analytics) {
  // TODO: this function has to be checked again for further improvement
  const thematicLayers = [];
  const thematicValues = [];
  layers.forEach(layer => {
    if (layer.layer.indexOf('thematic') >= 0) {
      thematicLayers.push(analytics);
    }
  });
  if (analytics) {
    thematicLayers.forEach(layerValues => {
      const valueIndex = _.findIndex(layerValues.headers, ['name', 'value']);
      const orgIndex = _.findIndex(layerValues.headers, ['name', 'ou']);
      const dxIndex = _.findIndex(layerValues.headers, ['name', 'dx']);
      layerValues.rows.forEach(row => {
        thematicValues.push({
          data: layerValues.metaData.names[row[dxIndex]],
          orgId: row[orgIndex],
          value: row[valueIndex]
        });
      });
    });
  }
  return thematicValues;
}
