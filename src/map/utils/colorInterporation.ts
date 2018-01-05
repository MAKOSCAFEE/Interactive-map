import { Color } from './color';

export function getColorScaleFromHigLow(visualizationLayerSettings) {
  const colorHigh: string = visualizationLayerSettings.colorHigh,
    colorLow: string = visualizationLayerSettings.colorLow,
    classes: number = visualizationLayerSettings.classes;
  const parseLow = colorParse(colorLow, 'hex');
  const parseHigh = colorParse(colorHigh, 'hex');
  const ends = [];
  ends[0] = new Color(parseLow[0], parseLow[1], parseLow[2]);
  ends[1] = new Color(parseHigh[0], parseHigh[1], parseHigh[2]);
  const step = stepCalc(classes, ends);
  const colors = mixPalete(classes, step, ends);
  let colorScale = '';
  colors.forEach((color, colorIndex) => {
    colorScale += color.bg;
    if (colorIndex === color.length - 1) {
    } else {
      colorScale += ',';
    }
  });
  return colorScale.split(',');
}

function stepCalc(steps, ends) {
  const step = [];
  step[0] = (ends[1].red - ends[0].red) / steps;
  step[1] = (ends[1].green - ends[0].green) / steps;
  step[2] = (ends[1].blue - ends[0].blue) / steps;
  return step;
}

function colorParse(color, colorType) {
  if (!color) {
    return [];
  }

  let m = 1;
  let base = 16;
  let num: Array<any> = [];
  color = color.toUpperCase();
  let colorRaw = color.replace('RGB', '').replace(/[\#\(]*/i, '');
  if (colorType === 'hex') {
    if (colorRaw.length === 3) {
      const colorSectionA = colorRaw.substr(0, 1);
      const colorSectionB = colorRaw.substr(1, 1);
      const colorSectionC = colorRaw.substr(2, 1);
      colorRaw =
        colorSectionA +
        colorSectionA +
        colorSectionB +
        colorSectionB +
        colorSectionC +
        colorSectionC;
    }
    num = new Array(
      colorRaw.substr(0, 2),
      colorRaw.substr(2, 2),
      colorRaw.substr(4, 2)
    );
    base = 16;
  } else {
    num = colorRaw.split(',');
    base = 10;
  }

  if (colorType === 'rgbp') {
    m = 2.55;
  }
  const ret = new Array(
    parseInt(num[0], base) * m,
    parseInt(num[1], base) * m,
    parseInt(num[2], base) * m
  );
  return ret;
}

function mixPalete(steps: number, step, ends) {
  const count = steps - 1;
  const palette: Array<any> = [];

  palette[0] = new Color(ends[0].red, ends[0].green, ends[0].blue);
  palette[count] = new Color(ends[1].red, ends[1].green, ends[1].blue);
  for (let paretteNumber = 1; paretteNumber < count; paretteNumber++) {
    const red = ends[0].red + step[0] * paretteNumber;
    const green = ends[0].green + step[1] * paretteNumber;
    const blue = ends[0].blue + step[2] * paretteNumber;
    palette[paretteNumber] = new Color(red, green, blue);
  }
  return palette;
}
