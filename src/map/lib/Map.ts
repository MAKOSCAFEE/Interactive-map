import L, { Class, Map, MapOptions } from 'leaflet';
import { tileLayer } from './TileLayer';
import { boundary } from './Boundary';

export class D2Map extends Map {
  options: MapOptions;
  constructor(id, options?: MapOptions) {
    super(id, options);

    L.DomUtil.addClass(super.getContainer(), this.options.className);

    L.Icon.Default.imagePath = '/assets/images';

    if (this.options.bounds) {
      super.fitBounds(this.options.bounds);
    }

    for (const control in this.options.controls) {
      // eslint-disable-line
      if (this.options.controls.hasOwnProperty(control)) {
        super.addControl(control);
      }
    }
  }
}

D2Map.prototype.options = {
  worldCopyJump: true,
  className: 'leaflet-map',
  zoomControl: false,
  controls: []
};

export function D2map(id, options?) {
  return new D2Map(id, options);
}
