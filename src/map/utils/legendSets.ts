import * as _ from 'lodash';
export function boundaryLayerClasses(mapVisualizationSettings, geoFeature) {
  const features = geoFeature;
  const Levels = getBoundaryLevels(features);
  const legend: any[] = [];

  Levels.forEach(level => {
    legend.push({
      name: level.id,
      label: level.id,
      description: '',
      relativeFrequency: '',
      min: 0,
      max: 0,
      color: getLevelColor(Levels, level),
      count: level.count,
      radius: '',
      boundary: true
    });
  });
  return legend;
}

function getBoundaryLevels(features) {
  const levels: any[] = [];
  features.forEach(feature => {
    if (_.find(levels, ['id', feature.le])) {
      _.find(levels, ['id', feature.le]).count += 1;
    } else {
      levels.push({ id: feature.le, name: null, count: 1 });
    }
  });
  return levels;
}

function getLevelColor(Levels, level) {
  const colorByIndex = ['#000000', '#0101DF', '#2F2FFD', '#FF0000', '#008000'];
  if (Levels.length === 1) {
    return '#000000';
  } else {
    return colorByIndex[Levels.indexOf(level)];
  }
}
