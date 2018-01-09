import * as _ from 'lodash';
import { LegendSet } from '../models/Legend-set.model';
export function boundaryLayerClasses(mapVisualizationSettings, geoFeature) {
  const features = geoFeature;
  const Levels = getBoundaryLevels(geoFeature);
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

export function getMapRadiusLegend(settings, analytics) {
  const radiusHigh = settings.radiusHigh;
  const radiusLow = settings.radiusLow;
  const classess = settings.classes;
  const method = settings.method;
  const legend = [];
  const dataArray = getDataSortedArray(analytics);

  const interval = +((radiusHigh - radiusLow) / classess).toFixed(0);
  const radiusArray = [];
  for (let classNumber = 0; classNumber < classess; classNumber++) {
    if (classNumber === 0) {
      radiusArray.push(radiusLow);
    } else if (classNumber === classess - 1) {
      radiusArray.push(radiusHigh);
    } else {
      radiusArray.push(radiusArray[classNumber - 1] + interval);
    }
  }

  const classLimits = [];
  let doneWorkAround = false;

  // Workaround for classess more than values
  if (dataArray.length < classess) {
    if (dataArray.length === 0 && doneWorkAround === false) {
      dataArray.push(0);
      doneWorkAround = true;
    }
    if (dataArray.length === 1 && doneWorkAround === false) {
      dataArray.push(dataArray[0] + 1);
      doneWorkAround = true;
    }
  }

  for (let classIncr = 0; classIncr <= classess; classIncr++) {
    if (method === 3) {
      const index = classIncr / classess * (dataArray.length - 1);
      if (Math.floor(index) === index) {
        classLimits.push(dataArray[index]);
      } else {
        const approxIndex = Math.floor(index);
        classLimits.push(
          dataArray[approxIndex] +
            (dataArray[approxIndex + 1] - dataArray[approxIndex]) *
              (index - approxIndex)
        );
      }
    } else {
      classLimits.push(
        Math.min.apply(Math, dataArray) +
          (Math.max.apply(Math, dataArray) - Math.min.apply(Math, dataArray)) /
            classess *
            classIncr
      );
    }
  }

  if (doneWorkAround) {
    dataArray.pop();
  } // Offset Workaround
  // Populate data count into classess
  classLimits.forEach(function(classLimit, classIndex) {
    if (classIndex < classLimits.length - 1) {
      const min = classLimits[classIndex],
        max = classLimits[classIndex + 1];
      legend.push({
        min: +min.toFixed(1),
        max: +max.toFixed(1),
        radius: radiusArray[classIndex]
      });
    }
  });

  return legend;
}

export function getDataSortedArray(visualizationAnalytics) {
  const dataArray = [];
  let sortedData = [];
  if (
    visualizationAnalytics &&
    visualizationAnalytics.hasOwnProperty('headers')
  ) {
    visualizationAnalytics.rows.forEach(row => {
      dataArray.push(
        +row[_.findIndex(visualizationAnalytics.headers, { name: 'value' })]
      );
    });
    sortedData = _(dataArray)
      .sortBy()
      .value();
  }
  return sortedData;
}

export function getFeatureRadius(legend, dataValue) {
  let theRadius = 0;
  const value = +dataValue;
  legend.forEach(function(classRadiusLimit, classRadiusIndex) {
    if (classRadiusLimit.min <= value && value < classRadiusLimit.max) {
      theRadius = classRadiusLimit.radius;
    }

    if (
      classRadiusIndex === legend.length - 1 &&
      classRadiusLimit.min < value &&
      value === classRadiusLimit.max
    ) {
      theRadius = classRadiusLimit.radius;
    }
  });
  return theRadius;
}

export function getFacilityLayerLegendClasses(
  visualizationLayerSettings,
  isLegendView,
  geoFeatures
) {
  const legend: LegendSet = {
    id: '',
    name: '',
    description: '',
    hidden: false,
    opened: false,
    pinned: false,
    isEvent: false,
    isClustered: false,
    isThematic: false,
    isBoundary: false,
    isFacility: true,
    useIcons: false,
    opacity: 0,
    classes: [],
    change: []
  };
  console.log(visualizationLayerSettings);
  const groupSet = visualizationLayerSettings.organisationUnitGroupSet;
  const features = geoFeatures;
  legend.id = visualizationLayerSettings.id;
  legend.name = groupSet.name;
  legend.opacity = visualizationLayerSettings.opacity
    ? visualizationLayerSettings.opacity * 100
    : 80;
  const totalFeatures: number = features.length;

  groupSet.organisationUnitGroups.forEach(group => {
    const classLegend = {
      name: group.name,
      label: '',
      id: group.id,
      description: '',
      relativeFrequency: '',
      min: 0,
      max: 0,
      level: 0,
      color: '',
      collapse: '',
      icon: group.symbol,
      radius: 0,
      count: group.organisationUnits.length,
      boundary: false
    };

    classLegend.relativeFrequency =
      totalFeatures !== 0
        ? (classLegend.count / totalFeatures).toFixed(0) + '%'
        : '';
    legend.classes.push(classLegend);
    if (!isLegendView) {
      features.forEach(feature => {
        const featureIndex = _.findIndex(group.organisationUnits, [
          'id',
          feature.id
        ]);
        if (featureIndex > -1) {
          feature.dimensions.icon = group.symbol;
        }
      });
    }
  });
  visualizationLayerSettings.geoFeature = features;
  return [legend.classes, visualizationLayerSettings];
}
