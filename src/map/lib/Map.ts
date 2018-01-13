import L, { Class, Map } from 'leaflet';
import { tileLayer } from './TileLayer';
import { boundary } from './Boundary';

/**
 * Creates a map instance.
 * @class D2Map
 * @param {string|Element} id HTML element to initialize the map in (or element id as string)
 * @param {Object} options
 * @param {number} [options.minZoom=0] Minimum zoom of the map
 * @param {number} [options.maxZoom=20] Maximum zoom of the map
 * @example
 * map('mapDiv', {
 *   bounds: [[6.9679, -13.29096], [9.9432, -10.4887]],
 * });
 */

export const D2Map = L.Map.extend({
  options: {
    className: 'leaflet-map',
    layerTypes: {
      tileLayer,
      boundary
    },
    controlTypes: {},
    zoomControl: false,
    controls: [],
    worldCopyJump: true
  },
  initialize(id, opts) {
    const options = L.setOptions(this, opts);
    this._baseLayers = {};
    this._overlays = {};

    L.Map.prototype.initialize.call(this, id, options);

    this.attributionControl.setPrefix('');

    L.DomUtil.addClass(this.getContainer(), options.className);

    L.Icon.Default.imagePath = '/assets/images';

    if (options.bounds) {
      this.fitBounds(options.bounds);
    }

    for (const control in options.controls) {
      // eslint-disable-line
      if (options.controls.hasOwnProperty(control)) {
        this.addControl(control);
      }
    }
  },
  // Override method to accept nye layer as config object
  addLayer(layer) {
    const layerTypes = this.options.layerTypes;
    let newLayer = layer;

    if (layer.type && layerTypes[layer.type]) {
      newLayer = this.createLayer(layer);

      if (layer.baseLayer === true) {
        this._baseLayers[layer.name] = newLayer;
      } else if (layer.overlay === true) {
        this._overlays[layer.name] = newLayer;
      }
    }

    L.Map.prototype.addLayer.call(this, newLayer);

    return newLayer;
  },
  createLayer(layer) {
    return this.options.layerTypes[layer.type](layer);
  },
  addControl(control) {
    const controlTypes = this.options.controlTypes;
    let newControl = control;

    if (control.type && controlTypes[control.type]) {
      newControl = controlTypes[control.type](control);
    } else if (control.type && L.control[control.type]) {
      newControl = L.control[control.type](control);
    }

    L.Map.prototype.addControl.call(this, newControl);
    return newControl;
  },
  // Returns combined bounds for non-tile layers
  getLayersBounds() {
    const bounds = new L.LatLngBounds();

    this.eachLayer(layer => {
      // TODO: Calculating bounds for circles layer (radius around facilitites) gives errors. Happends for dashboard maps
      if (layer.getBounds && layer.options.type !== 'circles') {
        bounds.extend(layer.getBounds());
      }
    });

    return bounds;
  }
});

export function map(id, options) {
  return new D2Map(id, options);
}
