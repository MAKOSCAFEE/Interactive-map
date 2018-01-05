import * as _ from 'lodash';
import { getColorScaleFromHigLow } from './colorInterporation';

export function prepareMapLegend(visualizationLayerSettings, analytics) {
  const dataArray = [];
  const legendSettings: any = visualizationLayerSettings;
  let legendsFromLegendSet = null;
  let obtainedDataLegend = null;

  if (!legendSettings.colorScale && !legendSettings.legendSet) {
    legendSettings['colorScale'] = getColorScaleFromHigLow(
      visualizationLayerSettings
    );
  }

  if (!legendSettings.colorScale && legendSettings.legendSet) {
    legendsFromLegendSet = getColorScaleFromLegendSet(legendSettings.legendSet);
    legendSettings['colorScale'] = legendsFromLegendSet.colorScale;
  }

  if (legendSettings.colorScale && legendSettings.legendSet) {
    legendsFromLegendSet = getColorScaleFromLegendSet(legendSettings.legendSet);
    legendSettings['colorScale'] = legendsFromLegendSet.colorScale;
  }

  if (analytics) {
    analytics.rows.map(row => {
      dataArray.push(+row[_.findIndex(analytics.headers, { name: 'value' })]);
    });
    const sortedData = _(dataArray)
      .sortBy()
      .value();

    // Legend Method is 1
    if (
      legendSettings.method === 1 &&
      visualizationLayerSettings &&
      analytics
    ) {
      obtainedDataLegend = prepareLegendSet(
        visualizationLayerSettings,
        legendsFromLegendSet,
        analytics
      );
    }

    // Legend Method is 2
    if (
      legendSettings.method === 2 &&
      visualizationLayerSettings &&
      analytics
    ) {
      if (legendSettings.legendSet) {
        obtainedDataLegend = prepareLegendSet(
          visualizationLayerSettings,
          legendsFromLegendSet,
          analytics
        );
      } else {
        obtainedDataLegend = generateLegendClassLimits(
          visualizationLayerSettings,
          analytics
        );
      }
    }

    // Legend Method 3
    if (
      legendSettings.method === 3 &&
      visualizationLayerSettings &&
      analytics
    ) {
      if (legendsFromLegendSet) {
        obtainedDataLegend = prepareLegendSet(
          visualizationLayerSettings,
          legendsFromLegendSet,
          analytics
        );
      } else {
        obtainedDataLegend = generateLegendClassLimits(
          visualizationLayerSettings,
          analytics
        );
      }
    }
  }
  return obtainedDataLegend;
}

export function prepareLegendSet(
  visualizationLayerSettings,
  legendsFromLegendSet,
  visualizationAnalytics
) {
  let legend: any[] = [];
  let dataArray: any[] = [];
  const interval = +(
    (visualizationLayerSettings.radiusHigh -
      visualizationLayerSettings.radiusLow) /
    legendsFromLegendSet.sets.length
  ).toFixed(0);
  const radiusArray = [];
  for (
    let classNumber = 0;
    classNumber < legendsFromLegendSet.sets.length;
    classNumber++
  ) {
    if (classNumber === 0) {
      radiusArray.push(visualizationLayerSettings.radiusLow);
    } else {
      radiusArray.push(radiusArray[classNumber - 1] + interval);
    }
  }

  dataArray = getDataSortedArray(visualizationAnalytics);
  legendsFromLegendSet.sets.forEach((set, setIndex) => {
    legend.push({
      name: set.name,
      label: set.name,
      description: '',
      percentage: 0,
      min: set.min,
      max: set.max,
      count: 0,
      color: set.color,
      radius: radiusArray[setIndex],
      boundary: false
    });
  });
  legend = getLegendCounts(dataArray, legend);
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

export function getColorScaleFromLegendSet(legendSet) {
  const legends = legendSet.legends;
  const sortedLegends = [];

  const legendsValue = [];
  const sortedLegendsValue = [];

  legends.forEach((legend, legendIndex) => {
    legendsValue.push(legend.startValue);
    sortedLegendsValue.push(legend.startValue);
  });

  sortedLegendsValue.sort((n1, n2) => n1 - n2);
  let colorScale = '';
  sortedLegendsValue.forEach((sortedLegendVale, legendValueIndex) => {
    let extraction = legends[legendsValue.indexOf(sortedLegendVale)];
    extraction = JSON.stringify(extraction);
    extraction = extraction.replace('startValue', 'min');
    extraction = extraction.replace('endValue', 'max');
    extraction = new Function('return' + extraction)();
    sortedLegends.push(extraction);
    colorScale += extraction.color + ',';
  });
  return { colorScale: colorScale, sets: sortedLegends };
}

function generateLegendClassLimits(
  visualizationLayerSettings,
  visualizationAnalytics
) {
  let legendSetColorArray: any = null;
  if (visualizationLayerSettings.colorScale) {
    legendSetColorArray = Array.isArray(visualizationLayerSettings.colorScale)
      ? visualizationLayerSettings.colorScale
      : visualizationLayerSettings.colorScale.split(',');
  } else {
    legendSetColorArray = getColorScaleFromHigLow(visualizationLayerSettings);
  }

  let dataArray: any[] = [],
    legend: any = [];
  const classLimits = [],
    classRanges = [];
  let doneWorkAround = false;

  if (
    visualizationAnalytics &&
    visualizationAnalytics.hasOwnProperty('headers')
  ) {
    const sortedData = getDataSortedArray(visualizationAnalytics);
    dataArray = sortedData;

    const interval = +(
      (visualizationLayerSettings.radiusHigh -
        visualizationLayerSettings.radiusLow) /
      visualizationLayerSettings.classes
    ).toFixed(0);
    const radiusArray = [];
    for (
      let classNumber = 0;
      classNumber < visualizationLayerSettings.classes;
      classNumber++
    ) {
      if (classNumber === 0) {
        radiusArray.push(visualizationLayerSettings.radiusLow);
      } else {
        radiusArray.push(radiusArray[classNumber - 1] + interval);
      }
    }

    // Workaround for classess more than values
    if (sortedData.length < visualizationLayerSettings.classes) {
      if (sortedData.length === 0 && doneWorkAround === false) {
        sortedData.push(0);
        doneWorkAround = true;
      }
      if (sortedData.length === 1 && doneWorkAround === false) {
        sortedData.push(sortedData[0] + 1);
        doneWorkAround = true;
      }
    }

    for (
      let classIncr = 0;
      classIncr <= visualizationLayerSettings.classes;
      classIncr++
    ) {
      if (visualizationLayerSettings.method === 3) {
        // equal counts
        const index =
          classIncr /
          visualizationLayerSettings.classes *
          (sortedData.length - 1);
        if (Math.floor(index) === index) {
          classLimits.push(sortedData[index]);
        } else {
          const approxIndex = Math.floor(index);
          classLimits.push(
            sortedData[approxIndex] +
              (sortedData[approxIndex + 1] - sortedData[approxIndex]) *
                (index - approxIndex)
          );
        }
      } else {
        classLimits.push(
          Math.min.apply(Math, sortedData) +
            (Math.max.apply(Math, sortedData) -
              Math.min.apply(Math, sortedData)) /
              visualizationLayerSettings.classes *
              classIncr
        );
      }
    }

    if (doneWorkAround) {
      dataArray.pop();
    }
    // Offset Workaround
    // Populate data count into classes
    classLimits.forEach(function(classLimit, classIndex) {
      if (classIndex < classLimits.length - 1) {
        const min = classLimits[classIndex],
          max = classLimits[classIndex + 1];
        legend.push({
          name: '',
          label: '',
          description: '',
          relativeFrequency: '',
          min: +min.toFixed(1),
          max: +max.toFixed(1),
          color: legendSetColorArray[classIndex],
          count: 0,
          radius: 0,
          boundary: false
        });
      }
    });
  }
  legend = getLegendCounts(dataArray, legend);
  return legend;
}

function getLegendCounts(dataArray, legend) {
  let totalCounts = 0;
  dataArray.forEach(data => {
    legend.forEach((legendItem, legendIndex) => {
      if (legendItem.min <= data && data < legendItem.max) {
        legendItem.count += 1;
        totalCounts += 1;
      }

      if (
        legendIndex === legend.length - 1 &&
        legendItem.min < data &&
        data === legendItem.max
      ) {
        legendItem.count += 1;
        totalCounts += 1;
      }
    });
  });

  legend.forEach(leg => {
    const fraction = leg.count / totalCounts;
    leg.percentage = fraction ? (fraction * 100).toFixed(0) + '%' : '';
  });

  return legend;
}
